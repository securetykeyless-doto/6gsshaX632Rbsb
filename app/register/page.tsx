'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

const translations: Record<string, any> = {
  en: {
    backHome: "← Home",
    title: "Streamer Dashboard",
    subtitle: "Enter your wallets to receive donations",
    usernameLabel: "YOUR USERNAME",
    evmLabel: "WALLET BASE / ARBITRUM / ETH",
    solanaLabel: "WALLET SOLANA",
    tronLabel: "WALLET TRON (TRC-20)",
    saveBtn: "Save Details",
    saving: "Saving...",
    savedSuccess: "Details saved successfully!",
  },
  uk: {
    backHome: "← На головну",
    title: "Кабінет стрімера",
    subtitle: "Введіть свої гаманці для отримання донатів",
    usernameLabel: "ВАШ НІКНЕЙМ (USERNAME)",
    evmLabel: "ГАМАНЕЦЬ BASE / ARBITRUM / ETH",
    solanaLabel: "ГАМАНЕЦЬ SOLANA",
    tronLabel: "ГАМАНЕЦЬ TRON (TRC-20)",
    saveBtn: "Зберегти реквізити",
    saving: "Збереження...",
    savedSuccess: "Реквізити успішно збережено!",
  },
  ru: {
    backHome: "← На главную",
    title: "Кабинет стримера",
    subtitle: "Введите свои кошельки для получения донатов",
    usernameLabel: "ВАШ НИКНЕЙМ (USERNAME)",
    evmLabel: "КОШЕЛЕК BASE / ARBITRUM / ETH",
    solanaLabel: "КОШЕЛЕК SOLANA",
    tronLabel: "КОШЕЛЕК TRON (TRC-20)",
    saveBtn: "Сохранить реквизиты",
    saving: "Сохранение...",
    savedSuccess: "Реквизиты успешно сохранены!",
  },
}

export default function RegisterPage() {
  const [session, setSession] = useState<any>(null)
  const [lang, setLang] = useState<'en' | 'uk' | 'ru'>('uk')
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  const [username, setUsername] = useState('testuser')
  const [walletEvm, setWalletEvm] = useState('')
  const [walletSolana, setWalletSolana] = useState('')
  const [walletTron, setWalletTron] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const t = translations[lang]

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) fetchProfile(session.user.id)
    })
  }, [])

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from('streamers')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (data) {
      setUsername(data.username || '')
      setWalletEvm(data.wallet_eth || data.wallet_base || '')
      setWalletSolana(data.wallet_solana || '')
      setWalletTron(data.wallet_tron || '')
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    const userId = session?.user?.id || '00000000-0000-0000-0000-000000000000'

    const updates = {
      user_id: userId,
      username: username.trim().toLowerCase(),
      wallet_base: walletEvm,
      wallet_arbitrum: walletEvm,
      wallet_eth: walletEvm,
      wallet_solana: walletSolana,
      wallet_tron: walletTron,
      updated_at: new Date(),
    }

    const { error } = await supabase.from('streamers').upsert(updates, {
      onConflict: 'user_id',
    })

    if (error) {
      setMessage('Помилка: ' + error.message)
    } else {
      setMessage(t.savedSuccess)
      setTimeout(() => setMessage(''), 4000)
    }
    setSaving(false)
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 flex flex-col items-center p-6 ${
      theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Шапка з навігацією, мовою та темою */}
      <header className={`w-full max-w-4xl flex justify-between items-center py-4 border-b mb-8 ${
        theme === 'dark' ? 'border-slate-800' : 'border-slate-200'
      }`}>
        <Link href="/" className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition ${
          theme === 'dark' ? 'border-slate-800 hover:bg-slate-900 text-slate-300' : 'border-slate-200 hover:bg-slate-100 text-slate-700'
        }`}>
          {t.backHome}
        </Link>

        <div className="flex items-center space-x-3">
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value as any)}
            className={`text-xs px-2 py-1.5 rounded-lg border outline-none font-medium transition ${
              theme === 'dark' ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-white border-slate-300 text-slate-700'
            }`}
          >
            <option value="uk">UA</option>
            <option value="en">EN</option>
            <option value="ru">RU</option>
          </select>

          <button
            onClick={() => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))}
            className={`p-2 rounded-lg border text-xs transition ${
              theme === 'dark' ? 'bg-slate-900 border-slate-700 hover:bg-slate-800 text-amber-400' : 'bg-white border-slate-300 hover:bg-slate-100 text-indigo-600'
            }`}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      {/* Основна форма реєстрації */}
      <main className="w-full max-w-md flex flex-col items-center justify-center my-auto">
        <div className={`w-full p-8 rounded-3xl border space-y-6 ${
          theme === 'dark' ? 'bg-slate-900/40 border-slate-800/80 shadow-2xl' : 'bg-white border-slate-200 shadow-xl'
        }`}>
          <div className="text-center space-y-1">
            <h1 className="text-xl font-bold">{t.title}</h1>
            <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{t.subtitle}</p>
          </div>

          {message && (
            <div className={`p-3 rounded-xl text-xs font-medium ${
              message.includes('Помилка') ? 'bg-red-950/50 text-red-400 border border-red-800/50' : 'bg-emerald-950/50 text-emerald-400 border border-emerald-800/50'
            }`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-1.5">
              <label className={`text-[10px] font-bold tracking-wider ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                {t.usernameLabel}
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full px-4 py-2.5 text-xs border rounded-xl outline-none transition font-mono ${
                  theme === 'dark' ? 'bg-slate-950/80 border-slate-800 focus:border-indigo-500 text-white' : 'bg-slate-50 border-slate-300 focus:border-indigo-500 text-slate-900'
                }`}
              />
            </div>

            <div className="space-y-1.5">
              <label className={`text-[10px] font-bold tracking-wider ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                {t.evmLabel}
              </label>
              <input
                type="text"
                value={walletEvm}
                onChange={(e) => setWalletEvm(e.target.value)}
                placeholder="0x..."
                className={`w-full px-4 py-2.5 text-xs border rounded-xl outline-none transition font-mono ${
                  theme === 'dark' ? 'bg-slate-950/80 border-slate-800 focus:border-indigo-500 text-white' : 'bg-slate-50 border-slate-300 focus:border-indigo-500 text-slate-900'
                }`}
              />
            </div>

            <div className="space-y-1.5">
              <label className={`text-[10px] font-bold tracking-wider ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                {t.solanaLabel}
              </label>
              <input
                type="text"
                value={walletSolana}
                onChange={(e) => setWalletSolana(e.target.value)}
                placeholder="Solana адреса..."
                className={`w-full px-4 py-2.5 text-xs border rounded-xl outline-none transition font-mono ${
                  theme === 'dark' ? 'bg-slate-950/80 border-slate-800 focus:border-indigo-500 text-white' : 'bg-slate-50 border-slate-300 focus:border-indigo-500 text-slate-900'
                }`}
              />
            </div>

            <div className="space-y-1.5">
              <label className={`text-[10px] font-bold tracking-wider ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                {t.tronLabel}
              </label>
              <input
                type="text"
                value={walletTron}
                onChange={(e) => setWalletTron(e.target.value)}
                placeholder="T..."
                className={`w-full px-4 py-2.5 text-xs border rounded-xl outline-none transition font-mono ${
                  theme === 'dark' ? 'bg-slate-950/80 border-slate-800 focus:border-indigo-500 text-white' : 'bg-slate-50 border-slate-300 focus:border-indigo-500 text-slate-900'
                }`}
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full mt-2 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-medium rounded-xl text-xs transition shadow-lg shadow-indigo-600/20 disabled:opacity-50"
            >
              {saving ? t.saving : t.saveBtn}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}