"use client";

import { useEffect, useState } from "react";
import { Laptop, Wifi, Lightbulb, Snowflake, Tv, Fan, Coffee, WashingMachine, Microwave, Trash2 } from "lucide-react";
import { ApplianceCard } from "@/components/ApplianceCard";
import { Slider } from "@/components/ui/slider";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
  {id: "fan", name: "Вентилятор", power: 45, quantity: 1, icon: Fan},
  {id: "coffee", name: "Кавомашина", power: 1200, quantity: 1, icon: Coffee},
  {id: "washingm", name: "Пральна Машина", power: 2400, quantity: 1, icon: WashingMachine},
  {id: "microwave", name: "Мікрохвильовка", power: 1100, quantity: 1, icon: Microwave},
];

export default function Home() {
const[capacity, setCapacity] = useState(512);
const[mounted, setMounted] = useState(false);
const[appliances, setAppliances] = useState<Appliance[]>(() => {
    if(typeof window === "undefined") return INITIAL_APPLIANCES.map(app => ({...app, isActive: false}));

    const saved = localStorage.getItem('user-appliances');
    if(saved) {
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

const isOverloaded = totalPower > capacity;

const runtimeHours = totalPower > 0 ? (capacity * 0.85) / totalPower : 0;

const formatTime = (decimalHours: number) => {
  if(decimalHours === 0) return "0 год";
  const h = Math.floor(decimalHours);
  const m = Math.round((decimalHours - h ) * 60);
  return m > 0 ? `${h} год ${m} хв` : `${h} год`;
}


const addCustomAppliance = () => {
  const newApp = {
    id: `custom-${Date.now()}`,
    name: "Мій пристрій",
    power: 0,
    quantity: 1,
    isActive: true,
    icon: Lightbulb,
  }
  setAppliances((prev) => [...prev, newApp]);
}


useEffect(() => {
  if(mounted) {
    localStorage.setItem('user-appliances', JSON.stringify(appliances));
  }
}, [appliances ,mounted]);  

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
          Ми автоматично врахували <strong>15%</strong> втрат енергії на роботу інвертора. Це робить наш прогноз набагато точнішим за стандартні калькулятори.
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
      <div className="w-full mx-auto mt-12 w-[calc(100%-3rem)] max-w-2xl space-y-4">
        <div className={`p-6 rounded-2xl shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 border-t transition-colors duration-500 ${
          isOverloaded
          ? "bg-red-600 text-white border-red-400"
          : "bg-primary text-primary-foreground border-white/10"
        }`}>
          <div className="text-center sm:text-left">
              <p className="text-xs uppercase tracking-widest opacity-70">
                {isOverloaded ? "Перевантаження!": "Залишилось часу"}
              </p>
              <p className="text-4xl font-black">
                {isOverloaded ? "⚠" : formatTime(runtimeHours)}
              </p>
          </div>
          <div className="h-px sm:h-12 w-full sm:w-px bg-white/20" />
          <div className="text-center sm:text-right">
            <p className="text-xs uppercase tracking-widest opacity-70">Навантаження</p>
            <p className="text-2xl font-bold">{totalPower} Вт</p>
          </div>
        </div>
        {/* Сповіщення-порада */}
        {isOverloaded && (
          <div className="bg-red-50 border-2 border-red-200 p-4 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
            <span className="text-2xl">⚠</span>
            <div className="space-y-1">
              <p className="text-sm font-bold text-red-700 leading-snug">
                Загальна потужність приладів ({totalPower} Вт) перевищує можливості станції ємністю {capacity} Вт·год. 
                Більшість станцій такого класу мають інвертор до {capacity} Вт. Спробуйте вимкнути потужні прилади (кавомашину, фен) або оберіть станцію більшої ємності.
              </p>
            </div>
          </div>
        )}
      </div>
      {/* Список приладів */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {appliances.map((app: Appliance) => (
        <div key={app.id} className="relative group">
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
          className="absolute -top-2 -right-2 bg-white text-red-500 p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all border border-red-100 hover:bg-red-50 z-10"
          title="Видалити прилад"
          >
          <Trash2 size={14} />
          </button>
          )}
          </div>
        ))}
        <button
          onClick={addCustomAppliance}
          className="flex felx-col items-center justify-center p-6 border-2 border-dashed border-slate-300 rounded-3xl hover:border-primary hover:bg-primary/5 transition-all group min-h-[140px] bg-slate-50/40"
        >
          <div className="w-14 h-14 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all mb-4 border border-slate-100">
            <span className="text-3xl font-light leading-none relative -top-[3px]">+</span>
          </div>
          <div className="text-center space-y-1 ml-5">
            <p className="text-xs font-black text-slate-500 uppercase tracking-[0.1em] group-hover:text-primary transition-colors">
              Додати свій
            </p>
            <p className="text-[10px] text-slate-400 font-medium">Тільки для вас</p>
          </div>
        </button>
      </div>
      <section className="max-w-3xl mx-auto mt-20 space-y-8 px-2">
        <div className="space-y-4">
          <h2 className="text-2xl font-black ">Часті питання про роботу зарядних станцій</h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            Розрахунок часу роботи EcoFlow, Bluetti чи Jackery залежить від багатьох факторів.
            Наш калькулятор враховує реальні умови експлуатації, щоб ви не залишилися без світла в невідповідний момент.
          </p>
        </div>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-left">Чому час роботи менший, ніж заявлено виробником?</AccordionTrigger>
          <AccordionContent className="text-slate-600 leading-relaxed">
            Виробники вказують ідеальну ємність акумулятора. Проте при роботі через розетку 220В частина енергії 
            (близько 10-15%) витрачається на роботу самого інвертора, який перетворює постійний струм у змінний. 
            Наш калькулятор автоматично враховує ці втрати для вашої точності.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger className="text-left">Скільки Вт споживає звичайний холодильник?</AccordionTrigger>
            <AccordionContent className="text-scale-600">
              У середньому сучасний холодильник споживає 100-150 Вт, але лише коли працює компресор. 
              У режимі очікування споживання мінімальне. Для розрахунку ми рекомендуємо ставити середнє значення 120 Вт.
            </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger className="text-left">Чи можна підключати кавомашину чи чайник?</AccordionTrigger>
          <AccordionContent className="text-scale-600">
            Лише якщо номінальна потужність вашої станції вища за потужність приладу. 
            Більшість чайників споживають 1500-2200 Вт. Якщо у вас станція типу EcoFlow River (600 Вт), 
            вона просто вимкнеться через перевантаження.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4">
          <AccordionTrigger className="text-left">Як дізнатися точну потужність мого пристрою?</AccordionTrigger>
          <AccordionContent className="text-scale-600">
            Подивіться на блок живлення або наклейку на самому пристрої (параметр Input або Power). 
            Наприклад, блоки живлення ноутбуків зазвичай мають маркування 45W, 65W або 90W. Ви можете ввести 
            це значення вручну в нашому калькуляторі.
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="bg-slate-900 text-white p-8 rounded-3xl space-y-4 shadow-xl">
        <h3 className="text-lg font-bold">💡 Порада для економії</h3>
        <p className="text-slate-300 text-sm leading-relaxed">
          Щоб станція працювала довше, заряджайте гаджети (телефони, планшети) напряму через порти USB або Type-C. 
          Це дозволяє уникнути втрат на роботі інвертора 220В, що додасть вам ще 30-60 хвилин роботи.
        </p>
      </div>
      </section>
      
      <footer className="max-w-2xl mx-auto py-10 text-center border-t mt-10">
        <Link href="/privacy" className="text-xs text-muted-foreground hover:text-primary transition-colors">
          Політика конфіденційності
        </Link>
      </footer>
    </main>  
  );
}
