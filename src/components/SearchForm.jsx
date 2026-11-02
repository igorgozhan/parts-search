import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loadBrands } from '../store/partsSlice'

export default function SearchForm() {
  const dispatch = useDispatch()
  const loading = useSelector((s) => s.parts.brands.status === 'loading')
  const [number, setNumber] = useState('')

  const submit = (e) => {
    e.preventDefault()
    const value = number.trim()
    if (value) dispatch(loadBrands(value))
  }

  return (
    <form onSubmit={submit} className="input-group input-group-lg">
      <input
        className="form-control search-input"
        placeholder="Введите артикул, например 01089"
        value={number}
        onChange={(e) => setNumber(e.target.value)}
        autoFocus
      />
      <button className="btn btn-primary" disabled={loading || !number.trim()}>
        Найти
      </button>
    </form>
  )
}
