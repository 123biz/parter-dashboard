'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import StatCard from '@/components/StatCard'
import PartnerTable from '@/components/PartnerTable'
import {
  Partner,
  getTotalRevenue,
  getNormalCount,
  getWarningCount,
  getPartnerRevenue,
  fetchPartners,
} from '@/lib/partners'
import { supabase } from '@/lib/supabase'

const PartnerMap = dynamic(() => import('@/components/PartnerMap'), { ssr: false })

function formatRevenue(amount: number): string {
  if (amount >= 100000000) return `${(amount / 100000000).toFixed(1)}억원`
  return `${(amount / 10000).toFixed(0)}만원`
}

export default function DashboardClient() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  const load = async () => {
    const data = await fetchPartners()
    setPartners(data)
    setLoading(false)
  }

  useEffect(() => {
    load()

    // partners 또는 products 테이블 변경 시 전체 재조회
    const channel = supabase
      .channel('dashboard-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'partners' }, load)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, load)
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  const top5 = [...partners]
    .sort((a, b) => getPartnerRevenue(b) - getPartnerRevenue(a))
    .slice(0, 5)

  const maxRevenue = top5[0] ? getPartnerRevenue(top5[0]) : 1

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f6fa] flex items-center justify-center">
        <div className="text-gray-400 text-sm">데이터 불러오는 중...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f5f6fa] text-gray-900">
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          <span className="text-sm font-semibold tracking-widest text-gray-700 uppercase">Partner Dashboard</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-gray-400">실시간 연동</span>
        </div>
      </header>

      <main className="px-8 py-6 space-y-6 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="총 거래처" value={`${partners.length}개`} sub="등록된 전체 거래처 수" accent="blue" />
          <StatCard title="이번 달 총 매출" value={formatRevenue(getTotalRevenue(partners))} sub="전 대리점 합산" accent="green" />
          <StatCard title="정상 거래처" value={`${getNormalCount(partners)}개`} sub={`전체의 ${Math.round((getNormalCount(partners) / partners.length) * 100)}%`} accent="green" />
          <StatCard title="경고 거래처" value={`${getWarningCount(partners)}개`} sub="점검이 필요한 거래처" accent="yellow" />
        </div>

        <div className="flex gap-4">
          <div className="flex-[3] bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-widest">거래처 위치 (서울)</h2>
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" />정상</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-yellow-500" />경고</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500" />선택됨</span>
                <span className="text-gray-300">|</span>
                <span>버블 크기 = 매출 비례</span>
              </div>
            </div>
            <div style={{ height: 400 }}>
              <PartnerMap partners={partners} selectedId={selectedId} onSelect={setSelectedId} />
            </div>
          </div>

          <div className="flex-[1] bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-widest">매출 Top 5</h2>
            </div>
            <div className="flex-1 px-5 py-4 flex flex-col justify-between gap-3">
              {top5.map((p, i) => {
                const rev = getPartnerRevenue(p)
                const barWidth = Math.round((rev / maxRevenue) * 100)
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedId(p.id)}
                    className={['w-full text-left rounded-lg px-3 py-2.5 transition-colors', selectedId === p.id ? 'bg-blue-50 ring-1 ring-blue-300' : 'hover:bg-gray-50'].join(' ')}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className={['w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0', i === 0 ? 'bg-yellow-400' : i === 1 ? 'bg-gray-400' : i === 2 ? 'bg-orange-400' : 'bg-gray-300'].join(' ')}>{i + 1}</span>
                        <span className="text-sm font-medium text-gray-800 truncate">{p.name}</span>
                      </div>
                      <span className="text-xs font-semibold text-blue-600 flex-shrink-0 ml-2">{formatRevenue(rev)}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div className="bg-blue-400 h-1.5 rounded-full transition-all" style={{ width: `${barWidth}%` }} />
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <PartnerTable partners={partners} selectedId={selectedId} onSelect={setSelectedId} />
      </main>
    </div>
  )
}
