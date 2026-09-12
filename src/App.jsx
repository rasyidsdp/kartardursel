import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Beranda from './pages/Beranda'
import Pengumuman from './pages/Pengumuman'
import Agenda from './pages/Agenda'
import Surat from './pages/Surat'
import Profil from './pages/Profil'
import Galeri from './pages/Galeri'
import Aspirasi from './pages/Aspirasi'

import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    setTimeout(() => {
      window.scrollTo(0, 0)
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
    }, 0)
  }, [pathname])
  return null
}

function AppLayout() {
  const { pathname } = useLocation()
  const isAdminRoute = pathname.startsWith('/admin')

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#fff' }}>
      {!isAdminRoute && <Navbar />}
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Beranda />} />
          <Route path="/pengumuman" element={<Pengumuman />} />
          <Route path="/agenda" element={<Agenda />} />
          <Route path="/surat" element={<Surat />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/galeri" element={<Galeri />} />
          <Route path="/aspirasi" element={<Aspirasi />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppLayout />
    </BrowserRouter>
  )
}
