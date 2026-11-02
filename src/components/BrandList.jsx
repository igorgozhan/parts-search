import { useDispatch, useSelector } from 'react-redux'
import { loadOffers } from '../store/partsSlice'
import Loader from './Loader'
import Message from './Message'

export default function BrandList() {
  const dispatch = useDispatch()
  const { status, items, error } = useSelector((s) => s.parts.brands)
  const selected = useSelector((s) => s.parts.selected)

  if (status === 'idle') return null
  if (status === 'loading') return <Loader text="Ищем производителей..." />
  if (status === 'failed') return <Message type="danger">{error}</Message>
  if (!items.length) return <Message>По этому артикулу ничего не найдено.</Message>

  return (
    <section className="mb-4">
      <h2 className="h5">Выберите производителя</h2>
      <div className="list-group">
        {items.map((item) => {
          const active = selected?.brand === item.brand && selected?.number === item.number
          return (
            <button
              key={item.goodsID}
              type="button"
              className={`list-group-item list-group-item-action ${active ? 'active' : ''}`}
              onClick={() => dispatch(loadOffers({ number: item.number, brand: item.brand }))}
            >
              <strong>{item.brand}</strong> — {item.number}
              <div className="small">{item.name}</div>
            </button>
          )
        })}
      </div>
    </section>
  )
}
