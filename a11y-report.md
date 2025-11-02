# Accessibility Report

## Summary

| Rule | Issues |
|------|--------|
| null | 65 |

## Detailed Findings

### null

**File:** `src\App.tsx`
**Location:** Line 67, Column 18
**Message:** Parsing error: Unexpected token :

```tsx
import { NotFound } from "./pages/NotFound";

const DebugRoutes: React.FC = () => {
  const location = useLocation();
  console.log('Current location:', location.pathname);
```

**File:** `src\components\CarrierLogos.tsx`
**Location:** Line 4, Column 26
**Message:** Parsing error: Unexpected token :

```tsx
import { getServiceImageUrl } from "../lib/supabase";

export const CarrierLogos: React.FC = () => {
  const carriers = [
    {
```

**File:** `src\components\JsonLd.tsx`
**Location:** Line 3, Column 1
**Message:** Parsing error: The keyword 'interface' is reserved

```tsx
import React from 'react';

interface JsonLdProps {
  schema: object;
}
```

**File:** `src\components\Meta.tsx`
**Location:** Line 5, Column 1
**Message:** Parsing error: The keyword 'interface' is reserved

```tsx
import { siteConfig } from "../config/siteConfig";

interface MetaProps {
  title: string;
  description: string;
```

**File:** `src\components\ScrollToTop.tsx`
**Location:** Line 4, Column 18
**Message:** Parsing error: Unexpected token :

```tsx
import { useLocation } from "react-router-dom";

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

```

**File:** `src\components\ServicePage.tsx`
**Location:** Line 21, Column 25
**Message:** Parsing error: Unexpected token :

```tsx
} from "./ui/accordion";

export const ServicePage: React.FC<Service> = (props) => {
  const {
    pageTitle,
```

**File:** `src\components\SmartImage.tsx`
**Location:** Line 3, Column 1
**Message:** Parsing error: The keyword 'interface' is reserved

```tsx
import React from "react";

interface SmartImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /**
   * If true, loads image eagerly with high fetch priority (for LCP/hero).
```

**File:** `src\components\VisitUsButton.tsx`
**Location:** Line 4, Column 1
**Message:** Parsing error: The keyword 'interface' is reserved

```tsx
import { Button } from "./ui";

interface VisitUsButtonProps {
  defaultCity: string; // e.g., "Concord Township"
  className?: string;
```

**File:** `src\components\layout\Footer.tsx`
**Location:** Line 9, Column 20
**Message:** Parsing error: Unexpected token :

```tsx
import { getGoogleMapsLink } from '../../utils/location';

export const Footer: React.FC = () => {
  const quickLinks = [
    { name: 'Pack & Ship', href: '/pack-ship' },
```

**File:** `src\components\layout\Header.tsx`
**Location:** Line 10, Column 20
**Message:** Parsing error: Unexpected token :

```tsx
import { SmartImage } from '../SmartImage';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
```

**File:** `src\components\layout\Layout.tsx`
**Location:** Line 8, Column 1
**Message:** Parsing error: The keyword 'interface' is reserved

```tsx
import { siteConfig } from '../../config/siteConfig';

interface LayoutProps {
  children: React.ReactNode;
}
```

**File:** `src\components\sections\CTA.tsx`
**Location:** Line 2, Column 13
**Message:** Parsing error: Unexpected token {

```tsx
import React from "react";
import type { CTA } from "../../types/services";
import { Button } from "../ui";
import { cn } from "../../lib/utils";
```

**File:** `src\components\ui\Breadcrumbs.tsx`
**Location:** Line 8, Column 1
**Message:** Parsing error: The keyword 'interface' is reserved

```tsx
import { JsonLd } from "../JsonLd";

interface BreadcrumbsProps {
  service: Service;
  baseUrl?: string;
```

**File:** `src\components\ui\Button.tsx`
**Location:** Line 2, Column 23
**Message:** Parsing error: Unexpected token MotionProps

```tsx
import React from "react";
import { motion, type MotionProps } from "framer-motion";

type BaseButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & MotionProps;
```

**File:** `src\components\ui\SearchBox.tsx`
**Location:** Line 6, Column 1
**Message:** Parsing error: The keyword 'interface' is reserved

```tsx
import { Search, X } from 'lucide-react';

interface SearchResult {
  title: string;
  description: string;
```

**File:** `src\components\ui\accordion.tsx`
**Location:** Line 11, Column 51
**Message:** Parsing error: Unexpected token ,

```tsx

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
```

**File:** `src\main.tsx`
**Location:** Line 16, Column 43
**Message:** Parsing error: Unexpected token !

```tsx
 // console.log('main.tsx: Starting render');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
```

**File:** `src\pages\AboutUs.tsx`
**Location:** Line 15, Column 21
**Message:** Parsing error: Unexpected token :

```tsx
});

export const AboutUs: React.FC = () => {
  // ✅ Schema setup
  const faqData = [
```

**File:** `src\pages\ArtworkShipping.tsx`
**Location:** Line 6, Column 29
**Message:** Parsing error: Unexpected token :

```tsx
import { services } from "../config/services";

export const ArtworkShipping: React.FC = () => {
  const service = services.find(s => s.id === "artwork-shipping")!;
  return <ServicePage {...service} />;
```

**File:** `src\pages\BicycleShipping.tsx`
**Location:** Line 6, Column 29
**Message:** Parsing error: Unexpected token :

```tsx
import { services } from "../config/services";

export const BicycleShipping: React.FC = () => {
  const service = services.find(s => s.id === "bicycle-shipping")!;
  return <ServicePage {...service} />;
```

**File:** `src\pages\BusinessCardsPage.tsx`
**Location:** Line 5, Column 31
**Message:** Parsing error: Unexpected token :

```tsx
import { services } from "../config/services";

export const BusinessCardsPage: React.FC = () => {
  const service = services.find(s => s.id === "business-cards")!;
  return <ServicePage {...service} />;
```

**File:** `src\pages\ContactUs.tsx`
**Location:** Line 9, Column 23
**Message:** Parsing error: Unexpected token :

```tsx
import { getGoogleMapsLink } from '../utils/location';

export const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
```

**File:** `src\pages\Copies.tsx`
**Location:** Line 6, Column 20
**Message:** Parsing error: Unexpected token :

```tsx
import { services } from "../config/services";

export const Copies: React.FC = () => {
  const service = services.find(s => s.id === "copies")!;
  return <ServicePage {...service} />;
```

**File:** `src\pages\CopyPrint.tsx`
**Location:** Line 9, Column 23
**Message:** Parsing error: Unexpected token :

```tsx
import { defaultCTA } from "../config/siteConfig";

export const CopyPrint: React.FC = () => {
  const services = [
    {
```

**File:** `src\pages\CopyingServices.tsx`
**Location:** Line 5, Column 29
**Message:** Parsing error: Unexpected token :

```tsx
import { services } from "../config/services";

export const CopyingServices: React.FC = () => {
  const service = services.find(s => s.id === "copying-services")!;
  return <ServicePage {...service} />;
```

**File:** `src\pages\CustomBoxMaking.tsx`
**Location:** Line 6, Column 29
**Message:** Parsing error: Unexpected token :

```tsx
import { services } from "../config/services";

export const CustomBoxMaking: React.FC = () => {
  const service = services.find(s => s.id === "custom-box-making")!;
  return <ServicePage {...service} />;
```

**File:** `src\pages\DHLExpress.tsx`
**Location:** Line 6, Column 24
**Message:** Parsing error: Unexpected token :

```tsx
import { services } from "../config/services";

export const DHLExpress: React.FC = () => {
  const service = services.find(s => s.id === "dhl-express")!;
  return <ServicePage {...service} />;
```

**File:** `src\pages\DigitalFingerprinting.tsx`
**Location:** Line 6, Column 35
**Message:** Parsing error: Unexpected token :

```tsx
import { services } from "../config/services";

export const DigitalFingerprinting: React.FC = () => {
  const service = services.find(s => s.id === "digital-fingerprinting")!;
  return <ServicePage {...service} />;
```

**File:** `src\pages\DigitalMailboxRental.tsx`
**Location:** Line 5, Column 34
**Message:** Parsing error: Unexpected token :

```tsx
import { services } from "../config/services";

export const DigitalMailboxRental: React.FC = () => {
  const service = services.find(s => s.id === "digital-mailbox-rental")!;
  return <ServicePage {...service} />;
```

**File:** `src\pages\DocumentPrinting.tsx`
**Location:** Line 6, Column 30
**Message:** Parsing error: Unexpected token :

```tsx
import { services } from "../config/services";

export const DocumentPrinting: React.FC = () => {
  const service = services.find(s => s.id === "document-printing")!;
  return <ServicePage {...service} />;
```

**File:** `src\pages\DocumentScanning.tsx`
**Location:** Line 6, Column 30
**Message:** Parsing error: Unexpected token :

```tsx
import { services } from "../config/services";

export const DocumentScanning: React.FC = () => {
  const service = services.find(s => s.id === "document-scanning")!;
  return <ServicePage {...service} />;
```

**File:** `src\pages\DocumentShredding.tsx`
**Location:** Line 6, Column 31
**Message:** Parsing error: Unexpected token :

```tsx
import { Button } from '../components/ui';

export const DocumentShredding: React.FC = () => {
  return (
    <div className="bg-white">
```

**File:** `src\pages\EveryDoorDirectMail.tsx`
**Location:** Line 7, Column 33
**Message:** Parsing error: Unexpected token :

```tsx
const service = services.find((s) => s.id === "every-door-direct-mail");

export const EveryDoorDirectMail: React.FC = () => {
  if (!service) {
    return <div>Service not found</div>;
```

**File:** `src\pages\FaxServices.tsx`
**Location:** Line 6, Column 25
**Message:** Parsing error: Unexpected token :

```tsx
import { services } from "../config/services";

export const FaxServices: React.FC = () => {
  const service = services.find(s => s.id === "fax-services")!;
  return <ServicePage {...service} />;
```

**File:** `src\pages\FedExShipping.tsx`
**Location:** Line 6, Column 27
**Message:** Parsing error: Unexpected token :

```tsx
import { services } from "../config/services";

export const FedExShipping: React.FC = () => {
  const service = services.find(s => s.id === "fedex-shipping")!;
  return <ServicePage {...service} />;
```

**File:** `src\pages\FlyersBrochures.tsx`
**Location:** Line 6, Column 29
**Message:** Parsing error: Unexpected token :

```tsx
import { services } from "../config/services";

export const FlyersBrochures: React.FC = () => {
  const service = services.find(s => s.id === "flyers-brochures")!;
  return <ServicePage {...service} />;
```

**File:** `src\pages\GolfClubShipping.tsx`
**Location:** Line 6, Column 30
**Message:** Parsing error: Unexpected token :

```tsx
import { services } from "../config/services";

export const GolfClubShipping: React.FC = () => {
  const service = services.find(s => s.id === "golf-club-shipping")!;
  return <ServicePage {...service} />;
```

**File:** `src\pages\GraphicDesign.tsx`
**Location:** Line 6, Column 27
**Message:** Parsing error: Unexpected token :

```tsx
import { services } from "../config/services";

export const GraphicDesign: React.FC = () => {
  const service = services.find(s => s.id === "graphic-design")!;
  return <ServicePage {...service} />;
```

**File:** `src\pages\Home.tsx`
**Location:** Line 19, Column 18
**Message:** Parsing error: Unexpected token :

```tsx
import { pageMeta } from "../config/pageMeta";

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0);
```

**File:** `src\pages\HomeBusiness.tsx`
**Location:** Line 6, Column 26
**Message:** Parsing error: Unexpected token :

```tsx
import { services } from "../config/services";

export const HomeBusiness: React.FC = () => {
  // console.log('HomeBusiness: services array:', services);
  const service = services.find(s => s.id === "home-business");
```

**File:** `src\pages\Insurance.tsx`
**Location:** Line 6, Column 23
**Message:** Parsing error: Unexpected token :

```tsx
import { services } from "../config/services";

export const Insurance: React.FC = () => {
  const service = services.find(s => s.id === "insurance")!;
  return <ServicePage {...service} />;
```

**File:** `src\pages\MailboxRentalPage.tsx`
**Location:** Line 6, Column 31
**Message:** Parsing error: Unexpected token :

```tsx
import { services } from "../config/services";

export const MailboxRentalPage: React.FC = () => {
  const service = services.find(s => s.id === "mailbox-rental")!;
  return <ServicePage {...service} />;
```

**File:** `src\pages\NotFound.tsx`
**Location:** Line 7, Column 22
**Message:** Parsing error: Unexpected token :

```tsx
import { Button } from '../components/ui';

export const NotFound: React.FC = () => {
  return (
    <div className="bg-white min-h-screen flex items-center justify-center">
```

**File:** `src\pages\PackShip.tsx`
**Location:** Line 7, Column 22
**Message:** Parsing error: Unexpected token :

```tsx
import { Button } from '../components/ui';

export const PackShip: React.FC = () => {
  const services = [
    {
```

**File:** `src\pages\PackageDropOffs.tsx`
**Location:** Line 6, Column 29
**Message:** Parsing error: Unexpected token :

```tsx
import { services } from "../config/services";

export const PackageDropOffs: React.FC = () => {
  const service = services.find(s => s.id === "package-drop-offs")!;
  return <ServicePage {...service} />;
```

**File:** `src\pages\PackageReceiving.tsx`
**Location:** Line 6, Column 30
**Message:** Parsing error: Unexpected token :

```tsx
import { services } from "../config/services";

export const PackageReceiving: React.FC = () => {
  const service = services.find(s => s.id === "package-receiving")!;
  return <ServicePage {...service} />;
```

**File:** `src\pages\PackagingSupplies.tsx`
**Location:** Line 6, Column 31
**Message:** Parsing error: Unexpected token :

```tsx
import { services } from "../config/services";

export const PackagingSupplies: React.FC = () => {
  const service = services.find(s => s.id === "packaging-supplies")!;
  return <ServicePage {...service} />;
```

**File:** `src\pages\PageWrapperTemplate.tsx`
**Location:** Line 15, Column 33
**Message:** Parsing error: Unexpected token :

```tsx
 */

export const PageWrapperTemplate: React.FC = () => {
  const service = services.find(s => s.id === "SERVICE_ID_HERE")!;

```

**File:** `src\pages\PostageStamps.tsx`
**Location:** Line 6, Column 27
**Message:** Parsing error: Unexpected token :

```tsx
import { services } from "../config/services";

export const PostageStamps: React.FC = () => {
  const service = services.find(s => s.id === "postage-stamps")!;
  return <ServicePage {...service} />;
```

**File:** `src\pages\PostcardPrinting.tsx`
**Location:** Line 6, Column 30
**Message:** Parsing error: Unexpected token :

```tsx
import { services } from "../config/services";

export const PostcardPrinting: React.FC = () => {
  const service = services.find(s => s.id === "postcard-printing")!;
  return <ServicePage {...service} />;
```

**File:** `src\pages\PostersPrinting.tsx`
**Location:** Line 6, Column 29
**Message:** Parsing error: Unexpected token :

```tsx
import { services } from "../config/services";

export const PostersPrinting: React.FC = () => {
  const service = services.find(s => s.id === "posters-printing")!;
  return <ServicePage {...service} />;
```

**File:** `src\pages\PrintDocumentServices.tsx`
**Location:** Line 6, Column 35
**Message:** Parsing error: Unexpected token :

```tsx
import { services } from "../config/services";

export const PrintDocumentServices: React.FC = () => {
  const service = services.find(s => s.id === "print-document-services")!;
  return <ServicePage {...service} />;
```

**File:** `src\pages\Privacy.tsx`
**Location:** Line 5, Column 21
**Message:** Parsing error: Unexpected token :

```tsx
import { Shield, Eye, Lock, FileText } from 'lucide-react';

export const Privacy: React.FC = () => {
  const sections = [
    {
```

**File:** `src\pages\ProfessionalPacking.tsx`
**Location:** Line 6, Column 33
**Message:** Parsing error: Unexpected token :

```tsx
import { services } from "../config/services";

export const ProfessionalPacking: React.FC = () => {
  const service = services.find(s => s.id === "professional-packing")!;
  return <ServicePage {...service} />;
```

**File:** `src\pages\ServiceAreaIndex.tsx`
**Location:** Line 6, Column 30
**Message:** Parsing error: Unexpected token :

```tsx
import { Button } from "../components/ui";

export const ServiceAreaIndex: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
```

**File:** `src\pages\ServiceAreaPage.tsx`
**Location:** Line 6, Column 29
**Message:** Parsing error: Unexpected token :

```tsx
import { ServicePage } from "../components/ServicePage";

export const ServiceAreaPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const area = serviceAreas.find((a) => a.slug === slug);
```

**File:** `src\pages\Services.tsx`
**Location:** Line 15, Column 20
**Message:** Parsing error: Unexpected token :

```tsx

// Utility to generate safe IDs
const makeId = (str: string) =>
  str.toLowerCase().replace(/\s+/g, "-").replace(/&/g, "and");

```

**File:** `src\pages\ShippingPartners.tsx`
**Location:** Line 6, Column 23
**Message:** Parsing error: Unexpected token :

```tsx
import { Meta } from "../components/Meta";

const ShippingPartners: React.FC = () => {
  return (
    <>
```

**File:** `src\pages\Shredding.tsx`
**Location:** Line 6, Column 23
**Message:** Parsing error: Unexpected token :

```tsx
import { services } from "../config/services";

export const Shredding: React.FC = () => {
  const service = services.find(s => s.id === "shredding")!;
  return <ServicePage {...service} />;
```

**File:** `src\pages\StoreHours.tsx`
**Location:** Line 8, Column 24
**Message:** Parsing error: Unexpected token :

```tsx
import { getGoogleMapsLink } from '../utils/location';

export const StoreHours: React.FC = () => {
  const hours = [
    { day: 'Monday', time: '9:00 AM - 6:00 PM', isToday: false },
```

**File:** `src\pages\Terms.tsx`
**Location:** Line 5, Column 18
**Message:** Parsing error: Unexpected token :

```tsx
import { FileText, Shield, AlertTriangle, Scale, Mail, Fingerprint, Gavel, RefreshCw, Phone } from 'lucide-react';

const BulletPoint: React.FC<{children: React.ReactNode}> = ({children}) => (
  <li className="flex items-start">
    <div className="w-2 h-2 bg-[#0855B1] rounded-full mt-2 mr-3 flex-shrink-0"></div>
```

**File:** `src\pages\Tracking.tsx`
**Location:** Line 11, Column 22
**Message:** Parsing error: Unexpected token :

```tsx

// Utility to safely stringify JSON for <script>
const toJsonLd = (obj: unknown) => JSON.stringify(obj, null, 2);

export const Tracking: React.FC = () => {
```

**File:** `src\pages\UPSAuthorizedShipperOutlet.tsx`
**Location:** Line 6, Column 40
**Message:** Parsing error: Unexpected token :

```tsx
import { services } from "../config/services";

export const UPSAuthorizedShipperOutlet: React.FC = () => {
  const service = services.find(s => s.id === "ups-authorized-shipper-outlet")!;
  return <ServicePage {...service} />;
```

**File:** `src\pages\USPSServices.tsx`
**Location:** Line 6, Column 26
**Message:** Parsing error: Unexpected token :

```tsx
import { services } from "../config/services";

export const USPSServices: React.FC = () => {
  const service = services.find(s => s.id === "usps-services")!;
  return <ServicePage {...service} />;
```

**File:** `src\pages\ask-mailbox-plus.tsx`
**Location:** Line 21, Column 31
**Message:** Parsing error: Unexpected token :

```tsx

// Helper to flatten all FAQ arrays from a category object
function flattenFaqs(faqModule: Record<string, unknown>): FAQ[] {
  return Object.values(faqModule)
    .filter((arr) => Array.isArray(arr))
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

