import Link from "next/link";


export default function PrivacyPolicy() {
    return(
        <main className="max-w-3xl mx-auto px-6 py-12 font-sans text-slate-700">
            <Link href="/" className="text-blue-600 hover:underline mb-8 inline-block">← Повернутися до канкулятора</Link>

            <h1 className="text-3xl font-bold text-slate-900 mb-6">Політика конфіденційності</h1>

            <section className="space-y-4">
                <p>Ця Політика конфіденційності описує, як ми збираємо та використовуємо інформацію на сайті<strong>Power Calc</strong>.</p>

                <h2 className="text-xl font-semibold text-slate-900 mt-8">1. Збір даних</h2>
                <p>Ми не збираємо жодних персональних даних (імена, адреси, телефони). Наш калькулятор працює виключно на стороні вашого браузера.</p>

                <h2 className="text-xl font-semibold text-slate-900 mt-8">2. Файли Cookie та Реклама</h2>
                <p>Ми використовуємо сторонні сервіси, такі як Google AdSense, які можуть використовувати файли cookie для показу релевантної реклами на основі ваших попередніх відвідувань цього чи інших сайтів.</p>

                <h2 className="text-xl font-semibold text-slate-900 mt-8">3. Google Analytics</h2>
                <p>Ми можемо використовувати Google Analytics для аналізу трафіку, щоб зрозуміти, наскільки зручний наш сервіс для користувачів. Ці дані є анонімними.</p>

                <h2 className="text-xl font-semibold text-slate-900 mt-8">4. Згода</h2>
                <p>Користуючись нашим сайтом, ви погоджуєтесь з умовами цієї Політики конфіденційності.</p>
            </section>

            <footer className="mt-12 text-sm text-slate-400 border-t pt-6">
                Останнє оновлення: {new Date().toLocaleDateString('uk-UA')}
            </footer>
        </main>
    );
}