import { NextResponse } from 'next/server'
import { processEvmDonations } from '@/lib/evmChecker'
import { processSolanaDonations } from '@/lib/solanaChecker'
import { processTronDonations } from '@/lib/tronChecker'

export async function GET(request: Request) {
  try {
    // Безпека: перевіряємо заголовок авторизації від Vercel Cron
    const authHeader = request.headers.get('authorization')
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Запускаємо перевірки паралельно для всіх трьох мереж
    const evmResult = await processEvmDonations()
    const solanaResult = await processSolanaDonations()
    const tronResult = await processTronDonations()

    return NextResponse.json({
      success: true,
      results: {
        evm: evmResult,
        solana: solanaResult,
        tron: tronResult,
      },
      timestamp: new Date().toISOString()
    })
  } catch (err: any) {
    console.error('Помилка виконання cron-завдання:', err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}