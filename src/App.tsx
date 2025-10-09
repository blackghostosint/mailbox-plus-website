import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import ScrollToTop from "./components/ScrollToTop";

// Core
import { Home } from "./pages/Home";
import { PackShip } from "./pages/PackShip";

// Pack & Ship
import { ArtworkShipping } from "./pages/ArtworkShipping";
import { BicycleShipping } from "./pages/BicycleShipping";
import { GolfClubShipping } from "./pages/GolfClubShipping";
import { FedExShipping } from "./pages/FedExShipping";
import { UPSAuthorizedShipperOutlet } from "./pages/UPSAuthorizedShipperOutlet";
import { USPSServices } from "./pages/USPSServices";
import { DHLExpress } from "./pages/DHLExpress";
import { InternationalShippingPage } from "./pages/InternationalShippingPage";
import { PackageDropOffs } from "./pages/PackageDropOffs";
import { PackageReceiving } from "./pages/PackageReceiving";
import { CustomBoxMaking } from "./pages/CustomBoxMaking";
import { ProfessionalPacking } from "./pages/ProfessionalPacking";
import { PackagingSupplies } from "./pages/PackagingSupplies";
import { PostageStamps } from "./pages/PostageStamps";

// Copy & Print
import { BusinessCardsPage } from "./pages/BusinessCardsPage";
import { FlyersBrochures } from "./pages/FlyersBrochures";
import { PostersPrinting } from "./pages/PostersPrinting";
import { PostcardPrinting } from "./pages/PostcardPrinting";
import { PosterBannerPrinting } from "./pages/PosterBannerPrinting";
import { DocumentPrinting } from "./pages/DocumentPrinting";
import { DocumentFinishing } from "./pages/DocumentFinishing";
import { GraphicDesign } from "./pages/GraphicDesign";
import { PrintDocumentServices } from "./pages/PrintDocumentServices";
import { Copies } from "./pages/Copies";

// Home & Business
import { MailboxRentalPage } from "./pages/MailboxRentalPage";
import { DigitalMailboxRental } from "./pages/DigitalMailboxRental";
import { EveryDoorDirectMail } from "./pages/EveryDoorDirectMail";
import { Shredding } from "./pages/Shredding";
import { DocumentScanning } from "./pages/DocumentScanning";
import { FaxServices } from "./pages/FaxServices";
import { NotaryServices } from "./pages/NotaryServices";

// Specialty
import { DigitalFingerprinting } from "./pages/DigitalFingerprinting";
import { Insurance } from "./pages/Insurance";

// Service Landing Pages
import { CopyPrint } from "./pages/CopyPrint";
import { HomeBusiness } from "./pages/HomeBusiness";

// Additional Pages
import { AboutUs } from "./pages/AboutUs";
import { ContactUs } from "./pages/ContactUs";
import { Services } from "./pages/Services";
import { Tracking } from "./pages/Tracking";
import { ServiceAreaPage } from "./pages/ServiceAreaPage";
import { ServiceAreaIndex } from "./pages/ServiceAreaIndex";
import { Privacy } from "./pages/Privacy";
import { Terms } from "./pages/Terms";

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <Layout>
        <Routes>
        {/* Homepage */}
        <Route path="/" element={<Home />} />

        {/* Service Landing Pages */}
        <Route path="/copy-print" element={<CopyPrint />} />
        <Route path="/home-business" element={<HomeBusiness />} />

        {/* Pack & Ship Landing Page */}
        <Route path="/pack-ship" element={<PackShip />} />

        {/* Pack & Ship */}
        <Route path="/pack-ship/artwork-shipping" element={<ArtworkShipping />} />
        <Route path="/pack-ship/bicycle-shipping" element={<BicycleShipping />} />
        <Route path="/pack-ship/golf-club-shipping" element={<GolfClubShipping />} />
        <Route path="/pack-ship/fedex-shipping" element={<FedExShipping />} />
        <Route path="/pack-ship/ups-authorized-shipper-outlet" element={<UPSAuthorizedShipperOutlet />} />
        <Route path="/pack-ship/usps-services" element={<USPSServices />} />
        <Route path="/pack-ship/dhl-express" element={<DHLExpress />} />
        <Route path="/pack-ship/international-shipping" element={<InternationalShippingPage />} />
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
        <Route path="/copy-print/poster-banner-printing" element={<PosterBannerPrinting />} />
        <Route path="/copy-print/document-printing" element={<DocumentPrinting />} />
        <Route path="/copy-print/document-finishing" element={<DocumentFinishing />} />
        <Route path="/copy-print/graphic-design" element={<GraphicDesign />} />
        <Route path="/copy-print/print-document-services" element={<PrintDocumentServices />} />
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
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
