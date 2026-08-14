import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { MONTHS, fmtBRL } from '../utils/format'
import { monthlyProfit } from '../utils/calculations'

export default function VendasChart({ months, sales, products }) {
  const data = months.map((i) => ({
    mes: MONTHS[i].slice(0, 3),
    lucro: monthlyProfit(sales, products, i),
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
          cursor={{ fill: 'rgba(110,126,88,0.06)' }}
        />
        <Bar dataKey="lucro" fill="#6E7E58" radius={[3, 3, 0, 0]} maxBarSize={38} />
      </BarChart>
    </ResponsiveContainer>
  )
}
