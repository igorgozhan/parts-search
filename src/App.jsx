import { useSelector } from 'react-redux'
import SearchForm from './components/SearchForm'
import BrandList from './components/BrandList'
import OffersTable from './components/OffersTable'

export default function App() {
  // key заставляет таблицу сбрасывать «Показать ещё» при выборе другого производителя
  const selected = useSelector((s) => s.parts.selected)
  const tableKey = selected ? `${selected.brand}|${selected.number}` : 'none'

  return (
    <div className="container-fluid py-4 px-3 px-lg-4" style={{ maxWidth: 1600 }}>
      <h1 className="h3 mb-4">Поиск автозапчастей и аналогов</h1>
      <SearchForm />
      {/* На широких экранах колонки рядом, на узких — друг под другом */}
      <div className="row mt-4">
        <div className="col-12 col-lg-4 col-xl-3">
          <BrandList />
        </div>
        <div className="col-12 col-lg-8 col-xl-9">
          <OffersTable key={tableKey} />
        </div>
      </div>
    </div>
  )
}
