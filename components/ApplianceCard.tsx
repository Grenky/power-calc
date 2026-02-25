import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
// import { Icon, LucideIcon } from "lucide-react";


interface ApplianceCardProps {
    name: string;
    power: number;
    icon: React.ElementType;
    isActive: boolean;
    onToggle: () => void;
}


export function ApplianceCard({name, power, icon: Icon, isActive, onToggle}: ApplianceCardProps) {
    return(
        <Card className={`transition-all ${isActive ? 'border-primary ring-1 ring-primary' : 'opacity-70'}`}>
            <CardContent className="p-4 flex item-center justify-between">
                <div className="flex items0center gap-3">
                    <div className="p-2 bg-secondary rounded-lg">
                        <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <p className="font-medium text-sm">{name}</p>
                        <p className="text-xs text-muted-foreground">{power} Вт</p>
                    </div>
                </div>
                <Switch checked={isActive} onCheckedChange={onToggle} />
            </CardContent>
        </Card>
    )
}