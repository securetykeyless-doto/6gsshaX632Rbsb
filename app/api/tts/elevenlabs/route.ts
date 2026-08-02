import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { text, voice_id } = await req.json()

    if (!text || !voice_id) {
      return NextResponse.json({ error: 'Missing text or voice_id' }, { status: 400 })
    }

    const apiKey = process.env.ELEVENLABS_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'Server missing ELEVENLABS_API_KEY' }, { status: 500 })
    }

    // Запит до офіційного API ElevenLabs
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice_id}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
      },
      body: JSON.stringify({
        text: text,
        model_id: 'eleven_multilingual_v2', // найкраще підходить для української та інших мов
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('ElevenLabs API Error Details:', errorText)
      // Повертаємо детальний текст помилки від ElevenLabs на фронтенд для діагностики
      return NextResponse.json({ error: errorText }, { status: response.status })
    }

    const audioBuffer = await response.arrayBuffer()

    // Повертаємо готовий MP3-аудіопотік назад на віджет
    return new Response(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
      },
    })
  } catch (error: any) {
    console.error('TTS Route Error:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}