import RoleSelect from "@/components/RoleSelect";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FreeLynk",
  description:
    "A simple freelancing web application developed as a mini project to connect freelancers and employers for project-based work. The platform demonstrates the core workflow of freelance marketplaces like Upwork, focusing on clean UI, interactivity, and smooth user experience.",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RoleSelectPage() {
  return <RoleSelect />;
}
