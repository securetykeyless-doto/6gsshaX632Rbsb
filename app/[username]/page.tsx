'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { QRCodeSVG } from 'qrcode.react'
import Link from 'next/link'

const CHAINS_CONFIG: Record<string, { name: string; color: string; icon: string; dbKey: string; fixedAddress?: string }> = {
  usdt_erc20: { 
    name: 'USDT (ERC-20)', 
    color: 'from-purple-500 to-slate-700', 
    icon: '💎', 
    dbKey: 'usdt_erc20_address',
    fixedAddress: '0x25901B2d6a990a3a0B81EF0B43B8799BDD5f5A7D'
  },
  usdc_erc20: { 
    name: 'USDC (ERC-20)', 
    color: 'from-purple-500 to-indigo-700', 
    icon: '💵', 
    dbKey: 'usdc_erc20_address',
    fixedAddress: '0x25901B2d6a990a3a0B81EF0B43B8799BDD5f5A7D'
  },
  wallet_eth: { 
    name: 'Ethereum', 
    color: 'from-purple-500 to-slate-700', 
    icon: '💎', 
    dbKey: 'wallet_eth',
    fixedAddress: '0x0F2f2ec941655d6810e63449fdd9bc01C1a84Cd6'
  },
  wallet_arbitrum: { 
    name: 'Arbitrum', 
    color: 'from-sky-500 to-blue-700', 
    icon: '⚡', 
    dbKey: 'wallet_arbitrum',
    fixedAddress: '0x25901B2d6a990a3a0B81EF0B43B8799BDD5f5A7D'
  },
  wallet_base: { 
    name: 'Base', 
    color: 'from-blue-600 to-indigo-600', 
    icon: '🔵', 
    dbKey: 'wallet_base',
    fixedAddress: '0x25901B2d6a990a3a0B81EF0B43B8799BDD5f5A7D'
  },
  wallet_solana: { 
    name: 'Solana', 
    color: 'from-purple-600 to-pink-600', 
    icon: '🟣', 
    dbKey: 'wallet_solana',
    fixedAddress: '9LMxvFfH8ap6xzcKVbk29HzwjPfkAvRxDZ7CvXpKqNCE'
  },
  usdt_solana: { 
    name: 'USDT (Solana)', 
    color: 'from-purple-600 to-pink-600', 
    icon: '🟣', 
    dbKey: 'usdt_solana_address',
    fixedAddress: '9LMxvFfH8ap6xzcKVbk29HzwjPfkAvRxDZ7CvXpKqNCE'
  },
  usdc_solana: { 
    name: 'USDC (Solana)', 
    color: 'from-purple-600 to-pink-600', 
    icon: '💵', 
    dbKey: 'usdc_solana_address',
    fixedAddress: '9LMxvFfH8ap6xzcKVbk29HzwjPfkAvRxDZ7CvXpKqNCE'
  },
  wallet_tron: { 
    name: 'Tron', 
    color: 'from-red-600 to-rose-800', 
    icon: '🔴', 
    dbKey: 'wallet_tron',
    fixedAddress: 'THu1dVk7XC5UQ5TidkTFsyMZDg7nNkv1Pj'
  },
  usdt_trc20: { name: 'USDT (TRC-20)', color: 'from-red-600 to-rose-800', icon: '🔴', dbKey: 'usdt_trc20_address', fixedAddress: 'THu1dVk7XC5UQ5TidkTFsyMZDg7nNkv1Pj' },
  usdc_trc20: { name: 'USDC (TRC-20)', color: 'from-red-600 to-rose-800', icon: '🔵', dbKey: 'usdc_trc20_address', fixedAddress: 'THu1dVk7XC5UQ5TidkTFsyMZDg7nNkv1Pj' },
  usdt_bep20: { name: 'USDT (BEP-20)', color: 'from-amber-500 to-yellow-600', icon: '🟡', dbKey: 'usdt_bep20_address', fixedAddress: '0x25901B2d6a990a3a0B81EF0B43B8799BDD5f5A7D' },
  usdc_bep20: { name: 'USDC (BEP-20)', color: 'from-amber-500 to-yellow-600', icon: '🟡', dbKey: 'usdc_bep20_address', fixedAddress: '0x25901B2d6a990a3a0B81EF0B43B8799BDD5f5A7D' },
}

const TRANSLATIONS: Record<string, Record<string, string>> = {
  uk: {
    home: '← Головна',
    support: 'Підтримати',
    subtitle: 'Надішліть крипто-донат та голосове повідомлення',
    noWallet: 'Цей стрімер ще не додав жодного гаманця.',
    selectNetwork: 'Оберіть мережу / токен:',
    walletAddress: 'Адреса гаманця для переказу',
    copy: 'Копіювати',
    copied: 'Скопійовано!',
    yourName: "Ваше ім'я (Нік):",
    anonymous: 'Анонім',
    amount: 'Сума',
    exactAmountToSend: 'Точна сума до переказу (з урахуванням хвостика):',
    message: 'Повідомлення для стрімера:',
    voiceNote: '🎙️ Голосове мікрофоном:',
    recordVoice: 'Записати голос',
    stopRecording: 'Зупинити запис',
    sendDonation: 'Згенерувати реквізити та надіслати',
    sending: 'Обробка...',
    success: 'Донат успішно зареєстровано в системі! Дякуємо! 🎉',
    loading: 'Завантаження...',
    notFnd: 'Стрімера не знайдено',
    unlockVoice: 'Введіть суму від',
    toUnlock: 'для розблокування голосу',
    micError: 'Не вдалося отримати доступ до мікрофона.',
    scanToPay: 'Відскануйте QR-код або скопіюйте адресу для оплати:',
    confirmPaymentDone: 'Я здійснив переказ',
  },
  en: {
    home: '← Home',
    support: 'Support',
    subtitle: 'Send a crypto donation & voice message',
    noWallet: 'This streamer has not added any wallet yet.',
    selectNetwork: 'Select network / token:',
    walletAddress: 'Wallet address to send',
    copy: 'Copy',
    copied: 'Copied!',
    yourName: 'Your Name (Nick):',
    anonymous: 'Anonymous',
    amount: 'Amount',
    exactAmountToSend: 'Exact amount to send (including identifier):',
    message: 'Streamer Message:',
    voiceNote: '🎙️ Voice note:',
    recordVoice: 'Record Voice',
    stopRecording: 'Stop Recording',
    sendDonation: 'Generate payment & send',
    sending: 'Processing...',
    success: 'Donation successfully registered! Thank you! 🎉',
    loading: 'Loading...',
    notFnd: 'Streamer not found',
    unlockVoice: 'Enter amount >=',
    toUnlock: 'to unlock voice note',
    micError: 'Could not access microphone.',
    scanToPay: 'Scan QR code or copy address to pay:',
    confirmPaymentDone: 'I have made the transfer',
  },
  ru: {
    home: '← Главная',
    support: 'Поддержать',
    subtitle: 'Отправьте крипто-донат и голосовое сообщение',
    noWallet: 'Этот стример еще не добавил ни одного кошелька.',
    selectNetwork: 'Выберите сеть / токен:',
    walletAddress: 'Адрес кошелька для перевода',
    copy: 'Копировать',
    copied: 'Скопировано!',
    yourName: 'Ваше имя (Ник):',
    anonymous: 'Аноним',
    amount: 'Сумма',
    exactAmountToSend: 'Точная сумма к переводу (с учетом хвостика):',
    message: 'Сообщение для стримера:',
    voiceNote: '🎙️ Голосовое микрофоном:',
    recordVoice: 'Записать голос',
    stopRecording: 'Остановить запись',
    sendDonation: 'Сгенерировать реквизиты',
    sending: 'Обработка...',
    success: 'Донат успешно зарегистрирован! Спасибо! 🎉',
    loading: 'Загрузка...',
    notFnd: 'Стример не найден',
    unlockVoice: 'Введите сумму от',
    toUnlock: 'для разблокировки голоса',
    micError: 'Не удалось получить доступ к микрофону.',
    scanToPay: 'Отсканируйте QR-код или скопируйте адрес для оплаты:',
    confirmPaymentDone: 'Я выполнил перевод',
  },
  es: {
    home: '← Inicio',
    support: 'Apoyar',
    subtitle: 'Envía una criptodonación y mensaje de voz',
    noWallet: 'Este streamer aún no ha agregado ninguna billetera.',
    selectNetwork: 'Seleccionar red / token:',
    walletAddress: 'Dirección de billetera',
    copy: 'Copiar',
    copied: '¡Copiado!',
    yourName: 'Tu nombre (Apodo):',
    anonymous: 'Anónimo',
    amount: 'Cantidad',
    exactAmountToSend: 'Monto exacto a enviar:',
    message: 'Mensaje para el streamer:',
    voiceNote: '🎙️ Nota de voz:',
    recordVoice: 'Grabar voz',
    stopRecording: 'Detener grabación',
    sendDonation: 'Generar pago',
    sending: 'Procesando...',
    success: '¡Donación registrada con éxito! ¡Gracias! 🎉',
    loading: 'Cargando...',
    notFnd: 'Streamer não encontrado',
    unlockVoice: 'Ingresa un monto >=',
    toUnlock: 'para desbloquear la voz',
    micError: 'No se pudo acceder al micrófono.',
    scanToPay: 'Escanea el código QR o copia la dirección:',
    confirmPaymentDone: 'He realizado la transferencia',
  },
  pl: {
    home: '← Strona główna',
    support: 'Wspomóż',
    subtitle: 'Wyślij krypto-donację i wiadomość głosową',
    noWallet: 'Ten streamer nie dodał jeszcze żadnego portfela.',
    selectNetwork: 'Wybierz sieć / token:',
    walletAddress: 'Adres portfela',
    copy: 'Kopiuj',
    copied: 'Skopiowano!',
    yourName: 'Twoje imię (Nick):',
    anonymous: 'Anonim',
    amount: 'Kwota',
    exactAmountToSend: 'Dokładna kwota do wysłania:',
    message: 'Wiadomość dla streamera:',
    voiceNote: '🎙️ Notatka głosowa:',
    recordVoice: 'Nagraj głos',
    stopRecording: 'Zatrzymaj nagrywanie',
    sendDonation: 'Generuj płatność',
    sending: 'Przetwarzanie...',
    success: 'Donacja zarejestrowana pomyślnie! Dziękujemy! 🎉',
    loading: 'Ładowanie...',
    notFnd: 'Nie znaleziono streamera',
    unlockVoice: 'Wprowadź kwotę >=',
    toUnlock: 'aby odblokować głos',
    micError: 'Nie udało się uzyskać dostępu do mikrofonu.',
    scanToPay: 'Zeskanuj kod QR lub skopiuj adres:',
    confirmPaymentDone: 'Wykonałem przelew',
  },
  de: {
    home: '← Startseite',
    support: 'Unterstützen',
    subtitle: 'Sende eine Krypto-Spende & Sprachnachricht',
    noWallet: 'Dieser Streamer hat noch kein Wallet hinzugefügt.',
    selectNetwork: 'Netzwerk / Token wählen:',
    walletAddress: 'Wallet-Adresse',
    copy: 'Kopieren',
    copied: 'Kopiert!',
    yourName: 'Dein Name (Nick):',
    anonymous: 'Anonym',
    amount: 'Betrag',
    exactAmountToSend: 'Genauer Sendebetrag:',
    message: 'Streamer-Nachricht:',
    voiceNote: '🎙️ Sprachnotiz:',
    recordVoice: 'Sprache aufnehmen',
    stopRecording: 'Aufnahme stoppen',
    sendDonation: 'Zahlung generieren',
    sending: 'Wird verarbeitet...',
    success: 'Spende erfolgreich registriert! Vielen Dank! 🎉',
    loading: 'Wird geladen...',
    notFnd: 'Streamer nicht gefunden',
    unlockVoice: 'Betrag >=',
    toUnlock: 'eingeben, um Sprache freizuschalten',
    micError: 'Mikrofonzugriff fehlgeschlagen.',
    scanToPay: 'QR-Code scannen oder Adresse kopieren:',
    confirmPaymentDone: 'Überweisung getätigt',
  },
  fr: {
    home: '← Accueil',
    support: 'Soutenir',
    subtitle: 'Envoyez un don crypto et un message vocal',
    noWallet: "Ce streamer n'a pas encore ajouté de portefeuille.",
    selectNetwork: 'Sélectionner le réseau / jeton :',
    walletAddress: 'Adresse du portefeuille',
    copy: 'Copier',
    copied: 'Copié !',
    yourName: 'Votre nom (Pseudo) :',
    anonymous: 'Anonyme',
    amount: 'Montant',
    exactAmountToSend: 'Montant exact à envoyer :',
    message: 'Message au streamer :',
    voiceNote: '🎙️ Note vocale :',
    recordVoice: 'Enregistrer la voix',
    stopRecording: "Arrêter l'enregistrement",
    sendDonation: 'Générer le paiement',
    sending: 'Traitement...',
    success: 'Don enregistré avec succès ! Merci ! 🎉',
    loading: 'Chargement...',
    notFnd: 'Streamer introuvable',
    unlockVoice: 'Entrez un montant >=',
    toUnlock: 'pour débloquer la voix',
    micError: 'Impossible d’accéder au microphone.',
    scanToPay: 'Scannez le code QR ou copiez l’adresse :',
    confirmPaymentDone: 'J’ai effectué le virement',
  },
}

export default function PublicDonatePage() {
  const params = useParams()
  const username = params.username as string

  const [streamer, setStreamer] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  
  const [selectedChain, setSelectedChain] = useState<string>('donation_contract')
  const [copied, setCopied] = useState(false)

  const [donorName, setDonorName] = useState('')
  const [amount, setAmount] = useState('')
  const [message, setMessage] = useState('')

  const [uniqueTail, setUniqueTail] = useState<number>(0)
  const [paymentStep, setPaymentStep] = useState<'form' | 'qr'>('form')

  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [recordingTime, setRecordingTime] = useState(0)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const [submitting, setSubmitting] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')

  const [isDarkMode, setIsDarkMode] = useState(true)
  const [lang, setLang] = useState<string>('uk')

  const t = (key: string) => TRANSLATIONS[lang]?.[key] || TRANSLATIONS['en'][key] || key

  useEffect(() => {
    async function fetchStreamerData() {
      const { data } = await supabase
        .from('streamers')
        .select('*')
        .eq('username', username)
        .single()

      if (data) {
        setStreamer(data)
        const available = Object.keys(CHAINS_CONFIG).filter(
          (key) => {
            const conf = CHAINS_CONFIG[key]
            if (conf.fixedAddress) return true
            const dbCol = conf.dbKey
            return data[dbCol] && data[dbCol].trim() !== ''
          }
        )
        if (available.length > 0) {
          setSelectedChain(available[0])
        }
      }
      setLoading(false)
    }

    if (username) {
      fetchStreamerData()
    }
  }, [username])

  const decimalsCount = (selectedChain.includes('eth') || selectedChain.includes('solana') || selectedChain.includes('arbitrum') || selectedChain.includes('base') || selectedChain.includes('donation_contract')) ? 4 : 2
  const finalCalculatedAmount = Number((parseFloat(amount || '0') + uniqueTail).toFixed(decimalsCount))

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const startRecording = async () => {
    setAudioBlob(null)
    setAudioUrl(null)
    setRecordingTime(0)
    audioChunksRef.current = []

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        setAudioBlob(blob)
        setAudioUrl(URL.createObjectURL(blob))
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= 15) {
            stopRecording()
            return 15
          }
          return prev + 1
        })
      }, 1000)
    } catch (err) {
      alert(t('micError'))
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }

  const deleteRecording = () => {
    setAudioBlob(null)
    setAudioUrl(null)
    setRecordingTime(0)
  }

  const minVoiceLimit = parseFloat(streamer?.tts_min_amount ?? streamer?.min_voice_amount) || 0
  const isVoiceUnlocked = finalCalculatedAmount >= minVoiceLimit

  // Крок 1: Генеруємо хвостик, записуємо інвойс в БД, переходимо до екрану з QR-кодом
  const handleGeneratePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!streamer) return

    setSubmitting(true)
    setSuccessMsg('')

    try {
      // Формуємо випадковий хвостик якщо він ще не був згенерований
      let currentTail = uniqueTail
      if (currentTail === 0) {
        const isNativeEthOrSol = selectedChain.includes('eth') || selectedChain.includes('solana') || selectedChain.includes('arbitrum') || selectedChain.includes('base') || selectedChain.includes('donation_contract')
        if (isNativeEthOrSol) {
          currentTail = Number((Math.floor(Math.random() * 9 + 1) / 10000).toFixed(4))
        } else {
          currentTail = Number((Math.floor(Math.random() * 98 + 1) / 100).toFixed(2))
        }
        setUniqueTail(currentTail)
      }

      const parsedBaseAmount = parseFloat(amount || '0')
      const dec = (selectedChain.includes('eth') || selectedChain.includes('solana') || selectedChain.includes('arbitrum') || selectedChain.includes('base') || selectedChain.includes('donation_contract')) ? 4 : 2
      const finalSum = Number((parsedBaseAmount + currentTail).toFixed(dec))

      let uploadedAudioUrl = null

      if (isVoiceUnlocked && audioBlob) {
        const fileName = `${streamer.id || streamer.user_id}/${Date.now()}.webm`
        const { error: uploadError } = await supabase.storage
          .from('voice_donations')
          .upload(fileName, audioBlob, { contentType: 'audio/webm' })

        if (uploadError) {
          throw new Error('Storage error: ' + uploadError.message)
        }

        const { data: publicUrlData } = supabase.storage
          .from('voice_donations')
          .getPublicUrl(fileName)

        uploadedAudioUrl = publicUrlData.publicUrl
      }

      const streamerId = streamer.id || streamer.user_id
      const finalDonorName = donorName.trim() || t('anonymous')
      const networkName = CHAINS_CONFIG[selectedChain]?.name || 'Crypto'

      const { error: dbError } = await supabase
        .from('donations')
        .insert([
          {
            streamer_id: streamerId,
            network: networkName,
            donor_name: finalDonorName,
            amount: finalSum,
            token: networkName,
            message: message.trim(),
            voice_url: uploadedAudioUrl,
            status: 'pending',
          },
        ])

      if (dbError) throw dbError

      setPaymentStep('qr')
    } catch (err: any) {
      alert('Error: ' + err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'} flex items-center justify-center text-xs`}>
        {t('loading')}
      </div>
    )
  }

  if (!streamer) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'} flex flex-col items-center justify-center p-6 text-center`}>
        <h1 className="text-xl font-bold text-red-400">
          {t('notFnd')} @{username}
        </h1>
        <Link href="/" className="mt-4 text-xs text-indigo-400 hover:underline">
          {t('home')}
        </Link>
      </div>
    )
  }

  const availableChains = Object.keys(CHAINS_CONFIG).filter(
    (key) => {
      const conf = CHAINS_CONFIG[key]
      if (conf.fixedAddress) return true
      const dbCol = conf.dbKey
      return streamer[dbCol] && streamer[dbCol].trim() !== ''
    }
  )

  const currentConfig = CHAINS_CONFIG[selectedChain]
  const currentWalletAddress = currentConfig?.fixedAddress || (currentConfig?.dbKey ? streamer[currentConfig.dbKey] : '') || ''

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-900'} flex flex-col items-center justify-center p-4 transition-colors duration-300`}>
      <div className={`max-w-md w-full ${isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-xl'} border p-6 rounded-2xl shadow-xl space-y-6 backdrop-blur-md`}>
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/50 text-xs">
          <Link href="/" className="text-indigo-400 hover:text-indigo-300 transition font-medium">
            {t('home')}
          </Link>
          
          <div className="flex items-center gap-2">
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className={`px-2 py-1 rounded-lg border text-[11px] font-medium transition outline-none cursor-pointer ${
                isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-300 text-slate-700'
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
              type="button"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium transition cursor-pointer ${
                isDarkMode ? 'bg-slate-950 border-slate-800 text-amber-400 hover:bg-slate-800' : 'bg-slate-100 border-slate-300 text-indigo-600 hover:bg-slate-200'
              }`}
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>

        <div className="text-center space-y-1">
          <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent">
            {t('support')} @{streamer.username}
          </h1>
          <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            {t('subtitle')}
          </p>
        </div>

        {availableChains.length === 0 ? (
          <div className="text-center py-8 text-xs text-amber-400 bg-amber-950/20 border border-amber-900/40 rounded-xl p-4">
            {t('noWallet')}
          </div>
        ) : paymentStep === 'qr' ? (
          /* ЕКРАН 2: Визволяється після кліку "Донатити" -> Показуємо QR, суму з хвостиком та адресу */
          <div className="space-y-4">
            <div className={`flex flex-col items-center space-y-4 p-4 rounded-xl ${isDarkMode ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'} border`}>
              <div className="bg-white p-3 rounded-xl shadow-md">
                <QRCodeSVG value={currentWalletAddress} size={160} level="M" />
              </div>

              {/* Сума з хвостиком */}
              <div className="w-full p-3 bg-indigo-950/60 border border-indigo-800/60 rounded-xl text-center space-y-1">
                <span className="text-[11px] text-indigo-300 block">{t('exactAmountToSend')}</span>
                <span className="text-base font-bold font-mono text-emerald-400">
                  {finalCalculatedAmount} {CHAINS_CONFIG[selectedChain]?.name.split(' ')[0]}
                </span>
              </div>

              <div className="w-full space-y-1">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block text-center">
                  {t('walletAddress')} ({CHAINS_CONFIG[selectedChain]?.name}):
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={currentWalletAddress}
                    className={`w-full ${isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-white border-slate-300 text-slate-700'} border text-[11px] font-mono px-3 py-2 rounded-lg outline-none text-center`}
                  />
                  <button
                    type="button"
                    onClick={() => handleCopy(currentWalletAddress)}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-3 py-2 rounded-lg transition shrink-0 cursor-pointer"
                  >
                    {copied ? t('copied') : t('copy')}
                  </button>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl text-xs bg-emerald-950/50 text-emerald-400 border border-emerald-800/50 text-center font-medium">
              {t('success')}
            </div>

            <button
              type="button"
              onClick={() => {
                setPaymentStep('form')
                setSuccessMsg('')
              }}
              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium py-2.5 rounded-xl text-xs transition cursor-pointer"
            >
              ← {t('home')} / Новий донат
            </button>
          </div>
        ) : (
          /* ЕКРАН 1: Спочатку вибір мережі, ім'я, сума, повідомлення та голос, і тільки потім кнопка генерації */
          <>
            <div className="space-y-2">
              <label className={`text-[11px] font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                {t('selectNetwork')}
              </label>
              <div className="grid grid-cols-2 gap-2 max-h-44 overflow-y-auto pr-1">
                {availableChains.map((key) => {
                  const conf = CHAINS_CONFIG[key]
                  const isSelected = selectedChain === key
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        setSelectedChain(key)
                        setUniqueTail(0)
                      }}
                      className={`flex items-center justify-start space-x-2 py-2 px-3 rounded-xl border text-xs font-medium transition cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-600/30 border-indigo-500 text-white shadow-lg'
                          : isDarkMode 
                            ? 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800' 
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <span className="shrink-0">{conf.icon}</span>
                      <span className="truncate">{conf.name}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <form onSubmit={handleGeneratePayment} className={`space-y-3 pt-2 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
              <div className="space-y-1">
                <label className={`text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  {t('yourName')}
                </label>
                <input
                  type="text"
                  placeholder="CryptoKing"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  className={`w-full ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-300 text-slate-900'} border rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-500 transition`}
                />
              </div>

              <div className="space-y-1">
                <label className={`text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  {t('amount')} ({CHAINS_CONFIG[selectedChain]?.name}):
                </label>
                <input
                  type="number"
                  step="any"
                  required
                  placeholder="10"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value)
                    setUniqueTail(0)
                  }}
                  className={`w-full ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-300 text-slate-900'} border rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-500 transition font-mono`}
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className={`text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    {t('message')}
                  </label>
                  <span className="text-[10px] text-slate-500">
                    {message.length}/255
                  </span>
                </div>
                <textarea
                  rows={2}
                  maxLength={255}
                  placeholder="Great stream! 🔥"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className={`w-full ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-300 text-slate-900'} border rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-500 transition resize-none`}
                />
              </div>

              {/* Voice record block */}
              <div className="pt-2 border-t border-slate-800/40 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
                    {t('voiceNote')}
                  </span>
                  {isRecording && (
                    <span className="text-red-400 animate-pulse font-mono font-bold">
                      {recordingTime}s / 15s
                    </span>
                  )}
                </div>

                {isVoiceUnlocked ? (
                  <>
                    {!audioUrl ? (
                      <div>
                        {!isRecording ? (
                          <button
                            type="button"
                            onClick={startRecording}
                            className="w-full py-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-xl text-xs font-medium transition cursor-pointer flex items-center justify-center gap-2"
                          >
                            <span>⏺️ {t('recordVoice')}</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={stopRecording}
                            className="w-full py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-medium transition cursor-pointer flex items-center justify-center gap-2 animate-pulse"
                          >
                            <span>⏹️ {t('stopRecording')}</span>
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-800 p-2 rounded-xl">
                        <audio src={audioUrl} controls className="w-full h-7" />
                        <button
                          type="button"
                          onClick={deleteRecording}
                          className="px-2.5 py-1 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 rounded-lg text-xs transition shrink-0 cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className={`p-2.5 rounded-xl text-[11px] border text-center ${isDarkMode ? 'bg-slate-950/50 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                    🔒 {t('unlockVoice')} {minVoiceLimit} {t('toUnlock')}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2.5 rounded-xl text-xs transition shadow-lg cursor-pointer disabled:opacity-50"
              >
                {submitting ? t('sending') : t('sendDonation')}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}