import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ana Gabriela Santos - Designer",
  description: "Galeria de trabalhos e portfólio profissional",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500;1,600;1,700;1,800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="antialiased"
        style={{ backgroundColor: "#fffce3" }}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
