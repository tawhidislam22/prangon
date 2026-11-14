import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Prangon Workspace",
    short_name: "Prangon",
    description: "A collaborative workspace and project management platform",
    start_url: "/",
    id: "/",
    scope: "/",
    display: "standalone",
    background_color: "#F8FAFC",
    theme_color: "#4F46E5",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/maskable-icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    categories: ["productivity", "business", "utilities"],
    shortcuts: [
      {
        name: "Dashboard",
        url: "/owner/dashboard",
        description: "Open your workspace dashboard",
      },
      {
        name: "Projects",
        url: "/owner/projects",
        description: "Open workspace projects",
      },
    ],
  };
}
