import { badgeClass, badgeIcon } from '../../data/db'

export function EstadoBadge({ estado }) {
  return <span className={`b-estado ${badgeClass(estado)}`}>{badgeIcon(estado)} {estado}</span>
}
export function Modal({ open, onClose, title, children, footer, wide }) {
  if (!open) return null
  return (
    <div className="modal-bg" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className={`modal-box${wide?' wide':''}`}>
        <div className="modal-hdr"><h4>{title}</h4><button className="close-btn" onClick={onClose}><i className="bi bi-x"/></button></div>
        <div className="modal-bdy">{children}</div>
        {footer&&<div className="modal-ftr">{footer}</div>}
      </div>
    </div>
  )
}
export function Confirm({ open, msg, onConfirm, onCancel }) {
  return (
    <Modal open={open} onClose={onCancel} title="Confirmar" footer={<>
      <button className="btn-rt btn-ghost" onClick={onCancel}>Cancelar</button>
      <button className="btn-rt btn-danger" onClick={onConfirm}>Confirmar</button>
    </>}>
      <div className="alerta warning"><i className="bi bi-exclamation-triangle"/> {msg}</div>
    </Modal>
  )
}
export function ToastContainer({ toasts }) {
  return (
    <div className="toast-container">
      {toasts.map(t=><div key={t.id} className={`toast-msg ${t.type}`}>{t.msg}</div>)}
    </div>
  )
}
export function StockBar({ value, max=20 }) {
  const pct=Math.min(100,(value/max)*100)
  const color=value<=3?'var(--rt-danger)':value<=8?'var(--rt-warn)':'var(--rt-cyan)'
  return <div className="stock-bar" style={{flex:1}}><div className="stock-fill" style={{width:`${pct}%`,background:color}}/></div>
}
export function EmptyState({ icon='bi-inbox', text='Sin datos.' }) {
  return <div className="empty-state"><i className={`bi ${icon}`}/><p>{text}</p></div>
}
