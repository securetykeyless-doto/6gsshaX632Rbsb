'use client'

import { useState } from 'react'
import Link from 'next/link'

// Словник перекладів для сторінки підтримки
const translations: Record<string, any> = {
  en: {
    back: "← Home",
    platform: "Platform Support",
    title: "Support Platform Development 🚀",
    subtitle: "Donations go toward infrastructure costs, updates, and the development of new MultiChain Donate features.",
    selectNetwork: "Select Network:",
    walletLabel: "Wallet address for the selected network:",
    copiedMsg: "Address successfully copied to clipboard!",
    copyBtn: "Copy",
    scanPrompt: "Scan via your cryptocurrency wallet",
    footer: "MultiChain Donate Platform © 2026. All rights reserved.",
  },
  uk: {
    back: "← На головну",
    platform: "Підтримка платформи",
    title: "Підтримати розробку платформи 🚀",
    subtitle: "Донати спрямовуються на оплату інфраструктури, оновлення та розвиток нових функцій MultiChain Donate.",
    selectNetwork: "Оберіть мережу:",
    walletLabel: "Адреса гаманця для вибраної мережі:",
    copiedMsg: "Адресу успішно скопійовано в буфер обміну!",
    copyBtn: "Копіювати",
    scanPrompt: "Відскануйте через ваш криптовалютний гаманець",
    footer: "MultiChain Donate Platform © 2026. Усі права захищені.",
  },
  ru: {
    back: "← На главную",
    platform: "Поддержка платформы",
    title: "Поддержать разработку платформы 🚀",
    subtitle: "Донаты направляются на оплату инфраструктуры, обновления и развитие новых функций MultiChain Donate.",
    selectNetwork: "Выберите сеть:",
    walletLabel: "Адрес кошелька для выбранной сети:",
    copiedMsg: "Адрес успешно скопирован в буфер обмена!",
    copyBtn: "Копировать",
    scanPrompt: "Отсканируйте через ваш криптовалютный кошелек",
    footer: "MultiChain Donate Platform © 2026. Все права защищены.",
  },
  es: {
    back: "← Inicio",
    platform: "Apoyo a la plataforma",
    title: "Apoya el desarrollo de la plataforma 🚀",
    subtitle: "Las donaciones se destinan a costos de infraestructura, actualizaciones y desarrollo de nuevas funciones de MultiChain Donate.",
    selectNetwork: "Seleccionar red:",
    walletLabel: "Dirección de billetera para la red seleccionada:",
    copiedMsg: "¡Dirección copiada al portapapeles!",
    copyBtn: "Copiar",
    scanPrompt: "Escanea con tu billetera de criptomonedas",
    footer: "MultiChain Donate Platform © 2026. Todos los derechos reservados.",
  },
  pl: {
    back: "← Strona główna",
    platform: "Wsparcie platformy",
    title: "Wspomóż rozwój platformy 🚀",
    subtitle: "Darowizny przeznaczane są na koszty infrastruktury, aktualizacje oraz rozwój nowych funkcji MultiChain Donate.",
    selectNetwork: "Wybierz sieć:",
    walletLabel: "Adres portfela dla wybranej sieci:",
    copiedMsg: "Adres został pomyślnie skopiowany do schowka!",
    copyBtn: "Kopiuj",
    scanPrompt: "Zeskanuj za pomocą swojego portfela kryptowalut",
    footer: "MultiChain Donate Platform © 2026. Wszelkie prawa zastrzeżone.",
  },
  de: {
    back: "← Startseite",
    platform: "Plattform-Unterstützung",
    title: "Plattformentwicklung unterstützen 🚀",
    subtitle: "Spenden fließen in Infrastrukturkosten, Updates und die Entwicklung neuer MultiChain Donate-Funktionen.",
    selectNetwork: "Netzwerk auswählen:",
    walletLabel: "Wallet-Adresse für das ausgewählte Netzwerk:",
    copiedMsg: "Adresse erfolgreich in die Zwischenablage kopiert!",
    copyBtn: "Kopieren",
    scanPrompt: "Scannen Sie mit Ihrem Krypto-Wallet",
    footer: "MultiChain Donate Platform © 2026. Alle Rechte vorbehalten.",
  },
  fr: {
    back: "← Accueil",
    platform: "Support de la plateforme",
    title: "Soutenir le développement de la plateforme 🚀",
    subtitle: "Les dons servent à couvrir les frais d'infrastructure, les mises à jour et le développement de nouvelles fonctionnalités.",
    selectNetwork: "Sélectionner le réseau :",
    walletLabel: "Adresse du portefeuille pour le réseau sélectionné :",
    copiedMsg: "Adresse copiée dans le presse-papiers !",
    copyBtn: "Copier",
    scanPrompt: "Scannez via votre portefeuille de cryptomonnaies",
    footer: "MultiChain Donate Platform © 2026. Tous droits réservés.",
  },
}

const networks = [
  { id: 'base', name: 'Base (L2)', token: 'USDC / ETH' },
  { id: 'arbitrum', name: 'Arbitrum One', token: 'USDC / ETH' },
  { id: 'ethereum', name: 'Ethereum Mainnet', token: 'USDC / ETH' },
  { id: 'solana', name: 'Solana', token: 'USDC / SOL' },
  { id: 'tron', name: 'Tron', token: 'USDT (TRC20)' },
]

export default function PlatformDonatePage() {
  const [selectedNetwork, setSelectedNetwork] = useState(networks[0].id)
  const [copied, setCopied] = useState(false)
  const [lang, setLang] = useState<'en' | 'uk' | 'ru' | 'es' | 'pl' | 'de' | 'fr'>('uk')
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  const t = translations[lang] || translations.en
  const walletAddress = '1111111111111111111111'

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))
  }

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(walletAddress)}&bgcolor=${theme === 'dark' ? '0f172a' : 'ffffff'}&color=${theme === 'dark' ? 'ffffff' : '0f172a'}`

  return (
    <main className={`min-h-screen transition-colors duration-300 flex flex-col items-center justify-between p-6 ${
      theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Шапка */}
      <header className={`w-full max-w-xl flex justify-between items-center py-4 border-b ${
        theme === 'dark' ? 'border-slate-900' : 'border-slate-200'
      }`}>
        <Link href="/" className="text-xs text-indigo-500 hover:text-indigo-400 font-medium">
          {t.back}
        </Link>

        {/* Перемикач мови та теми */}
        <div className="flex items-center space-x-2">
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value as any)}
            className={`text-xs px-2 py-1.5 rounded-lg border outline-none font-medium transition ${
              theme === 'dark' 
                ? 'bg-slate-900 border-slate-700 text-slate-200' 
                : 'bg-white border-slate-300 text-slate-700'
            }`}
          >
            <option value="uk">UA</option>
            <option value="en">EN</option>
            <option value="ru">RU</option>
            <option value="es">ES</option>
            <option value="pl">PL</option>
            <option value="de">DE</option>
            <option value="fr">FR</option>
          </select>

          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg border text-xs transition ${
              theme === 'dark' 
                ? 'bg-slate-900 border-slate-700 hover:bg-slate-800 text-amber-400' 
                : 'bg-white border-slate-300 hover:bg-slate-100 text-indigo-600'
            }`}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      {/* Головний блок */}
      <div className="max-w-xl w-full my-auto py-10 space-y-8 text-center">
        <div className="space-y-3">
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-500 to-emerald-500 bg-clip-text text-transparent">
            {t.title}
          </h1>
          <p className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
            {t.subtitle}
          </p>
        </div>

        {/* Вибір мережі */}
        <div className="space-y-3 text-left">
          <label className={`text-xs font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
            {t.selectNetwork}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {networks.map((net) => (
              <button
                key={net.id}
                onClick={() => setSelectedNetwork(net.id)}
                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                  selectedNetwork === net.id
                    ? theme === 'dark' 
                      ? 'bg-slate-900 border-indigo-500 shadow-lg shadow-indigo-500/10' 
                      : 'bg-white border-indigo-500 shadow-md'
                    : theme === 'dark' 
                      ? 'bg-slate-900/40 border-slate-800 hover:bg-slate-900/80 hover:border-slate-700' 
                      : 'bg-white/80 border-slate-200 hover:bg-white hover:border-slate-300'
                }`}
              >
                <span className={`text-xs font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{net.name}</span>
                <span className="text-[10px] text-indigo-500 mt-1">{net.token}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Блок з гаманцем та QR-кодом */}
        <div className={`p-6 rounded-2xl border backdrop-blur-md space-y-6 shadow-2xl ${
          theme === 'dark' ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="space-y-2 text-left">
            <span className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>{t.walletLabel}</span>
            <div 
              onClick={handleCopy}
              className={`p-3 rounded-xl font-mono text-xs text-indigo-400 break-all cursor-pointer transition relative group border ${
                theme === 'dark' 
                  ? 'bg-slate-950 border-slate-800 hover:border-indigo-500/50' 
                  : 'bg-slate-50 border-slate-200 hover:border-indigo-400'
              }`}
              title="Натисніть, щоб скопіювати"
            >
              {walletAddress}
              <span className={`absolute right-2 top-2 text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition ${
                theme === 'dark' ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-700'
              }`}>
                {copied ? '✓' : t.copyBtn}
              </span>
            </div>
            {copied && <p className="text-[10px] text-emerald-500 font-medium">{t.copiedMsg}</p>}
          </div>

          {/* QR код */}
          <div className="flex flex-col items-center space-y-3 pt-2">
            <div className={`p-3 rounded-2xl border shadow-inner inline-block ${
              theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
            }`}>
              <img 
                src={qrCodeUrl} 
                alt="Wallet QR Code" 
                className="w-36 h-36 rounded-xl object-contain"
              />
            </div>
            <span className={`text-[10px] ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>{t.scanPrompt}</span>
          </div>
        </div>
      </div>

      {/* Футер */}
      <footer className={`w-full max-w-xl text-center py-6 border-t text-[10px] ${
        theme === 'dark' ? 'border-slate-900 text-slate-500' : 'border-slate-200 text-slate-400'
      }`}>
        {t.footer}
      </footer>
    </main>
  )
}