import { fetchPartners } from '@/lib/partners'
import DashboardClient from './dashboard-client'

export default async function DashboardPage() {
  const partners = await fetchPartners()
  return <DashboardClient partners={partners} />
}
