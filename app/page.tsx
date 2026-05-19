"use client";

type PowerSource = 'station' | 'generator';

import { useEffect, useState } from "react";
import { Laptop, Wifi, Lightbulb, Snowflake, Tv, Fan, Coffee, WashingMachine, Microwave, Trash2 } from "lucide-react";
import { ApplianceCard } from "@/components/ApplianceCard";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ChatBot from "@/components/ChatBot";
import { ThemeToggle } from "@/components/ThemeToggle";

interface Appliance {
  id: string;
  name: string;
  power: number;
  quantity: number;
  isActive: boolean;
  icon: any; 
}

const INITIAL_APPLIANCES = [
  { id: "laptop", name: "Ноутбук", power: 60, quantity: 1, icon: Laptop },
  { id: "router", name: "Роутер", power: 15, quantity: 1, icon: Wifi },
  { id: "lamp", name: "LED Лампа", power: 10, quantity: 1, icon: Lightbulb },
  { id: "fridge", name: "Холодильник", power: 120, quantity: 1, icon: Snowflake },
  { id: "tv", name: "Телевізор", power: 80, quantity: 1, icon: Tv },
  { id: "fan", name: "Вентилятор", power: 45, quantity: 1, icon: Fan },
  { id: "coffee", name: "Кавомашина", power: 1200, quantity: 1, icon: Coffee },
  { id: "washingm", name: "Пральна Машина", power: 2400, quantity: 1, icon: WashingMachine },
  { id: "microwave", name: "Мікрохвильовка", power: 1100, quantity: 1, icon: Microwave },
];

export default function Home() {
  const [capacity, setCapacity] = useState(512);
  const [mounted, setMounted] = useState(false);
  const [chargePercent, setChargePercent] = useState(100);
  const [sourceType, setSourceType] = useState<PowerSource>('station');
  const [tankSize, setTankSize] = useState(15);
  const [fuelConsumption, setFuelConsumption] = useState(0.8);
  const [appliances, setAppliances] = useState<Appliance[]>(() => {
    if (typeof window === "undefined") return INITIAL_APPLIANCES.map(app => ({ ...app, isActive: false }));

    const saved = localStorage.getItem('user-appliances');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((app: any) => ({
          ...app,
          icon: INITIAL_APPLIANCES.find(i => i.id === app.id)?.icon || Lightbulb
        }));
      } catch (e) {
        return INITIAL_APPLIANCES.map(app => ({ ...app, isActive: false }));
      }
    }
    return INITIAL_APPLIANCES.map(app => ({ ...app, isActive: false }));
  });

  useEffect(() => { setMounted(true); }, []);

  const toggleAppliance = (id: string) => {
    setAppliances(prev => prev.map(app => 
      app.id === id ? { ...app, isActive: !app.isActive } : app
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
      app.id === id ? { ...app, power: newPower } : app
    ));
  };

  const updateName = (id: string, newName: string) => {
    setAppliances(prev => prev.map(app => 
      app.id === id ? { ...app, name: newName } : app
    ));
  };

  const removeAppliance = (id: string) => { 
    setAppliances(prev => prev.filter(app => app.id !== id));
  };

  const totalPower = appliances.reduce((sum, app) => 
    app.isActive ? sum + (app.power * app.quantity) : sum, 0
  );

  const isStation = sourceType === 'station';
  const isOverloaded = isStation && totalPower > capacity;

  const currentEnergy = (capacity * (chargePercent / 100));
  const runtimeHours = totalPower > 0 ? (currentEnergy * 0.85) / totalPower : 0;
  
  // Додано перевірку, щоб не ділити на нуль
 

  const realFuelConsumption = totalPower > 0 
    ? fuelConsumption + (totalPower / 1000) * 0.3
    : fuelConsumption;
  
 const generatorRunTime = realFuelConsumption > 0 ? tankSize / realFuelConsumption : 0;


  const formatTime = (decimalHours: number) => {
    if (decimalHours === 0 || isNaN(decimalHours) || !isFinite(decimalHours)) return "0 год";
    const h = Math.floor(decimalHours);
    const m = Math.round((decimalHours - h) * 60);
    return m > 0 ? `${h} год ${m} хв` : `${h} год`;
  }

  const addCustomAppliance = () => {
    const newApp = {
      id: `custom-${Date.now()}`,
      name: "Пристрій",
      power: 0,
      quantity: 1,
      isActive: true,
      icon: Lightbulb,
    }
    setAppliances((prev) => [...prev, newApp]);
  }

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('user-appliances', JSON.stringify(appliances));
    }
  }, [appliances, mounted]);

  if (!mounted) return null;

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-8 pb-20">
      <div className="absolute top-4 right-4 sm:top-8 sm:right-8 z-50">
        <ThemeToggle />
      </div>

      <div className="text-center space-y-2 py-0">
        <h1 className="text-4xl font-black tracking-tight">PowerCalc 2026</h1>
        <p className="text-muted-foreground">Твій персональний гід енергозалежності</p>
        <p className="text-muted-foreground">Розрахуйте точний час роботи вашого джерела живлення.</p>
      </div>

      <div className="flex justify-center mb-8">
        <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setSourceType('station')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              isStation ? "bg-white dark:bg-slate-700 shadow-sm text-blue-600" : "text-slate-500"
            }`}
          >
            🔋 Станція
          </button>
          <button
            onClick={() => setSourceType('generator')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              !isStation ? "bg-white dark:bg-slate-700 shadow-sm text-orange-600" : "text-slate-500"
            }`}
          >
            ⛽ Генератор
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto mt-6 bg-slate-50 border border-slate-200 p-4 rounded-2xl flex items-center gap-4 shadow-sm dark:bg-slate-900 dark:border-slate-800">
        <div className="flex-shrink-0 w-10 h-10 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-sm">
          <span className="text-xl">💡</span>
        </div>
        <div className="text-sm text-slate-600 dark:text-slate-400 leading-snug">
          {isStation 
            ? <>Ми автоматично врахували <strong>15%</strong> втрат енергії на роботу інвертора 220В.</>
            : <>Розрахунок базується на об&apos;ємі бака та середньому споживанні палива за годину.</>
          }
        </div>
      </div>

      <div className={`p-8 rounded-[2.5rem] shadow-2xl border-b-4 flex flex-col md:flex-row items-center gap-10 transition-all duration-500 dark:bg-slate-900/50 backdrop-blur-sm ${
        isStation ? "bg-slate-900 border-slate-800" : "bg-slate-800 border-orange-900/30"
      }`}> 
        
        {isStation ? (
          <>
            <div className="flex-1 space-y-8 w-full text-white">
              <div className="space-y-1">
                <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-500">Налаштування станції</h2>
                <p className="text-xl font-medium opacity-90">Параметри живлення</p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <p className="text-[10px] uppercase font-bold opacity-50 tracking-widest">Повна ємність</p>
                  <p className="text-sm font-mono">{capacity} <span className="opacity-50">Wh</span></p>
                </div>
                <Slider value={[capacity]} onValueChange={(v) => setCapacity(v[0])} max={3000} step={10} className="py-2" />
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <p className="text-[10px] uppercase font-bold opacity-50 tracking-widest">Поточний заряд</p>
                  <p className="text-sm font-mono text-cyan-400">{chargePercent}%</p>
                </div>
                <Slider value={[chargePercent]} onValueChange={(v) => setChargePercent(v[0])} max={100} step={1} className="py-2" />
              </div>
            </div>

            <div className="relative flex items-center justify-center flex-shrink-0 bg-slate-800/30 p-6 rounded-3xl border border-white/5">
              <svg className="w-44 h-44 transform -rotate-90 text-white">
                <circle cx="88" cy="88" r="78" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-800" />
                <circle
                  cx="88" cy="88" r="78"
                  stroke="currentColor" strokeWidth="12" fill="transparent"
                  strokeDasharray={490} 
                  strokeDashoffset={490 - (490 * chargePercent) / 100}
                  strokeLinecap="round"
                  className={`transition-all duration-1000 ease-out ${
                    chargePercent > 50 ? "text-cyan-400" : chargePercent > 20 ? "text-yellow-400" : "text-red-500"
                  }`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <span className="text-4xl font-black tracking-tighter leading-none">{chargePercent}%</span>
                <span className="text-[10px] uppercase font-bold opacity-40 mt-1">Battery</span>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 space-y-6 w-full py-4 text-white animate-in fade-in slide-in-from-bottom-2">
            <div className="space-y-1">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-orange-500">Налаштування генератора</h2>
              <p className="text-xl font-medium opacity-90">Параметри палива</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-[10px] uppercase font-bold opacity-50 tracking-widest text-slate-300">Об&apos;єм бака (л)</label>
                <Input 
                  type="number" 
                  value={tankSize} 
                  onChange={(e) => setTankSize(Number(e.target.value))}
                  className="bg-slate-700/50 border-slate-600 text-white h-12 text-lg focus:ring-orange-500"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] uppercase font-bold opacity-50 tracking-widest text-slate-300">Споживання (л/год)</label>
                <Input 
                  type="number" 
                  step="0.1"
                  value={fuelConsumption} 
                  onChange={(e) => setFuelConsumption(Number(e.target.value))}
                  className="bg-slate-700/50 border-slate-600 text-white h-12 text-lg focus:ring-orange-500"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="w-full mx-auto mt-12 max-w-2xl space-y-4 px-4 sm:px-0">
        <div className={`p-6 rounded-2xl shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 border-t transition-colors duration-500 dark:bg-slate-900/50 dark:border-slate-800 backdrop-blur-md ${
          isOverloaded
          ? "bg-red-600 text-white border-red-400"
          : "bg-slate-900 text-white border-white/10 dark:bg-blue-600 dark:text-white"
        }`}>
          <div className="text-center sm:text-left">
            <p className="text-xs uppercase tracking-widest opacity-70">
              {isOverloaded ? "Перевантаження!" : "Залишилось часу"}
            </p>
            <div className="text-4xl font-black">
              {isStation 
                ? (isOverloaded ? "⚠" : formatTime(runtimeHours)) 
                : formatTime(generatorRunTime)
              }
            </div>
          </div>
          <div className="h-px sm:h-12 w-full sm:w-px bg-white/20" />
          <div className="text-center sm:text-right">
            <p className="text-xs uppercase tracking-widest opacity-70">Навантаження</p>
            <p className="text-2xl font-bold">{totalPower} Вт</p>
          </div>
        </div>

        {isOverloaded && (
          <div className="bg-red-50 border-2 border-red-200 p-4 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2 dark:bg-red-900/20 dark:border-red-900/30">
            <span className="text-2xl">⚠</span>
            <p className="text-sm font-bold text-red-700 dark:text-red-400 leading-snug">
              Потужність приладів ({totalPower} Вт) перевищує можливості станції. Спробуйте вимкнути енергоємні пристрої.
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {appliances.map((app, index) => (
          <div key={`${app.id}-${index}`} className="relative group">
            <ApplianceCard
              {...app}
              onToggle={() => toggleAppliance(app.id)}
              onQuantityChange={(delta) => updateQuantity(app.id, delta)}
              onPowerChange={(newPower) => updatePower(app.id, newPower)}
              onNameChange={(newName) => updateName(app.id, newName)}
            />
            {app.id.startsWith('custom-') && (
              <button
                onClick={() => removeAppliance(app.id)}
                className="absolute -top-2 -right-2 bg-white text-red-500 p-1.5 rounded-full shadow-md border border-red-100 hover:bg-red-50 z-10 transition-all opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        ))}
        
        <button
          onClick={addCustomAppliance}
          className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 rounded-3xl hover:border-primary hover:bg-primary/5 transition-all group min-h-[140px] bg-slate-50/40 dark:border-slate-800 dark:bg-slate-900/20"
        >
          <div className="w-14 h-14 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all mb-4 border border-slate-100 dark:bg-slate-800 dark:border-slate-700">
            <span className="text-3xl font-light relative -top-[2px]">+</span>
          </div>
          <div className="text-center">
            <p className="text-xs font-black text-slate-500 uppercase tracking-widest group-hover:text-primary">Додати свій</p>
          </div>
        </button>
      </div>

      <section className="max-w-3xl mx-auto mt-20 space-y-8 px-2">
        <h2 className="text-2xl font-black">Часті питання</h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>Чому час роботи менший, ніж заявлено?</AccordionTrigger>
            <AccordionContent>
              Виробники вказують ідеальну ємність. При роботі через розетку 220В частина енергії (10-15%) витрачається на роботу інвертора. Наш калькулятор це враховує.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      <footer className="max-w-2xl mx-auto py-10 text-center border-t mt-10 dark:border-slate-800">
        <Link href="/privacy" className="text-xs text-muted-foreground hover:text-primary transition-colors">
          Політика конфіденційності
        </Link>
      </footer>
      <ChatBot />
    </main>
  );
}