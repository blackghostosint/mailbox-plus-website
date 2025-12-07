import { additionalServices } from "../config/services/additional-services";
import { ServicePage } from "../components/ServicePage";

export default function NuulyReturnsPage() {
    const service = additionalServices.find(s => s.id === "nuuly-returns");
    if (!service) return null;
    return <ServicePage {...service} />;
}
