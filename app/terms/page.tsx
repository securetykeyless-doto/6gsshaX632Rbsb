'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function TermsAndPrivacyPage() {
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [lang, setLang] = useState<'uk' | 'en'>('uk')

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} transition-colors duration-300 py-12 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Шапка зі зручними перемикачами */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-800">
          <Link href="/" className="text-xs text-indigo-400 hover:text-indigo-300 font-medium">
            {lang === 'uk' ? '← На головну' : '← Home'}
          </Link>
          
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setLang(lang === 'uk' ? 'en' : 'uk')}
              className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition ${
                isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {lang === 'uk' ? '🇺🇦 UA' : '🇬🇧 EN'}
            </button>

            <button
              type="button"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition ${
                isDarkMode ? 'bg-slate-900 border-slate-800 text-amber-400 hover:bg-slate-800' : 'bg-white border-slate-300 text-indigo-600 hover:bg-slate-100'
              }`}
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>

        {/* Заголовок */}
        <div className="space-y-2 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent">
            {lang === 'uk' ? 'Правила та Політика Конфіденційності' : 'Terms & Privacy Policy'}
          </h1>
          <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            {lang === 'uk' ? 'Останнє оновлення: Липень 2026 р.' : 'Last update: July 2026'}
          </p>
        </div>

        {/* Основний контент */}
        <div className={`space-y-6 p-6 sm:p-8 rounded-2xl border ${isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-xl'} backdrop-blur-md text-xs leading-relaxed`}>
          
          {/* Секція 1 */}
          <section className="space-y-2">
            <h2 className="text-sm font-bold text-indigo-400">
              {lang === 'uk' ? '1. Загальні положення' : '1. General Provisions'}
            </h2>
            <p className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>
              {lang === 'uk'
                ? 'Цей документ визначає правила користування платформою для збору донатів через криптовалютні мережі, а також принципи обробки та захисту даних користувачів і стрімерів.'
                : 'This document defines the rules for using the platform for collecting donations via cryptocurrency networks, as well as the principles of processing and protecting user and streamer data.'}
            </p>
          </section>

          <hr className={isDarkMode ? 'border-slate-800' : 'border-slate-200'} />

          {/* Секція 2 */}
          <section className="space-y-2">
            <h2 className="text-sm font-bold text-indigo-400">
              {lang === 'uk' ? '2. Умови здійснення транзакцій' : '2. Transaction Conditions'}
            </h2>
            <p className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>
              {lang === 'uk'
                ? 'Усі криптовалютні транзакції здійснюються безпосередньо через блокчейн-мережі (Base, Arbitrum, Ethereum, Solana, Tron тощо). Платформа не зберігає приватні ключі користувачів та не несе відповідальності за комісії мережі (gas fees) чи помилкові перекази на невірні адреси.'
                : 'All cryptocurrency transactions are processed directly via blockchain networks (Base, Arbitrum, Ethereum, Solana, Tron, etc.). The platform does not store user private keys and is not responsible for network gas fees or erroneous transfers to incorrect addresses.'}
            </p>
          </section>

          <hr className={isDarkMode ? 'border-slate-800' : 'border-slate-200'} />

          {/* Секція 3 */}
          <section className="space-y-2">
            <h2 className="text-sm font-bold text-indigo-400">
              {lang === 'uk' ? '3. Комісії та розподіл коштів' : '3. Fees and Fund Distribution'}
            </h2>
            <p className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>
              {lang === 'uk'
                ? 'Платформа може утримувати комісійну винагороду з надходжень для забезпечення стабільної роботи сервісу та підтримки інфраструктури (стандартний розподіл становить 95% власнику/стрімеру та 5% на забезпечення платформи, якщо не узгоджено інше).'
                : 'The platform may retain a commission fee from incoming funds to ensure stable service operation and infrastructure support (the standard distribution is 95% to the owner/streamer and 5% for platform maintenance, unless otherwise agreed).'}
            </p>
          </section>

          <hr className={isDarkMode ? 'border-slate-800' : 'border-slate-200'} />

          {/* Секція 4 */}
          <section className="space-y-2">
            <h2 className="text-sm font-bold text-indigo-400">
              {lang === 'uk' ? '4. Конфіденційність та безпека даних' : '4. Privacy and Data Security'}
            </h2>
            <p className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>
              {lang === 'uk'
                ? 'Ми збираємо мінімально необхідні дані для роботи сервісу (імена стрімерів, публічні адреси гаманців, налаштування алертів та повідомлення донатів). Ми не передаємо ваші персональні дані третім особам.'
                : 'We collect the minimum necessary data for the service to function (streamer usernames, public wallet addresses, alert settings, and donation messages). We do not transfer your personal data to third parties.'}
            </p>
          </section>

          <hr className={isDarkMode ? 'border-slate-800' : 'border-slate-200'} />

          {/* Секція 5 */}
          <section className="space-y-2">
            <h2 className="text-sm font-bold text-indigo-400">
              {lang === 'uk' ? '5. Зміни до правил' : '5. Changes to the Rules'}
            </h2>
            <p className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>
              {lang === 'uk'
                ? 'Адміністрація залишає за собою право в будь-який момент оновлювати чи змінювати ці правила. Продовження користування сайтом означає вашу згоду з новими умовами.'
                : 'The administration reserves the right to update or modify these rules at any time. Continued use of the site signifies your agreement to the new terms.'}
            </p>
          </section>

        </div>

      </div>
    </div>
  )
}