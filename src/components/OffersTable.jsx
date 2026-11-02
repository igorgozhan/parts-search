import { useState } from 'react'
import { useSelector } from 'react-redux'
import Loader from './Loader'
import Message from './Message'

const PAGE_SIZE = 50

// Цена верхнего уровня (price) помечена в документации как «НЕ ИСПОЛЬЗОВАТЬ»,
// поэтому берём минимальную цену среди складов, где есть остаток.
function getPrice(item) {
  const prices = (item.warehouses ?? [])
    .filter((w) => w.stock > 0 && w.price > 0)
    .map((w) => w.price)
  return prices.length ? Math.min(...prices) : null
}

const formatPrice = (price) =>
  price === null
    ? '—'
    : `от ${price.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₽`

export default function OffersTable() {
  const { status, items, error } = useSelector((s) => s.parts.offers)
  const selected = useSelector((s) => s.parts.selected)
  const [visible, setVisible] = useState(PAGE_SIZE)

  if (status === 'idle') return null
  if (status === 'loading') return <Loader text="Загружаем аналоги и предложения..." />
  if (status === 'failed') return <Message type="danger">{error}</Message>
  if (!items.length) return <Message>Аналоги и предложения не найдены.</Message>

  return (
    <section>
      <h2 className="h5">
        Предложения для {selected.brand} {selected.number} ({items.length})
      </h2>
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead>
            <tr>
              <th>Название / Производитель</th>
              <th className="text-end">Цена</th>
              <th className="text-end">Остаток</th>
            </tr>
          </thead>
          <tbody>
            {items.slice(0, visible).map((item) => {
              const price = getPrice(item)
              const inStock = item.count > 0
              return (
              <tr key={item.goodsID} className={item.isOriginal ? 'table-primary' : ''}>
                <td>
                  <div>
                    {item.name}
                    {item.isOriginal && <span className="badge text-bg-primary ms-2">искомая деталь</span>}
                  </div>
                  <div className="small text-secondary">
                    {item.brand} · {item.number}
                  </div>
                </td>
                <td className={`text-end text-nowrap ${price === null ? 'text-secondary opacity-75' : ''}`}>
                  {formatPrice(price)}
                </td>
                <td className={`text-end ${inStock ? '' : 'text-secondary opacity-75'}`}>
                  {inStock ? `${item.count} шт.` : 'нет\u00A0в наличии'}
                </td>
              </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {visible < items.length && (
        <button className="btn btn-outline-secondary" onClick={() => setVisible(visible + PAGE_SIZE)}>
          Показать ещё
        </button>
      )}
    </section>
  )
}
