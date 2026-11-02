// Клиент для API «Проценка» (см. wsprice.pdf).
// Ключ берётся из .env (VITE_API_KEY); по умолчанию — демо-ключ из документации.
const API_URL = 'http://api.favorit-parts.ru/hs/hsprice/'
const API_KEY =
  import.meta.env.VITE_API_KEY || '00000000-0000-0000-0000-000000000001'

async function request(params) {
  const query = new URLSearchParams({ key: API_KEY, ...params }) // сам экранирует спецсимволы

  let response
  try {
    response = await fetch(`${API_URL}?${query}`)
  } catch {
    throw new Error('Сбой сети: не удалось связаться с сервером')
  }
  if (!response.ok) {
    throw new Error(`Ошибка сервера: HTTP ${response.status}`)
  }

  let data
  try {
    data = await response.json()
  } catch {
    throw new Error('Сервер вернул некорректный ответ')
  }

  // В случае ошибки API возвращает { error: "..." } (строка или массив строк)
  if (data?.error) {
    throw new Error([].concat(data.error).join('; '))
  }
  // «Товар не найден» — массив с одной пустой структурой, поэтому отфильтровываем её
  return (data?.goods ?? []).filter((item) => item.number)
}

// Этап 1: все детали с этим номером -> из них берём производителей
export function fetchBrands(number) {
  return request({ number })
}

// Этап 2: искомая деталь + аналоги
export async function fetchOffers(number, brand) {
  const goods = await request({ number, brand, analogues: 'on' })
  const seen = new Set()
  const result = []
  // Искомая деталь идёт первой, затем её аналоги
  goods.forEach((item) => {
    ;[{ ...item, isOriginal: true }, ...(item.analogues ?? [])].forEach((g) => {
      if (!g.number || seen.has(g.goodsID)) return
      seen.add(g.goodsID)
      result.push(g)
    })
  })
  return result
}
