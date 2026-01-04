import {
  CheckCircle,
  HelpCircle,
  AlertTriangle
} from "lucide-react";
import { Service } from "../../../types/services";
import { getServiceImageUrl } from "../../../lib/storage";

export const amazonReturnsService: Service = {
  id: "amazon-returns",
  category: "additional-services",
  city: "Concord Township",
  serviceName: "Amazon Return Guide",
  slug: "/amazon-returns",
  canonicalUrl: "https://mailboxplus.com/amazon-returns",
  pageTitle: "Amazon Return Guide | Easy Returns in Concord Township, Ohio",
  metaDescription: "Learn how to easily return items to Amazon at Mailbox Plus. We help with packing, labeling, and shipping for all Lake County, Ohio residents.",
  keywords: "amazon returns, return shipping, pack and ship, concord township, lake county, printable label",
  heroTitle: "How to Return Items to Amazon",
  heroSubtitle: "Local Guide for Lake County, Ohio",
  heroImage: getServiceImageUrl("https://pub-21518ce3034449a3a7b5a0b89551f710.r2.dev/how-to-return-items-to-amazon-2025-.webp"),
  content: [
    {
      heading: "How Amazon Returns Work",
      body: `
        <div class="bg-white rounded-2xl shadow-sm p-8 border border-slate-200">
          <ul class="space-y-4">
            <li class="flex items-start gap-3">
              <span class="text-blue-600 shrink-0 mt-1">✓</span>
              <span class="text-slate-700 text-lg">Most Amazon items can be returned within about 30 days.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="text-blue-600 shrink-0 mt-1">✓</span>
              <span class="text-slate-700 text-lg">Some items (electronics, perishables, personalized items) have special rules.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="text-blue-600 shrink-0 mt-1">✓</span>
              <span class="text-slate-700 text-lg">Always check your Amazon "Your Orders" page for exact eligibility and deadlines.</span>
            </li>
          </ul>
        </div>
      `,
      isFullWidth: true
    },
    {
      heading: "Step-by-Step: How to Start an Amazon Return",
      body: `
        <div class="space-y-12 mt-8">
          ${[
          {
            title: "Start Your Return in the Amazon App",
            image: "step-01-return-replace-your-item.webp",
            description: "Open the Amazon app or website and navigate to <strong>\"Your Orders.\"</strong> Locate the item you wish to return to begin the process."
          },
          {
            title: "Pick Your Reason for Returning",
            image: "step-02-why-are-you-returning-your-item.webp",
            description: "Select the specific reason for your return from the provided list (e.g., \"defective,\" \"no longer needed\"). This helps Amazon process your request accurately."
          },
          {
            title: "Confirm the Packaging Status",
            image: "step-03-confirm-the-packaging-status.webp",
            description: "Indicate whether the item is still in its original packaging. This information helps Amazon determine the correct return method and restocking requirements."
          },
          {
            title: "Select Refund or Replacement",
            image: "step-04-select-refund-replacement.webp",
            description: "Choose your preferred resolution: receive a refund to your original payment method (or Amazon balance) or request a replacement item if available."
          },
          {
            title: "Describe the Issue and Proceed",
            image: "step-05-describe-issue-and-proceed.webp",
            description: "Add any specific comments describing the problem if prompted, then continue to the next step to finalize your return details."
          },
          {
            title: "Choose UPS Drop-Off (We can handle the Label!)",
            image: "step-06-choose-ups-dropoff.webp",
            description: "<strong>Crucial Step:</strong> Select a return method that provides a <strong>printable shipping label</strong> (often labeled as UPS Drop-off Points). <em>Avoid \"No Box/No Label\" options if you want to use Mailbox Plus.</em>"
          },
          {
            title: "Share Your Return Label With Us ($2.00 fee)",
            image: "step-07-share-label-with-friend.webp",
            description: "No printer? No problem! We can print your label for a small $2.00 fee. Simply choose the option to <strong>\"Share\"</strong> or <strong>\"Email\"</strong> the label from the app."
          },
          {
            title: "Email the Label to Us",
            image: "step-08-email-label-to-us.webp",
            description: "Select your preferred email app and prepare to send the label file directly to our store for fast printing."
          },
          {
            title: "Send the Label to Mailbox Plus",
            image: "step-09-use-our-email-address.webp",
            description: "Send your shipping label to <strong>RETURNS@MAILBOXPLUSOHIO.COM</strong>. We will print it out and have it ready for your arrival."
          },
          {
            title: "Confirmation: Label Sent Successfully",
            image: "step-10-label-sentto-us.webp",
            description: "Ensure your email has been sent successfully. You can now head to our store knowing your paperwork is being handled."
          },
          {
            title: "Now Drop Off at Mailbox Plus",
            image: "step-11-pack-label-dropoff.webp",
            description: "Bring your item to <strong>Mailbox Plus at 7554 Fredle Drive</strong> in Concord Township. We'll professionally pack it (if needed), attach the label, and ship it out for you!"
          }
        ].map((step, idx) => `
            <div class="flex flex-col md:flex-row items-start gap-6 bg-slate-50/50 p-6 rounded-2xl border border-slate-200/60 shadow-sm">
              <div class="w-full md:w-1/3">
                <div class="flex items-center gap-3 mb-4">
                  <div class="w-10 h-10 rounded-full bg-[#0855B1] text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-md">${idx + 1}</div>
                  <h3 class="text-lg font-bold text-[#0855B1] md:hidden">${step.title}</h3>
                </div>
                <img src="${getServiceImageUrl(step.image)}" alt="Step ${idx + 1}" class="rounded-lg shadow-sm w-full" />
              </div>
              <div class="w-full md:w-2/3">
                <h3 class="hidden md:block text-2xl font-bold text-[#0855B1] mb-3">${step.title}</h3>
                <p class="text-slate-700 text-lg leading-relaxed">${step.description}</p>
              </div>
            </div>
          `).join('')}
        </div>
        <div class="mt-8 bg-blue-50 border-l-4 border-[#0855B1] p-6 rounded-r-2xl flex items-start gap-4">
          <div class="w-6 h-6 text-[#0855B1] shrink-0 mt-1">💡</div>
          <div>
            <p class="font-bold text-[#0855B1] text-lg">Tip:</p>
            <p class="text-blue-900 text-lg">Start your return as early as possible to avoid missing the return window.</p>
          </div>
        </div>
      `,
      isFullWidth: true
    },
    {
      heading: "How Mailbox Plus Helps With Amazon Returns",
      body: `
        <div class="grid md:grid-cols-2 gap-8 my-8">
          <div class="bg-slate-900 text-white p-8 rounded-[28px] space-y-6 shadow-xl">
            <h3 class="text-2xl font-bold text-blue-300">Services We Provide:</h3>
            <ul class="space-y-4">
              <li class="flex items-center gap-3"><span class="text-blue-400">●</span> Print your Amazon label (if needed)</li>
              <li class="flex items-center gap-3"><span class="text-blue-400">●</span> Supply proper packaging</li>
              <li class="flex items-center gap-3"><span class="text-blue-400">●</span> Professionally pack fragile items</li>
              <li class="flex items-center gap-3"><span class="text-blue-400">●</span> Prepare shipments for all carriers</li>
              <li class="flex items-center gap-3"><span class="text-blue-400">●</span> Real person support for instructions</li>
            </ul>
          </div>
          <div class="bg-blue-50/50 p-8 rounded-[28px] border border-blue-100 flex flex-col justify-center">
            <h3 class="text-2xl font-bold text-blue-900 mb-6">Why Choose Us?</h3>
            <p class="text-slate-700 text-lg leading-relaxed mb-6 italic">
              "At Mailbox Plus, we assist residents throughout Lake County. We’re a local, owner-operated pack-and-ship store—when Amazon’s instructions get confusing, you can talk to a real person."
            </p>
            <div class="flex items-center gap-3 text-slate-600 font-medium">
              <span>📍 7554 Fredle Drive, Concord Township, OH</span>
            </div>
          </div>
        </div>
      `,
      isFullWidth: true
    },
    {
      heading: "Common Problems & How We Help",
      body: `
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4 my-8">
          ${[
          "Wrong packaging", "Missing accessories", "Confusing labels",
          "No printer at home", "Misreading steps", "QR code confusion"
        ].map(problem => `
            <div class="bg-red-50/50 p-6 rounded-2xl border border-red-100 flex flex-col items-center text-center gap-3">
              <span class="text-red-500 text-xl font-bold">!</span>
              <span class="font-semibold text-slate-800">${problem}</span>
            </div>
          `).join('')}
        </div>
        <p class="text-center font-bold text-red-600 text-lg">
          "If Amazon only provides a QR code with no printable label, you must take that return to an authorized Amazon partner."
        </p>
      `,
      isFullWidth: true
    },
    {
      heading: "When You Should NOT Use Mailbox Plus",
      body: `
        <div class="bg-white p-8 rounded-[28px] shadow-sm border border-slate-200">
          <ul class="space-y-4 mb-6">
            <li class="flex items-start gap-3 text-slate-700 text-lg">
              <span class="text-red-500 font-bold">✕</span>
              <span>Amazon only gave you a QR code</span>
            </li>
            <li class="flex items-start gap-3 text-slate-700 text-lg">
              <span class="text-red-500 font-bold">✕</span>
              <span>Amazon forced the return to a specific partner location</span>
            </li>
            <li class="flex items-start gap-3 text-slate-700 text-lg">
              <span class="text-red-500 font-bold">✕</span>
              <span>Amazon requires in-person verification</span>
            </li>
          </ul>
          <div class="bg-red-50 p-6 rounded-2xl border border-red-100 text-red-800 font-bold text-center text-lg">
            If the return instructions only show a QR code with no option for a shipping label, we cannot process that return.
          </div>
        </div>
      `,
      isFullWidth: true
    },
    {
      heading: "Holiday Return Extensions",
      body: "During the holiday season (typically November and December), Amazon often extends its return window. This means gifts purchased early can often be returned into January. Check your order details for specific deadlines."
    },
    {
      heading: "Why Local Customers Choose Us",
      body: `
        <div class="grid md:grid-cols-2 gap-4 my-8">
          ${[
          "Local, owner-operated business",
          "Minutes from I-90 and OH-44",
          "Friendly, knowledgeable team",
          "Packing materials onsite",
          "Fast, hassle-free service",
          "Supports all major carriers"
        ].map(reason => `
            <div class="flex items-center gap-3 bg-white p-5 rounded-2xl shadow-sm border border-blue-100/50 hover:bg-blue-50/30 transition-colors">
              <span class="text-blue-600 font-bold">✓</span>
              <span class="text-slate-800 font-semibold">${reason}</span>
            </div>
          `).join('')}
        </div>
        <p class="text-center text-3xl font-black text-[#0855B1] italic mt-8">
          “Let Us Handle Your Package!”
        </p>
      `,
      isFullWidth: true
    }
  ],
  features: [
    { icon: HelpCircle, title: "Friendly Guidance", description: "Talk to real people, not algorithms." },
    { icon: AlertTriangle, title: "Return Window Help", description: "We help you avoid missing deadlines." },
    { icon: CheckCircle, title: "Carrier Flexibility", description: "UPS, USPS, and FedEx returns accepted." }
  ],
  faqs: [
    {
      question: "Can Mailbox Plus scan my Amazon QR code?",
      answer: "No. Mailbox Plus cannot scan or accept Amazon QR codes. These returns must be completed at Amazon-authorized partners such as The UPS Store, Kohl’s, Whole Foods, or Amazon Hub. We CAN help you with Amazon returns that include a printed shipping label."
    },
    {
      question: "Do you charge for helping with Amazon returns?",
      answer: "We may charge for packaging materials, packing services, or printing labels. If your item is already labeled and ready to ship, the cost is minimal."
    },
    {
      question: "Do you control whether Amazon approves my refund?",
      answer: "No. Amazon controls all refund decisions. We handle the packing and shipping portion only."
    },
    {
      question: "Can you print my Amazon label if I don’t have a printer?",
      answer: "Yes. Send it to returns@mailboxplusohio.com. We charge a $2.00 fee for label printing."
    },
    {
      question: "Do you help with returns for other retailers besides Amazon?",
      answer: "Yes. Bring any return label or instructions (UPS, USPS, FedEx, DHL) and we will assist."
    }
  ]
};
