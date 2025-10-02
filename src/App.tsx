import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";

// Core
import { PackShip } from "./pages/PackShip";

// Pack & Ship
import { ArtworkShipping } from "./pages/ArtworkShipping";
import { BicycleShipping } from "./pages/BicycleShipping";
import { FedExShipping } from "./pages/FedExShipping";
import { UPSAuthorizedShipperOutlet } from "./pages/UPSAuthorizedShipperOutlet";
import { USPSServices } from "./pages/USPSServices";
import { DHLExpress } from "./pages/DHLExpress";
import { InternationalShippingPage } from "./pages/InternationalShippingPage";
import { PackageDropOffs } from "./pages/PackageDropOffs";
import { CustomBoxMaking } from "./pages/CustomBoxMaking";
import { ProfessionalPacking } from "./pages/ProfessionalPacking";
import { PackagingSupplies } from "./pages/PackagingSupplies";

// Copy & Print
import { BusinessCardsPage } from "./pages/BusinessCardsPage";
import { FlyersBrochures } from "./pages/FlyersBrochures";
import { PostersPrinting } from "./pages/PostersPrinting";
import { DocumentPrinting } from "./pages/DocumentPrinting";
import { Copies } from "./pages/Copies";

// Home & Business
import { MailboxRentalPage } from "./pages/MailboxRentalPage";
import { Shredding } from "./pages/Shredding";
import { DocumentScanning } from "./pages/DocumentScanning";
import { FaxServices } from "./pages/FaxServices";
import { NotaryServices } from "./pages/NotaryServices";

// Specialty
import { DigitalFingerprinting } from "./pages/DigitalFingerprinting";

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
        {/* Homepage */}
        <Route path="/" element={<PackShip />} />

        {/* Pack & Ship */}
        <Route path="/pack-ship/artwork-shipping" element={<ArtworkShipping />} />
        <Route path="/pack-ship/bicycle-shipping" element={<BicycleShipping />} />
        <Route path="/pack-ship/fedex-shipping" element={<FedExShipping />} />
        <Route path="/pack-ship/ups-shipping" element={<UPSAuthorizedShipperOutlet />} />
        <Route path="/pack-ship/usps-services" element={<USPSServices />} />
        <Route path="/pack-ship/dhl-express" element={<DHLExpress />} />
        <Route path="/pack-ship/international-shipping" element={<InternationalShippingPage />} />
        <Route path="/pack-ship/package-drop-offs" element={<PackageDropOffs />} />
        <Route path="/pack-ship/custom-box-making" element={<CustomBoxMaking />} />
        <Route path="/pack-ship/professional-packing" element={<ProfessionalPacking />} />
        <Route path="/pack-ship/packaging-supplies" element={<PackagingSupplies />} />

        {/* Copy & Print */}
        <Route path="/copy-print/business-cards" element={<BusinessCardsPage />} />
        <Route path="/copy-print/flyers-brochures" element={<FlyersBrochures />} />
        <Route path="/copy-print/posters-printing" element={<PostersPrinting />} />
        <Route path="/copy-print/document-printing" element={<DocumentPrinting />} />
        <Route path="/copy-print/copies" element={<Copies />} />

        {/* Home & Business */}
        <Route path="/home-business/mailbox-rental" element={<MailboxRentalPage />} />
        <Route path="/home-business/shredding" element={<Shredding />} />
        <Route path="/home-business/document-scanning" element={<DocumentScanning />} />
        <Route path="/home-business/fax-services" element={<FaxServices />} />
        <Route path="/home-business/notary-services" element={<NotaryServices />} />

        {/* Specialty */}
        <Route path="/specialty/digital-fingerprinting" element={<DigitalFingerprinting />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
