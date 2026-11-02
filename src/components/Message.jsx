// Универсальное сообщение: type = 'danger' (ошибка) или 'info' (пустой результат)
export default function Message({ type = 'info', children }) {
  return (
    <div className={`alert alert-${type} mb-3`} role="alert">
      {children}
    </div>
  )
}
