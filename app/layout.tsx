import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";


export const metadata: Metadata = {
  metadataBase: new URL("https://powercalc.digital"),
  title: "Калькулятор зарядної станції та генератора — розрахунок EcoFlow, Bluetti",
  description: "Онлайн калькулятор часу роботи зарядної станції та витрати палива генератора. Враховуємо ККД інвертора, навантаження та ємність баку/акумулятора.",
  keywords: [
    "калькулятор зарядної станції",
    "калькулятор генератора",
    "розрахунок витрати палива генератора",
    "розрахунок екофлоу",
    "на скільки вистачить екофлоу",
    "ecoflow",
    "bluetti",
    "вимкнення світла",
    "розрахунок часу роботи акумулятора",
    "розрахунок акумулятора",
    "калькулятор блекліауту",
    "розрахунок генератора",
    "резервне живлення для будинку",
    "ecoflow calculator",
    "bluetti calculator",
    "power station calculator",
    "калькулятор ватт",
    "розрахунок потужності зарядної станції",
  ],
  alternates: {
    canonical: "https://powercalc.digital",
  },
  openGraph: {
    title: "Калькулятор зарядної станції та генератора | PowerCalc",
    description: "Розрахуй точний час роботи EcoFlow, Bluetti чи витрату бензину/дизелю генератора під твоє навантаження.",
    url: "https://powercalc.digital",
    siteName: "PowerCalc",
    type: "website",
    locale: "uk_UA",
  },
  verification: {
    google: "bcW1UCF-1Vm7Hn4nkFyb-szXf6DMXfYsYJIpfIvdRJA",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@name": "PowerCalc",
    "url": "https://powercalc.digital",
  };

  return (
    <html lang="uk" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className="antialiased font-sans">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
        </ThemeProvider>
      </body>
    </html>
  );
}