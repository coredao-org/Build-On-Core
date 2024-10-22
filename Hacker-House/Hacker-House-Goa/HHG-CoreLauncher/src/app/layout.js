import { TokenDataProvider } from "@/context/tokenData";
import "./globals.css";
import Provider from "@/lib/ThemeProvider/Provider";
import "@rainbow-me/rainbowkit/styles.css";
import { Toaster } from "sonner";

// const bodyFont = IBM_Plex_Mono({ subsets: ["latin"], weight: ["100", "200", "300", "400", "500", "600", "700"] });

export const metadata = {
  title: "Core Launcher ",
  description: "Core Launcher",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/images/favicon.png" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-IBM-Plex">
        <Provider>
          <Toaster closeButton />
          <TokenDataProvider>{children}</TokenDataProvider>
        </Provider>
      </body>
    </html>
  );
}
