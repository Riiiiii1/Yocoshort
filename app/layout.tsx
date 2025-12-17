import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "Yocoshort",
  description: "Acortador de URLs con personalización de URLs y subdominios",
  icons: {
    icon: '/icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-gray-50">
        <main className="min-h-screen flex flex-col">
          {children}
          <footer className="text-center py-4 bg-[#155dfc] text-white w-full mt-auto">
            <p className="text-sm md:text-base">
              © 2025 Yocoshort. Todos los derechos reservados. Desarrollado por{' '}
              <a
                href="https://github.com/riiiiii1"
                target="_blank"
                className="text-white underline hover:no-underline"
              >
                Riiiiii1
              </a>
            </p>
          </footer>
        </main>
      </body>
    </html>
  );
}