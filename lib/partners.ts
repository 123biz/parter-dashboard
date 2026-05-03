import { supabase } from './supabase'

export type PartnerStatus = 'normal' | 'warning'

export interface Product {
  id: number
  partner_id: number
  name: string
  monthly_revenue: number
  created_at: string
}

export interface Partner {
  id: number
  name: string
  address: string
  lat: number
  lng: number
  manager_name: string
  phone: string
  status: PartnerStatus
  created_at: string
  products: Product[]
}

export async function fetchPartners(): Promise<Partner[]> {
  const { data, error } = await supabase
    .from('partners')
    .select('*, products(*)')
    .order('id')

  if (error) throw new Error(`대리점 조회 실패: ${error.message}`)
  return (data ?? []) as Partner[]
}

export function getPartnerRevenue(partner: Partner): number {
  return partner.products.reduce((sum, p) => sum + p.monthly_revenue, 0)
}

export function getTotalRevenue(partners: Partner[]): number {
  return partners.reduce((sum, p) => sum + getPartnerRevenue(p), 0)
}

export function getNormalCount(partners: Partner[]): number {
  return partners.filter((p) => p.status === 'normal').length
}

export function getWarningCount(partners: Partner[]): number {
  return partners.filter((p) => p.status === 'warning').length
}
