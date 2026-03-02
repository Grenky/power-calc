"use client";

import { useEffect, useState } from "react";
import { Laptop, Wifi, Lightbulb, Snowflake, Tv, Fan, Coffee, WashingMachine, Microwave } from "lucide-react";
import { ApplianceCard } from "@/components/ApplianceCard";
import { Slider } from "@/components/ui/slider";
import Link from "next/link";

const INITIAL_APPLIANCES = [
  { id: "laptop", name: "Ноутбук", power: 60, quantity: 1, icon: Laptop },
  { id: "router", name: "Роутер", power: 15, quantity: 1, icon: Wifi },
  { id: "lamp", name: "LED Лампа", power: 10, quantity: 1, icon: Lightbulb },
  { id: "fridge", name: "Холодильник", power: 120, quantity: 1, icon: Snowflake },
  { id: "tv", name: "Телевізор", power: 80, quantity: 1, icon: Tv },
  {id: "fan", name: "Вентилятор", power: 45, quantity: 1, icon: Fan},
  {id: "coffe", name: "Кавомашина", power: 1200, quantity: 1, icon: Coffee},
  {id: "washingm", name: "Пральна Машина", power: 2400, quantity: 1, icon: WashingMachine},
  {id: "microwave", name: "Мікрохвильовка", power: 1100, quantity: 1, icon: Microwave},
];

export default function Home() {
const[capacity, setCapacity] = useState(512);
const[activeIds, setActiveIds] = useState<string[]>([]);
const[mounted, setMounted] = useState(false);
const[appliances, setAppliances] = useState(
  INITIAL_APPLIANCES.map(app => ({ ...app, isActive: false }))
)

useEffect(() => {setMounted(true); }, []);


const toggleAppliance = (id: string) => {
  setAppliances(prev => prev.map(app => 
    app.id === id ? {...app, isActive: !app.isActive} : app
  ));
};

const updateQuantity = (id: string, delta: number) => {
  setAppliances(prev => prev.map(app => {
    if (app.id === id) {
      const newQty = Math.max(1, Math.min(10, app.quantity + delta));
      return { ...app, quantity: newQty, isActive: true };
    }
    return app;
  }));
};

const updatePower = (id: string, newPower: number) => {
  setAppliances(prev => prev.map(app =>
    app.id === id ? {...app, power: newPower} : app
  ));
};


const totalPower = appliances.reduce((sum, app) => 
  app.isActive ? sum + (app.power * app.quantity) : sum, 0
);

const runtimeHours = totalPower > 0 ? (capacity * 0.85) / totalPower : 0;

const formatTime = (decimalHours: number) => {
  if(decimalHours === 0) return "0 год";
  const h = Math.floor(decimalHours);
  const m = Math.round((decimalHours - h ) * 60);
  return m > 0 ? `${h} год ${m} хв` : `${h} год`;
}

const toggleApliance = (id: string) => {
  setActiveIds((prev) => 
    prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
  );
};



if(!mounted) return null;

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-8 pb-20">
      <div className="text-center space-y-2 py-0">
        <h1 className="text-4x1 font-black tracking-tight">PowerCalc 2026</h1>
        <p className="text-muted-foreground">Твій персональний гід енергозалежності</p>
        <p className="text-muted-foreground">Розрахуйте точний час роботи вашої станції з урахуванням ККД інвертора та реального споживання приладів.</p>
      </div>
      {/* Порада */}
      <div className="max-w-2xl mx-auto mt-6 bg-slate-50 border border-slate-200 p-4 rounded-2xl flex items-center gap-4 shadow-sm">
        <div className="flex-shrink-0 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
          <span className="text-xl">💡</span>
        </div>
        <p className="text-sm text-slate-600 leading-snug">
          Ми автоматично врахували **15% втрат** енергії на роботу інвертора. Це робить наш прогноз набагато точнішим за стандартні калькулятори.
        </p>
      </div>
      {/* Налаштування ємності */}
      <div className="bg-card border p-8 rounded-3xl shadow-sm space-y-6">
        <div className="space-y-1">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Ємність станції</h2>
          <p className="text-3xl font-bold">{capacity} <span className="text-lg font-medium text-muted-foreground">Вт·год</span></p>
        </div>
        <div className="flex gap-2">
            {[256, 512, 1024, 2048].map(v => (
              <button
              key={v}
              onClick={() => setCapacity(v)}
              className="px-3 py-1 text-xs font-medium text-black bg-secondary hover:bg-primary hover:text-primary-foreground rounded-full transition-colors"

              >
                {v}
              </button>
            ))}
        </div>
        <Slider 
          value={[capacity]}
          onValueChange={(v) => setCapacity(v[0])}
          max={2000}
          step={10}
          className="py-4"
          />
      </div>
      {/* Віджет результату */}
      <div className="w-full mx-auto mt-12 w-[calc(100%-3rem)] max-w-2xl">
        <div className="bg-primary text-primary-foreground p-6 rounded-2xl shadow-2xl flex flex-col sm:flex-flow items-center justify-between gap-4 border-t border-white/10">
          <div className="text-center sm: text-left">
              <p className="text-xs uppercase tracking-widest opacity-70">Залишилось часу</p>
              <p className="text-4xl font-black">{formatTime(runtimeHours)}</p>
          </div>
          <div className="h-px sm:h-12 w-full sm:w-px bg-white/20" />
          <div className="text-center sm:text-right">
            <p className="text-xs uppercase tracking-widest opacity-70">Навантаження</p>
            <p className="text-2xl font-bold">{totalPower} Вт</p>
          </div>
        </div>
      </div>
      {/* Список приладів */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {appliances.map((app) => (
          <ApplianceCard
          key={app.id}
          {...app}
          onToggle={() => toggleAppliance(app.id)}
          onQuantityChange={(delta) => updateQuantity(app.id, delta)}
          onPowerChange={(newPower) => updatePower(app.id, newPower)}
          />
        ))}
      </div>
      <footer className="max-w-2xl mx-auto py-10 text-center border-t mt-10">
        <Link href="/privacy" className="text-xs text-muted-foreground hover:text-primary transition-colors">
          Політика конфіденційності
        </Link>
      </footer>
    </main>  
  );
}
