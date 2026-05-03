'use client'

import { Partner, getPartnerRevenue } from '@/lib/partners'

interface PartnerTableProps {
  partners: Partner[]
  selectedId: number | null
  onSelect: (id: number) => void
}

function formatRevenue(amount: number): string {
  if (amount >= 100000000) return `${(amount / 100000000).toFixed(1)}억`
  return `${(amount / 10000).toFixed(0)}만원`
}

export default function PartnerTable({ partners, selectedId, onSelect }: PartnerTableProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-widest">거래처 목록</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              {['거래처명', '담당자', '연락처', '취급 상품', '월 매출액', '상태'].map((h) => (
                <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {partners.map((p) => (
              <tr
                key={p.id}
                onClick={() => onSelect(p.id)}
                className={[
                  'border-b border-gray-50 cursor-pointer transition-colors',
                  selectedId === p.id
                    ? 'bg-blue-50 border-l-2 border-l-blue-500'
                    : 'hover:bg-gray-50',
                ].join(' ')}
              >
                <td className="px-6 py-4 font-medium text-gray-900">{p.name}</td>
                <td className="px-6 py-4 text-gray-500">{p.manager_name}</td>
                <td className="px-6 py-4 text-gray-500 font-mono">{p.phone}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {p.products.map((prod) => (
                      <span key={prod.id} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                        {prod.name}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-700 font-semibold">{formatRevenue(getPartnerRevenue(p))}</td>
                <td className="px-6 py-4">
                  <span className={[
                    'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium',
                    p.status === 'normal' ? 'bg-emerald-50 text-emerald-700' : 'bg-yellow-50 text-yellow-700',
                  ].join(' ')}>
                    <span className={['w-1.5 h-1.5 rounded-full', p.status === 'normal' ? 'bg-emerald-500' : 'bg-yellow-500'].join(' ')} />
                    {p.status === 'normal' ? '정상' : '경고'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
