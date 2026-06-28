#!/usr/bin/env python3
import os
import sys
import argparse
import boto3

def load_env(env_path):
    """Load environment variables from a .env file."""
    if not os.path.exists(env_path):
        return
    with open(env_path, 'r') as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith('#'):
                continue
            if '=' in line:
                key, val = line.split('=', 1)
                os.environ[key.strip()] = val.strip()

def main():
    parser = argparse.ArgumentParser(description="Upload files to Cloudflare R2 bucket")
    parser.add_argument("--file", required=True, help="Local file path to upload")
    parser.add_argument("--key", required=True, help="Destination key (path) in R2")
    parser.add_argument("--env", default="/home/blackghost/mailbox-plus-website/.env", help="Path to .env file")
    args = parser.parse_args()

    # Load credentials
    load_env(args.env)

    endpoint = os.getenv("R2_ENDPOINT_URL")
    access_key = os.getenv("R2_ACCESS_KEY_ID")
    secret_key = os.getenv("R2_SECRET_ACCESS_KEY")
    bucket_name = os.getenv("R2_BUCKET_NAME", "mailbox-plus-images")

    if not all([endpoint, access_key, secret_key]):
        print("Error: Missing R2 credentials in environment or .env file.")
        print("Ensure R2_ENDPOINT_URL, R2_ACCESS_KEY_ID, and R2_SECRET_ACCESS_KEY are set.")
        sys.exit(1)

    if not os.path.exists(args.file):
        print(f"Error: Local file '{args.file}' not found.")
        sys.exit(1)

    # Initialize S3 client for Cloudflare R2
    s3 = boto3.client(
        service_name='s3',
        endpoint_url=endpoint,
        aws_access_key_id=access_key,
        aws_secret_access_key=secret_key,
        region_name='auto'
    )

    # Determine Content-Type based on extension
    content_type = 'application/octet-stream'
    if args.file.endswith('.webp'):
        content_type = 'image/webp'
    elif args.file.endswith('.png'):
        content_type = 'image/png'
    elif args.file.endswith('.jpg') or args.file.endswith('.jpeg'):
        content_type = 'image/jpeg'
    elif args.file.endswith('.svg'):
        content_type = 'image/svg+xml'

    try:
        print(f"Uploading '{args.file}' to '{bucket_name}' as '{args.key}'...")
        s3.upload_file(
            Filename=args.file,
            Bucket=bucket_name,
            Key=args.key,
            ExtraArgs={
                'ContentType': content_type
            }
        )
        print("Upload completed successfully!")
    except Exception as e:
        print(f"Error uploading file: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
