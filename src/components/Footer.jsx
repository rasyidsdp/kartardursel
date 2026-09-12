import { Link } from 'react-router-dom'

const IconHome = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
)

const IconMapPin = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
)

export default function Footer() {
  return (
    <footer style={{ background: '#f8faf9', borderTop: '1px solid var(--gray-100)', paddingTop: '4rem', paddingBottom: '2rem', marginTop: '2.5rem' }}>
      <div className="section-container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
          {/* Brand */}
          <div style={{ maxWidth: '300px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1rem' }}>
              <div><img src="/favicon.ico" alt="Logo" style={{ width: 32, height: 32, objectFit: 'contain' }} /></div>
              <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--gray-900)' }}>Karang Taruna</span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)', lineHeight: 1.7, fontWeight: 500 }}>
              Kelurahan Duri Selatan, Kecamatan Tambora,<br />
              Kota Jakarta Barat.<br />
              Bergerak bersama untuk kemajuan masyarakat.
            </p>
            {/* Google Maps link */}
            <a
              href="https://maps.google.com/?q=Kelurahan+Duri+Selatan,+Kecamatan+Tambora,+Jakarta+Barat"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                marginTop: '0.875rem', fontSize: '0.8125rem', fontWeight: 600,
                color: 'var(--brand-700)', textDecoration: 'none',
                background: 'var(--brand-50)', border: '1px solid var(--brand-200)',
                padding: '0.4rem 0.875rem', borderRadius: '0.625rem',
                transition: 'all 0.18s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--brand-100)'; e.currentTarget.style.borderColor = 'var(--brand-600)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--brand-50)'; e.currentTarget.style.borderColor = 'var(--brand-200)' }}
            >
              <IconMapPin />
              Lihat di Google Maps
            </a>
          </div>

          {/* Wilayah */}
          <div>
            <h4 style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--gray-900)', marginBottom: '1.25rem' }}>
              Wilayah
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {['RW 001', 'RW 002', 'RW 003', 'RW 004', 'RW 005', 'RW 006'].map(rw => (
                <li key={rw} style={{ fontSize: '0.875rem', color: 'var(--gray-500)', fontWeight: 500 }}>{rw}</li>
              ))}
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <h4 style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--gray-900)', marginBottom: '1.25rem' }}>
              Kontak
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <li>
                <a href="https://wa.me/628989625550" target="_blank" rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem', color: 'var(--gray-500)', fontWeight: 500, textDecoration: 'none' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--brand-700)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--gray-500)'}
                >
                  <span style={{ width: 32, height: 32, background: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-600)', border: '1px solid var(--gray-100)', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', flexShrink: 0 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.21 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  </span>
                  0898-9625-550
                </a>
              </li>
              <li>
                <a href="mailto:kt.duriselatan@gmail.com"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem', color: 'var(--gray-500)', fontWeight: 500, textDecoration: 'none' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--brand-700)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--gray-500)'}
                >
                  <span style={{ width: 32, height: 32, background: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-600)', border: '1px solid var(--gray-100)', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', flexShrink: 0 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  </span>
                  kt.duriselatan@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--gray-200)', paddingTop: '1.5rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--gray-400)', fontWeight: 500 }}>© 2026 Karang Taruna Kelurahan Duri Selatan</p>
          <p style={{ fontSize: '0.75rem', color: 'var(--gray-400)', fontWeight: 500 }}>
            Dibuat oleh <span style={{ color: 'var(--gray-600)', fontWeight: 700 }}>Sie TIK Unit 05</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
