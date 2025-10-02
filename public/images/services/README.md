# Service Hero Images

This directory contains hero images for service pages.

## Image Specifications

- **Format:** JPEG, PNG, or WebP
- **Dimensions:** Recommended 1200x400px or similar aspect ratio (3:1)
- **File Size:** Keep under 500KB for optimal performance
- **Naming Convention:** Use lowercase with hyphens matching the service slug

## Required Images

The following hero images are referenced in the application:

1. `pack-ship.jpg`
2. `artwork-shipping.jpg`
3. `bicycle-shipping.jpg`
4. `golf-club-shipping.jpg`
5. `fedex-shipping.jpg`
6. `ups-shipping.jpg`
7. `usps-services.jpg`
8. `dhl-express.jpg`
9. `international-shipping.jpg`
10. `package-drop-offs.jpg`
11. `custom-box-making.jpg`
12. `professional-packing.jpg`
13. `packaging-supplies.jpg`
14. `business-cards.jpg`
15. `flyers-brochures.jpg`
16. `document-finishing.jpg`
17. `graphic-design.jpg`
18. `postcard-printing.jpg`
19. `poster-banner-printing.jpg`
20. `print-document-services.jpg`
21. `copies.jpg`
22. `mailbox-rental.jpg`
23. `digital-mailbox-rental.jpg`
24. `every-door-direct-mail.jpg`
25. `package-receiving.jpg`
26. `postage-stamps.jpg`
27. `shredding.jpg`
28. `document-scanning.jpg`
29. `fax-services.jpg`
30. `notary-services.jpg`
31. `digital-fingerprinting.jpg`

## Using Supabase Storage

### Option 1: Local Development
Place image files directly in this directory for local development.

### Option 2: Supabase Storage (Recommended for Production)
1. Go to your Supabase dashboard
2. Navigate to Storage > service-images bucket
3. Upload your images to the `services/` folder
4. Images will be automatically served from Supabase CDN

The application automatically handles both local and Supabase Storage URLs.

## Image Sources

Consider using high-quality stock photos from:
- Pexels (https://pexels.com) - Free stock photos
- Unsplash (https://unsplash.com) - Free high-resolution images
- Your own professional photography

## Notes

- Images should be relevant to the service they represent
- Maintain consistent visual style across all images
- Ensure proper licensing for all images used
- Optimize images before uploading to reduce load times
