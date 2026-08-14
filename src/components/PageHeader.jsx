export default function PageHeader({ title, subtitle }) {
  return (
    <div className="topbar">
      <div>
        <div className="page-title">{title}</div>
        <div className="page-sub">{subtitle}</div>
      </div>
    </div>
  )
}
