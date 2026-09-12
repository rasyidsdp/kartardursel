import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const navLinks = [
  { path: '/',            label: 'Beranda' },
  { path: '/pengumuman',  label: 'Pengumuman' },
  { path: '/agenda',      label: 'Agenda' },
  { path: '/profil',      label: 'Profil' },
]

const IconHome = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
)

const IconMenu = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
)
const IconX = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)

export default function Navbar() {
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(255,255,255,0.97)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #f0fdf4',
        boxShadow: '0 1px 20px rgba(22,101,52,0.06)',
      }}>
        <div className="section-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '68px' }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none' }}>
            <div><img src="/favicon.ico" alt="Logo" style={{ width: 32, height: 32, objectFit: 'contain' }} /></div>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
              <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--gray-900)' }}>Karang Taruna</span>
              <span style={{ fontSize: '0.65rem', color: 'var(--gray-400)', fontWeight: 600 }}>Kelurahan Duri Selatan</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }} className="desktop-nav">
            {navLinks.map(link => {
              const active = pathname === link.path
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: active ? 700 : 600,
                    color: active ? 'var(--brand-700)' : 'var(--gray-500)',
                    textDecoration: 'none',
                    position: 'relative',
                    paddingBottom: '4px',
                    transition: 'color 0.18s',
                  }}
                  onMouseEnter={e => { if (!active) e.target.style.color = 'var(--brand-700)' }}
                  onMouseLeave={e => { if (!active) e.target.style.color = 'var(--gray-500)' }}
                >
                  {link.label}
                  {active && (
                    <span style={{
                      position: 'absolute', bottom: 0, left: 0, right: 0,
                      height: '2px', borderRadius: '2px',
                      background: 'var(--brand-600)',
                    }} />
                  )}
                </Link>
              )
            })}

            {/* CTA Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link
                to="/surat"
                className="btn-primary"
                style={{ textDecoration: 'none', fontSize: '0.8125rem', padding: '0.5rem 1.125rem' }}
              >
                Ajukan Surat
              </Link>
              <Link
                to="/aspirasi"
                className="btn-primary"
                style={{ textDecoration: 'none', fontSize: '0.8125rem', padding: '0.5rem 1.125rem' }}
              >
                Aspirasi
              </Link>
            </div>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(o => !o)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-700)', display: 'none' }}
            className="mobile-menu-btn"
            aria-label="Toggle menu"
          >
            {menuOpen ? <IconX /> : <IconMenu />}
          </button>
        </div>

        {/* Mobile drawer */}
        {menuOpen && (
          <div style={{
            background: '#fff',
            borderTop: '1px solid var(--gray-100)',
            padding: '1rem 1.5rem 1.5rem',
            display: 'flex', flexDirection: 'column', gap: '0.25rem',
          }} className="mobile-drawer">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                style={{
                  padding: '0.75rem 0',
                  fontWeight: 600,
                  fontSize: '0.9375rem',
                  color: pathname === link.path ? 'var(--brand-700)' : 'var(--gray-600)',
                  textDecoration: 'none',
                  borderBottom: '1px solid var(--gray-100)',
                }}
              >
                {link.label}
              </Link>
            ))}
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
              <Link
                to="/surat"
                onClick={() => setMenuOpen(false)}
                className="btn-primary"
                style={{ textDecoration: 'none', flex: 1, justifyContent: 'center' }}
              >
                Ajukan Surat
              </Link>
              <Link
                to="/aspirasi"
                onClick={() => setMenuOpen(false)}
                className="btn-primary"
                style={{ textDecoration: 'none', flex: 1, justifyContent: 'center' }}
              >
                Aspirasi
              </Link>
            </div>
          </div>
        )}
      </nav>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </>
  )
}
