import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import ScrollToTop from "./components/ScrollToTop";

// Helper for lazy loading named exports
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const lazyLoad = (importFunc: () => Promise<any>, componentName: string) => {
  return React.lazy(() =>
    importFunc().then((module) => ({ default: module[componentName] }))
  );
};

// Core
const Home = lazyLoad(() => import("./pages/Home"), "Home");
const PackShip = lazyLoad(() => import("./pages/PackShip"), "PackShip");

// Pack & Ship
const ArtworkShipping = lazyLoad(() => import("./pages/ArtworkShipping"), "ArtworkShipping");
const BicycleShipping = lazyLoad(() => import("./pages/BicycleShipping"), "BicycleShipping");
const GolfClubShipping = lazyLoad(() => import("./pages/GolfClubShipping"), "GolfClubShipping");
const FedExShipping = lazyLoad(() => import("./pages/FedExShipping"), "FedExShipping");
const FedExEasyReturns = lazyLoad(() => import("./pages/fedex-easy-returns"), "FedExEasyReturns");
// const NuulyReturns = lazyLoad(() => import("./pages/NuulyReturns"), "NuulyReturns");
const AmazonReturnGuide = lazyLoad(() => import("./pages/AmazonReturnGuide"), "AmazonReturnGuide");
const UPSAuthorizedShipperOutlet = lazyLoad(() => import("./pages/UPSAuthorizedShipperOutlet"), "UPSAuthorizedShipperOutlet");
const USPSServices = lazyLoad(() => import("./pages/USPSServices"), "USPSServices");
const DHLExpress = lazyLoad(() => import("./pages/DHLExpress"), "DHLExpress");
// const InternationalShippingPage = lazyLoad(() => import("./pages/InternationalShippingPage"), "InternationalShippingPage");
const PackageDropOffs = lazyLoad(() => import("./pages/PackageDropOffs"), "PackageDropOffs");
const PackageReceiving = lazyLoad(() => import("./pages/PackageReceiving"), "PackageReceiving");
const CustomBoxMaking = lazyLoad(() => import("./pages/CustomBoxMaking"), "CustomBoxMaking");
const ProfessionalPacking = lazyLoad(() => import("./pages/ProfessionalPacking"), "ProfessionalPacking");
const PackagingSupplies = lazyLoad(() => import("./pages/PackagingSupplies"), "PackagingSupplies");
const PostageStamps = lazyLoad(() => import("./pages/PostageStamps"), "PostageStamps");

// Copy & Print
const BusinessCardsPage = lazyLoad(() => import("./pages/BusinessCardsPage"), "BusinessCardsPage");
const FlyersBrochures = lazyLoad(() => import("./pages/FlyersBrochures"), "FlyersBrochures");
const PostersPrinting = lazyLoad(() => import("./pages/PostersPrinting"), "PostersPrinting");
const PostcardPrinting = lazyLoad(() => import("./pages/PostcardPrinting"), "PostcardPrinting");
// const PosterBannerPrinting = lazyLoad(() => import("./pages/PosterBannerPrinting"), "PosterBannerPrinting");
const DocumentPrinting = lazyLoad(() => import("./pages/DocumentPrinting"), "DocumentPrinting");
// const DocumentFinishing = lazyLoad(() => import("./pages/DocumentFinishing"), "DocumentFinishing");
const GraphicDesign = lazyLoad(() => import("./pages/GraphicDesign"), "GraphicDesign");
const Copies = lazyLoad(() => import("./pages/Copies"), "Copies");

// Home & Business
const MailboxRentalPage = lazyLoad(() => import("./pages/MailboxRentalPage"), "MailboxRentalPage");
const DigitalMailboxRental = lazyLoad(() => import("./pages/DigitalMailboxRental"), "DigitalMailboxRental");
const EveryDoorDirectMail = lazyLoad(() => import("./pages/EveryDoorDirectMail"), "EveryDoorDirectMail");
const Shredding = lazyLoad(() => import("./pages/Shredding"), "Shredding");
const DocumentScanning = lazyLoad(() => import("./pages/DocumentScanning"), "DocumentScanning");
const FaxServices = lazyLoad(() => import("./pages/FaxServices"), "FaxServices");
const NotaryServices = lazyLoad(() => import("./pages/NotaryServices"), "NotaryServices");

// Specialty
const DigitalFingerprinting = lazyLoad(() => import("./pages/DigitalFingerprinting"), "DigitalFingerprinting");
const Insurance = lazyLoad(() => import("./pages/Insurance"), "Insurance");

// Service Landing Pages
const CopyPrint = lazyLoad(() => import("./pages/CopyPrint"), "CopyPrint");
const HomeBusiness = lazyLoad(() => import("./pages/HomeBusiness"), "HomeBusiness");

// SEO Landing Pages
// Note: Default exports can be lazy loaded directly if needed, but using the helper for consistency if they are named exports or default
const UPSStoreAlternativePage = React.lazy(() => import("./pages/ups-store-alternative-concord-township"));
const MailBoxesEtcAlternativePage = React.lazy(() => import("./pages/mail-boxes-etc-alternative-concord-township"));
const FedExOfficeAlternativePage = React.lazy(() => import("./pages/fedex-office-alternative-concord-township"));
const StaplesAlternativePage = React.lazy(() => import("./pages/staples-printing-alternative-concord-township"));
const OfficeDepotAlternativePage = React.lazy(() => import("./pages/office-depot-alternative-concord-township"));
const USPSDropOffAlternativePage = React.lazy(() => import("./pages/usps-drop-off-alternative-concord-township"));
const PostOfficeAlternativePage = React.lazy(() => import("./pages/post-office-alternative-concord-township"));
const USPSPackageHelpPage = React.lazy(() => import("./pages/usps-package-help-concord-township"));
const ShippingCenterPage = React.lazy(() => import("./pages/shipping-center-concord-township"));
const PackAndShipServicesPage = React.lazy(() => import("./pages/pack-and-ship-services-concord-township"));
const MultiCarrierShippingPage = React.lazy(() => import("./pages/ups-fedex-usps-dhl-shipping-concord-township"));
const SmallBusinessShippingPage = React.lazy(() => import("./pages/small-business-shipping-concord-township"));
const AmazonReturnsPage = React.lazy(() => import("./pages/amazon-returns-drop-off-concord-township"));
const UPSDropOffAlternativePage = React.lazy(() => import("./pages/ups-drop-off-alternative-concord-township"));
const PrintingServicesPage = React.lazy(() => import("./pages/printing-services-concord-township"));
const BusinessServicesPage = React.lazy(() => import("./pages/business-services-concord-township"));
const DocumentServicesPage = React.lazy(() => import("./pages/document-services-concord-township"));
const PrivateMailboxRentalPage = React.lazy(() => import("./pages/private-mailbox-rental-concord-township"));
const VirtualMailboxPage = React.lazy(() => import("./pages/virtual-mailbox-concord-township"));
const MailForwardingPage = React.lazy(() => import("./pages/mail-forwarding-concord-township"));

// Additional Pages
const AboutUs = lazyLoad(() => import("./pages/AboutUs"), "AboutUs");
const ContactUs = lazyLoad(() => import("./pages/ContactUs"), "ContactUs");
const Services = lazyLoad(() => import("./pages/Services"), "Services");
const Tracking = lazyLoad(() => import("./pages/Tracking"), "Tracking");
const ServiceAreaPage = lazyLoad(() => import("./pages/ServiceAreaPage"), "ServiceAreaPage");
const ServiceAreaIndex = lazyLoad(() => import("./pages/ServiceAreaIndex"), "ServiceAreaIndex");
const Privacy = lazyLoad(() => import("./pages/Privacy"), "Privacy");
const Terms = lazyLoad(() => import("./pages/Terms"), "Terms");
const ShippingPartners = React.lazy(() => import("./pages/ShippingPartners")); // Default export
const PickupHours = React.lazy(() => import("./pages/PickupHours")); // Default export
const AskMailboxPlus = React.lazy(() => import("./pages/ask-mailbox-plus")); // Default export
const NotFound = lazyLoad(() => import("./pages/NotFound"), "NotFound");

const MicroProblemPage = React.lazy(() => import("./pages/micro/MicroProblemPage"));

const DebugRoutes: React.FC = () => {
  // const location = useLocation();
  // console.log('Current location:', location.pathname);
  return null;
};

const App: React.FC = () => {
  // console.log('App.tsx: App component rendering');
  return (
    <Router>
      <ScrollToTop />
      <Layout>
        <DebugRoutes />
        <React.Suspense fallback={<div style={{ padding: 32, textAlign: "center" }}>Loading…</div>}>
          <Routes>
            {/* Homepage */}
            <Route path="/" element={<Home />} />

            {/* Service Landing Pages */}
            <Route path="/copy-print" element={<CopyPrint />} />
            <Route path="/home-business" element={<HomeBusiness />} />

            {/* SEO Landing Pages */}
            <Route path="/ups-store-alternative-concord-township" element={<UPSStoreAlternativePage />} />
            <Route path="/mail-boxes-etc-alternative-concord-township" element={<MailBoxesEtcAlternativePage />} />
            <Route path="/fedex-office-alternative-concord-township" element={<FedExOfficeAlternativePage />} />
            <Route path="/staples-printing-alternative-concord-township" element={<StaplesAlternativePage />} />
            <Route path="/office-depot-alternative-concord-township" element={<OfficeDepotAlternativePage />} />
            <Route path="/usps-drop-off-alternative-concord-township" element={<USPSDropOffAlternativePage />} />
            <Route path="/post-office-alternative-concord-township" element={<PostOfficeAlternativePage />} />
            <Route path="/usps-package-help-concord-township" element={<USPSPackageHelpPage />} />
            <Route path="/shipping-center-concord-township" element={<ShippingCenterPage />} />
            <Route path="/pack-and-ship-services-concord-township" element={<PackAndShipServicesPage />} />
            <Route path="/ups-fedex-usps-dhl-shipping-concord-township" element={<MultiCarrierShippingPage />} />
            <Route path="/small-business-shipping-concord-township" element={<SmallBusinessShippingPage />} />
            <Route path="/amazon-returns-drop-off-concord-township" element={<AmazonReturnsPage />} />
            <Route path="/ups-drop-off-alternative-concord-township" element={<UPSDropOffAlternativePage />} />
            <Route path="/printing-services-concord-township" element={<PrintingServicesPage />} />
            <Route path="/business-services-concord-township" element={<BusinessServicesPage />} />
            <Route path="/document-services-concord-township" element={<DocumentServicesPage />} />
            <Route path="/private-mailbox-rental-concord-township" element={<PrivateMailboxRentalPage />} />
            <Route path="/virtual-mailbox-concord-township" element={<VirtualMailboxPage />} />
            <Route path="/mail-forwarding-concord-township" element={<MailForwardingPage />} />

            {/* Pack & Ship Landing Page */}
            <Route path="/pack-ship" element={<PackShip />} />

            {/* Pack & Ship */}
            <Route path="/pack-ship/artwork-shipping" element={<ArtworkShipping />} />
            <Route path="/pack-ship/bicycle-shipping" element={<BicycleShipping />} />
            <Route path="/pack-ship/golf-club-shipping" element={<GolfClubShipping />} />
            <Route path="/pack-ship/fedex-shipping" element={<FedExShipping />} />
            <Route path="/fedex-easy-returns" element={<FedExEasyReturns />} />
            {/* <Route path="/nuuly-returns" element={<NuulyReturns />} /> */}
            <Route path="/amazon-returns" element={<AmazonReturnGuide />} />
            <Route path="/pack-ship/ups-authorized-shipper-outlet" element={<UPSAuthorizedShipperOutlet />} />
            <Route path="/pack-ship/usps-services" element={<USPSServices />} />
            <Route path="/pack-ship/dhl-express" element={<DHLExpress />} />
            {/* <Route path="/pack-ship/international-shipping" element={<InternationalShippingPage />} /> */}
            <Route path="/pack-ship/package-drop-offs" element={<PackageDropOffs />} />
            <Route path="/pack-ship/package-receiving" element={<PackageReceiving />} />
            <Route path="/pack-ship/custom-box-making" element={<CustomBoxMaking />} />
            <Route path="/pack-ship/professional-packing" element={<ProfessionalPacking />} />
            <Route path="/pack-ship/packaging-supplies" element={<PackagingSupplies />} />
            <Route path="/pack-ship/postage-stamps" element={<PostageStamps />} />

            {/* Copy & Print */}
            <Route path="/copy-print/business-cards" element={<BusinessCardsPage />} />
            <Route path="/copy-print/flyers-brochures" element={<FlyersBrochures />} />
            <Route path="/copy-print/posters-printing" element={<PostersPrinting />} />
            <Route path="/copy-print/postcard-printing" element={<PostcardPrinting />} />
            { /* <Route path="/copy-print/poster-banner-printing" element={<PosterBannerPrinting />} /> */}
            <Route path="/copy-print/document-printing" element={<DocumentPrinting />} />
            <Route path="/copy-print/graphic-design" element={<GraphicDesign />} />
            <Route path="/copy-print/copies" element={<Copies />} />

            {/* Home & Business */}
            <Route path="/home-business/mailbox-rental" element={<MailboxRentalPage />} />
            <Route path="/home-business/digital-mailbox-rental" element={<DigitalMailboxRental />} />
            <Route path="/home-business/every-door-direct-mail" element={<EveryDoorDirectMail />} />
            <Route path="/home-business/shredding" element={<Shredding />} />
            <Route path="/home-business/document-scanning" element={<DocumentScanning />} />
            <Route path="/home-business/fax-services" element={<FaxServices />} />
            <Route path="/home-business/notary-services" element={<NotaryServices />} />

            {/* Specialty */}
            <Route path="/specialty/digital-fingerprinting" element={<DigitalFingerprinting />} />
            <Route path="/specialty/insurance" element={<Insurance />} />

            {/* Additional Pages */}
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/services" element={<Services />} />
            <Route path="/tracking" element={<Tracking />} />
            <Route path="/service-area" element={<ServiceAreaIndex />} />
            <Route path="/service-area/:slug" element={<ServiceAreaPage />} />
            <Route path="/shipping-partners" element={<ShippingPartners />} />
            <Route path="/pickup-hours" element={<PickupHours />} />
            <Route path="/ask-mailbox-plus" element={<AskMailboxPlus />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />

            {/* Micro Problems */}
            <Route path="/print-return-label-without-printer" element={<MicroProblemPage />} />
            <Route path="/return-without-original-box" element={<MicroProblemPage />} />
            <Route path="/print-amazon-return-label" element={<MicroProblemPage />} />
            <Route path="/package-a-return-so-its-accepted-by-the-carrier" element={<MicroProblemPage />} />
            <Route path="/ups-drop-off-near-concord-township-not-sure-if-its-packed-right" element={<MicroProblemPage />} />
            <Route path="/fedex-drop-off-in-concord-township-have-label-need-packaging" element={<MicroProblemPage />} />
            <Route path="/usps-drop-off-in-concord-township-label-printing-and-packaging-help" element={<MicroProblemPage />} />
            <Route path="/ship-a-fragile-item-safely-in-concord-township-glass-ceramics-electronics" element={<MicroProblemPage />} />
            <Route path="/ship-an-odd-shaped-or-oversized-item-in-concord-township-guitars-lamps-sports-equipment" element={<MicroProblemPage />} />
            <Route path="/ship-a-heavy-package-in-concord-township-over-50-lbs-wont-get-rejected" element={<MicroProblemPage />} />
            <Route path="/repackage-a-damaged-or-torn-shipping-box-in-concord-township" element={<MicroProblemPage />} />
            <Route path="/ship-electronics-safely-in-concord-township-phones-laptops-tablets-computers" element={<MicroProblemPage />} />


            {/* Catch-all route for unmatched paths */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </React.Suspense>
      </Layout>
    </Router>
  );
};

export default App;
