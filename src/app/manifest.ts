import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Patrimoine",
    short_name: "Patrimoine",
    description: "Suivi simple de vos comptes, espèces, objectifs et investissements.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#f4f7f6",
    theme_color: "#10251e",
    lang: "fr",
    orientation: "portrait-primary",
  };
}
