#!/usr/bin/env python3
"""Store Photo Library processor — Immich 'Mailbox Plus/Captioned' → R2 store-library.

Eligibility (owner rule, 2026-09-23):
  1. Tagged 'Mailbox Plus/Captioned' in Immich (owner's reclassification pipeline marks
     fully processed images with this tag; anything else is waiting to be processed).
  2. GPS inside the store geofence (store coords from astro/src/config/siteConfig.ts).

Commands:
  scan                          list eligible assets (id, filename, topics from tags)
  preview <assetId>             download full-res original to /tmp for the agent's PII
                                vision check (READABLE LABELS/PII MUST BE ABSENT)
  publish <assetId> --alt TEXT  convert (WebP 1600px q82, EXIF stripped), upload to
    [--topics a,b] [--name k]   mailboxplus-r2:mailbox-plus-images/articles/store-library/
                                {topic}/{name}.webp, verify HTTP 200, append manifest entry.
                                Requires --pii-checked as the operator's attestation that the
                                full-res vision check passed (privacy rule: no readable labels).
  copy-existing <srcKey> ...    register already-uploaded per-article body images into the
                                library (rclone copyto to library key + manifest entry)

Immich is reached over SSH to 100.77.217.4 (API key lives server-side; never on this box).
"""
import argparse, json, subprocess, sys, os

IMMICH_SSH = "blackghost@100.77.217.4"
IMMICH_URL = "http://127.0.0.1:2283"
IMMICH_KEY_FILE = os.path.expanduser("~/immich-categorize/.api_key")
CAPTION_TAG = "Mailbox Plus/Captioned"
STORE_LAT, STORE_LON, GEOFENCE_M = 41.66497, -81.24166, 200
R2_REMOTE = "mailboxplus-r2"
R2_PREFIX = "mailbox-plus-images/articles/store-library"
R2_PUBLIC = "https://pub-21518ce3034449a3a7b5a0b89551f710.r2.dev/articles/store-library"
MANIFEST = os.path.join(os.path.dirname(__file__), "..", "content", "store-photos.json")


def _ssh_immich(*curl_args):
    """Run an Immich API call server-side; the API key never leaves 100.77.217.4."""
    key_expr = f"KEY=$(cat {IMMICH_KEY_FILE}) && curl -s -H \"x-api-key: $KEY\" " + " ".join(f"'{a}'" for a in curl_args)
    r = subprocess.run(["ssh", IMMICH_SSH, key_expr], capture_output=True, text=True, timeout=120)
    if r.returncode != 0:
        sys.exit(f"Immich SSH call failed: {r.stderr[:300]}")
    return r.stdout


def _json_or_die(text):
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        sys.exit(f"Immich returned non-JSON: {text[:300]}")


def haversine(lat1, lon1, lat2, lon2):
    from math import radians, sin, cos, asin, sqrt
    lat1, lon1, lat2, lon2 = map(radians, (lat1, lon1, lat2, lon2))
    h = sin((lat2-lat1)/2)**2 + cos(lat1)*cos(lat2)*sin((lon2-lon1)/2)**2
    return 2*6371000*asin(sqrt(h))


def eligible_assets():
    tag_id = None
    tags = _json_or_die(_ssh_immich(f"{IMMICH_URL}/api/tags"))
    for t in tags if isinstance(tags, list) else tags.get("tags", []):
        if t.get("name") == CAPTION_TAG or t.get("value") == CAPTION_TAG:
            tag_id = t.get("id")
            break
    if not tag_id:
        return []  # no Captioned assets yet — library grows as reclassification lands
    body = json.dumps({"tagIds": [tag_id], "withExif": True, "size": 1000})
    assets = _json_or_die(_ssh_immich("-X", "POST", f"{IMMICH_URL}/api/search/metadata",
                                      "-H", "Content-Type: application/json", "-d", body))
    assets = assets.get("assets", {}).get("items", []) if isinstance(assets, dict) else assets
    out = []
    for a in assets:
        ex = a.get("exifInfo", {})
        lat, lon = ex.get("latitude"), ex.get("longitude")
        if lat is None or lon is None:
            continue
        if haversine(lat, lon, STORE_LAT, STORE_LON) > GEOFENCE_M:
            continue
        out.append({"id": a["id"], "file": ex.get("originalFileName", a["id"]),
                    "lat": lat, "lon": lon, "taken": ex.get("dateTimeOriginal", "")})
    return out


def load_manifest():
    with open(MANIFEST) as f:
        return json.load(f)


def save_manifest(m):
    with open(MANIFEST, "w") as f:
        json.dump(m, f, indent=2)
        f.write("\n")


def cmd_scan(_):
    assets = eligible_assets()
    if not assets:
        print("0 eligible assets — nothing tagged '%s' inside the store geofence yet." % CAPTION_TAG)
        print("The library fills automatically as the reclassification pipeline lands tags.")
        return
    m = load_manifest()
    known = {e.get("immich_asset", "") for e in m["photos"]}
    for a in assets:
        flag = "PUBLISHED" if any(a["id"] in k for k in known) else "candidate"
        print(f"{a['id']}  {flag}  {a['file']}  taken={a['taken']}")


def cmd_preview(args):
    r = subprocess.run(["ssh", IMMICH_SSH,
                        f"KEY=$(cat {IMMICH_KEY_FILE}) && curl -s -H 'x-api-key: $KEY' "
                        f"'{IMMICH_URL}/api/assets/{args.asset_id}/original' -o /tmp/immich_{args.asset_id[:8]}"],
                       capture_output=True, text=True, timeout=300)
    if r.returncode != 0:
        sys.exit(f"download failed: {r.stderr[:300]}")
    print(f"/tmp/immich_{args.asset_id[:8]} — run the full-res PII vision check on this file "
          f"BEFORE publish (no readable labels, names, addresses, signatures).")


def cmd_publish(args):
    if not args.pii_checked:
        sys.exit("refusing to publish: --pii-checked is the operator's attestation that the "
                 "full-res vision check passed (privacy rule: no readable labels).")
    topics = [t.strip() for t in args.topics.split(",") if t.strip()]
    if not topics:
        sys.exit("--topics required (used as the library subfolder, e.g. packing,mailbox-wall)")
    topic = topics[0]
    name = args.name or args.asset_id[:8]
    key = f"{R2_PREFIX}/{topic}/{name}.webp"
    tmp = f"/tmp/immich_{args.asset_id[:8]}"
    if not os.path.exists(tmp):
        sys.exit(f"{tmp} missing — run `preview {args.asset_id}` first")
    # convert: WebP, max 1600px, q82, strip all EXIF
    script = ("from PIL import Image; im=Image.open('%s'); im.thumbnail((1600,1600)); "
              "im.save('/tmp/store_photo_upload.webp','WEBP',quality=82)" % tmp)
    subprocess.run([sys.executable, "-c", script], check=True)
    subprocess.run(["rclone", "copyto", "/tmp/store_photo_upload.webp",
                    f"{R2_REMOTE}:{key}"], check=True)
    import urllib.request
    url = f"{R2_PUBLIC}/{topic}/{name}.webp"
    req = urllib.request.Request(url, method="HEAD", headers={"User-Agent": "Mozilla/5.0"})
    code = urllib.request.urlopen(req, timeout=30).status
    if code != 200:
        sys.exit(f"upload verify failed: HTTP {code} {url} (rclone 501s are normal — retry)")
    m = load_manifest()
    m["photos"].append({"key": key[len("mailbox-plus-images/"):], "topics": topics, "alt": args.alt,
                        "immich_asset": args.asset_id, "vetted": __import__("datetime").date.today().isoformat(),
                        "source_article": None})
    save_manifest(m)
    print(f"published + manifest updated: {url}")
    print(f"article usage: ![{args.alt}]({url})")


def cmd_copy_existing(args):
    m = load_manifest()
    for pair in args.pairs:  # srcR2Key topic/name  (pairs like 'articles/pack-ship/x-body-1.webp packing/kraft-bench-01.webp')
        src, dst = pair.split()
        key = f"{R2_PREFIX}/{dst}"
        subprocess.run(["rclone", "copyto", f"{R2_REMOTE}:mailbox-plus-images/{src}", f"{R2_REMOTE}:{key}"], check=True)
        print(f"copied {src} -> {key}")
    print("now add matching manifest entries via edit (alt/topics) and commit.")


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = p.add_subparsers(dest="cmd", required=True)
    sub.add_parser("scan").set_defaults(fn=cmd_scan)
    pv = sub.add_parser("preview"); pv.add_argument("asset_id"); pv.set_defaults(fn=cmd_preview)
    pb = sub.add_parser("publish"); pb.add_argument("asset_id")
    pb.add_argument("--alt", required=True); pb.add_argument("--topics", default="")
    pb.add_argument("--name", default=""); pb.add_argument("--pii-checked", action="store_true")
    pb.set_defaults(fn=cmd_publish)
    ce = sub.add_parser("copy-existing"); ce.add_argument("pairs", nargs="+"); ce.set_defaults(fn=cmd_copy_existing)
    args = p.parse_args()
    args.fn(args)


if __name__ == "__main__":
    main()
