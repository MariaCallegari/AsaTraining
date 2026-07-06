import { ClerkProvider } from "@clerk/nextjs";
import { esES } from "@clerk/localizations";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Gimnasio | Rutinas",
  description: "Plataforma de rutinas del gimnasio",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider localization={esES}>
      <html lang="es">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
