import { supabase } from '@/lib/supabase'

export async function processTronDonations() {
  try {
    // 1. Отримуємо всі незавершені донати для мережі Tron
    const { data: pendingDonations, error } = await supabase
      .from('donations')
      .select('*, streamers(wallet_tron)')
      .eq('status', 'pending')
      .eq('network', 'tron')

    if (error || !pendingDonations || pendingDonations.length === 0) {
      return { processed: 0 }
    }

    let processedCount = 0

    for (const donation of pendingDonations) {
      const recipientWallet = (donation.streamers as any)?.wallet_tron
      if (!recipientWallet) continue

      const expectedAmount = Number(donation.amount)
      const tolerance = 0.01 // Похибка

      // 2. Викликаємо публічний API TronGrid для отримання останніх транзакцій гаманця
      // Використовуємо загальнодоступний ендпоінт TronGrid
      const res = await fetch(`https://api.trongrid.io/v1/accounts/${recipientWallet}/transactions/trc20?limit=10`, {
        headers: {
          'Accept': 'application/json'
        }
      })
      
      const data = await res.json()
      if (!data || !data.success || !data.data) continue

      // 3. Перевіряємо транзакції (наприклад, USDT TRC-20 або рідний TRX)
      for (const tx of data.data) {
        // Перевіряємо, чи це входяча транзакція на нашу адресу
        if (tx.to && tx.to.toLowerCase() === recipientWallet.toLowerCase()) {
          // Сума в токенах (враховуючи decimals, зазвичай USDT має 6 знаків)
          const decimals = Number(tx.token_info?.decimals || 6)
          const txValue = Number(tx.value) / Math.pow(10, decimals)

          if (Math.abs(txValue - expectedAmount) <= tolerance) {
            // Знайдено збіг! Оновлюємо статус в БД
            const { error: updateError } = await supabase
              .from('donations')
              .update({ 
                status: 'completed', 
                tx_hash: tx.transaction_id 
              })
              .eq('id', donation.id)

            if (!updateError) {
              processedCount++
              console.log(` Tron донат #${donation.id} підтверджено за транзакцією ${tx.transaction_id}`)
            }
          }
        }
      }
    }

    return { processed: processedCount }
  } catch (err: any) {
    console.error('Помилка tronChecker:', err)
    return { error: err.message }
  }
}