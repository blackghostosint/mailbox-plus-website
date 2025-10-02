// categories.ts
import { ServiceCategory } from "./types/services";

export interface Category {
  id: ServiceCategory;
  name: string;
  href: string;
}

export const categories: Category[] = [
  {
    id: "core",
    name: "Core Pages",
    href: "/"
  },
  {
    id: "pack-ship",
    name: "Pack & Ship",
    href: "/pack-ship"
  },
  {
    id: "copy-print",
    name: "Copy & Print",
    href: "/copy-print"
  },
  {
    id: "home-business",
    name: "Mailbox & Business",
    href: "/home-business"
  },
  {
    id: "specialty",
    name: "Specialty Services",
    href: "/digital-fingerprinting"
  }
];
