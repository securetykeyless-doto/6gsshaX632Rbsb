import { ethers } from 'ethers'
import { supabase } from '@/lib/supabase'

// Підключення до EVM ноди (наприклад, Base network)
const provider = new ethers.JsonRpcProvider(process.env.EVM_RPC_URL || 'https://mainnet.base.org')

export async function processEvmDonations() {
  try {
    // 1. Отримуємо всі незавершені (pending) донати для EVM мереж
    const { data: pendingDonations, error } = await supabase
      .from('donations')
      .select('*')
      .eq('status', 'pending')
      .eq('network', 'evm')

    if (error || !pendingDonations || pendingDonations.length === 0) {
      return { processed: 0 }
    }

    // Адреса нашого платформного приймача / контракту
    const platformReceiver = process.env.NEXT_PUBLIC_PLATFORM_EVMC_ADDRESS?.toLowerCase()
    if (!platformReceiver) {
      console.error('Не задано NEXT_PUBLIC_PLATFORM_EVMC_ADDRESS у .env')
      return { processed: 0 }
    }

    // 2. Отримуємо останні транзакції на нашу адресу через провайдер
    // (Для продуктиву краще використовувати Alchemy/Blockscout API, але для RPC перевіряємо останні блоки)
    const latestBlock = await provider.getBlock('latest', true)
    if (!latestBlock || !latestBlock.prefetchedTransactions) {
      return { processed: 0 }
    }

    let processedCount = 0

    // 3. Проходимося по кожному очікуваному донату
    for (const donation of pendingDonations) {
      const expectedAmount = Number(donation.amount) // Наприклад: 10.4215
      const tolerance = 0.01 // Похибка на випадок комісій

      // Шукаємо транзакцію в останньому блоці, яка надійшла на нашу адресу
      for (const tx of latestBlock.prefetchedTransactions) {
        if (tx.to && tx.to.toLowerCase() === platformReceiver) {
          const txValue = Number(ethers.formatEther(tx.value))

          // Перевіряємо, чи вкладається сума в діапазон з урахуванням хвостика та похибки
          if (Math.abs(txValue - expectedAmount) <= tolerance) {
            // Знайдено збіг! Оновлюємо статус донату в Supabase
            const { error: updateError } = await supabase
              .from('donations')
              .update({ 
                status: 'completed', 
                tx_hash: tx.hash 
              })
              .eq('id', donation.id)

            if (!updateError) {
              processedCount++
              console.log(`Донат #${donation.id} успішно підтверджено за транзакцією ${tx.hash}`)
            }
          }
        }
      }
    }

    return { processed: processedCount }
  } catch (err: any) {
    console.error('Помилка у processEvmDonations:', err)
    return { error: err.message }
  }
}