"use client";

import { LucideIcon, ChevronUp, ChevronDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface ApplianceCardProps {
  id: string;
  name: string;
  power: number;
  quantity: number;
  icon: LucideIcon;
  isActive: boolean;
  onToggle: () => void;
  onQuantityChange: (delta: number) => void;
  onPowerChange: (newPower: number) => void;
  onNameChange: (newName: string) => void;
}

const POWER_PRESETS: Record<string, number[]> = {
  laptop: [45, 65, 90, 100],
  router: [5, 10, 15, 20],
  lamp: [5, 9, 12, 15],
  fridge: [80, 120, 150, 200],
  tv: [40, 60, 80, 120],
  fan: [30, 45, 60],
  coffee: [800, 1200, 1450],
  washingm: [2000, 2400],
  microwave: [600, 800, 1000, 1100, 1200]
} 

export function ApplianceCard({
  id,
  name,
  power,
  quantity,
  icon: Icon,
  isActive,
  onToggle,
  onQuantityChange,
  onPowerChange,
  onNameChange,
}: ApplianceCardProps) {
  const[isCustom, setIsCustom] = useState(false);
  const presets = POWER_PRESETS[id] || [power];
  const[isEditingName, setIsEditingName] = useState(false);

  return (
    <Card className={`transition-all border-2 ${isActive ? "border-primary bg-primary/5 shadow-sm" : "border-transparent"}`}>
      <CardContent className="p-4 flex items-center justify-between gap-4">
        
        {/* ЛІВА ЧАСТИНА: Іконка + Текст */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className={`p-2 rounded-xl flex-shrink-0 ${isActive ? "bg-primary text-white" : "bg-slate-100 text-slate-400"}`}>
            <Icon size={20} />
          </div>

          <div className="truncate">
            {isEditingName ? (
              <Input
                autoFocus
                className="h-7 w-full  text-sm font-bold p-1 border-primary"
                defaultValue={power || ""}
                onBlur={(e) => {
                  onNameChange?.(e.target.value || name);
                  setIsEditingName(false);
                }}
                onKeyDown={(e) => {
                  if(e.key === 'Enter') {
                    onNameChange?.(e.currentTarget.value || name);
                    setIsEditingName(false);
                  }
                }}
              />
            ) : (
              <h3 
                onClick={() => setIsEditingName(true)}
                className="text-sm font-bold text-slate-900 truncate cursor-pointer hover:text-primary flex items-center gap-1 group/name"
              >
                {name}
                <span className="opacity-0 group-hover/name:opacity-50 text-[10px] ">✎</span>
              </h3> 
            )}
            {/* Вибір потужності */}
            <div onClick={(e) => e.stopPropagation()} className="mt-1">
              {isCustom ? (
                <Input
                type="number"
                className="h-6 w-20 text-[10px] p-1"
                defaultValue={power || ""}
                autoFocus
                onBlur={(e) => {
                  onPowerChange(Number(e.target.value));
                  setIsCustom(false);
                }}
                onKeyDown={(e) => {
                  if(e.key === 'Enter') {
                    onPowerChange(Number(e.currentTarget.value));
                    setIsCustom(false);
                  }
                }}
                />
              ) : (
                <Select
                  value={String(power)}
                  onValueChange={(val) => {
                    if(val === "custom") setIsCustom(true);
                    else onPowerChange(Number(val));
                  }}
                >
                  <SelectTrigger className="h-5 w-fit border-none p-0 bg-transperent text=[10px] text-slate-500 hover:text-primary transition-colors focus: ring-0">
                    <SelectValue placeholder={`${power} Вт`} />
                  </SelectTrigger>
                <SelectContent>
                  {presets.map((p, i) => (
                    <SelectItem key={`${id}-${p}-${i}`} value={String(p)}>{p} Вт</SelectItem>
                  ))}
                  <SelectItem value="custom" className="text-primary font-bold">Своє значення...</SelectItem>
                </SelectContent>
              </Select>
              )}
            </div>
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