import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import LoadingSpinner from '../components/LoadingSpinner'

export default function Galeri() {
  const [selected, setSelected] = useState(null)
  const [galeriItems, setGaleriItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchGaleri = async () => {
      const { data } = await supabase.from('galeri').select('*').order('urutan', { ascending: true })
      if (data) {
        setGaleriItems(data.filter(item => item.foto_url))
      }
      setLoading(false)
    }
    fetchGaleri()
  }, [])

  return (
    <div className="page-enter" style={{ paddingBottom: '3rem' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, var(--brand-900) 0%, var(--brand-700) 100%)', padding: '3rem 1.5rem 4rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 300, height: 300, background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -40, width: 220, height: 220, background: 'rgba(255,255,255,0.04)', borderRadius: '50%' }} />
        <div className="section-container">
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600, marginBottom: '1.25rem', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.8)'}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            Kembali ke Beranda
          </Link>
          <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>
            Galeri Kegiatan
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9375rem', fontWeight: 500 }}>
            Dokumentasi foto dan momen kegiatan warga Duri Selatan.
          </p>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8125rem', fontWeight: 500, marginTop: '0.5rem' }}>
            {!loading && galeriItems.length} foto tersedia
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="section-container" style={{ marginTop: '2rem' }}>
        {loading ? (
          <LoadingSpinner text="Memuat galeri..." />
        ) : galeriItems.length === 0 ? (
          <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>Belum ada foto galeri.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
            {galeriItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelected(item)}
                style={{ borderRadius: '1rem', overflow: 'hidden', cursor: 'pointer', position: 'relative', aspectRatio: '4/3', boxShadow: '0 2px 12px rgba(0,0,0,0.1)', transition: 'transform 0.2s, box-shadow 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.2)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.1)' }}
              >
                {item.foto_url ? (
                  <img src={item.foto_url} alt={item.judul} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', background: item.bg_gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>
                    {item.icon_emoji}
                  </div>
                )}
                {/* Overlay */}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 50%)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '1rem' }}>
                  <h3 style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#fff', lineHeight: 1.3 }}>{item.judul}</h3>
                  {item.bulan_tahun && <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', marginTop: '0.25rem' }}>{item.bulan_tahun}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {selected && createPortal(
        <div
          onClick={() => setSelected(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', cursor: 'pointer' }}
        >
          <div onClick={e => e.stopPropagation()} style={{ maxWidth: 800, width: '100%', borderRadius: '1.25rem', overflow: 'hidden', position: 'relative' }}>
            {selected.foto_url ? (
              <img src={selected.foto_url} alt={selected.judul} style={{ width: '100%', display: 'block' }} />
            ) : (
              <div style={{ width: '100%', height: '50vh', background: selected.bg_gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '5rem' }}>
                {selected.icon_emoji}
              </div>
            )}
            <div style={{ background: '#fff', padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--gray-900)' }}>{selected.judul}</h3>
                {selected.bulan_tahun && <p style={{ fontSize: '0.8125rem', color: 'var(--gray-500)', marginTop: '0.125rem' }}>{selected.bulan_tahun}</p>}
                {selected.deskripsi && <p style={{ fontSize: '0.8125rem', color: 'var(--gray-600)', marginTop: '0.5rem' }}>{selected.deskripsi}</p>}
              </div>
              <button onClick={() => setSelected(null)} style={{ background: 'var(--gray-100)', border: 'none', borderRadius: '50%', width: 40, height: 40, cursor: 'pointer', fontSize: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                ✕
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
