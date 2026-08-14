export default function Modal({ onClose, children }) {
  return (
    <div
      className="modal-overlay open"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="modal">
        <button className="modal-close" onClick={onClose}>✕</button>
        {children}
      </div>
    </div>
  )
}
