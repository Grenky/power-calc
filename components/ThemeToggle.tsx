"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
    const {theme, setTheme} = useTheme();
    const [mounted, setMounted] = useState(false);


    useEffect(() =>{
        setMounted(true);
    }, []);

    if(!mounted) return null;

    return(
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex items-center justify-center p-3 rounded-2xl
                       bg-white dark:bg-slate-800
                       border border-slate-200 dark:border-slate-700
                       shadow-sm hover-md
                       transition-all duration-200 group"
        aria-label="Перемкнути тему"
        >
            {theme === "dark" ? (
                <Sun className="w-5 h-5 text-yellow-400 group-hover:rotate-45 transition-transform" />
                ) : ( 
                <Moon className="w-5 h-5 text-yellow-600 group-hover:-rotate-12 transition-transform" />
            )}
        </button>
    )
}