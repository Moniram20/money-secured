import type { Metadata, Viewport } from "next";
import { Poppins, Inter, Nunito } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Money Secured",
  description: "Money Secured - A modern finance app to track your income and expenses with powerful analytics. 100% offline.",
  keywords: ["Money Secured", "Finance", "Expense Tracker", "Budget", "Money Manager"],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Money Secured",
  },
  icons: {
    icon: "/icon-192.png",
    apple: "/icon-512.png",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0F111A",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/icon-512.png" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(function(reg) {
                    // Check for updates every 60 seconds
                    setInterval(function() {
                      reg.update();
                    }, 60000);

                    // If a new SW is waiting, tell it to activate and reload page
                    reg.addEventListener('updatefound', function() {
                      var newWorker = reg.installing;
                      newWorker.addEventListener('statechange', function() {
                        if (newWorker.state === 'activated') {
                          // New service worker activated, reload the page
                          window.location.reload();
                        }
                      });
                    });

                    // If already has a waiting worker, skip waiting and reload
                    if (reg.waiting) {
                      reg.waiting.postMessage({ type: 'SKIP_WAITING' });
                      reg.waiting.addEventListener('statechange', function() {
                        if (this.state === 'activated') {
                          window.location.reload();
                        }
                      });
                    }
                  }).catch(function(){});
                });
              }
            `,
          }}
        />
      </head>
      <body
        className={`${poppins.variable} ${inter.variable} ${nunito.variable} antialiased bg-[#0F111A] text-white`}
      >
        {children}
      </body>
    </html>
  );
}
