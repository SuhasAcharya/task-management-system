import "./globals.css";
import StoreProvider from "@/components/StoreProvider";
import ToasterHost from "@/components/ToasterHost";

export const metadata = {
  title: "Task Management Dashboard",
  description: "Fast and modern task management dashboard built with Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          {children}
          <ToasterHost />
        </StoreProvider>
      </body>
    </html>
  );
}
