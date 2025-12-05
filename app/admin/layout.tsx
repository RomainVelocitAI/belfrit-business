import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminSidebar } from '@/components/admin/sidebar'
import { AdminHeader } from '@/components/admin/header'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin-login')
  }

  // Récupérer les infos admin
  const { data: admin } = await supabase
    .from('admins')
    .select('*')
    .eq('email', user.email)
    .single()

  if (!admin || !admin.actif) {
    redirect('/admin-login?error=unauthorized')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <AdminSidebar admin={admin} />

      {/* Main content */}
      <div className="lg:pl-64">
        <AdminHeader admin={admin} />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
