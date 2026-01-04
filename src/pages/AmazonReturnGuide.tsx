import React from "react";
import { AlertTriangle } from "lucide-react";
import { ServicePageV2 } from "../components/ServicePageV2";
import { amazonReturnsService } from "../config/services/pack-ship/amazon-returns";
import { InternalLink } from "../components/ui/InternalLink";

export const AmazonReturnGuide: React.FC = () => {
  return (
    <ServicePageV2 {...amazonReturnsService}>
      {/* Crucial Notice Box & Intro Text (Preserving Original Flow) */}
      <div className="space-y-8">
        {/* V2-Styled Notice Box */}
        <div className="bg-white rounded-xl p-6 text-left shadow-sm border-l-8 border-yellow-500">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-8 h-8 text-yellow-600 shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">⚠️ Important Amazon QR-Code Notice</h3>
              <p className="text-gray-700 mb-4">
                Mailbox Plus <strong>cannot scan or accept Amazon QR codes</strong> for label-free returns.
                Amazon requires QR-code returns to be processed ONLY at Amazon-authorized partner locations (The UPS Store, Whole Foods, Kohl’s, Amazon Hub, etc.).
              </p>
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <p className="font-medium text-green-800">
                  We CAN accept Amazon returns when Amazon provides a printable shipping label (UPS, USPS, or FedEx).
                </p>
                <p className="text-sm text-green-700 mt-1">
                  If you do not have a printer, we can print the label for you for a small $2.00 fee.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Intro Paragraphs */}
        <div className="space-y-6 text-center max-w-3xl mx-auto">
          <p className="text-lg text-slate-600 leading-relaxed">
            Returning an item to Amazon doesn&apos;t have to be confusing. If you live in Concord Township, Painesville, Mentor, Eastlake, Willoughby, or anywhere in Lake County, Ohio, Mailbox Plus is here to make your Amazon returns simple. We help you pack, label, and ship your Amazon return—<strong>as long as Amazon provides a printable label</strong>.
          </p>
          <p className="text-lg text-slate-600 leading-relaxed">
            Mailbox Plus is your local <InternalLink variant="geo" to="/amazon-returns-drop-off-concord-township">Amazon returns drop-off location</InternalLink> for pre-labeled packages.
            While you&apos;re here, we can also help with <InternalLink variant="geo" to="/pack-ship">packing other shipments</InternalLink> or <InternalLink variant="geo" to="/shipping">comparing shipping rates</InternalLink> for your personal or business needs.
          </p>
        </div>
      </div>
    </ServicePageV2>
  );
};