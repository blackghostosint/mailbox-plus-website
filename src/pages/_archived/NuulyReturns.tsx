import { additionalServices } from "../config/services/additional-services";
import { ServicePage } from "../components/ServicePage";

console.log("AVAILABLE SERVICES:", additionalServices);

export default function NuulyReturnsPage() {
    console.log("NuulyReturnsPage: looking for nuuly-returns in", additionalServices);
    const service = additionalServices.find(s => s.id === "nuuly-returns");
    if (!service) {
        console.error("NuulyReturnsPage: Service not found!");
        return (
            <div className="p-10 text-center">
                <h1 className="text-xl font-bold text-red-600">Error: Service Configuration Not Found</h1>
                <p>Could not find &apos;nuuly-returns&apos; in additionalServices.</p>
                <code className="block mt-4 bg-gray-100 p-2 text-left text-sm invalid">
                    Available services: {additionalServices.map(s => s.id).join(", ")}
                </code>
            </div>
        );
    }

    return <ServicePage {...service} />;
}
