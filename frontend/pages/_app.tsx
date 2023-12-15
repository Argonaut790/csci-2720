import type { AppProps } from "next/app";

import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { UserSystemProvider } from "@/contexts/UserSystemContext";
import { NearestChargerProvider } from "@/contexts/NearestChargerContext";
import { DistrictChargerProvider } from "@/contexts/DistrictChargerContext";
import { AllDataPointsProvider } from "@/contexts/AllDataPointsContext";
import { fontSans, fontMono } from "@/config/fonts";
import { useRouter } from "next/router";
import "@/styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <NextUIProvider navigate={router.push}>
      <NextThemesProvider>
        <UserSystemProvider>
          <AllDataPointsProvider>
            <DistrictChargerProvider>
              <NearestChargerProvider>
                <Component {...pageProps} />
              </NearestChargerProvider>
            </DistrictChargerProvider>
          </AllDataPointsProvider>
        </UserSystemProvider>
      </NextThemesProvider>
    </NextUIProvider>
  );
}

export const fonts = {
  sans: fontSans.style.fontFamily,
  mono: fontMono.style.fontFamily,
};
