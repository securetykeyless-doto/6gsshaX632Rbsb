'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

// Словник перекладів
const translations: Record<string, any> = {
  en: {
    title: "Receive Crypto Donations Easily & Securely",
    subtitle: "Supports Base, Arbitrum, Ethereum, Solana, and Tron. Create your unique page and OBS widget in a few clicks.",
    createBtn: "Create Donation Page",
    dashboard: "Streamer Dashboard",
    login: "Log In / Create Profile",
    activeStreamers: "Active Platform Streamers:",
    noStreamers: "No registered streamers yet. Be the first!",
    loading: "Loading list...",
    partnersTitle: "Compatible Platforms",
    partnersSubtitle: "Instant alerts via OBS Browser Source",
    termsLink: "Terms & Privacy Policy",
    supportLink: "Support Platform ☕",
  },
  uk: {
    title: "Отримуй донати у крипті легко та безпечно",
    subtitle: "Підтримуються мережі Base, Arbitrum, Ethereum, Solana та Tron. Створи свою унікальну сторінку та віджет для OBS за пару кліків.",
    createBtn: "Створити сторінку донатів",
    dashboard: "Мій кабінет стрімера",
    login: "Увійти / Створити профіль",
    activeStreamers: "Активні стрімери платформи:",
    noStreamers: "Ще немає зареєстрованих стрімерів. Будь першим!",
    loading: "Завантаження списку...",
    partnersTitle: "Сумісні платформи",
    partnersSubtitle: "Миттєві алерти через OBS Browser Source",
    termsLink: "Правила та Політика конфіденційності",
    supportLink: "Підтримати платформу ☕",
  },
  ru: {
    title: "Получайте донаты в крипте легко и безопасно",
    subtitle: "Поддерживаются сети Base, Arbitrum, Ethereum, Solana и Tron. Создайте свою уникальную страницу и виджет для OBS в пару кликов.",
    createBtn: "Создать страницу донатів",
    dashboard: "Кабинет стримера",
    login: "Войти / Создать профиль",
    activeStreamers: "Активные стримеры платформы:",
    noStreamers: "Еще нет зарегистрированных стримеров. Будь первым!",
    loading: "Загрузка списка...",
    partnersTitle: "Совместимые платформы",
    partnersSubtitle: "Мгновенные алерты через OBS Browser Source",
    termsLink: "Правила и Политика конфиденциальности",
    supportLink: "Поддержать платформу ☕",
  },
  es: {
    title: "Recibe donaciones en criptomonedas de forma fácil y segura",
    subtitle: "Compatible con Base, Arbitrum, Ethereum, Solana y Tron. Crea tu página única y widget para OBS en pocos clics.",
    createBtn: "Crear página de donaciones",
    dashboard: "Panel de Streamer",
    login: "Iniciar sesión / Crear perfil",
    activeStreamers: "Streamers activos de la plataforma:",
    noStreamers: "Aún no hay streamers registrados. ¡Sé el primero!",
    loading: "Cargando lista...",
    partnersTitle: "Plataformas compatibles",
    partnersSubtitle: "Alertas instantáneas a través de OBS Browser Source",
    termsLink: "Términos y Política de Privacidad",
    supportLink: "Apoyar la plataforma ☕",
  },
  pl: {
    title: "Otrzymuj dotacje krypto łatwo i bezpiecznie",
    subtitle: "Obsługuje Base, Arbitrum, Ethereum, Solana i Tron. Stwórz swoją unikalną stronę i widżet OBS w kilka kliknięć.",
    createBtn: "Utwórz stronę dotacji",
    dashboard: "Panel Streamera",
    login: "Zaloguj się / Utwórz profil",
    activeStreamers: "Aktywni streamerzy platformy:",
    noStreamers: "Brak zarejestrowanych streamerów. Bądź pierwszy!",
    loading: "Ładowanie listy...",
    partnersTitle: "Kompatybilne platformy",
    partnersSubtitle: "Natychmiastowe alerty przez OBS Browser Source",
    termsLink: "Regulamin i Polityka Prywatności",
    supportLink: "Wspomóż platformę ☕",
  },
  de: {
    title: "Erhalte Krypto-Spenden einfach und sicher",
    subtitle: "Unterstützt Base, Arbitrum, Ethereum, Solana und Tron. Erstelle deine eigene Seite und OBS-Widget mit wenigen Klicks.",
    createBtn: "Spendenseite erstellen",
    dashboard: "Streamer-Dashboard",
    login: "Anmelden / Profil erstellen",
    activeStreamers: "Aktive Plattform-Streamer:",
    noStreamers: "Noch keine Streamer registriert. Sei der Erste!",
    loading: "Liste wird geladen...",
    partnersTitle: "Kompatible Plattformen",
    partnersSubtitle: "Sofortige Benachrichtigungen über OBS Browser Source",
    termsLink: "AGB & Datenschutzrichtlinie",
    supportLink: "Plattform unterstützen ☕",
  },
  fr: {
    title: "Recevez des dons en crypto facilement et en toute sécurité",
    subtitle: "Prend en charge Base, Arbitrum, Ethereum, Solana et Tron. Créez votre page unique et votre widget OBS en quelques clics.",
    createBtn: "Créer une page de dons",
    dashboard: "Tableau de bord",
    login: "Connexion / Créer un profil",
    activeStreamers: "Streamers actifs de la plateforme :",
    noStreamers: "Aucun streamer enregistré pour le moment. Soyez le premier !",
    loading: "Chargement de la liste...",
    partnersTitle: "Plateformes compatibles",
    partnersSubtitle: "Alertes instantanées via OBS Browser Source",
    termsLink: "Conditions et Politique de Confidentialité",
    supportLink: "Soutenir la plateforme ☕",
  },
}

const platforms = [
  { name: 'Twitch', color: 'from-purple-950/60 to-purple-900/40 text-purple-400 border-purple-800/50 hover:border-purple-500' },
  { name: 'YouTube', color: 'from-red-950/60 to-red-900/40 text-red-400 border-red-800/50 hover:border-red-500' },
  { name: 'Kick', color: 'from-emerald-950/60 to-emerald-900/40 text-emerald-400 border-emerald-800/50 hover:border-emerald-500' },
  { name: 'Trovo', color: 'from-blue-950/60 to-blue-900/40 text-blue-400 border-blue-800/50 hover:border-blue-500' },
]

export default function HomePage() {
  const [session, setSession] = useState<any>(null)
  const [streamers, setStreamers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  const [lang, setLang] = useState<'en' | 'uk' | 'ru' | 'es' | 'pl' | 'de' | 'fr'>('uk')
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  const t = translations[lang] || translations.en

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    fetchStreamers()

    return () => subscription.unsubscribe()
  }, [])

  const fetchStreamers = async () => {
    const { data } = await supabase
      .from('streamers')
      .select('username, created_at')
      .order('created_at', { ascending: false })
      .limit(10)

    if (data) {
      setStreamers(data)
    }
    setLoading(false)
  }

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))
  }

  return (
    <main className={`min-h-screen transition-colors duration-300 flex flex-col items-center justify-between p-6 ${
      theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Шапка сайту */}
      <header className={`w-full max-w-4xl flex justify-between items-center py-4 border-b ${
        theme === 'dark' ? 'border-slate-800' : 'border-slate-200'
      }`}>
        <div className="flex items-center space-x-2">
          <Link href="/" className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-emerald-500 bg-clip-text text-transparent">
            MultiChain Donate
          </Link>
        </div>

        {/* Навігація в шапці */}
        <div className="flex items-center space-x-3">
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
            title="Змінити тему"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          <Link
            href="/dashboard"
            className="bg-indigo-600 hover:bg-indigo-500 text-white transition text-xs font-medium px-4 py-2 rounded-lg shadow-lg"
          >
            {session ? t.dashboard : t.login}
          </Link>
        </div>
      </header>

      {/* Головний контент */}
      <div className="max-w-2xl w-full text-center space-y-8 my-auto py-12">
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            {t.title}
          </h1>
          <p className={`text-sm sm:text-base ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
            {t.subtitle}
          </p>
        </div>

        <div className="flex justify-center gap-4">
          <Link
            href="/dashboard"
            className="bg-emerald-600 hover:bg-emerald-500 text-white transition font-medium px-6 py-3 rounded-xl text-sm shadow-xl"
          >
            {t.createBtn}
          </Link>
        </div>

        {/* Список активних стрімерів */}
        <div className={`pt-8 border-t text-left space-y-4 ${theme === 'dark' ? 'border-slate-900' : 'border-slate-200'}`}>
          <h2 className={`text-xs font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
            {t.activeStreamers}
          </h2>

          {loading ? (
            <p className="text-xs text-slate-500 animate-pulse">{t.loading}</p>
          ) : streamers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {streamers.map((s) => (
                <Link
                  key={s.username}
                  href={`/${s.username}`}
                  className={`border transition p-3 rounded-xl flex items-center justify-between group ${
                    theme === 'dark' 
                      ? 'bg-slate-900/60 hover:bg-slate-900 border-slate-800 hover:border-indigo-500/50' 
                      : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-indigo-400 shadow-sm'
                  }`}
                >
                  <span className="font-mono text-xs text-indigo-500 group-hover:text-indigo-400">
                    @{s.username}
                  </span>
                  <span className={`text-[10px] ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>Сторінка →</span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500">{t.noStreamers}</p>
          )}
        </div>
      </div>

      {/* Футер */}
      <footer className={`w-full max-w-4xl text-center py-6 border-t space-y-5 ${
        theme === 'dark' ? 'border-slate-900 text-slate-500' : 'border-slate-200 text-slate-400'
      }`}>
        {/* Стильний продовгуватий банер сумісних платформ */}
        <div className={`w-full py-3 px-6 border rounded-2xl backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl ${
          theme === 'dark' ? 'bg-slate-900/40 border-slate-800/80 text-slate-200' : 'bg-white border-slate-200 text-slate-800 shadow-sm'
        }`}>
          <div className="text-center sm:text-left space-y-0.5">
            <h4 className="text-xs font-bold">{t.partnersTitle}</h4>
            <p className="text-[10px] text-slate-400">{t.partnersSubtitle}</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {platforms.map((p) => (
              <div 
                key={p.name}
                className={`px-3 py-1.5 rounded-xl bg-gradient-to-r ${p.color} border font-mono text-xs font-bold shadow-md transition-all duration-300 hover:scale-105`}
              >
                {p.name}
              </div>
            ))}
          </div>
        </div>
        
        {/* Посилання на правила та підтримку платформи */}
        <div className="pt-2 flex justify-center items-center gap-6">
          <Link href="/terms" className="text-xs text-indigo-400 hover:underline font-medium">
            {t.termsLink}
          </Link>
          <span className="text-slate-700">•</span>
          <Link href="/donate" className="text-xs text-emerald-400 hover:underline font-medium">
            {t.supportLink}
          </Link>
        </div>

        <p className="text-[10px]">MultiChain Stream Donation Platform &copy; 2026</p>
      </footer>
    </main>
  )
}