# Supabase Setup Instructions

## Step 1: Update Your Anon Key

The `.env` file has been updated with your new Supabase project URL. You now need to add the anon key from your new project:

1. Go to https://supabase.com/dashboard
2. Select your project: **benozoiluqfwumlupgbf**
3. Navigate to **Settings** → **API** in the left sidebar
4. Copy the **anon public** key (under "Project API keys")
5. Open the `.env` file in your project root
6. Replace `YOUR_NEW_ANON_KEY_HERE` with the actual anon key you copied
7. Save the file

## Step 2: Create Storage Bucket

Your application needs a storage bucket to store hero images for service pages.

### Create the Bucket:

1. In your Supabase dashboard (still at https://supabase.com/dashboard)
2. Select your project: **benozoiluqfwumlupgbf**
3. Click **Storage** in the left sidebar
4. Click **Create a new bucket** button
5. Configure the bucket:
   - **Name:** `service-images` (must be exactly this name)
   - **Public bucket:** Toggle ON (enables public read access)
   - **File size limit:** 5MB
   - **Allowed MIME types:** Leave default or set to: `image/jpeg, image/jpg, image/png, image/webp, image/gif`
6. Click **Create bucket**

### Configure Bucket Policies (Optional - for admin uploads later):

1. Click on the `service-images` bucket
2. Click the **Policies** tab
3. The bucket should already allow public SELECT (read) access
4. If you want to upload images via admin panel later, add policies for INSERT, UPDATE, DELETE for authenticated users

## Step 3: Upload Your Hero Images

You have 31 hero images that need to be uploaded to the storage bucket.

### Download from Google Drive:

1. Download all 31 images from your Google Drive to your computer
2. Ensure they are named correctly according to the list below

### Upload to Supabase:

1. In Supabase dashboard, go to **Storage** → **service-images** bucket
2. Click **Upload file** button
3. Select all 31 images (you can upload multiple at once)
4. Wait for upload to complete
5. Verify all images appear in the bucket

### Required Image Filenames (31 total):

**Pack & Ship (13 images):**
- `pack-ship.jpg`
- `artwork-shipping.jpg`
- `bicycle-shipping.jpg`
- `golf-club-shipping.jpg`
- `fedex-shipping.jpg`
- `ups-shipping.jpg`
- `usps-services.jpg`
- `dhl-express.jpg`
- `international-shipping.jpg`
- `package-drop-offs.jpg`
- `custom-box-making.jpg`
- `professional-packing.jpg`
- `packaging-supplies.jpg`

**Copy & Print (10 images):**
- `business-cards.jpg`
- `flyers-brochures.jpg`
- `document-finishing.jpg`
- `graphic-design.jpg`
- `postcard-printing.jpg`
- `poster-banner-printing.jpg`
- `print-document-services.jpg`
- `copies.jpg`

**Home & Business (9 images):**
- `mailbox-rental.jpg`
- `digital-mailbox-rental.jpg`
- `every-door-direct-mail.jpg`
- `package-receiving.jpg`
- `postage-stamps.jpg`
- `shredding.jpg`
- `document-scanning.jpg`
- `fax-services.jpg`
- `notary-services.jpg`

**Specialty (1 image):**
- `digital-fingerprinting.jpg`

## Step 4: Verify Setup

After completing the above steps:

1. Restart your development server if it's running
2. Visit any service page to test image loading:
   - http://localhost:5173/pack-ship
   - http://localhost:5173/copy-print/business-cards
   - http://localhost:5173/home-business/mailbox-rental
3. Images should now display at the top of each service page

## Image Specifications

- **Format:** JPEG (preferred), PNG, or WebP
- **Dimensions:** 1200x400px (3:1 aspect ratio recommended)
- **File Size:** Under 500KB per image for optimal performance
- **Quality:** 80-85% JPEG compression is sufficient

## Alternative: Local Development (Temporary)

If you want to test immediately before setting up Supabase Storage:

1. Create the directory: `/public/images/services/`
2. Place your 31 images in that folder with the correct filenames
3. Images will be served from your local project during development
4. Upload to Supabase Storage when ready for production

## Troubleshooting

### Images not loading?
- Check that the anon key is correct in `.env`
- Verify bucket name is exactly `service-images`
- Ensure bucket is set to "Public"
- Confirm filenames match exactly (case-sensitive)
- Check browser console for any errors

### Need help?
- Review `/public/images/services/README.md` for more details
- Check `/HERO_IMAGES_IMPLEMENTATION.md` for technical documentation
- Verify your Supabase project URL is correct in `.env`

## Summary

**What you need to do:**

1. ✅ Update `.env` with your anon key from the new Supabase project
2. ⏳ Create `service-images` bucket in Supabase Storage (public)
3. ⏳ Upload 31 hero images from Google Drive to the bucket
4. ⏳ Restart dev server and test

Once complete, all service pages will display beautiful hero images at the top!
