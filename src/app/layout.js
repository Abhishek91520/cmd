import "./globals.css";

export const metadata = {
  title: "Document Intelligence & Risk OS — NVIDIA NIM AI",
  description: "Drop any contract, invoice, medical report, notice, or ID. NVIDIA NIM AI identifies hidden risks, translates to Indian regional languages, and answers custom questions instantly.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-slate-950 text-slate-100 antialiased min-h-screen flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
