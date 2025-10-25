export const getServiceImageUrl = (imagePath: string): string => {
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  const cleaned = imagePath.replace(/^\/?images\//, "");
  const baseUrl = import.meta.env.VITE_R2_PUBLIC_BASE_URL;

  if (!baseUrl) {
    throw new Error("Missing R2 base URL environment variable");
  }

  return `${baseUrl.replace(/\/$/, "")}/${cleaned}`;
};
