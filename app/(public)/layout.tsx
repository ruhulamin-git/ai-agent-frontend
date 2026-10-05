import { Toaster } from "sonner";

import { Header } from "@/modules/landing/Header";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { Footer } from "@/shared/base-layout/Footer";

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark" enableSystem={false}>
      <div className="min-h-screen bg-gray-950 text-foreground relative">
        <div className="relative z-10">
          <Header />
          <main className="pt-16">{children}</main>
          <Footer />
        </div>
        <Toaster position="top-right" richColors />
      </div>
    </ThemeProvider>
  );
};

export default PublicLayout;
