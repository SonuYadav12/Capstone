import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import Header from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
import { dark } from "@clerk/themes";

export const metadata = {
  title: "PREPMASTER",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="icon" href="/logo.png" sizes="any" />
        </head>
        <body className="font-sans">
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            <main className="min-h-screen">{children}</main>
            <Toaster richColors />

            <footer className="dark:bg-muted/50 py-12 border-t border-gray-300 dark:border-gray-700">
              <div className="container mx-auto px-6 flex flex-col items-center justify-center text-center space-y-3">
                <p className="text-lg font-semibold text-gray-800 dark:text-gray-300">
                  Made with{" "}
                  <span className="text-red-500 animate-pulse">❤️</span> by
                  <span className="ml-1 font-bold text-blue-600 dark:text-blue-400">
                    Sonu Yadav
                  </span>
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  © {new Date().getFullYear()} PrepMaster. All rights reserved.
                </p>
              </div>
            </footer>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
