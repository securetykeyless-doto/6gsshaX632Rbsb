import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, amount, network, donorName, message } = body

    if (!username || !amount || !network) {
      return NextResponse.json({ error: 'Не передано обовʼязкові поля' }, { status: 400 })
    }

    // 1. Знаходимо стрімера в базі за нікнеймом
    const { data: streamer, error: streamerError } = await supabase
      .from('streamers')
      .select('*')
      .eq('username', username.toLowerCase())
      .single()

    if (streamerError || !streamer) {
      return NextResponse.json({ error: 'Стрімера не знайдено' }, { status: 404 })
    }

    // 2. Витягуємо правильну адресу відповідно до твоїх колонок у Supabase
    let receiverAddress = 'Адреса не вказана'
    if (network === 'evm') {
      receiverAddress = streamer.wallet_eth || streamer.wallet_address || '0x...'
    } else if (network === 'solana') {
      receiverAddress = streamer.wallet_solana || 'Адреса Solana не вказана'
    } else if (network === 'tron') {
      receiverAddress = streamer.wallet_tron || 'Адреса Tron не вказана'
    }

    // 3. Генеруємо унікальний "хвостик"
    const randomTail = Math.floor(Math.random() * 9000 + 1000) / 100000 
    const finalAmount = Number((Number(amount) + randomTail).toFixed(5))

    // 4. Зберігаємо донат у базу зі статусом 'pending'
    const { data: donation, error: insertError } = await supabase
      .from('donations')
      .insert({
        streamer_id: streamer.id,
        username: streamer.username,
        amount: finalAmount,
        network: network,
        donor_name: donorName || 'Анонім',
        message: message || '',
        status: 'pending',
      })
      .select()
      .single()

    if (insertError) throw insertError

    return NextResponse.json({
      success: true,
      donationId: donation.id,
      finalAmount: finalAmount,
      receiverAddress: receiverAddress,
    })

} catch (err: any) {
    console.error('Помилка створення донату:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}