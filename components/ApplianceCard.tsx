"use client";

import { LucideIcon, ChevronUp, ChevronDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

interface ApplianceCardProps {
  id: string;
  name: string;
  power: number;
  quantity: number;
  icon: LucideIcon;
  isActive: boolean;
  onToggle: () => void;
  onQuantityChange: (delta: number) => void;
}

export function ApplianceCard({
  name,
  power,
  quantity,
  icon: Icon,
  isActive,
  onToggle,
  onQuantityChange,
}: ApplianceCardProps) {
  return (
    <Card className={`transition-all border-2 ${isActive ? "border-primary bg-primary/5 shadow-sm" : "border-transparent"}`}>
      <CardContent className="p-4 flex items-center justify-between gap-4">
        
        {/* ЛІВА ЧАСТИНА: Іконка + Текст */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className={`p-2 rounded-xl flex-shrink-0 ${isActive ? "bg-primary text-white" : "bg-slate-100 text-slate-400"}`}>
            <Icon size={20} />
          </div>
          <div className="truncate">
            <p className="text-sm font-bold leading-tight truncate">{name}</p>
            <p className="text-[10px] text-slate-500">{power} Вт</p>
          </div>
        </div>

        {/* лічильник */}
        <div className="flex flex-col items-center gap-0.5 flex-shrink-0 mx-2" onClick={(e) => e.stopPropagation()}>
          <button 
            onClick={() => onQuantityChange(1)}
            className="text-slate-400 hover:text-primary transition-colors"
          >
            <ChevronUp size={16} />
          </button>
          
          <div className="w-8 h-8 border-2 border-slate-200 rounded-lg flex items-center justify-center font-bold text-sm text-slate-700 bg-white">
            {quantity}
          </div>

          <button 
            onClick={() => onQuantityChange(-1)}
            className="text-slate-400 hover:text-primary transition-colors"
          >
            <ChevronDown size={16} />
          </button>
        </div>

        {/* Switch */}
        <div className="flex-shrink-0" onClick={(e) => e.stopPropagation()}>
          <Switch 
            checked={isActive} 
            onCheckedChange={onToggle} 
          />
        </div>

      </CardContent>
    </Card>
  );
}