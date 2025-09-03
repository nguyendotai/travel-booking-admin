// app/layout.tsx
import "./globals.css";

export const metadata = {
  title: "Admin Panel",
  description: "Next.js Admin Panel",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-gradient-to-br from-purple-900 via-blue-900 to-gray-900 text-white">
        {children}
      </body>
    </html>
  );
}
