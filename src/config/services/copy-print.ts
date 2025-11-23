import {
    Users, Palette, Star, Printer, Layers, FileText, Truck, Clock, Lock
} from "lucide-react";
import { Service } from "../../types/services";
import { getServiceImageUrl } from "../../lib/storage";
import {
    generalCopyPrintFaqs,
    businessCardsFaqs,
    flyersBrochuresFaqs,
    documentPrintingFaqs,
    postersPrintingFaqs,
    postcardPrintingFaqs,
    copiesFaqs
} from "../faqs";

export const copyPrintServices: Service[] = [
    // ---------------------------
    // COPY & PRINT
    // ---------------------------
    {
        id: "business-cards",
        category: "copy-print",
        city: "Concord Township",
        serviceName: "Business Cards",
        slug: "/copy-print/business-cards",
        pageTitle: "Business Cards in Concord Township, Ohio | Mailbox Plus",
        metaDescription: "Local Business Cards in Concord Township including UPS, FedEx, USPS, DHL shipping, printing, mailbox rentals, and notary services. Mailbox Plus is the top local alternative to USPS, The UPS Store, FedEx Office, Mail Boxes Etc., Staples, and Office Depot.",
        keywords: "business cards, printing, Concord Township, Lake County",
        heroTitle: "Professional Business Cards",
        heroSubtitle: "Make a lasting first impression with custom-designed business cards.",
        heroImage: getServiceImageUrl("/images/business-cards.webp"),
        content: [
            {
                heading: "Why Business Cards Still Matter",
                body: "In the digital age, a well-designed business card remains one of the most effective tools for building professional connections."
            },
            {
                heading: "Design Options & Quality Printing",
                body: "We work with top print suppliers to deliver business cards that reflect your brand. Choose from matte, glossy, and premium finishes."
            },
            {
                heading: "Professional Business Card Printing in Concord Township, Ohio",
                body: `Make a lasting first impression with <strong>custom business cards professionally printed at Mailbox Plus</strong> in Concord Township, Ohio. We help entrepreneurs, small businesses, and professionals throughout Lake County create <strong>high-quality, full-color business cards</strong> that reflect their brand, mission, and style.

Our design and printing team offers <strong>matte, glossy, and premium cardstock finishes</strong>, along with specialty upgrades such as <em>spot UV, raised lettering, double-sided prints, and custom-cut corners.</em> Whether you need 100 cards or 10,000, we ensure crisp detail, vibrant color, and fast turnaround times.

Don’t have a design yet? We can help you create one from scratch or polish your existing layout for print. Every card is printed using <strong>professional-grade printers and durable materials</strong> to make sure your brand stands out with confidence and clarity.

If you’re searching for <em>business card printing near Concord Township</em> or need <em>custom business cards in Lake County, Ohio</em>, visit Mailbox Plus today. We’ll help you design and print cards that open doors, start conversations, and make your business unforgettable.`,
                isFullWidth: true
            }
        ],
        features: [
            { icon: Users, title: "Custom Design", description: "Work with our staff or upload your own design." },
            { icon: Palette, title: "Premium Materials", description: "Choose from multiple card stocks and finishes." },
            { icon: Star, title: "Fast Turnaround", description: "Get your cards quickly, ready for your next meeting." }
        ],
        faqs: [...generalCopyPrintFaqs, ...businessCardsFaqs]
    },
    {
        id: "flyers-brochures",
        category: "copy-print",
        city: "Concord Township",
        serviceName: "Flyers & Brochures",
        slug: "/copy-print/flyers-brochures",
        pageTitle: "Flyers & Brochures in Concord Township, Ohio | Mailbox Plus",
        metaDescription: "Local Flyers & Brochures in Concord Township including UPS, FedEx, USPS, DHL shipping, printing, mailbox rentals, and notary services. Mailbox Plus is the top local alternative to USPS, The UPS Store, FedEx Office, Mail Boxes Etc., Staples, and Office Depot.",
        keywords: "flyers, brochures, printing, concord township",
        heroTitle: "Flyer & Brochure Printing",
        heroSubtitle: "High-quality printed materials for marketing, events, and promotions.",
        heroImage: getServiceImageUrl("/images/flyers_brochures.webp"),
        content: [
            {
                heading: "Promote Your Business",
                body: "Flyers and brochures remain one of the most cost-effective ways to share your message with the community."
            },
            {
                heading: "Professional Quality",
                body: "Our print partners provide full-color, double-sided printing on premium paper stocks."
            },
            {
                heading: "Flyer and Brochure Printing Services in Concord Township, Ohio",
                body: `Promote your business, event, or product with <strong>professional flyer and brochure printing</strong> from Mailbox Plus in Concord Township, Ohio. We help businesses and organizations across Lake County design and print <strong>eye-catching marketing materials</strong> that deliver your message clearly and effectively.

Our print specialists offer a variety of <strong>sizes, paper weights, and finishes</strong>—including <em>glossy, matte, tri-fold, and double-sided layouts</em>—so you can customize your flyers and brochures to match your brand and purpose. From small business promotions to community events and real estate listings, we ensure every print looks sharp, vibrant, and ready to impress.

Need help with design? Our team can assist with <strong>layout creation, color optimization, and brand consistency</strong> to ensure your materials look polished and professional. We print in both small and bulk quantities with fast turnaround times and affordable pricing.

If you’re searching for <em>flyer printing near Concord Township</em> or need <em>custom brochure printing in Lake County, Ohio</em>, stop by Mailbox Plus today. We’ll help you turn your ideas into professional marketing pieces that get noticed and get results.`,
                isFullWidth: true
            }
        ],
        features: [
            { icon: Printer, title: "High-Resolution Printing", description: "Sharp, full-color graphics every time." },
            { icon: Palette, title: "Custom Designs", description: "Flexible templates or upload your own design." },
            { icon: Layers, title: "Variety of Finishes", description: "Glossy, matte, and specialty options." }
        ],
        faqs: [...generalCopyPrintFaqs, ...flyersBrochuresFaqs]
    },
    {
        id: "document-printing",
        category: "copy-print",
        city: "Concord Township",
        serviceName: "Document Printing",
        slug: "/copy-print/document-printing",
        pageTitle: "Document Printing in Concord Township, Ohio | Mailbox Plus",
        metaDescription: "Local Document Printing in Concord Township including UPS, FedEx, USPS, DHL shipping, printing, mailbox rentals, and notary services. Mailbox Plus is the top local alternative to USPS, The UPS Store, FedEx Office, Mail Boxes Etc., Staples, and Office Depot.",
        keywords: "document printing, business printing, Concord Township, Lake County",
        heroTitle: "Document Printing",
        heroSubtitle: "High-quality document printing for all your needs.",
        heroImage: getServiceImageUrl("/images/document-printing.webp"),
        content: [
            {
                heading: "Professional Document Printing",
                body: "From single-page documents to large reports, we provide high-quality printing services for businesses and individuals."
            },
            {
                heading: "Fast Turnaround",
                body: "Most printing jobs are completed the same day, so you can get your documents when you need them."
            },
            {
                heading: "Document Printing Services in Concord Township, Ohio",
                body: `Mailbox Plus provides fast, affordable, and high-quality <strong>document printing services</strong> for residents, students, and businesses throughout Concord Township and Lake County, Ohio. Whether you need to print <strong>resumes, presentations, contracts, forms, or reports</strong>, we make it simple to get crisp, professional results—right when you need them.

Our on-site printers produce <strong>black-and-white and full-color documents</strong> with a variety of finishing options, including <em>stapling, hole-punching, collating, and binding</em>. We can print directly from email, USB drive, cloud storage, or hard copy, and every print job is handled with care and confidentiality.

Mailbox Plus also offers <strong>bulk printing, scanning, and faxing services</strong> for small offices, local professionals, and community organizations. Need quick turnaround? Most document printing jobs are completed the same day or while you wait.

If you’re searching for <em>document printing near Concord Township</em> or need <em>professional printing and copying services in Lake County, Ohio</em>, visit Mailbox Plus today. We’ll help you print it right—the first time.`,
                isFullWidth: true
            }
        ],
        features: [
            { icon: Printer, title: "Color & B/W", description: "Full-color or black and white printing options." },
            { icon: FileText, title: "Multiple Formats", description: "Print documents, reports, presentations, and more." },
            { icon: Star, title: "Professional Quality", description: "Sharp, crisp printing on premium paper." }
        ],
        faqs: [...generalCopyPrintFaqs, ...documentPrintingFaqs]
    },
    {
        id: "posters-printing",
        category: "copy-print",
        city: "Concord Township",
        serviceName: "Posters Printing",
        slug: "/copy-print/posters-printing",
        pageTitle: "Posters Printing in Concord Township, Ohio | Mailbox Plus",
        metaDescription: "Local Posters Printing in Concord Township including UPS, FedEx, USPS, DHL shipping, printing, mailbox rentals, and notary services. Mailbox Plus is the top local alternative to USPS, The UPS Store, FedEx Office, Mail Boxes Etc., Staples, and Office Depot.",
        keywords: "poster printing, large format printing, Concord Township, Lake County",
        heroTitle: "Poster Printing",
        heroSubtitle: "Eye-catching posters for events, promotions, and presentations.",
        heroImage: getServiceImageUrl("/images/posters-printing.webp"),
        content: [
            {
                heading: "Stand Out with Custom Posters",
                body: "Our large-format poster printing services deliver vibrant, professional results for any occasion."
            },
            {
                heading: "Multiple Sizes Available",
                body: "Choose from standard sizes or request custom dimensions to fit your specific needs."
            },
            {
                heading: "Large Format Poster Printing in Concord Township, Ohio",
                body: `Make a bold statement with <strong>custom poster printing</strong> from Mailbox Plus in Concord Township, Ohio. We specialize in creating <strong>vibrant, high-resolution posters</strong> for businesses, schools, events, and organizations throughout Lake County—perfect for promotions, presentations, displays, and special occasions.

Our print team uses <strong>professional-grade printers and premium photo-quality paper</strong> to ensure your posters look sharp, colorful, and durable. Choose from a variety of <em>sizes, finishes, and materials</em>, including glossy, matte, and laminated options. We can print everything from a single poster to a full campaign run, all with fast turnaround times.

Need help designing your poster? Our in-store experts can assist with <strong>layout, sizing, and color matching</strong> to make sure your artwork stands out and communicates your message clearly.

If you’re searching for <em>poster printing near Concord Township</em> or need <em>large-format printing services in Lake County, Ohio</em>, stop by Mailbox Plus today. We’ll help you create professional posters that get attention—whether you’re advertising a sale, promoting an event, or decorating your space.`,
                isFullWidth: true
            }
        ],
        features: [
            { icon: Printer, title: "Large Format", description: "Print posters in various sizes up to 36 inches wide." },
            { icon: Palette, title: "Vibrant Colors", description: "Full-color printing with rich, eye-catching graphics." },
            { icon: Star, title: "Quality Materials", description: "Choose from glossy, matte, or premium paper stocks." }
        ],
        faqs: [...generalCopyPrintFaqs, ...postersPrintingFaqs]
    },
    {
        id: "postcard-printing",
        category: "copy-print",
        city: "Concord Township",
        serviceName: "Postcard Printing",
        slug: "/copy-print/postcard-printing",
        pageTitle: "Postcard Printing in Concord Township, Ohio | Mailbox Plus",
        metaDescription: "Local Postcard Printing in Concord Township including UPS, FedEx, USPS, DHL shipping, printing, mailbox rentals, and notary services. Mailbox Plus is the top local alternative to USPS, The UPS Store, FedEx Office, Mail Boxes Etc., Staples, and Office Depot.",
        keywords: "postcard printing, marketing postcards, Concord Township, Lake County",
        heroTitle: "Postcard Printing",
        heroSubtitle: "Affordable, high-quality postcard printing for any occasion.",
        heroImage: getServiceImageUrl("/images/postcard-printing.webp"),
        content: [
            {
                heading: "Send Your Message",
                body: "Postcards are a cost-effective way to reach customers and promote your brand."
            },
            {
                heading: "Design Options & Quality Printing",
                body: "We work with top print suppliers to deliver postcards that reflect your brand. Choose from matte, glossy, and premium finishes."
            },
            {
                heading: "Custom Postcard Printing in Concord Township, Ohio",
                body: `Reach customers, friends, and the community with <strong>custom postcard printing</strong> from Mailbox Plus in Concord Township, Ohio. We create <strong>high-quality, full-color postcards</strong> that are perfect for direct mail campaigns, event promotions, thank-you cards, and special announcements—all printed locally for fast turnaround and professional results.

Our printing team offers a range of <strong>sizes, finishes, and paper stocks</strong> to fit your message and style. Choose from <em>standard, glossy, matte, or premium heavyweight cards</em>, all printed with sharp detail and vibrant color. Whether you’re sending 25 postcards or 2,500, we ensure every card reflects your brand’s quality and attention to detail.

Need mailing help? We also provide <strong>address printing, EDDM (Every Door Direct Mail) preparation, and USPS delivery coordination</strong> to make your postcard marketing effortless and effective.

If you’re searching for <em>postcard printing near Concord Township</em> or need <em>custom mailer design and printing in Lake County, Ohio</em>, visit Mailbox Plus today. We’ll help you design, print, and mail postcards that get noticed and deliver results.`,
                isFullWidth: true
            }
        ],
        features: [
            { icon: Printer, title: "Full-Color Printing", description: "Bright, eye-catching postcards." },
            { icon: Layers, title: "Quality Paper", description: "Choose from matte or glossy finishes." },
            { icon: Star, title: "Fast Turnaround", description: "Get your postcards quickly." }
        ],
        faqs: [...generalCopyPrintFaqs, ...postcardPrintingFaqs]
    },
    {
        id: "copies",
        category: "copy-print",
        city: "Concord Township",
        serviceName: "Copies",
        slug: "/copy-print/copies",
        pageTitle: "Copies in Concord Township, Ohio | Mailbox Plus",
        metaDescription: "Local Copies in Concord Township including UPS, FedEx, USPS, DHL shipping, printing, mailbox rentals, and notary services. Mailbox Plus is the top local alternative to USPS, The UPS Store, FedEx Office, Mail Boxes Etc., Staples, and Office Depot.",
        keywords: "copy services, document copies, concord township, lake county",
        heroTitle: "Copy Services",
        heroSubtitle: "Quick, affordable copies for personal or business use.",
        heroImage: getServiceImageUrl("/images/copies.webp"),
        content: [
            {
                heading: "Affordable Copying",
                body: "Make black-and-white or color copies in any quantity you need."
            },
            {
                heading: "Bulk Discounts",
                body: "Save more when you print larger volumes."
            },
            {
                heading: "Fast and Affordable Copy Services in Concord Township, Ohio",
                body: `Mailbox Plus provides quick, reliable, and high-quality <strong>copy and duplication services</strong> for individuals, students, and businesses across Concord Township and Lake County, Ohio. Whether you need a few pages or hundreds of copies, our professional-grade printers ensure <strong>crisp, clean, and accurate reproductions</strong> every time.

We offer both <strong>black-and-white and full-color copying</strong> with flexible options for <em>single-sided, double-sided, collated, and stapled copies</em>. Our team can also help you scale documents, adjust formatting, or reproduce large quantities for presentations, training materials, flyers, and handouts.

Mailbox Plus also provides <strong>document scanning, faxing, and binding services</strong>—so you can handle all your document needs in one stop. Whether it’s business forms, personal paperwork, or school projects, we make sure your copies are handled with care, speed, and precision.

If you’re searching for <em>copy services near Concord Township</em> or need <em>professional printing and duplication in Lake County, Ohio</em>, visit Mailbox Plus today. We’ll help you copy it right the first time—fast, easy, and affordable.`,
                isFullWidth: true
            }
        ],
        features: [
            { icon: Printer, title: "Color & B/W Copies", description: "Flexible copy options for any need." },
            { icon: Layers, title: "High Volume", description: "We handle bulk orders quickly." },
            { icon: Star, title: "Quality Guaranteed", description: "Clear, sharp copies every time." }
        ],
        faqs: [...generalCopyPrintFaqs, ...copiesFaqs]
    },
    {
        id: "staples-printing-alternative-concord-township",
        category: "copy-print",
        city: "Concord Township",
        serviceName: "Staples Printing Alternative",
        slug: "/staples-printing-alternative-concord-township",
        pageTitle: "Staples Printing Alternative in Concord Township, Ohio | Mailbox Plus",
        metaDescription: "Local Staples Alternative for printing and shipping. Mailbox Plus is the top local alternative to USPS, The UPS Store, FedEx Office, Mail Boxes Etc., Staples, and Office Depot in Concord Township.",
        keywords: "Staples printing alternative, Concord Township, Mailbox Plus",
        heroTitle: "The Best Staples Printing Alternative in Concord Township: Mailbox Plus",
        heroSubtitle: "Mailbox Plus offers high-quality document services without the big-box store hassle.",
        heroImage: getServiceImageUrl("/images/document-printing.webp"),
        content: [
            {
                heading: "The Best Staples Printing Alternative in Concord Township: Mailbox Plus",
                body: "Need a <strong>Staples alternative for printing and shipping in Concord Township, Ohio</strong>? \nMailbox Plus offers high-quality document services without the big-box store hassle. Whether you need \nbusiness cards, flyers, or secure shredding, our local team provides the personalized attention your projects deserve. \nWe are also a full-service shipping center for <strong>UPS, FedEx, USPS, and DHL</strong>, making us a one-stop shop \nfor all your business needs. Experience the difference of a locally owned business that puts quality and customer service first."
            },
            {
                heading: "Why Choose Mailbox Plus Over Staples?",
                body: "• **Personalized Attention:** We take the time to ensure your print jobs are perfect.\n• **No Long Lines:** Get your errands done quickly without the crowd.\n• **Local Ownership:** Your business supports the Concord Township community.\n• **Multi-Carrier Shipping:** Unlike Staples (which often limits carrier options), we ship via UPS, FedEx, USPS, and DHL.\n• **Transparent Pricing:** Competitive rates for printing and shipping.\n• **More Services:** We offer notary, fingerprinting, and mailbox rentals too."
            },
            {
                heading: "Printing & Business Services",
                body: "• **Document Services:** Color/B&W copies, laminating, binding, and scanning services.\n• **Print Marketing:** Business cards, flyers, brochures, and postcards to promote your business.\n• **Shipping Center:** Authorized shipping for all major carriers: UPS, FedEx, USPS, DHL.\n• **Secure Shredding:** Safe and secure document destruction to protect your sensitive information."
            }
        ],
        features: [
            { title: "Customer Focus", description: "Personalized Local Service.", icon: Users },
            { title: "Shipping Options", description: "UPS, FedEx, USPS, DHL.", icon: Truck },
            { title: "Efficiency", description: "Fast In & Out.", icon: Clock }
        ],
        faqs: [
            {
                question: "Do you offer the same printing services as Staples?",
                answer: "We offer a wide range of essential business printing services including copies, flyers, and business cards with faster turnaround times."
            },
            {
                question: "Can I ship packages here too?",
                answer: "Yes! We are a comprehensive shipping center for UPS, FedEx, USPS, and DHL."
            },
            {
                question: "Do you offer shredding services?",
                answer: "Yes, we provide secure document destruction to keep your sensitive information safe."
            }
        ]
    },
    {
        id: "office-depot-alternative-concord-township",
        category: "copy-print",
        city: "Concord Township",
        serviceName: "Office Depot Alternative",
        slug: "/office-depot-alternative-concord-township",
        pageTitle: "Office Depot Alternative in Concord Township, Ohio | Mailbox Plus",
        metaDescription: "Local Office Depot Alternative for business services. Mailbox Plus is the top local alternative to USPS, The UPS Store, FedEx Office, Mail Boxes Etc., Staples, and Office Depot in Concord Township.",
        keywords: "Office Depot alternative, Concord Township, Mailbox Plus",
        heroTitle: "The Best Office Depot Alternative in Concord Township: Mailbox Plus",
        heroSubtitle: "Mailbox Plus provides the essential business services you rely on, right in your neighborhood.",
        heroImage: getServiceImageUrl("/images/document-printing.webp"),
        content: [
            {
                heading: "The Best Office Depot Alternative in Concord Township: Mailbox Plus",
                body: "Looking for an <strong>Office Depot alternative in Concord Township, Ohio</strong>? \nMailbox Plus provides the essential business services you rely on, right in your neighborhood. \nFrom professional printing and copying to shipping and mailbox rentals, we offer a more personalized and efficient experience than the big chain stores. \nPlus, as a multi-carrier shipping center, we give you more choices with <strong>UPS, FedEx, USPS, and DHL</strong> all in one location. \nChoose Mailbox Plus for friendly service and expert solutions."
            },
            {
                heading: "Why Mailbox Plus is Your Best Choice",
                body: "• **Faster Service:** We get you in and out quickly, respecting your busy schedule.\n• **No Long Lines:** Avoid the wait times often found at Office Depot.\n• **Local Ownership:** We are a locally owned business invested in our community.\n• **Multi-Carrier Shipping:** Compare rates and services from UPS, FedEx, USPS, and DHL.\n• **Transparent Pricing:** Fair prices for all our services.\n• **More Services:** We offer comprehensive solutions like notary, shredding, and fingerprinting."
            },
            {
                heading: "Comprehensive Business Services",
                body: "• **Printing & Copying:** High-quality copies, business cards, flyers, and document finishing services.\n• **Shipping & Packing:** Authorized shipping center for UPS, FedEx, USPS, and DHL with professional packing.\n• **Mailbox Services:** Secure private mailboxes with package receiving from all carriers.\n• **Office Essentials:** Notary public, faxing, scanning, and secure shredding services."
            }
        ],
        features: [
            { title: "Service Experience", description: "Personal & Efficient.", icon: Star },
            { title: "Shipping Carriers", description: "UPS, FedEx, USPS, DHL.", icon: Truck },
            { title: "Waiting Time", description: "Minimal.", icon: Clock }
        ],
        faqs: [
            {
                question: "What shipping services do you offer?",
                answer: "We offer shipping via UPS, FedEx, USPS, and DHL, allowing you to choose the best option for your needs."
            },
            {
                question: "Can I get documents printed here?",
                answer: "Absolutely! We handle copies, business cards, flyers, and more with professional quality."
            },
            {
                question: "Do you offer notary services?",
                answer: "Yes, our on-site notary is available to assist you with your legal documents."
            }
        ]
    },
    {
        id: "printing-services-concord-township",
        category: "copy-print",
        city: "Concord Township",
        serviceName: "Printing Services",
        slug: "/printing-services-concord-township",
        pageTitle: "Printing Services in Concord Township, Ohio | Mailbox Plus",
        metaDescription: "Local Printing Services including UPS, FedEx, USPS, and DHL services. Mailbox Plus is the top local alternative to USPS, The UPS Store, FedEx Office, Mail Boxes Etc., Staples, and Office Depot in Concord Township.",
        keywords: "printing services, Concord Township, Mailbox Plus",
        heroTitle: "High-Quality Printing Services in Concord Township: Mailbox Plus",
        heroSubtitle: "Mailbox Plus is your local print shop for everything from business cards and flyers to documents and presentations.",
        heroImage: getServiceImageUrl("/images/document-printing.webp"),
        content: [
            {
                heading: "High-Quality Printing Services in Concord Township: Mailbox Plus",
                body: "Looking for professional <strong>printing services in Concord Township, Ohio</strong>? \nMailbox Plus is your local print shop for everything from business cards and flyers to documents and presentations. \nWe offer high-quality color and black & white printing with fast turnaround times. Whether you're a student, \na small business owner, or just need a few copies, our friendly team is here to help your projects look their best. \nPlus, we can ship your printed materials anywhere with <strong>UPS, FedEx, USPS, and DHL</strong>."
            },
            {
                heading: "Why Print with Mailbox Plus?",
                body: "• **Quality:** We use professional-grade equipment for crisp, clear results.\n• **Speed:** Same-day service available for many print jobs.\n• **Convenience:** Email us your files or bring them in on a USB drive.\n• **Personal Service:** We take the time to check your files and ensure they print correctly.\n• **Full Service:** We can print, bind, laminate, and ship your documents all in one visit.\n• **Local Value:** Competitive pricing without the big box store hassle."
            },
            {
                heading: "Complete Printing Solutions",
                body: "• **Document Printing:** Resumes, reports, presentations, and flyers in color or B&W.\n• **Business Cards:** Make a great first impression with professionally printed business cards.\n• **Finishing Services:** Binding, laminating, stapling, and folding to give your project a polished look.\n• **Digital Services:** Scan documents to email or USB for easy digital archiving."
            }
        ],
        features: [
            { title: "Print Quality", description: "Professional Laser.", icon: Printer },
            { title: "Cost per Page", description: "Efficient / Bulk Rates.", icon: Star },
            { title: "Speed", description: "High Volume Fast.", icon: Clock }
        ],
        faqs: [
            {
                question: "How do I send you my file?",
                answer: "You can email it to us or bring it in on a USB drive."
            },
            {
                question: "Do you print in color?",
                answer: "Yes, we offer full-color and black & white printing on a variety of paper sizes."
            },
            {
                question: "Can you laminate documents?",
                answer: "Yes, we offer laminating services to protect your important documents."
            }
        ]
    }
];