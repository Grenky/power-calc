import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        if (!messages || messages.length === 0) {
            return NextResponse.json({ error: "Повідомлення відсутні" }, { status: 400 });
        }

        const lastMessage = messages[messages.length - 1].content;
        const apiKey = process.env.GOOGLE_API_KEY;

        if (!apiKey) {
            throw new Error("API ключ не знайдено в .env.local");
        }

        const systemPrompt = "Ти спеціаліст із зарядних станцій EcoFlow та Bluetti. Відповідай українською мовою. Допомагай користувачу розрахувати час роботи приладів від станцій.";

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent?key=${apiKey}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                { 
                                    text: `${systemPrompt}\n\nКористувач запитує: ${lastMessage}` 
                                }
                            ],
                        },
                    ],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 1000,
                    },
                }),
            }
        );

        const data = await response.json();

        if (data.error) {
            console.error("Google API Error:", data.error);
            throw new Error(data.error.message);
        }

        if (!data.candidates || !data.candidates[0]?.content?.parts[0]?.text) {
            throw new Error("Модель повернула порожню відповідь");
        }

        const aiText = data.candidates[0].content.parts[0].text;

        return NextResponse.json({ text: aiText });

    } catch (error: any) {
        console.error("DEBUG ERROR:", error);
        
        return NextResponse.json({ 
            text: `Помилка Power AI: ${error.message}` 
        }, { status: 200 }); 
    }
} // <--- Закриваюча дужка функції POST