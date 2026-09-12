import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import CategoryIcon from '../components/CategoryIcon'
import LoadingSpinner from '../components/LoadingSpinner'

const filterOptions = [
  { label: 'Semua', months: null },
  { label: '3 Bulan Terakhir', months: 3 },
  { label: '6 Bulan Terakhir', months: 6 },
  { label: '1 Tahun Terakhir', months: 12 },
]

export default function Agenda() {
  const [filterIdx, setFilterIdx] = useState(0)
  const [agendaList, setAgendaList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAgenda = async () => {
      const { data } = await supabase
        .from('agenda')
        .select('*')
        .order('tanggal', { ascending: false })
      
      if (data) setAgendaList(data)
      setLoading(false)
    }
    fetchAgenda()
  }, [])

  const now = new Date()

  const filtered = agendaList.filter(a => {
    if (filterOptions[filterIdx].months === null) return true
    const months = filterOptions[filterIdx].months
    const cutoff = new Date(now)
    cutoff.setMonth(cutoff.getMonth() - months)
    return new Date(a.tanggal) >= cutoff
  })

  const formatAgendaDate = (dateStr) => {
    const d = new Date(dateStr)
    return {
      day: d.getDate(),
      month: d.toLocaleDateString('id-ID', { month: 'short' }),
      year: d.getFullYear()
    }
  }

  return (
    <div className="page-enter" style={{ paddingBottom: '3rem' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, var(--brand-800) 0%, var(--brand-600) 100%)', padding: '3rem 1.5rem 4rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 300, height: 300, background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: -80, left: -40, width: 250, height: 250, background: 'rgba(255,255,255,0.04)', borderRadius: '50%' }} />
        <div className="section-container">
          <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>
            Agenda Kegiatan
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9375rem', fontWeight: 500 }}>
            Jadwal kegiatan warga, rapat, dan acara penting yang akan datang.
          </p>
        </div>
      </div>

      {/* Filter */}
      <div className="section-container" style={{ marginTop: '-1.5rem', position: 'relative', zIndex: 2 }}>
        <div style={{ background: '#fff', borderRadius: '1.25rem', padding: '1.25rem', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '1px solid var(--gray-100)', display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--gray-600)', marginRight: '0.5rem' }}>Filter Periode:</span>
          {filterOptions.map((opt, idx) => (
            <button
              key={opt.label}
              onClick={() => setFilterIdx(idx)}
              style={{
                padding: '0.4375rem 1rem',
                borderRadius: '0.75rem',
                fontSize: '0.8125rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.18s',
                background: filterIdx === idx ? 'var(--brand-700)' : 'var(--gray-100)',
                color: filterIdx === idx ? '#fff' : 'var(--gray-600)',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline / List */}
      <div className="section-container" style={{ marginTop: '2rem' }}>
        {loading ? (
          <LoadingSpinner text="Memuat agenda..." />
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--gray-400)' }}>
            <p style={{ fontSize: '1rem', fontWeight: 600 }}>Tidak ada agenda di periode ini.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {filtered.map((item) => {
              const date = formatAgendaDate(item.tanggal)
              return (
              <div key={item.id} className="agenda-card" style={{ background: '#fff', border: '1.5px solid var(--gray-200)', borderRadius: '1.25rem', padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', display: 'flex', gap: '1.25rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                {/* Date badge */}
                <div className="agenda-date-box" style={{ background: 'var(--brand-50)', border: '1.5px solid var(--brand-200)', color: 'var(--brand-800)', borderRadius: '1rem', padding: '0.875rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 72, textAlign: 'center', flexShrink: 0, transition: 'background-color 0.2s, border-color 0.2s, color 0.2s' }}>
                  <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{date.month}</span>
                  <span style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1.1 }}>{date.day}</span>
                  <span style={{ fontSize: '0.625rem', color: 'var(--gray-500)', fontWeight: 600 }}>{date.year}</span>
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                    <span className={`badge badge-${(item.tag_color || 'blue').toLowerCase()}`} style={{ display: 'inline-flex', alignItems: 'center' }}>
                      <CategoryIcon category={item.kategori} /> {item.kategori}
                    </span>
                  </div>
                  <h3 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--gray-900)', marginBottom: '0.625rem', lineHeight: 1.4 }}>{item.judul}</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                    {item.waktu && (
                      <span style={{ fontSize: '0.8125rem', color: 'var(--gray-500)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        {item.waktu}
                      </span>
                    )}
                    {item.lokasi && (
                      <span style={{ fontSize: '0.8125rem', color: 'var(--gray-500)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                        {item.lokasi}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )})}
          </div>
        )}
      </div>
    </div>
  )
}
