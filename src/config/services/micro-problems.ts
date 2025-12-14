import { Service } from "../../types/services";
import { getServiceImageUrl } from "../../lib/storage";

export const microProblems: Service[] = [
    {
        id: "return-without-original-box",
        category: "micro-problem",
        city: "Concord Township",
        serviceName: "Return a Package Without the Original Box",
        slug: "/return-without-original-box",
        pageTitle: "Return a Package Without the Original Box in Concord Township",
        metaDescription: "Lost your original box? Mailbox Plus in Concord Township provides professional packing services to ensure your return items are shipped safely and securely.",
        heroTitle: "Return a Package Without the Original Box",
        heroSubtitle: "Lost the original packaging? We can help prepare your return properly.",
        heroImage: getServiceImageUrl("/images/micro/pack-ship.webp")
    }
];
