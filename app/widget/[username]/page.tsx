'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const ELEVEN_LABS_VOICES: Record<string, string> = {
  'eLDtXX7z65CuLasDRxrP': 'Rachel',
  'AZnzlk1XvdvUeBnXmlld': 'Domi',
  'EXAVITQu4vr4xnSDxMaL': 'Bella',
  'ErXwobaYiN019PkySvjV': 'Antoni',
  'MF3mGyEYCl7XYWbV9V6O': 'Elli',
  'TxGEqnHWrfWFTfGW9XjX': 'Josh',
  'VR6AewLTigWG4xSOukaG': 'Arnold',
  'pNInz6obpgDQGcFmaJgB': 'Adam',
  'yoZ06aMxZJJ28mfd3POQ': 'Sam',
  '2EiwWnXFnvU5JabPnv8n': 'Clyde',
  'CYw3kZ02Hs0563khs1Fj': 'Dave',
  'ThT5KcBeYPX3keUQqHPh': 'Dorothy',
  'onwK4e9ZLuTAKqWW03F9': 'Daniel',
  'pFZP5JQG7iQjIQuC4Bku': 'Lily',
}

export default function AlertWidgetPage() {
  const params = useParams()
  const username = params.username as string

  const [currentDonation, setCurrentDonation] = useState<any>(null)
  const [streamerSettings, setStreamerSettings] = useState<any>(null)
  const [isReady, setIsReady] = useState(false)

  // Черга донатів та прапорець зайнятості плеєра
  const [donationQueue, setDonationQueue] = useState<any[]>([])
  const [isProcessingQueue, setIsProcessingQueue] = useState(false)
  const queueRef = useRef<any[]>([])
  queueRef.current = donationQueue

  const processingRef = useRef(false)
  processingRef.current = isProcessingQueue

  // Завантажуємо налаштування стрімера
  useEffect(() => {
    if (!username) return

    async function loadStreamerSettings() {
      const { data: streamer } = await supabase
        .from('streamers')
        .select('*')
        .eq('username', username)
        .single()

      if (streamer) {
        setStreamerSettings(streamer)
      }
    }

    loadStreamerSettings()
  }, [username])

  const getActiveGif = () => {
    if (!streamerSettings) return null

    const customGifs = [
      streamerSettings.gif_url_1,
      streamerSettings.gif_url_2,
      streamerSettings.gif_url_3,
    ].filter(Boolean)

    if (customGifs.length > 0) {
      const randomIndex = Math.floor(Math.random() * customGifs.length)
      return customGifs[randomIndex]
    }

    return null
  }

  // Обгортка для TTS з підтримкою промісів (щоб черга чекала завершення озвучки)
  const handleTTS = (donationData: any): Promise<void> => {
    return new Promise((resolve) => {
      if (!streamerSettings) {
        resolve()
        return
      }

      const isTtsEnabled = streamerSettings.tts_enabled ?? true
      if (!isTtsEnabled || !donationData.message || donationData.message.trim() === '') {
        resolve()
        return
      }

      const textToSpeak = `${donationData.donor_name} надіслав ${donationData.amount} ${donationData.token}. ${donationData.message}`
      const voiceId = streamerSettings.eleven_labs_voice_id || streamerSettings.elevenLabsVoiceId

      if (voiceId && voiceId.trim() !== '') {
        fetch('/api/tts/elevenlabs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: textToSpeak, voice_id: voiceId }),
        })
          .then(async (response) => {
            if (response.ok) {
              const blob = await response.blob()
              const audioUrl = URL.createObjectURL(blob)
              const elevenAudio = new Audio(audioUrl)
              elevenAudio.volume = 1.0
              elevenAudio.onended = () => resolve()
              elevenAudio.onerror = () => resolve()
              elevenAudio.play().catch(() => resolve())
            } else {
              fallbackBrowserTTS(textToSpeak, resolve)
            }
          })
          .catch(() => {
            fallbackBrowserTTS(textToSpeak, resolve)
          })
      } else {
        fallbackBrowserTTS(textToSpeak, resolve)
      }
    })
  }

  const fallbackBrowserTTS = (text: string, onEnd: () => void) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'uk-UA'
      utterance.rate = 1.0
      utterance.pitch = 1.0
      utterance.onend = () => onEnd()
      utterance.onerror = () => onEnd()
      window.speechSynthesis.speak(utterance)
    } else {
      onEnd()
    }
  }

  // Послідовне відтворення аудіо (голос глядача -> кастомний звук -> TTS)
  const playNotificationAudio = (donationData: any): Promise<void> => {
    return new Promise((resolve) => {
      // 1. Голосове повідомлення глядача
      if (donationData.voice_url) {
        const voiceAudio = new Audio(donationData.voice_url)
        voiceAudio.volume = 1.0
        voiceAudio.onended = () => resolve()
        voiceAudio.onerror = () => resolve()
        voiceAudio.play().catch(() => resolve())
        return
      }

      // 2. Власний звуковий алерт стрімера
      const soundToPlay = streamerSettings?.sound_url
      if (soundToPlay && soundToPlay.trim() !== '') {
        const audio = new Audio(soundToPlay)
        audio.volume = 0.9
        audio.onended = async () => {
          await handleTTS(donationData)
          resolve()
        }
        audio.onerror = async () => {
          await handleTTS(donationData)
          resolve()
        }
        audio.play().catch(async () => {
          await handleTTS(donationData)
          resolve()
        })
        return
      }

      // 3. Чистий TTS
      handleTTS(donationData).then(() => resolve())
    })
  }

  // Обробник показу одного алерта
  const processNextDonation = async () => {
    if (queueRef.current.length === 0) {
      setIsProcessingQueue(false)
      return
    }

    setIsProcessingQueue(true)
    const nextDonation = queueRef.current[0]

    // Знімаємо з черги
    setDonationQueue((prev) => prev.slice(1))

    // Показуємо на екрані
    setCurrentDonation({
      ...nextDonation,
      activeGif: getActiveGif(),
    })

    // Чекаємо поки програється звук/голос/TTS (мінімум 4 секунди або довжину аудіо)
    await Promise.all([
      playNotificationAudio(nextDonation),
      new Promise((res) => setTimeout(res, 8000)) // Час відображення картки на екрані
    ])

    // Ховаємо картку
    setCurrentDonation(null)

    // Пауза між алертами (0.8 сек)
    await new Promise((res) => setTimeout(res, 800))

    // Рекурсивно викликаємо наступний
    processNextDonation()
  }

  // Додавання нового донату в чергу
  const enqueueDonation = (donationData: any) => {
    // Фільтруємо непідтверджені (пропускаємо, якщо статус pending)
    if (donationData.status && donationData.status !== 'completed') {
      return
    }

    setDonationQueue((prev) => [...prev, donationData])
  }

  // Ефект запуску черги
  useEffect(() => {
    if (!isProcessingQueue && donationQueue.length > 0) {
      processNextDonation()
    }
  }, [donationQueue, isProcessingQueue])

  // Підписка на події Supabase
  useEffect(() => {
    if (!username || !streamerSettings) return

    const streamerId = streamerSettings.id || streamerSettings.user_id

    const channel = supabase
      .channel(`streamer_${streamerId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'donations',
          filter: `streamer_id=eq.${streamerId}`,
        },
        (payload) => {
          enqueueDonation(payload.new)
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'donations',
          filter: `streamer_id=eq.${streamerId}`,
        },
        (payload) => {
          // Якщо донат змінив статус з pending на completed (блокчейн підтвердив)
          const oldStatus = (payload.old as any)?.status
          const newStatus = (payload.new as any)?.status
          if (oldStatus !== 'completed' && newStatus === 'completed') {
            enqueueDonation(payload.new)
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'streamers',
          filter: `id=eq.${streamerId}`,
        },
        (payload) => {
          const newData = payload.new as any
          if (newData && newData.last_donation_data) {
            enqueueDonation(newData.last_donation_data)
          }
        }
      )
      .on('broadcast', { event: 'new_donation' }, (payload) => {
        if (payload && payload.payload) {
          enqueueDonation(payload.payload)
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [username, streamerSettings])

  if (!isReady) {
    return (
      <div 
        onClick={() => setIsReady(true)}
        className="min-h-screen bg-transparent flex items-center justify-center p-6 cursor-pointer"
      >
        <div className="bg-slate-900/90 border border-emerald-500/50 text-white px-6 py-4 rounded-xl shadow-2xl text-center animate-pulse">
          <p className="text-xs font-semibold text-emerald-400">Клікніть тут, щоб активувати звук алертів у OBS</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center p-6 overflow-hidden">
      {currentDonation && (
        <div className="animate-bounce bg-slate-900/95 border border-indigo-500/50 text-white p-6 rounded-2xl shadow-2xl max-w-sm w-full backdrop-blur-md space-y-4 text-center">
          {currentDonation.activeGif && (
            <div className="flex justify-center">
              <img 
                src={currentDonation.activeGif} 
                alt="Alert GIF" 
                className="max-h-32 rounded-xl object-contain shadow-md"
              />
            </div>
          )}

          <div className="space-y-1">
            <div className="text-xs uppercase tracking-wider text-indigo-400 font-semibold">
              Новий донат! 🎉
            </div>
            <div className="text-lg font-bold">
              {currentDonation.donor_name} надіслав {currentDonation.amount} {currentDonation.token}!
            </div>
          </div>

          {currentDonation.message && (
            <p className="text-sm text-slate-300 italic bg-slate-950/50 p-3 rounded-xl border border-slate-800 break-words [overflow-wrap:anywhere]">
              &ldquo;{currentDonation.message}&rdquo;
            </p>
          )}
        </div>
      )}
    </div>
  )
}