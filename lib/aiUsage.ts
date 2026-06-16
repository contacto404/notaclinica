import { createClient } from '@supabase/supabase-js'

// Tope diario de llamadas a IA por usuario (anti-abuso / control de costos).
// Generoso para no molestar a usuarios reales.
export const AI_DAILY_LIMIT = 200

// Devuelve true si puede seguir; false si superó el tope del día.
// Fail-open: ante cualquier error (o si la tabla no existe aún) deja pasar.
export async function checkAiQuota(userId: string): Promise<boolean> {
  try {
    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const day = new Date().toISOString().slice(0, 10)
    const { data, error } = await admin
      .from('ai_usage')
      .select('count')
      .eq('user_id', userId)
      .eq('day', day)
      .maybeSingle()
    if (error) return true
    const count = data?.count ?? 0
    if (count >= AI_DAILY_LIMIT) return false
    await admin
      .from('ai_usage')
      .upsert({ user_id: userId, day, count: count + 1 }, { onConflict: 'user_id,day' })
    return true
  } catch {
    return true
  }
}
