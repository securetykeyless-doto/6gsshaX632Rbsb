'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

const translations: Record<string, any> = {
  en: {
    backHome: "← Home",
    title: "Streamer Dashboard",
    subtitle: "Manage your crypto wallets and donation links",
    authRequired: "Authorization Required",
    emailPlaceholder: "Your email address",
    passwordPlaceholder: "Password",
    loginBtn: "Log In",
    registerBtn: "Sign Up",
    switchToRegister: "No account? Sign Up",
    switchToLogin: "Already have an account? Log In",
    myUsername: "Your Username (Donation URL):",
    walletLabel: "Wallet Address ({chain}):",
    customizationTitle: "Alert Customization (Sound & GIFs)",
    customizationSubtitle: "Paste direct links to files (.mp3 for sound, .gif for animations). Max duration for audio is 6 seconds.",
    soundUrlLabel: "Custom Audio Signal (URL .mp3):",
    elevenLabsVoiceLabel: "Or select ElevenLabs Voice:",
    gifUrl1Label: "GIF #1 (URL .gif):",
    gifUrl2Label: "GIF #2 (URL .gif):",
    gifUrl3Label: "GIF #3 (URL .gif):",
    ttsTitle: "Voice Messages (TTS)",
    ttsSubtitle: "Specify the minimum donation amount starting from which the viewer's message will be read aloud on stream.",
    ttsEnableLabel: "Enable voice message text-to-speech",
    ttsMinLabel: "Minimum amount for voice (e.g. 5):",
    minVoiceAmountLabel: "Minimum amount for voice messages:",
    saveBtn: "Save Settings",
    saving: "Saving...",
    savedSuccess: "Settings saved successfully!",
    donationLink: "Donation Page:",
    widgetLink: "OBS Widget Link:",
    copy: "Copy",
    copied: "Copied!",
    logout: "Log Out",
    historyTitle: "Donation History & Alerts Control",
    replayBtn: "▶ Play on OBS",
    noDonations: "No donations yet",
  },
  uk: {
    backHome: "← На головну",
    title: "Кабінет стрімера",
    subtitle: "Керуйте своїми криптовалютними гаманцями та посиланнями на донати",
    authRequired: "Потрібна авторизація",
    emailPlaceholder: "Ваша електронна пошта",
    passwordPlaceholder: "Пароль",
    loginBtn: "Увійти",
    registerBtn: "Зареєструватися",
    switchToRegister: "Немає акаунта? Зареєструватися",
    switchToLogin: "Вже є акаунт? Увійти",
    myUsername: "Ваш нікнейм (посилання на донат):",
    walletLabel: "Адреса гаманця ({chain}):",
    customizationTitle: "Кастомізація алертів (Звук та Гіфки)",
    customizationSubtitle: "Вставте прямі посилання на файли (.mp3 для звуку, .gif для анімацій). Максимальна тривалість звуку — до 6 секунд.",
    soundUrlLabel: "Власний аудіо-сигнал (URL .mp3):",
    elevenLabsVoiceLabel: "Або виберіть голос ElevenLabs:",
    gifUrl1Label: "Гіфка #1 (URL .gif):",
    gifUrl2Label: "Гіфка #2 (URL .gif):",
    gifUrl3Label: "Гіфка #3 (URL .gif):",
    ttsTitle: "Голосові повідомлення (TTS)",
    ttsSubtitle: "Вкажіть мінімальну суму донату, починаючи з якої повідомлення глядача буде обов'язково озвучено голосом в ефірі.",
    ttsEnableLabel: "Увімкнути голосове озвучення повідомлень",
    ttsMinLabel: "Мінімальна сума для голосу (наприклад, 5):",
    minVoiceAmountLabel: "Мінімальна сума для голосового повідомлення:",
    saveBtn: "Зберегти налаштування",
    saving: "Збереження...",
    savedSuccess: "Налаштування успішно збережено!",
    donationLink: "Сторінка донатів:",
    widgetLink: "Віджет для OBS:",
    copy: "Скопіювати",
    copied: "Скопійовано!",
    logout: "Вийти з акаунта",
    historyTitle: "Історія донатів та керування алертами",
    replayBtn: "▶ Запустити на OBS",
    noDonations: "Ще немає донатів",
  },
  ru: {
    backHome: "← На главную",
    title: "Кабинет стримера",
    subtitle: "Управляйте своими криптовалютными кошельками и ссылками на донаты",
    authRequired: "Требуется авторизация",
    emailPlaceholder: "Ваш адрес электронной почты",
    passwordPlaceholder: "Пароль",
    loginBtn: "Войти",
    registerBtn: "Зарегистрироваться",
    switchToRegister: "Нет аккаунта? Зарегистрироваться",
    switchToLogin: "Уже есть аккаунт? Войти",
    myUsername: "Ваш никнейм (ссылка на донат):",
    walletLabel: "Адрес кошелька ({chain}):",
    customizationTitle: "Кастомизация алертов (Звук и Гифки)",
    customizationSubtitle: "Вставьте прямые ссылки на файлы (.mp3 для звука, .gif для анимаций). Максимальная длительность звука — до 6 секунд.",
    soundUrlLabel: "Собственный аудио-сигнал (URL .mp3):",
    elevenLabsVoiceLabel: "Или выберите голос ElevenLabs:",
    gifUrl1Label: "Гифка #1 (URL .gif):",
    gifUrl2Label: "Гифка #2 (URL .gif):",
    gifUrl3Label: "Гифка #3 (URL .gif):",
    ttsTitle: "Голосовые сообщения (TTS)",
    ttsSubtitle: "Укажите минимальную сумму доната, начиная с которой сообщение зрителя будет обязательно озвучено голосом в эфире.",
    ttsEnableLabel: "Включить голосовое озвучивание сообщений",
    ttsMinLabel: "Минимальная сумма для голоса (например, 5):",
    minVoiceAmountLabel: "Минимальная сумма для голосового сообщения:",
    saveBtn: "Сохранить настройки",
    saving: "Сохранение...",
    savedSuccess: "Настройки успешно сохранены!",
    donationLink: "Страница донатов:",
    widgetLink: "Виджет для OBS:",
    copy: "Копировать",
    copied: "Скопировано!",
    logout: "Выйти из аккаунта",
    historyTitle: "История донатов и управление алертами",
    replayBtn: "▶ Запустить на OBS",
    noDonations: "Пока нет донатов",
  },
  es: {
    backHome: "← Inicio",
    title: "Panel de Streamer",
    subtitle: "Administra tus billeteras cripto y enlaces de donación",
    authRequired: "Autorización Requerida",
    emailPlaceholder: "Tu correo electrónico",
    passwordPlaceholder: "Contraseña",
    loginBtn: "Iniciar Sesión",
    registerBtn: "Registrarse",
    switchToRegister: "¿Sin cuenta? Regístrate",
    switchToLogin: "¿Ya tienes cuenta? Inicia sesión",
    myUsername: "Tu usuario (Enlace de donación):",
    walletLabel: "Dirección de billetera ({chain}):",
    customizationTitle: "Personalización de Alertas (Sonido y GIFs)",
    customizationSubtitle: "Pega enlaces directos a archivos (.mp3 para sonido, .gif para animaciones). Duración máx. 6 segundos.",
    soundUrlLabel: "Señal de audio personalizada (URL .mp3):",
    elevenLabsVoiceLabel: "O selecciona voz de ElevenLabs:",
    gifUrl1Label: "GIF #1 (URL .gif):",
    gifUrl2Label: "GIF #2 (URL .gif):",
    gifUrl3Label: "GIF #3 (URL .gif):",
    ttsTitle: "Mensajes de Voz (TTS)",
    ttsSubtitle: "Establece el monto mínimo de donación para leer en voz alta el mensaje en el stream.",
    ttsEnableLabel: "Habilitar texto a voz para mensajes",
    ttsMinLabel: "Monto mín. para voz (ej. 5):",
    minVoiceAmountLabel: "Monto mínimo para mensajes de voz:",
    saveBtn: "Guardar Ajustes",
    saving: "Guardando...",
    savedSuccess: "¡Ajustes guardados con éxito!",
    donationLink: "Página de Donación:",
    widgetLink: "Enlace de Widget OBS:",
    copy: "Copiar",
    copied: "¡Copiado!",
    logout: "Cerrar Sesión",
    historyTitle: "Historial de Donaciones y Control de Alertas",
    replayBtn: "▶ Reproducir en OBS",
    noDonations: "Aún no hay donaciones",
  },
  pl: {
    backHome: "← Strona główna",
    title: "Panel Streamera",
    subtitle: "Zarządzaj portfelami kryptowalut i linkami do dotacji",
    authRequired: "Wymagana autoryzacja",
    emailPlaceholder: "Twój adres e-mail",
    passwordPlaceholder: "Hasło",
    loginBtn: "Zaloguj się",
    registerBtn: "Zarejestruj się",
    switchToRegister: "Nie masz konta? Zarejestruj się",
    switchToLogin: "Masz już konto? Zaloguj się",
    myUsername: "Twoja nazwa użytkownika (Link do dotacji):",
    walletLabel: "Adres portfela ({chain}):",
    customizationTitle: "Dostosowanie alertów (Dźwięk i GIFy)",
    customizationSubtitle: "Wklej bezpośrednie linki do plików (.mp3 dla dźwięku, .gif dla animacji). Maks. czas trwania 6 sekund.",
    soundUrlLabel: "Własny sygnał audio (URL .mp3):",
    elevenLabsVoiceLabel: "Lub wybierz głos ElevenLabs:",
    gifUrl1Label: "GIF #1 (URL .gif):",
    gifUrl2Label: "GIF #2 (URL .gif):",
    gifUrl3Label: "GIF #3 (URL .gif):",
    ttsTitle: "Wiadomości głosowe (TTS)",
    ttsSubtitle: "Określ minimalną kwotę dotacji, od której wiadomość będzie odczytywana na streamie.",
    ttsEnableLabel: "Włącz syntezę mowy dla wiadomości",
    ttsMinLabel: "Minimalna kwota dla głosu (np. 5):",
    minVoiceAmountLabel: "Minimalna kwota dla wiadomości głosowych:",
    saveBtn: "Zapisz ustawienia",
    saving: "Zapisywanie...",
    savedSuccess: "Ustawienia zapisane pomyślnie!",
    donationLink: "Strona dotacji:",
    widgetLink: "Link do widgetu OBS:",
    copy: "Kopiuj",
    copied: "Skopiowano!",
    logout: "Wyloguj się",
    historyTitle: "Historia dotacji i kontrola alertów",
    replayBtn: "▶ Odtwórz w OBS",
    noDonations: "Brak dotacji",
  },
  de: {
    backHome: "← Startseite",
    title: "Streamer-Dashboard",
    subtitle: "Verwalte deine Krypto-Wallets und Spendenlinks",
    authRequired: "Autorisierung erforderlich",
    emailPlaceholder: "Deine E-Mail-Adresse",
    passwordPlaceholder: "Passwort",
    loginBtn: "Anmelden",
    registerBtn: "Registrieren",
    switchToRegister: "Kein Konto? Registrieren",
    switchToLogin: "Bereits ein Konto? Anmelden",
    myUsername: "Dein Benutzername (Spenden-Link):",
    walletLabel: "Wallet-Adresse ({chain}):",
    customizationTitle: "Alert-Anpassung (Sound & GIFs)",
    customizationSubtitle: "Füge direkte Links zu Dateien ein (.mp3 für Sound, .gif für Animationen). Max. Dauer 6 Sekunden.",
    soundUrlLabel: "Europäisches/Eingenes Audiosignal (URL .mp3):",
    elevenLabsVoiceLabel: "Oder ElevenLabs-Stimme auswählen:",
    gifUrl1Label: "GIF #1 (URL .gif):",
    gifUrl2Label: "GIF #2 (URL .gif):",
    gifUrl3Label: "GIF #3 (URL .gif):",
    ttsTitle: "Sprachnachrichten (TTS)",
    ttsSubtitle: "Gib den Mindestspendenbetrag an, ab dem Nachrichten im Stream vorgelesen werden.",
    ttsEnableLabel: "Sprachausgabe für Nachrichten aktivieren",
    ttsMinLabel: "Mindestbetrag für Sprache (z.B. 5):",
    minVoiceAmountLabel: "Mindestbetrag für Sprachnachrichten:",
    saveBtn: "Einstellungen speichern",
    saving: "Speichern...",
    savedSuccess: "Einstellungen erfolgreich gespeichert!",
    donationLink: "Spendenseite:",
    widgetLink: "OBS-Widget-Link:",
    copy: "Kopieren",
    copied: "Kopiert!",
    logout: "Abmelden",
    historyTitle: "Spendenverlauf & Alert-Steuerung",
    replayBtn: "▶ In OBS abspielen",
    noDonations: "Noch keine Spenden",
  },
  fr: {
    backHome: "← Accueil",
    title: "Tableau de bord Streamer",
    subtitle: "Gérez vos portefeuilles crypto et liens de dons",
    authRequired: "Autorisation requise",
    emailPlaceholder: "Votre adresse e-mail",
    passwordPlaceholder: "Mot de passe",
    loginBtn: "Se connecter",
    registerBtn: "S'inscrire",
    switchToRegister: "Pas de compte ? S'inscrire",
    switchToLogin: "Déjà un compte ? Se connecter",
    myUsername: "Votre nom d'utilisateur (Lien de don):",
    walletLabel: "Adresse du portefeuille ({chain}):",
    customizationTitle: "Personnalisation des alertes (Son et GIFs)",
    customizationSubtitle: "Collez des liens directs (.mp3 pour le son, .gif pour les animations). Durée max 6 secondes.",
    soundUrlLabel: "Signal audio personnalisé (URL .mp3):",
    elevenLabsVoiceLabel: "Ou sélectionnez une voix ElevenLabs:",
    gifUrl1Label: "GIF #1 (URL .gif):",
    gifUrl2Label: "GIF #2 (URL .gif):",
    gifUrl3Label: "GIF #3 (URL .gif):",
    ttsTitle: "Messages Vocaux (TTS)",
    ttsSubtitle: "Définissez le montant minimum du don pour que le message soit lu à voix haute sur le live.",
    ttsEnableLabel: "Activer la synthèse vocale des messages",
    ttsMinLabel: "Montant min. pour la voix (ex. 5):",
    minVoiceAmountLabel: "Montant minimum pour les messages vocaux:",
    saveBtn: "Enregistrer les paramètres",
    saving: "Enregistrement...",
    savedSuccess: "Paramètres enregistrés avec succès !",
    donationLink: "Page de Don:",
    widgetLink: "Lien du Widget OBS:",
    copy: "Copier",
    copied: "Copié !",
    logout: "Se déconnecter",
    historyTitle: "Historique des dons et contrôle des alertes",
    replayBtn: "▶ Lire sur OBS",
    noDonations: "Aucun don pour l'instant",
  },
}

const CHAINS = ['Base', 'Arbitrum', 'ETH', 'Solana', 'Tron']

const ELEVEN_LABS_VOICES = [
  { id: '', name: '— Вимкнено / За замовчуванням —' },
  { id: 'eLDtXX7z65CuLasDRxrP', name: 'Rachel (Спокійний / Жіночий)' },
  { id: 'AZnzlk1XvdvUeBnXmlld', name: 'Domi (Енергійний / Жіночий)' },
  { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Bella (М’який / Жіночий)' },
  { id: 'ErXwobaYiN019PkySvjV', name: 'Antoni (Глибокий / Чоловічий)' },
  { id: 'MF3mGyEYCl7XYWbV9V6O', name: 'Elli (Молодіжний / Жіночий)' },
  { id: 'TxGEqnHWrfWFTfGW9XjX', name: 'Josh (Надійний / Чоловічий)' },
  { id: 'VR6AewLTigWG4xSOukaG', name: 'Arnold (Суворий / Чоловічий)' },
  { id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam (Глибокий / Чоловічий)' },
  { id: 'yoZ06aMxZJJ28mfd3POQ', name: 'Sam (Діловий / Чоловічий)' },
  { id: '2EiwWnXFnvU5JabPnv8n', name: 'Clyde (Низький / Чоловічий)' },
  { id: 'CYw3kZ02Hs0563khs1Fj', name: 'Dave (Британський / Чоловічий)' },
  { id: 'ThT5KcBeYPX3keUQqHPh', name: 'Dorothy (Зрілий / Жіночий)' },
  { id: 'onwK4e9ZLuTAKqWW03F9', name: 'Daniel (Журналістський / Чоловічий)' },
  { id: 'pFZP5JQG7iQjIQuC4Bku', name: 'Lily (М’який / Жіночий)' },
]

export default function DashboardPage() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [replayingId, setReplayingId] = useState<string | null>(null)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoginMode, setIsLoginMode] = useState(true)

  const [lang, setLang] = useState<'en' | 'uk' | 'ru' | 'es' | 'pl' | 'de' | 'fr'>('uk')
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  // Стан для розсувних блоків (акордеонів)
  const [isCustomizationOpen, setIsCustomizationOpen] = useState(false)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)

  const [username, setUsername] = useState('')
  const [streamerId, setStreamerId] = useState('')
  const [wallets, setWallets] = useState<Record<string, string>>({
    Base: '',
    Arbitrum: '',
    ETH: '',
    Solana: '',
    Tron: '',
  })

  const [soundUrl, setSoundUrl] = useState('')
  const [elevenLabsVoiceId, setElevenLabsVoiceId] = useState('')
  const [gifUrl1, setGifUrl1] = useState('')
  const [gifUrl2, setGifUrl2] = useState('')
  const [gifUrl3, setGifUrl3] = useState('')

  const [ttsEnabled, setTtsEnabled] = useState(true)
  const [ttsMinAmount, setTtsMinAmount] = useState('5')
  const [minVoiceAmount, setMinVoiceAmount] = useState('0')

  const [donationsHistory, setDonationsHistory] = useState<any[]>([])

  const [copiedDonation, setCopiedDonation] = useState(false)
  const [copiedWidget, setCopiedWidget] = useState(false)

  const t = translations[lang] || translations.en

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) fetchProfile(session.user.id)
      else setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) fetchProfile(session.user.id)
      else setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (userId: string) => {
    setLoading(true)
    const { data } = await supabase
      .from('streamers')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (data) {
      setStreamerId(data.id)
      setUsername(data.username || '')
      setWallets({
        Base: data.wallet_base || '',
        Arbitrum: data.wallet_arbitrum || '',
        ETH: data.wallet_eth || '',
        Solana: data.wallet_solana || '',
        Tron: data.wallet_tron || '',
      })
      setSoundUrl(data.sound_url || '')
      setElevenLabsVoiceId(data.eleven_labs_voice_id || '')
      setGifUrl1(data.gif_url_1 || '')
      setGifUrl2(data.gif_url_2 || '')
      setGifUrl3(data.gif_url_3 || '')
      setTtsEnabled(data.tts_enabled ?? true)
      setTtsMinAmount(data.tts_min_amount ? String(data.tts_min_amount) : '5')
      setMinVoiceAmount(data.min_voice_amount !== undefined ? String(data.min_voice_amount) : '0')

      fetchDonations(data.id)
    }
    setLoading(false)
  }

const fetchDonations = async (streamerUsername: string) => {
  try {
    const { data, error } = await supabase
      .from('donations')
      .select('*')
      .eq('streamer_id', streamerUsername)
      .eq('status', 'completed') // Фільтруємо тільки підтверджені блокчейном донати
      .order('created_at', { ascending: false })

    if (error) throw error
    setDonationsHistory(data || [])
  } catch (err) {
    console.error('Помилка завантаження історії донатів:', err)
  }
}

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')

    if (isLoginMode) {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) {
        setMessage('Помилка входу: ' + error.message)
      }
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })
      if (error) {
        setMessage('Помилка реєстрації: ' + error.message)
      } else if (data.session) {
        setMessage('Акаунт успішно створено та виконано вхід!')
      } else {
        setMessage('Акаунт створено! Тепер ви можете увійти.')
        setIsLoginMode(true)
      }
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session) return
    setSaving(true)
    setMessage('')

    const updates = {
      user_id: session.user.id,
      username: username.trim().toLowerCase(),
      
      // Записуємо загальні мережі (якщо вони теж є в таблиці)
      wallet_base: wallets.Base,
      wallet_arbitrum: wallets.Arbitrum,
      wallet_eth: wallets.ETH,
      wallet_solana: wallets.Solana,
      wallet_tron: wallets.Tron,

      // МАПІНГ ДЛЯ ВАШИХ КОЛОНОК ТОКЕНІВ ЗІ СКРІНШОТА:
      usdt_erc20_address: wallets.ETH,    // Наприклад, для ERC-20 беремо з поля ETH або Base
      usdc_erc20_address: wallets.ETH,    // Або можете зробити окремі поля вводу в формі, якщо вони відрізняються
      usdt_trc20_address: wallets.Tron,   // Для TRC-20 автоматично підтягується з поля Tron
      usdc_trc20_address: wallets.Tron,   // Для TRC-20 автоматично підтягується з поля Tron
      usdt_solana_address: wallets.Solana,// Для Solana підтягується з поля Solana
      usdc_solana_address: wallets.Solana,// Для Solana підтягується з поля Solana
    }

    const { error } = await supabase.from('streamers').upsert(updates, {
      onConflict: 'user_id',
    })

    if (error) {
      setMessage('Помилка: ' + error.message)
    } else {
      setMessage(t.savedSuccess)
      setTimeout(() => setMessage(''), 4000)
      fetchProfile(session.user.id)
    }
    setSaving(false)
  }

  const triggerReplayAlert = async (e: React.MouseEvent, donationItem: any) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!streamerId) return

    setReplayingId(donationItem.id)

    const alertPayload = {
      id: donationItem.id,
      donor_name: donationItem.donor_name,
      amount: donationItem.amount,
      token: donationItem.token,
      message: donationItem.message || '',
      voice_url: donationItem.voice_url || null,
      timestamp: Date.now()
    }

    await supabase
      .from('streamers')
      .update({ last_donation_data: null })
      .eq('id', streamerId)

    setTimeout(async () => {
      const { error } = await supabase
        .from('streamers')
        .update({ last_donation_data: alertPayload })
        .eq('id', streamerId)

      if (error) {
        alert('Помилка відправки сигналу на віджет: ' + error.message)
      }
      
      setReplayingId(null)
    }, 300)
  }

  const copyToClipboard = (text: string, type: 'donation' | 'widget') => {
    navigator.clipboard.writeText(text)
    if (type === 'donation') {
      setCopiedDonation(true)
      setTimeout(() => setCopiedDonation(false), 2000)
    } else {
      setCopiedWidget(true)
      setTimeout(() => setCopiedWidget(false), 2000)
    }
  }

  const origin = typeof window !== 'undefined' ? window.location.origin : ''

  return (
    <div className={`min-h-screen transition-colors duration-300 flex flex-col items-center p-6 ${
      theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'
    }`}>
      <header className={`w-full max-w-4xl flex justify-between items-center py-4 border-b mb-8 ${
        theme === 'dark' ? 'border-slate-800' : 'border-slate-200'
      }`}>
        <div className="flex items-center space-x-4">
          <Link href="/" className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition ${
            theme === 'dark' ? 'border-slate-800 hover:bg-slate-900 text-slate-300' : 'border-slate-200 hover:bg-slate-100 text-slate-700'
          }`}>
            {t.backHome}
          </Link>
          <span className="text-lg font-bold bg-gradient-to-r from-indigo-500 to-emerald-500 bg-clip-text text-transparent">
            MultiChain Donate
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value as any)}
            className={`text-xs px-2 py-1.5 rounded-lg border outline-none font-medium transition cursor-pointer ${
              theme === 'dark' ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-white border-slate-300 text-slate-700'
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
            onClick={() => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))}
            className={`p-2 rounded-lg border text-xs transition cursor-pointer ${
              theme === 'dark' ? 'bg-slate-900 border-slate-700 hover:bg-slate-800 text-amber-400' : 'bg-white border-slate-300 hover:bg-slate-100 text-indigo-600'
            }`}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          {session && (
            <button
              onClick={handleLogout}
              className="text-xs bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 px-3 py-1.5 rounded-lg transition cursor-pointer"
            >
              {t.logout}
            </button>
          )}
        </div>
      </header>

      <main className="max-w-xl w-full space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">{t.title}</h1>
          <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>{t.subtitle}</p>
        </div>

        {loading ? (
          <p className="text-xs text-slate-500 animate-pulse py-12 text-center">Завантаження...</p>
        ) : !session ? (
          <div className={`p-6 rounded-2xl border text-center space-y-4 ${
            theme === 'dark' ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <h2 className="text-sm font-semibold">{t.authRequired}</h2>

            {message && (
              <div className="p-2.5 rounded-xl text-xs bg-indigo-950/50 text-indigo-300 border border-indigo-800/50">
                {message}
              </div>
            )}

            <form onSubmit={handleAuth} className="space-y-3 pt-2">
              <input
                type="email"
                required
                placeholder={t.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-3 py-2.5 text-xs border rounded-xl outline-none transition ${
                  theme === 'dark' ? 'bg-slate-950 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                }`}
              />
              <input
                type="password"
                required
                placeholder={t.passwordPlaceholder}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-3 py-2.5 text-xs border rounded-xl outline-none transition ${
                  theme === 'dark' ? 'bg-slate-950 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                }`}
              />
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs py-2.5 rounded-xl transition shadow-lg cursor-pointer"
              >
                {isLoginMode ? t.loginBtn : t.registerBtn}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setIsLoginMode(!isLoginMode)}
                  className="text-[11px] text-indigo-400 hover:underline cursor-pointer"
                >
                  {isLoginMode ? t.switchToRegister : t.switchToLogin}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="space-y-6">
            <form onSubmit={handleSave} className={`p-6 rounded-2xl border space-y-5 ${
              theme === 'dark' ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              {message && (
                <div className={`p-3 rounded-xl text-xs font-medium ${
                  message.includes('Помилка') ? 'bg-red-950/50 text-red-400 border border-red-800/50' : 'bg-emerald-950/50 text-emerald-400 border border-emerald-800/50'
                }`}>
                  {message}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-medium">{t.myUsername}</label>
                <div className="flex items-center">
                  <span className={`px-3 py-2 text-xs border border-r-0 rounded-l-xl ${
                    theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-slate-100 border-slate-300 text-slate-500'
                  }`}>
                    @
                  </span>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="my_channel"
                    className={`w-full px-3 py-2 text-xs border rounded-r-xl outline-none transition font-mono ${
                      theme === 'dark' ? 'bg-slate-950 border-slate-700 focus:border-indigo-500 text-white' : 'bg-white border-slate-300 focus:border-indigo-500 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <p className={`text-[11px] font-semibold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                  Crypto Wallets (EVM & Solana Unified Tokens Support):
                </p>
                {CHAINS.map((chain) => (
                  <div key={chain} className="space-y-1">
                    <label className={`text-[11px] font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                      {t.walletLabel.replace('{chain}', chain)} {chain === 'ETH' || chain === 'Base' || chain === 'Arbitrum' ? '(Також для USDT/USDC ERC-20)' : chain === 'Solana' ? '(Також для USDT/USDC SPL)' : chain === 'Tron' ? '(Також для USDT/USDC TRC-20)' : ''}
                    </label>
                    <input
                      type="text"
                      value={wallets[chain]}
                      onChange={(e) => {
                        const val = e.target.value
                        setWallets(prev => {
                          const updated = { ...prev, [chain]: val }
                          // Якщо це EVM мережа, за бажанням можна синхронізувати з іншими EVM
                          return updated
                        })
                      }}
                      placeholder={`0x... (${chain} address)`}
                      className={`w-full px-3 py-2 text-xs border rounded-xl outline-none transition font-mono ${
                        theme === 'dark' ? 'bg-slate-950 border-slate-700 focus:border-indigo-500 text-white' : 'bg-white border-slate-300 focus:border-indigo-500 text-slate-900'
                      }`}
                    />
                  </div>
                ))}
              </div>

              {/* РОЗСУВНИЙ БЛОК: Кастомізація алертів */}
              <div className={`pt-4 border-t space-y-3 ${theme === 'dark' ? 'border-slate-800' : 'border-slate-200'}`}>
                <button
                  type="button"
                  onClick={() => setIsCustomizationOpen(!isCustomizationOpen)}
                  className="w-full flex items-center justify-between text-xs font-semibold text-emerald-400 cursor-pointer py-1"
                >
                  <span>{t.customizationTitle}</span>
                  <span className="text-sm font-bold">{isCustomizationOpen ? '▲' : '▼'}</span>
                </button>

                {isCustomizationOpen && (
                  <div className="space-y-3 pt-2 transition-all">
                    <p className={`text-[11px] ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                      {t.customizationSubtitle}
                    </p>

                    <div className="space-y-2 text-xs pt-1">
                      <div>
                        <label className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>{t.soundUrlLabel}</label>
                        <input
                          type="url"
                          value={soundUrl}
                          onChange={(e) => setSoundUrl(e.target.value)}
                          className={`w-full mt-1 border rounded-xl px-3 py-2 outline-none transition ${
                            theme === 'dark' ? 'bg-slate-950 border-slate-700 text-white focus:border-emerald-500' : 'bg-white border-slate-300 text-slate-900 focus:border-emerald-500'
                          }`}
                          placeholder="https://example.com/sound.mp3"
                        />
                      </div>

                      <div>
                        <label className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>{t.elevenLabsVoiceLabel}</label>
                        <select
                          value={elevenLabsVoiceId}
                          onChange={(e) => setElevenLabsVoiceId(e.target.value)}
                          className={`w-full mt-1 border rounded-xl px-3 py-2 outline-none transition cursor-pointer ${
                            theme === 'dark' ? 'bg-slate-950 border-slate-700 text-white focus:border-emerald-500' : 'bg-white border-slate-300 text-slate-900 focus:border-emerald-500'
                          }`}
                        >
                          {ELEVEN_LABS_VOICES.map((voice) => (
                            <option key={voice.id} value={voice.id}>
                              {voice.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>{t.gifUrl1Label}</label>
                        <input
                          type="url"
                          value={gifUrl1}
                          onChange={(e) => setGifUrl1(e.target.value)}
                          className={`w-full mt-1 border rounded-xl px-3 py-2 outline-none transition ${
                            theme === 'dark' ? 'bg-slate-950 border-slate-700 text-white focus:border-emerald-500' : 'bg-white border-slate-300 text-slate-900 focus:border-emerald-500'
                          }`}
                          placeholder="https://example.com/gif1.gif"
                        />
                      </div>

                      <div>
                        <label className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>{t.gifUrl2Label}</label>
                        <input
                          type="url"
                          value={gifUrl2}
                          onChange={(e) => setGifUrl2(e.target.value)}
                          className={`w-full mt-1 border rounded-xl px-3 py-2 outline-none transition ${
                            theme === 'dark' ? 'bg-slate-950 border-slate-700 text-white focus:border-emerald-500' : 'bg-white border-slate-300 text-slate-900 focus:border-emerald-500'
                          }`}
                          placeholder="https://example.com/gif2.gif"
                        />
                      </div>

                      <div>
                        <label className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>{t.gifUrl3Label}</label>
                        <input
                          type="url"
                          value={gifUrl3}
                          onChange={(e) => setGifUrl3(e.target.value)}
                          className={`w-full mt-1 border rounded-xl px-3 py-2 outline-none transition ${
                            theme === 'dark' ? 'bg-slate-950 border-slate-700 text-white focus:border-emerald-500' : 'bg-white border-slate-300 text-slate-900 focus:border-emerald-500'
                          }`}
                          placeholder="https://example.com/gif3.gif"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className={`pt-4 border-t space-y-3 ${theme === 'dark' ? 'border-slate-800' : 'border-slate-200'}`}>
                <h2 className="text-xs font-semibold text-indigo-400">{t.ttsTitle}</h2>
                <p className={`text-[11px] ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                  {t.ttsSubtitle}
                </p>

                <div className="space-y-3 text-xs pt-1">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={ttsEnabled}
                      onChange={(e) => setTtsEnabled(e.target.checked)}
                      className="rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-0 cursor-pointer"
                    />
                    <span className={theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}>{t.ttsEnableLabel}</span>
                  </label>

                  {ttsEnabled && (
                    <div>
                      <label className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>{t.ttsMinLabel}</label>
                      <input
                        type="number"
                        step="any"
                        value={ttsMinAmount}
                        onChange={(e) => setTtsMinAmount(e.target.value)}
                        className={`w-full mt-1 border rounded-xl px-3 py-2 outline-none transition font-mono ${
                          theme === 'dark' ? 'bg-slate-950 border-slate-700 text-white focus:border-indigo-500' : 'bg-white border-slate-300 text-slate-900 focus:border-indigo-500'
                        }`}
                        placeholder="5"
                      />
                    </div>
                  )}

                  <div className="space-y-1 pt-2">
                    <label className={`text-[11px] ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                      {t.minVoiceAmountLabel}
                    </label>
                    <input
                      type="number"
                      step="any"
                      placeholder="0"
                      value={minVoiceAmount}
                      onChange={(e) => setMinVoiceAmount(e.target.value)}
                      className={`w-full border rounded-xl px-3 py-2 text-xs outline-none transition font-mono ${
                        theme === 'dark' ? 'bg-slate-950 border-slate-700 text-white focus:border-indigo-500' : 'bg-white border-slate-300 text-slate-900 focus:border-indigo-500'
                      }`}
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2.5 rounded-xl text-xs transition shadow-lg disabled:opacity-50 cursor-pointer"
              >
                {saving ? t.saving : t.saveBtn}
              </button>

              {username && (
                <div className={`pt-4 border-t space-y-3 ${theme === 'dark' ? 'border-slate-800' : 'border-slate-200'}`}>
                  <div className="space-y-1">
                    <span className={`text-[11px] ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>{t.donationLink}</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={`${origin}/${username}`}
                        className={`w-full px-3 py-1.5 text-xs border rounded-lg font-mono ${
                          theme === 'dark' ? 'bg-slate-950 border-slate-800 text-indigo-400' : 'bg-slate-100 border-slate-200 text-indigo-600'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => copyToClipboard(`${origin}/${username}`, 'donation')}
                        className="px-3 py-1.5 text-xs bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition shrink-0 cursor-pointer"
                      >
                        {copiedDonation ? t.copied : t.copy}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className={`text-[11px] ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>{t.widgetLink}</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={`${origin}/widget/${username}`}
                        className={`w-full px-3 py-1.5 text-xs border rounded-lg font-mono ${
                          theme === 'dark' ? 'bg-slate-950 border-slate-800 text-emerald-400' : 'bg-slate-100 border-slate-200 text-emerald-600'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => copyToClipboard(`${origin}/widget/${username}`, 'widget')}
                        className="px-3 py-1.5 text-xs bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition shrink-0 cursor-pointer"
                      >
                        {copiedWidget ? t.copied : t.copy}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </form>

            {/* РОЗСУВНИЙ БЛОК: Історія донатів та керування алертами */}
            {username && (
              <div className={`p-6 rounded-2xl border space-y-4 ${
                theme === 'dark' ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <button
                  type="button"
                  onClick={() => setIsHistoryOpen(!isHistoryOpen)}
                  className="w-full flex items-center justify-between text-xs font-semibold text-indigo-400 cursor-pointer py-1"
                >
                  <span>{t.historyTitle}</span>
                  <span className="text-sm font-bold">{isHistoryOpen ? '▲' : '▼'}</span>
                </button>

                {isHistoryOpen && (
                  <div className="pt-2 transition-all">
                    {donationsHistory.length === 0 ? (
                      <p className="text-xs text-slate-500 py-4 text-center">{t.noDonations}</p>
                    ) : (
                      <div className="space-y-2.5">
                        {donationsHistory.map((item) => (
                          <div 
                            key={item.id} 
                            className={`relative flex items-center justify-between p-3 rounded-xl border text-xs z-10 ${
                              theme === 'dark' ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                            }`}
                          >
                            <div className="space-y-0.5 max-w-[240px] pointer-events-none">
                              <div className="font-bold truncate">
                                {item.donor_name} — {item.amount} {item.token}
                              </div>
                              {item.message && (
                                <div className="text-[11px] text-slate-400 italic truncate">
                                  &ldquo;{item.message}&rdquo;
                                </div>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={(e) => triggerReplayAlert(e, item)}
                              disabled={replayingId === item.id}
                              className="relative z-20 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white rounded-lg text-[11px] font-medium transition shrink-0 shadow-md cursor-pointer disabled:opacity-50"
                            >
                              {replayingId === item.id ? '⌛...' : t.replayBtn}
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}