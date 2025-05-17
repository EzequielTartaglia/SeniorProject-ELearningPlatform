import { Inter } from "next/font/google";
import "./globals.css";
import NavBarWrapper from "@/components/navbars/NavBarWrapper";
import FooterWrapper from "@/components/footers/FooterWrapper";
import Metadata from "@/components/page_formats/Metadata";
import PageBody from "@/components/page_formats/PageBody";
import { AsideNavBarProvider } from "@/contexts/AsideContext";
import { UserInfoProvider } from "@/contexts/UserInfoContext";
import { UserInfoControlCenterProvider } from "@/contexts/UserInfoControlCenterContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { Suspense } from "react";
import Loading from "./loading";
import PushNotificationManager from "@/utils/web-push/PushNotificationManager";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  manifest: "/manifest.json",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Metadata />
      <Suspense fallback={<Loading />}>
        <body className="min-h-screen body-bg">
          <NotificationProvider>
            <UserInfoProvider>
            <UserInfoControlCenterProvider>
            <PushNotificationManager /> 
              <AsideNavBarProvider>
                <NavBarWrapper />
                <main
                  className={`${inter.className}`}
                  style={{ minHeight: "calc(100vh - 100px)" }}
                >
                  <PageBody>{children}</PageBody>
                </main>
                <FooterWrapper />
              </AsideNavBarProvider>
              
              </UserInfoControlCenterProvider>
            </UserInfoProvider>
          </NotificationProvider>
        </body>
      </Suspense>
    </html>
  );
}
