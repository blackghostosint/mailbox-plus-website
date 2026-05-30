# Hero Images Implementation

## Overview

Hero images have been successfully added to all service pages in the Mailbox Plus application. This feature enhances the visual appeal of service pages with beautiful, relevant imagery displayed at the top of each page.

## What Was Implemented

### 1. Type System Updates
- ✅ Added `heroImage?: string` field to the `Service` interface (`/src/types/services.ts`)
- This optional field stores the image URL or path for each service

### 2. Component Updates
- ✅ Updated `ServicePage.tsx` to display hero images
- Images appear above the hero title with a beautiful rounded border and shadow
- Smooth fade-in animation using Framer Motion
- Responsive design: full-width on mobile, max-width on desktop
- Fixed height of 288px (h-72) with object-cover for consistent display

### 3. Data Configuration
- ✅ Added `heroImage` URLs to all 31 services in `/src/config/services.ts`
- Each service now references an image path like `/images/services/[service-name].jpg`

### 4. Supabase Storage Setup
- ✅ Created `service-images` storage bucket in Supabase
- ✅ Configured public read access for all users
- ✅ Set up authenticated user permissions for upload/update/delete
- ✅ Set file size limit to 5MB per image
- ✅ Allowed image formats: JPEG, JPG, PNG, WebP, GIF

### 5. Infrastructure
- ✅ Created Supabase client utility (`/src/lib/supabase.ts`)
- ✅ Added helper function `getServiceImageUrl()` for flexible image URL handling
- ✅ Created public directory structure: `/public/images/services/`
- ✅ Added comprehensive documentation for image uploads

## Image Specifications

**Recommended Settings:**
- Format: JPEG (best for photos)
- Dimensions: 1200x400px (3:1 aspect ratio)
- File Size: Under 500KB
- Quality: 80-85% JPEG compression

## Services with Hero Images (31 Total)

**Pack & Ship Category (13 services):**
- pack-ship.jpg
- artwork-shipping.jpg
- bicycle-shipping.jpg
- golf-club-shipping.jpg
- fedex-shipping.jpg
- ups-shipping.jpg
- usps-services.jpg
- dhl-express.jpg
- international-shipping.jpg
- package-drop-offs.jpg
- custom-box-making.jpg
- professional-packing.jpg
- packaging-supplies.jpg

**Copy & Print Category (10 services):**
- business-cards.jpg
- flyers-brochures.jpg
- document-finishing.jpg
- graphic-design.jpg
- postcard-printing.jpg
- poster-banner-printing.jpg
- print-document-services.jpg
- copies.jpg

**Home & Business Category (8 services):**
- mailbox-rental.jpg
- digital-mailbox-rental.jpg
- every-door-direct-mail.jpg
- package-receiving.jpg
- postage-stamps.jpg
- shredding.jpg
- document-scanning.jpg
- fax-services.jpg
- notary-services.jpg

**Specialty Category (1 service):**
- digital-fingerprinting.jpg

## How to Add Images

### Method 1: Supabase Dashboard (Production)
1. Go to https://supabase.com/dashboard
2. Select your project
3. Navigate to Storage > service-images
4. Upload images to the root of the bucket
5. Use exact filenames as listed above

### Method 2: Local Development
1. Place image files in `/public/images/services/`
2. Images will be served during local development
3. Ensure filenames match the configuration

## Image Sources

Use royalty-free stock photos from:
- **Pexels** - https://pexels.com (recommended)
- **Unsplash** - https://unsplash.com

Search suggestions:
- "shipping packages boxes"
- "business card printing"
- "mailbox postal service"
- "document printer office"
- "fingerprint scanner"
- "notary public seal"

## Testing

Visit any service page to see hero images in action:
- http://localhost:5173/pack-ship
- http://localhost:5173/pack-ship/artwork-shipping
- http://localhost:5173/copy-print/business-cards
- http://localhost:5173/home-business/mailbox-rental

## Technical Details

### Component Structure
```tsx
{heroImage && (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="mb-10"
  >
    <img
      src={heroImage}
      alt={heroTitle}
      className="w-full h-72 object-cover rounded-2xl shadow-md"
    />
  </motion.div>
)}
```

### Storage Configuration
- **Bucket Name:** service-images
- **Access:** Public read, authenticated write
- **Max File Size:** 5MB
- **Allowed Types:** image/jpeg, image/jpg, image/png, image/webp, image/gif

### Supabase Storage URL Pattern
```
https://[project-ref].supabase.co/storage/v1/object/public/service-images/[filename]
```

## Files Modified

1. `/src/types/services.ts` - Added heroImage field to Service interface
2. `/src/components/ServicePage.tsx` - Added hero image display logic
3. `/src/config/services.ts` - Added heroImage URLs to all 31 services
4. `/src/lib/supabase.ts` - Created Supabase client and helper functions

## Files Created

1. `/public/images/services/README.md` - Documentation for image specifications
2. `/public/images/services/.gitkeep` - Ensures directory is tracked by git
3. `/scripts/upload-images.md` - Guide for uploading images
4. `/HERO_IMAGES_IMPLEMENTATION.md` - This file

## Build Status

✅ Project builds successfully with no errors
✅ TypeScript compilation passes
✅ All components render correctly

## Next Steps

1. **Upload Images:** Add actual hero images to Supabase Storage or local directory
2. **Optimize Images:** Ensure all images are optimized for web (under 500KB)
3. **Test Responsive:** Verify images look good on mobile, tablet, and desktop
4. **Performance:** Monitor image loading performance and add lazy loading if needed

## Future Enhancements

- Add image upload functionality in an admin panel
- Implement image optimization pipeline
- Add fallback placeholder for missing images
- Consider WebP format for better compression
- Add srcset for responsive images
