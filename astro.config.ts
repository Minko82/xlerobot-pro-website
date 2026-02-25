import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  integrations: [
    starlight({
      title: "XLerobot",
      description:
        "Documentation, tutorials, and lab notes for the XLerobot robotics project.",
      favicon: "/favicon.svg",
      customCss: ["./src/styles/global.css"],
      sidebar: [
        {
          label: "Start Here",
          items: [
            { slug: "start-here" },
            { slug: "start-here/prerequisites" },
            { slug: "start-here/learning-path" },
          ],
        },
        {
          label: "Docs",
          items: [
            {
              label: "Hardware",
              autogenerate: { directory: "docs/hardware" },
            },
            {
              label: "Software",
              autogenerate: { directory: "docs/software" },
            },
            {
              label: "Architecture",
              autogenerate: { directory: "docs/architecture" },
            },
            {
              label: "Calibration",
              autogenerate: { directory: "docs/calibration" },
            },
            {
              label: "Reference",
              autogenerate: { directory: "docs/reference" },
            },
          ],
        },
        {
          label: "Tutorials",
          autogenerate: { directory: "tutorials" },
        },
        {
          label: "Troubleshooting",
          autogenerate: { directory: "troubleshooting" },
        },
        {
          label: "Lab Notes",
          autogenerate: { directory: "lab-notes" },
        },
        {
          label: "Contributing",
          autogenerate: { directory: "contributing" },
        },
      ],
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/ranegray/xlerobot-pro-website",
        },
      ],
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
