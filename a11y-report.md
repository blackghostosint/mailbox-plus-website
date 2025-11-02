# Accessibility Report

## Summary

| Rule | Issues |
|------|--------|
| jsx-a11y/button-has-content | 65 |
| jsx-a11y/alt-text | 2 |
| react/no-unescaped-entities | 15 |
| react/react-in-jsx-scope | 3 |
| @typescript-eslint/no-unused-vars | 1 |

## Detailed Findings

### jsx-a11y/button-has-content

**File:** `src\App.tsx`
**Location:** Line 1, Column 1
**Message:** Definition for rule 'jsx-a11y/button-has-content' was not found.

```tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
```

**File:** `src\components\CarrierLogos.tsx`
**Location:** Line 1, Column 1
**Message:** Definition for rule 'jsx-a11y/button-has-content' was not found.

```tsx
import React from "react";
import { getServiceImageUrl } from "../lib/supabase";

```

**File:** `src\components\JsonLd.tsx`
**Location:** Line 1, Column 1
**Message:** Definition for rule 'jsx-a11y/button-has-content' was not found.

```tsx
import React from 'react';

interface JsonLdProps {
```

**File:** `src\components\Meta.tsx`
**Location:** Line 1, Column 1
**Message:** Definition for rule 'jsx-a11y/button-has-content' was not found.

```tsx
import React from "react";
import { Helmet } from "react-helmet-async";
import { siteConfig } from "../config/siteConfig";
```

**File:** `src\components\ScrollToTop.tsx`
**Location:** Line 1, Column 1
**Message:** Definition for rule 'jsx-a11y/button-has-content' was not found.

```tsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

```

**File:** `src\components\ServicePage.tsx`
**Location:** Line 1, Column 1
**Message:** Definition for rule 'jsx-a11y/button-has-content' was not found.

```tsx
import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
```

**File:** `src\components\SmartImage.tsx`
**Location:** Line 1, Column 1
**Message:** Definition for rule 'jsx-a11y/button-has-content' was not found.

```tsx
import React from "react";

interface SmartImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
```

**File:** `src\components\VisitUsButton.tsx`
**Location:** Line 1, Column 1
**Message:** Definition for rule 'jsx-a11y/button-has-content' was not found.

```tsx
import React, { useState, useEffect } from "react";
import { Button } from "./ui";

```

**File:** `src\components\layout\Footer.tsx`
**Location:** Line 1, Column 1
**Message:** Definition for rule 'jsx-a11y/button-has-content' was not found.

```tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';
```

**File:** `src\components\layout\Header.tsx`
**Location:** Line 1, Column 1
**Message:** Definition for rule 'jsx-a11y/button-has-content' was not found.

```tsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
```

**File:** `src\components\layout\Layout.tsx`
**Location:** Line 1, Column 1
**Message:** Definition for rule 'jsx-a11y/button-has-content' was not found.

```tsx
import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
```

**File:** `src\components\sections\CTA.tsx`
**Location:** Line 1, Column 1
**Message:** Definition for rule 'jsx-a11y/button-has-content' was not found.

```tsx
import React from "react";
import type { CTA } from "../../types/services";
import { Button } from "../ui";
```

**File:** `src\components\ui\Breadcrumbs.tsx`
**Location:** Line 1, Column 1
**Message:** Definition for rule 'jsx-a11y/button-has-content' was not found.

```tsx
import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
```

**File:** `src\components\ui\Button.tsx`
**Location:** Line 1, Column 1
**Message:** Definition for rule 'jsx-a11y/button-has-content' was not found.

```tsx
import React from "react";
import { motion, type MotionProps } from "framer-motion";

```

**File:** `src\components\ui\SearchBox.tsx`
**Location:** Line 1, Column 1
**Message:** Definition for rule 'jsx-a11y/button-has-content' was not found.

```tsx
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
```

**File:** `src\components\ui\accordion.tsx`
**Location:** Line 1, Column 1
**Message:** Definition for rule 'jsx-a11y/button-has-content' was not found.

```tsx
"use client"

import * as React from "react"
```

**File:** `src\main.tsx`
**Location:** Line 1, Column 1
**Message:** Definition for rule 'jsx-a11y/button-has-content' was not found.

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
```

**File:** `src\pages\AboutUs.tsx`
**Location:** Line 1, Column 1
**Message:** Definition for rule 'jsx-a11y/button-has-content' was not found.

```tsx
import React from "react";
import { motion } from "framer-motion";
import { Heart, Users, Award, Clock, Package, Shield, Printer, Fingerprint } from "lucide-react";
```

**File:** `src\pages\ArtworkShipping.tsx`
**Location:** Line 1, Column 1
**Message:** Definition for rule 'jsx-a11y/button-has-content' was not found.

```tsx
// ArtworkShipping.tsx
import React from "react";
import { ServicePage } from "../components/ServicePage";
```

**File:** `src\pages\BicycleShipping.tsx`
**Location:** Line 1, Column 1
**Message:** Definition for rule 'jsx-a11y/button-has-content' was not found.

```tsx
// BicycleShipping.tsx
import React from "react";
import { ServicePage } from "../components/ServicePage";
```

**File:** `src\pages\BusinessCardsPage.tsx`
**Location:** Line 1, Column 1
**Message:** Definition for rule 'jsx-a11y/button-has-content' was not found.

```tsx
import React from "react";
import { ServicePage } from "../components/ServicePage";
import { services } from "../config/services";
```

**File:** `src\pages\ContactUs.tsx`
**Location:** Line 1, Column 1
**Message:** Definition for rule 'jsx-a11y/button-has-content' was not found.

```tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';
```

**File:** `src\pages\Copies.tsx`
**Location:** Line 1, Column 1
**Message:** Definition for rule 'jsx-a11y/button-has-content' was not found.

```tsx
// Copies.tsx
import React from "react";
import { ServicePage } from "../components/ServicePage";
```

**File:** `src\pages\CopyPrint.tsx`
**Location:** Line 1, Column 1
**Message:** Definition for rule 'jsx-a11y/button-has-content' was not found.

```tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
```

**File:** `src\pages\CopyingServices.tsx`
**Location:** Line 1, Column 1
**Message:** Definition for rule 'jsx-a11y/button-has-content' was not found.

```tsx
import React from "react";
import { ServicePage } from "../components/ServicePage";
import { services } from "../config/services";
```

**File:** `src\pages\CustomBoxMaking.tsx`
**Location:** Line 1, Column 1
**Message:** Definition for rule 'jsx-a11y/button-has-content' was not found.

```tsx
// CustomBoxMaking.tsx
import React from "react";
import { ServicePage } from "../components/ServicePage";
```

**File:** `src\pages\DHLExpress.tsx`
**Location:** Line 1, Column 1
**Message:** Definition for rule 'jsx-a11y/button-has-content' was not found.

```tsx
// DHLExpress.tsx
import React from "react";
import { ServicePage } from "../components/ServicePage";
```

**File:** `src\pages\DigitalFingerprinting.tsx`
**Location:** Line 1, Column 1
**Message:** Definition for rule 'jsx-a11y/button-has-content' was not found.

```tsx
// DigitalFingerprinting.tsx
import React from "react";
import { ServicePage } from "../components/ServicePage";
```

**File:** `src\pages\DigitalMailboxRental.tsx`
**Location:** Line 1, Column 1
**Message:** Definition for rule 'jsx-a11y/button-has-content' was not found.

```tsx
import React from "react";
import { ServicePage } from "../components/ServicePage";
import { services } from "../config/services";
```

**File:** `src\pages\DocumentPrinting.tsx`
**Location:** Line 1, Column 1
**Message:** Definition for rule 'jsx-a11y/button-has-content' was not found.

```tsx
// DocumentPrinting.tsx
import React from "react";
import { ServicePage } from "../components/ServicePage";
```

**File:** `src\pages\DocumentScanning.tsx`
**Location:** Line 1, Column 1
**Message:** Definition for rule 'jsx-a11y/button-has-content' was not found.

```tsx
// DocumentScanning.tsx
import React from "react";
import { ServicePage } from "../components/ServicePage";
```

**File:** `src\pages\DocumentShredding.tsx`
**Location:** Line 1, Column 1
**Message:** Definition for rule 'jsx-a11y/button-has-content' was not found.

```tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Trash2, Shield, FileText, CheckCircle } from 'lucide-react';
```

**File:** `src\pages\EveryDoorDirectMail.tsx`
**Location:** Line 1, Column 1
**Message:** Definition for rule 'jsx-a11y/button-has-content' was not found.

```tsx
import React from "react";
import { ServicePage } from "../components/ServicePage";
import { services } from "../config/services";
```

**File:** `src\pages\FaxServices.tsx`
**Location:** Line 1, Column 1
**Message:** Definition for rule 'jsx-a11y/button-has-content' was not found.

```tsx
// FaxServices.tsx
import React from "react";
import { ServicePage } from "../components/ServicePage";
```

**File:** `src\pages\FedExShipping.tsx`
**Location:** Line 1, Column 1
**Message:** Definition for rule 'jsx-a11y/button-has-content' was not found.

```tsx
// FedExShipping.tsx
import React from "react";
import { ServicePage } from "../components/ServicePage";
```

**File:** `src\pages\FlyersBrochures.tsx`
**Location:** Line 1, Column 1
**Message:** Definition for rule 'jsx-a11y/button-has-content' was not found.

```tsx
// FlyersBrochures.tsx
import React from "react";
import { ServicePage } from "../components/ServicePage";
```

**File:** `src\pages\GolfClubShipping.tsx`
**Location:** Line 1, Column 1
**Message:** Definition for rule 'jsx-a11y/button-has-content' was not found.

```tsx
// GolfClubShipping.tsx
import React from "react";
import { ServicePage } from "../components/ServicePage";
```

**File:** `src\pages\GraphicDesign.tsx`
**Location:** Line 1, Column 1
**Message:** Definition for rule 'jsx-a11y/button-has-content' was not found.

```tsx
// GraphicDesign.tsx
import React from "react";
import { ServicePage } from "../components/ServicePage";
```

**File:** `src\pages\Home.tsx`
**Location:** Line 1, Column 1
**Message:** Definition for rule 'jsx-a11y/button-has-content' was not found.

```tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
```

**File:** `src\pages\HomeBusiness.tsx`
**Location:** Line 1, Column 1
**Message:** Definition for rule 'jsx-a11y/button-has-content' was not found.

```tsx
// HomeBusiness.tsx
import React from "react";
import { ServicePage } from "../components/ServicePage";
```

**File:** `src\pages\Insurance.tsx`
**Location:** Line 1, Column 1
**Message:** Definition for rule 'jsx-a11y/button-has-content' was not found.

```tsx
// Insurance.tsx
import React from "react";
import { ServicePage } from "../components/ServicePage";
```

**File:** `src\pages\MailboxRentalPage.tsx`
**Location:** Line 1, Column 1
**Message:** Definition for rule 'jsx-a11y/button-has-content' was not found.

```tsx
// MailboxRentalPage.tsx
import React from "react";
import { ServicePage } from "../components/ServicePage";
```

**File:** `src\pages\NotFound.tsx`
**Location:** Line 1, Column 1
**Message:** Definition for rule 'jsx-a11y/button-has-content' was not found.

```tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
```

**File:** `src\pages\PackShip.tsx`
**Location:** Line 1, Column 1
**Message:** Definition for rule 'jsx-a11y/button-has-content' was not found.

```tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
```

**File:** `src\pages\PackageDropOffs.tsx`
**Location:** Line 1, Column 1
**Message:** Definition for rule 'jsx-a11y/button-has-content' was not found.

```tsx
// PackageDropOffs.tsx
import React from "react";
import { ServicePage } from "../components/ServicePage";
```

**File:** `src\pages\PackageReceiving.tsx`
**Location:** Line 1, Column 1
**Message:** Definition for rule 'jsx-a11y/button-has-content' was not found.

```tsx
// PackageReceiving.tsx
import React from "react";
import { ServicePage } from "../components/ServicePage";
```

**File:** `src\pages\PackagingSupplies.tsx`
**Location:** Line 1, Column 1
**Message:** Definition for rule 'jsx-a11y/button-has-content' was not found.

```tsx
// PackagingSupplies.tsx
import React from "react";
import { ServicePage } from "../components/ServicePage";
```

**File:** `src\pages\PageWrapperTemplate.tsx`
**Location:** Line 1, Column 1
**Message:** Definition for rule 'jsx-a11y/button-has-content' was not found.

```tsx
import React from "react";
import { ServicePage } from "../components/ServicePage";
import { services } from "../config/services";
```

**File:** `src\pages\PostageStamps.tsx`
**Location:** Line 1, Column 1
**Message:** Definition for rule 'jsx-a11y/button-has-content' was not found.

```tsx
// PostageStamps.tsx
import React from "react";
import { ServicePage } from "../components/ServicePage";
```

**File:** `src\pages\PostcardPrinting.tsx`
**Location:** Line 1, Column 1
**Message:** Definition for rule 'jsx-a11y/button-has-content' was not found.

```tsx
// PostcardPrinting.tsx
import React from "react";
import { ServicePage } from "../components/ServicePage";
```

**File:** `src\pages\PostersPrinting.tsx`
**Location:** Line 1, Column 1
**Message:** Definition for rule 'jsx-a11y/button-has-content' was not found.

```tsx
// PostersPrinting.tsx
import React from "react";
import { ServicePage } from "../components/ServicePage";
```

**File:** `src\pages\PrintDocumentServices.tsx`
**Location:** Line 1, Column 1
**Message:** Definition for rule 'jsx-a11y/button-has-content' was not found.

```tsx
// PrintDocumentServices.tsx
import React from "react";
import { ServicePage } from "../components/ServicePage";
```

**File:** `src\pages\Privacy.tsx`
**Location:** Line 1, Column 1
**Message:** Definition for rule 'jsx-a11y/button-has-content' was not found.

```tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Eye, Lock, FileText } from 'lucide-react';
```

**File:** `src\pages\ProfessionalPacking.tsx`
**Location:** Line 1, Column 1
**Message:** Definition for rule 'jsx-a11y/button-has-content' was not found.

```tsx
// ProfessionalPacking.tsx
import React from "react";
import { ServicePage } from "../components/ServicePage";
```

**File:** `src\pages\ServiceAreaIndex.tsx`
**Location:** Line 1, Column 1
**Message:** Definition for rule 'jsx-a11y/button-has-content' was not found.

```tsx
import React from "react";
import { Link } from "react-router-dom";
import { serviceAreas } from "../config/serviceAreas";
```

**File:** `src\pages\ServiceAreaPage.tsx`
**Location:** Line 1, Column 1
**Message:** Definition for rule 'jsx-a11y/button-has-content' was not found.

```tsx
import React from "react";
import { useParams } from "react-router-dom";
import { serviceAreas } from "../config/serviceAreas";
```

**File:** `src\pages\Services.tsx`
**Location:** Line 1, Column 1
**Message:** Definition for rule 'jsx-a11y/button-has-content' was not found.

```tsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
```

**File:** `src\pages\ShippingPartners.tsx`
**Location:** Line 1, Column 1
**Message:** Definition for rule 'jsx-a11y/button-has-content' was not found.

```tsx
// src/pages/ShippingPartners.tsx
import React from "react";
import { shippingPartners } from "../data/shippingPartners";
```

**File:** `src\pages\Shredding.tsx`
**Location:** Line 1, Column 1
**Message:** Definition for rule 'jsx-a11y/button-has-content' was not found.

```tsx
// Shredding.tsx
import React from "react";
import { ServicePage } from "../components/ServicePage";
```

**File:** `src\pages\StoreHours.tsx`
**Location:** Line 1, Column 1
**Message:** Definition for rule 'jsx-a11y/button-has-content' was not found.

```tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Clock, MapPin, Phone, Calendar } from 'lucide-react';
```

**File:** `src\pages\Terms.tsx`
**Location:** Line 1, Column 1
**Message:** Definition for rule 'jsx-a11y/button-has-content' was not found.

```tsx
import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Shield, AlertTriangle, Scale, Mail, Fingerprint, Gavel, RefreshCw, Phone } from 'lucide-react';
```

**File:** `src\pages\Tracking.tsx`
**Location:** Line 1, Column 1
**Message:** Definition for rule 'jsx-a11y/button-has-content' was not found.

```tsx
import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
```

**File:** `src\pages\UPSAuthorizedShipperOutlet.tsx`
**Location:** Line 1, Column 1
**Message:** Definition for rule 'jsx-a11y/button-has-content' was not found.

```tsx
// UPSAuthorizedShipperOutlet.tsx
import React from "react";
import { ServicePage } from "../components/ServicePage";
```

**File:** `src\pages\USPSServices.tsx`
**Location:** Line 1, Column 1
**Message:** Definition for rule 'jsx-a11y/button-has-content' was not found.

```tsx
// USPSServices.tsx
import React from "react";
import { ServicePage } from "../components/ServicePage";
```

**File:** `src\pages\ask-mailbox-plus.tsx`
**Location:** Line 1, Column 1
**Message:** Definition for rule 'jsx-a11y/button-has-content' was not found.

```tsx
import React from "react";
import { Meta } from "../components/Meta";
import { motion } from "framer-motion";
```

### jsx-a11y/alt-text

**File:** `src\components\SmartImage.tsx`
**Location:** Line 44, Column 9
**Message:** img elements must have an alt prop, either with meaningful text, or an empty string for decorative images.

```tsx
          />
        ))}
        <img
          {...imgProps}
          loading={loading}
```

**File:** `src\components\SmartImage.tsx`
**Location:** Line 55, Column 5
**Message:** img elements must have an alt prop, either with meaningful text, or an empty string for decorative images.

```tsx

  return (
    <img
      {...imgProps}
      loading={loading}
```

### react/no-unescaped-entities

**File:** `src\components\ui\SearchBox.tsx`
**Location:** Line 150, Column 77
**Message:** `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.

```tsx
            ) : query.trim() !== '' ? (
              <div className="py-8 text-center">
                <p className="text-sm text-[#4B5563]">No services found for "{query}"</p>
                <p className="text-xs text-[#4B5563] mt-1">
                  Try searching for shipping, printing, or business services
```

**File:** `src\components\ui\SearchBox.tsx`
**Location:** Line 150, Column 85
**Message:** `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.

```tsx
            ) : query.trim() !== '' ? (
              <div className="py-8 text-center">
                <p className="text-sm text-[#4B5563]">No services found for "{query}"</p>
                <p className="text-xs text-[#4B5563] mt-1">
                  Try searching for shipping, printing, or business services
```

**File:** `src\pages\AboutUs.tsx`
**Location:** Line 105, Column 197
**Message:** `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.

```tsx
          </motion.h1>
          <motion.p {...fadeUp(0.15)} className="text-xl text-blue-100 mb-8 leading-relaxed">
            We exist to make life easier for our neighbors in Lake County, Ohio. Whether you need to ship a package, rent a secure mailbox, get fingerprints taken, or print important documents, we're your one-stop shop — right here in your own community.
          </motion.p>
        </div>
```

**File:** `src\pages\AboutUs.tsx`
**Location:** Line 117, Column 19
**Message:** `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.

```tsx
            <div className="space-y-6 text-[#4B5563] leading-relaxed">
              <p>
                We're a locally owned, faith-guided business committed to serving with integrity, stewardship, and respect. Every customer who walks through our doors is treated like a neighbor, because that's exactly who you are.
              </p>
              <p>
```

**File:** `src\pages\AboutUs.tsx`
**Location:** Line 117, Column 208
**Message:** `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.

```tsx
            <div className="space-y-6 text-[#4B5563] leading-relaxed">
              <p>
                We're a locally owned, faith-guided business committed to serving with integrity, stewardship, and respect. Every customer who walks through our doors is treated like a neighbor, because that's exactly who you are.
              </p>
              <p>
```

**File:** `src\pages\AboutUs.tsx`
**Location:** Line 121, Column 25
**Message:** `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.

```tsx
              <p>
                What started as a simple pack-and-ship shop has grown into a trusted local resource for families, small businesses, and professionals. Our tagline says it best:{" "}
                <strong>"Let us handle your package"</strong>
              </p>
              <p>
```

**File:** `src\pages\AboutUs.tsx`
**Location:** Line 121, Column 52
**Message:** `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.

```tsx
              <p>
                What started as a simple pack-and-ship shop has grown into a trusted local resource for families, small businesses, and professionals. Our tagline says it best:{" "}
                <strong>"Let us handle your package"</strong>
              </p>
              <p>
```

**File:** `src\pages\ContactUs.tsx`
**Location:** Line 122, Column 71
**Message:** `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.

```tsx
              className="text-xl text-[#4B5563] mb-8 leading-relaxed"
            >
              Visit our store in Concord Twp., or contact us today. We're here to help 
              with all your shipping, printing, and business service needs.
            </motion.p>
```

**File:** `src\pages\ContactUs.tsx`
**Location:** Line 180, Column 47
**Message:** `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.

```tsx
              <p className="text-[#4B5563] mb-8 leading-relaxed">
                Have a question about our services or need a custom quote? 
                Fill out the form below and we'll get back to you promptly.
              </p>

```

**File:** `src\pages\ContactUs.tsx`
**Location:** Line 337, Column 21
**Message:** `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.

```tsx
                <h4 className="font-semibold text-[#111827] mb-3">Getting Here</h4>
                <p className="text-sm text-[#4B5563] leading-relaxed">
                  We're conveniently located nextdoor to Pub Frato, just minutes from I-90 and OH-44. 
                  Plenty of free parking available. Look for our red Mailbox Plus sign!
                </p>
```

**File:** `src\pages\NotFound.tsx`
**Location:** Line 21, Column 29
**Message:** `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.

```tsx
          </h1>
          <p className="text-xl text-[#4B5563] mb-8 leading-relaxed">
            Sorry, we couldn't find the page you're looking for. The page may have been moved, 
            deleted, or you may have entered the wrong URL.
          </p>
```

**File:** `src\pages\NotFound.tsx`
**Location:** Line 21, Column 49
**Message:** `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.

```tsx
          </h1>
          <p className="text-xl text-[#4B5563] mb-8 leading-relaxed">
            Sorry, we couldn't find the page you're looking for. The page may have been moved, 
            deleted, or you may have entered the wrong URL.
          </p>
```

**File:** `src\pages\ShippingPartners.tsx`
**Location:** Line 22, Column 13
**Message:** `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.

```tsx
        {/* Intro Text */}
        <p className="text-center text-lg mb-10 text-gray-600 max-w-2xl mx-auto">
          We're proud to work with a wide range of businesses who trust Mailbox
          Plus for their packing, shipping, and logistics needs.
        </p>
```

**File:** `src\pages\StoreHours.tsx`
**Location:** Line 48, Column 64
**Message:** `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.

```tsx
              className="text-xl text-[#4B5563] mb-8 leading-relaxed"
            >
              Visit us during our convenient business hours. We're here to help with all 
              your shipping, printing, and business service needs.
            </motion.p>
```

**File:** `src\pages\Tracking.tsx`
**Location:** Line 282, Column 16
**Message:** `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.

```tsx
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Can't locate your tracking number or having trouble with tracking?
            Our team is here to help you every step of the way.
          </p>
```

### react/react-in-jsx-scope

**File:** `src\main.tsx`
**Location:** Line 17, Column 3
**Message:** 'React' must be in scope when using JSX

```tsx

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <App />
```

**File:** `src\main.tsx`
**Location:** Line 18, Column 5
**Message:** 'React' must be in scope when using JSX

```tsx
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
```

**File:** `src\main.tsx`
**Location:** Line 19, Column 7
**Message:** 'React' must be in scope when using JSX

```tsx
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>
```

### @typescript-eslint/no-unused-vars

**File:** `src\pages\Home.tsx`
**Location:** Line 15, Column 10
**Message:** 'SmartImage' is defined but never used.

```tsx
import { getGoogleMapsLink } from "../utils/location";
import { Meta } from "../components/Meta";
import { SmartImage } from "../components/SmartImage";
import { getServiceImageUrl } from "../lib/supabase";
import { pageMeta } from "../config/pageMeta";
```

## Proactive Fix Examples

### Buttons with accessible text

```tsx
// Bad
<button />

// Good
<button>Click Me</button>
<button aria-label="Close">X</button>
```

### Images with alt text

```tsx
// Bad
<img src="logo.png" />

// Good
<img src="logo.png" alt="Company Logo" />
```

### Anchors with content

```tsx
// Bad
<a></a>

// Good
<a href="/home">Home</a>
```

