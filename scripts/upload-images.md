# Upload Service Images to Supabase Storage

This guide explains how to upload hero images to your Supabase Storage bucket.

## Method 1: Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard at: https://supabase.com/dashboard
2. Navigate to **Storage** in the left sidebar
3. Click on the `service-images` bucket
4. Create a folder named `services` (if it doesn't exist)
5. Click **Upload Files** and select your hero images
6. Make sure filenames match the ones referenced in the code (e.g., `pack-ship.jpg`)

## Method 2: Local Public Folder

For local development, you can place images in:
```
/public/images/services/
```

The application will serve them from this location during development.

## Image Guidelines

### File Naming
Use the exact names as listed in the services configuration:
- `pack-ship.jpg`
- `artwork-shipping.jpg`
- `bicycle-shipping.jpg`
- etc. (see /public/images/services/README.md for full list)

### Image Specifications
- **Format:** JPEG (preferred), PNG, or WebP
- **Dimensions:** 1200x400px (3:1 aspect ratio recommended)
- **File Size:** Under 500KB per image
- **Quality:** 80-85% JPEG quality is sufficient

### Image Content Suggestions

**Pack & Ship Services:**
- Boxes, packages, shipping labels, delivery trucks

**Printing Services:**
- Printers, printed materials, business cards, brochures

**Mailbox Services:**
- Mail boxes, postal services, secure storage

**Specialty Services:**
- Fingerprinting equipment, notary seals, scanning devices

## Testing Images

After uploading, you can test by visiting any service page. For example:
- `/pack-ship` - Pack & Ship service page
- `/pack-ship/artwork-shipping` - Artwork Shipping page
- `/copy-print/business-cards` - Business Cards page

Images will appear at the top of each service page with a nice rounded border and shadow effect.

## Troubleshooting

**Images not showing?**
1. Check that filenames match exactly (including extension)
2. Verify images are in the correct bucket/folder
3. Ensure images are under 5MB (bucket limit)
4. Check browser console for any loading errors

**Need placeholder images?**
Use high-quality stock photos from:
- Pexels: https://pexels.com
- Unsplash: https://unsplash.com

Search terms like:
- "shipping boxes"
- "business cards printing"
- "mailbox postal service"
- "document scanning"
