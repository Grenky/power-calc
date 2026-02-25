import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Калькулятор зарядної станції — на скільки вистачить EcoFlow, Bluetti",
  description: "Точний розрахунок часу роботи вашої зарядної станції. Враховуємо ККД інвертора. Підтримка EcoFlow, Bluetti, Jackery та інших.",
  keywords: ["калькулятор енергії", "ecoflow", "bluetti", "вимкнення світла", "зарядна станція"],
  openGraph: {
    title: "Чи вистачить тобі заряду? Перевір зараз",
    description: "Розрахуй час роботи своїх приладів від зарядної станції онлайн.",
    type: "website",
    locale: "uk_UA",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk">
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}