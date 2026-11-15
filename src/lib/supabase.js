const SUPABASE_URL  = 'https://yxknnrkquislaixrstxl.supabase.co'
const SUPABASE_ANON = 'sb_publishable_-fwJk2eFDQYILOOY-laP8g_-ttER71T'

export async function supabaseInsert(table, payload) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON,
      'Authorization': `Bearer ${SUPABASE_ANON}`,
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(await res.text())
}
