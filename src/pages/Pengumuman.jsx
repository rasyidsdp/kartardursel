import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import CategoryIcon from '../components/CategoryIcon'
import LoadingSpinner from '../components/LoadingSpinner'

const categories = ['Semua', 'Kelurahan', 'RT', 'Kegiatan', 'Penting']

export default function Pengumuman() {
  const [activeFilter, setActiveFilter] = useState('Semua')
  const [search, setSearch] = useState('')
  const [listPengumuman, setListPengumuman] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPengumuman = async () => {
      const { data } = await supabase
        .from('pengumuman')
        .select('*')
        .order('is_pinned', { ascending: false })
        .order('tanggal', { ascending: false })
        .order('created_at', { ascending: false })
      
      if (data) setListPengumuman(data)
      setLoading(false)
    }
    fetchPengumuman()
  }, [])

  const filtered = listPengumuman.filter(p => {
    const matchCat = activeFilter === 'Semua' || p.kategori === activeFilter
    const matchSearch = p.judul.toLowerCase().includes(search.toLowerCase()) || p.isi.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  return (
    <div className="page-enter" style={{ paddingBottom: '3rem' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, var(--brand-800) 0%, var(--brand-600) 100%)', padding: '3rem 1.5rem 4rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 300, height: 300, background: 'rgba(255,255,255,0.06)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: -80, left: -40, width: 250, height: 250, background: 'rgba(255,255,255,0.04)', borderRadius: '50%' }} />
        <div className="section-container">
          <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>
            Informasi & Pengumuman
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9375rem', fontWeight: 500 }}>
            Berita dan pengumuman terbaru seputar kegiatan kelurahan dan RT.
          </p>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="section-container" style={{ marginTop: '-1.5rem', position: 'relative', zIndex: 2 }}>
        <div style={{ background: '#fff', borderRadius: '1.25rem', padding: '1.25rem', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '1px solid var(--gray-100)' }}>
          <input
            type="text"
            placeholder="Cari pengumuman..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="form-input"
            style={{ marginBottom: '1rem' }}
          />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                style={{
                  padding: '0.4375rem 1rem',
                  borderRadius: '0.75rem',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.18s',
                  background: activeFilter === cat ? 'var(--brand-700)' : 'var(--gray-100)',
                  color: activeFilter === cat ? '#fff' : 'var(--gray-600)',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* List */}
      <div className="section-container" style={{ marginTop: '2rem' }}>
        {loading ? (
          <LoadingSpinner text="Memuat pengumuman..." />
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--gray-400)' }}>
            <p style={{ fontSize: '1rem', fontWeight: 600 }}>Tidak ada pengumuman ditemukan.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
            {filtered.map((item) => {
              return (
                <div
                  key={item.id}
                  style={{
                    background: '#fff',
                    border: '1.5px solid var(--gray-200)',
                    borderRadius: '1.25rem',
                    padding: '1.5rem',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                  }}
                  className="pengumuman-card"
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.875rem' }}>
                    <span className={`badge badge-${(item.tag_color || 'blue').toLowerCase()}`} style={{ display: 'inline-flex', alignItems: 'center' }}>
                      <CategoryIcon category={item.kategori} /> {item.kategori}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)', fontWeight: 500 }}>{formatDate(item.tanggal)}</span>
                  </div>
                  <h3 style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--gray-900)', marginBottom: '0.5rem', lineHeight: 1.4, display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    {item.is_pinned && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--brand-600)' }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>}
                    {item.judul}
                  </h3>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--gray-500)', lineHeight: 1.65 }}>{item.isi}</p>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
