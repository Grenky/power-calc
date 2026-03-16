"use client";

import { useState } from "react";
import { MessageCircle, X, Send, Bot } from "lucide-react";

export default function ChatBot() {
    const[isOpen, setIsOpen] = useState(false);
    const[input, setInput] = useState("");
    const[messages, setMessage] = useState<{role: string; content: string}[]>([]);
    const[isLoading, setIsLOading] = useState(false);

    const sendMessage = async () => {
        if(!input.trim()) return;

        const userMsg = {role: "user", content: input};
        setMessage((prev => [...prev, userMsg]));
        setInput("");
        setIsLOading(true);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({ messages: [...messages, userMsg] }),
            });
            const data = await res.json();
            setMessage((prev) => [...prev, { role: "assistant", content: data.text }]);
        } catch (e) {
            setMessage((prev) => [...prev, { role: "assistant", content: "Помилка мережі."}]);
        } finally {
            setIsLOading(false);
        }
    };


    return(
        <div className="fixed bottom-6 right-6 z-50 font-sans">
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-cyan-500 hover:bg-cyan-600 text-white p-4 rounded-full shadow-2xl transitin-all hover: scale-110 active:scale-95 cursor-pointer"
                    >
                        <MessageCircle size={28} />
                    </button>
            )}
            {isOpen && (
                <div className="bg-slate-900 border border-slate-800 w-80 sm:w-96 h-[500px] rounded-2xl flex flex-col oveflow-hidden animate-in slide-in-from-bottom-5">
                    <div className="bg-slate-800 p-4 flex jusify-between items-center border-b border-white/5">
                        <div className="flex items-center gap-2 text-cyan-400">
                            <Bot size={20} />
                            <span className="font-bold text-sm tracking-widest uppercase">PowerCalc AI Assistent</span>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
                            <X size={24} />
                        </button>
                    </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.length === 0 && (
                        <p className="text-slate-500 text-xs text-center mt10">
                            Запитайте мене про будь-яку модель EcoFlow або Bluetti
                        </p>
                    )}
                    {messages.map((m, i) => (
                        <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                            <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                                m.role === "user" ? "bg-cyan-600 text-white" : "bg-slate-800 text-slate-200"
                            }`}>
                                {m.content}
                            </div>
                        </div>
                    ))}
                    {isLoading && <div className="text-cyan-500 text-xs animate-pulse">Бот думає...</div>}
                </div>
                <div className="p-4 bg-slate-800/50 border-t border-white/5 flex gap-2">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        placeholder="Яка ємність у Delta 2?"
                        className="flex-1 bg-slate-900 border-none rounded-xl px-3 py-2 text-sm focus:ring-1 focus:ring-cyan-500 outline-none text-white"
                    />
                    <button onClick={sendMessage} className="bg-cyan-500 p-2 rounded-xl text-white cursor-pointer">
                        <Send size={18} />
                    </button>
                </div>
            </div>
            )}
        </div>
    );
}