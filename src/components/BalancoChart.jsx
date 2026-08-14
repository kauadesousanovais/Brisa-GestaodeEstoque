import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { MONTHS, fmtBRL } from '../utils/format'
import { monthlyRevenue, monthlyCost } from '../utils/calculations'

export default function BalancoChart({ months, sales, movements }) {
  const data = months.map((i) => ({
    mes: MONTHS[i].slice(0, 3),
    Entradas: monthlyRevenue(sales, i),
    Gastos: monthlyCost(movements, i),
  }))

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid stroke="#E2DFD5" vertical={false} />
        <XAxis dataKey="mes" tick={{ fill: '#98948A', fontFamily: 'IBM Plex Mono', fontSize: 11 }} axisLine={{ stroke: '#E2DFD5' }} tickLine={false} />
        <YAxis tick={{ fill: '#98948A', fontFamily: 'IBM Plex Mono', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `R$${v}`} />
        <Tooltip
          formatter={(v) => fmtBRL(v)}
          contentStyle={{ background: '#FFFFFF', border: '1px solid #E2DFD5', borderRadius: 2, fontFamily: 'Work Sans' }}
          labelStyle={{ color: '#1A1A18' }}
          cursor={{ fill: 'rgba(110,126,88,0.05)' }}
        />
        <Legend wrapperStyle={{ fontFamily: 'Work Sans', fontSize: 11.5, color: '#5C594F' }} />
        <Bar dataKey="Entradas" fill="#4C7A56" radius={[3, 3, 0, 0]} maxBarSize={26} />
        <Bar dataKey="Gastos" fill="#A8573F" radius={[3, 3, 0, 0]} maxBarSize={26} />
      </BarChart>
    </ResponsiveContainer>
  )
}
