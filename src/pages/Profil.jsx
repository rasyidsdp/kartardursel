import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import LoadingSpinner from '../components/LoadingSpinner'

const misi = [
  'Menumbuhkan jiwa kepedulian sosial dan semangat gotong royong pemuda',
  'Mengembangkan potensi dan kreativitas generasi muda melalui berbagai kegiatan positif',
  'Memfasilitasi program pemberdayaan ekonomi dan keterampilan warga',
  'Menjaga kebersihan, keindahan, dan kenyamanan lingkungan bersama warga',
  'Menjadi jembatan komunikasi antara warga dan pemerintah kelurahan',
]

const IconUser = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
)

const IconBuilding = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/>
    <path d="M9 22v-4h6v4"/>
    <path d="M8 6h.01"/><path d="M16 6h.01"/>
    <path d="M8 10h.01"/><path d="M16 10h.01"/>
    <path d="M8 14h.01"/><path d="M16 14h.01"/>
  </svg>
)

const RenderStruktur = ({ title, data }) => (
  <div style={{ background: '#fff', border: '1.5px solid var(--gray-100)', borderRadius: '1.5rem', padding: '2rem', marginBottom: '1.5rem' }}>
    <h3 style={{ fontWeight: 800, fontSize: '1.125rem', color: 'var(--gray-900)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <span style={{ color: 'var(--brand-600)', display: 'flex' }}><IconBuilding /></span>
      {title}
    </h3>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.875rem' }}>
      {data.map((s) => (
        <div key={s.id} style={{ border: '1.5px solid var(--gray-100)', borderRadius: '1rem', padding: '1rem 1.125rem', display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          {s.foto_url ? (
            <div style={{ width: 40, height: 40, borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
              <img src={s.foto_url} alt={s.nama} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ) : (
            <div style={{ width: 40, height: 40, background: s.avatar_color || 'var(--brand-50)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'var(--brand-700)' }}>
              {s.inisial ? <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>{s.inisial}</span> : <IconUser />}
            </div>
          )}
          <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: '3.5rem', justifyContent: 'center' }}>
            <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--brand-700)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.125rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{s.jabatan}</p>
            <p style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--gray-900)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{s.nama}</p>
            <div style={{ minHeight: '1.125rem', display: 'flex', alignItems: 'flex-end', marginTop: '0.125rem' }}>
              {s.asal_rw ? (
                <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)', fontWeight: 500 }}>{s.asal_rw}</span>
              ) : s.kontak ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--brand-600)', fontWeight: 600 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.21 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  {s.kontak}
                </span>
              ) : (
                <span style={{ fontSize: '0.75rem', visibility: 'hidden' }}>&nbsp;</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
)

const formatRW = (str) => {
  if (!str) return str;
  const match = str.trim().match(/^rw\s*(\d+)$/i);
  if (match) return `RW ${match[1]}`;
  return str;
}

export default function Profil() {
  const [activeTab, setActiveTab] = useState('Kelurahan')
  const [pengurus, setPengurus] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPengurus = async () => {
      const { data } = await supabase.from('pengurus').select('*').order('urutan', { ascending: true })
      if (data) {
        setPengurus(data.map(item => ({
          ...item,
          unit: formatRW(item.unit || 'Lainnya'),
          asal_rw: formatRW(item.asal_rw)
        })))
      }
      setLoading(false)
    }
    fetchPengurus()
  }, [])

  // Mengelompokkan berdasarkan unit
  const groupedPengurus = pengurus.reduce((acc, curr) => {
    const u = curr.unit || 'Lainnya'
    if (!acc[u]) acc[u] = []
    acc[u].push(curr)
    return acc
  }, {})

  const allUnits = Object.keys(groupedPengurus)
  const rwList = allUnits.filter(u => u.toUpperCase().startsWith('RW')).sort()
  const nonRwList = allUnits.filter(u => !u.toUpperCase().startsWith('RW')).sort()

  // Auto-select tab if 'Kelurahan' isn't available
  useEffect(() => {
    if (!loading && allUnits.length > 0 && !groupedPengurus[activeTab]) {
      if (nonRwList.includes('Kelurahan')) setActiveTab('Kelurahan')
      else if (nonRwList.length > 0) setActiveTab(nonRwList[0])
      else setActiveTab(rwList[0])
    }
  }, [loading, allUnits, activeTab, nonRwList, rwList, groupedPengurus])

  return (
    <div className="page-enter">

      {/* Header — hanya judul, tanpa chips */}
      <div style={{
        background: 'linear-gradient(135deg, var(--brand-900) 0%, var(--brand-700) 60%, var(--brand-600) 100%)',
        padding: '3rem 1.5rem 4rem', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 300, height: 300, background: 'rgba(255,255,255,0.06)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: -80, left: -40, width: 250, height: 250, background: 'rgba(255,255,255,0.04)', borderRadius: '50%' }} />
        <div className="section-container">
          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.625rem' }}>
            Karang Taruna
          </p>
          <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>
            Profil Kelurahan
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9375rem', fontWeight: 500 }}>
            Kelurahan Duri Selatan · Kecamatan Tambora · Jakarta Barat
          </p>
        </div>
      </div>

      <div className="section-container" style={{ marginTop: '-1.5rem', position: 'relative', zIndex: 2 }}>

        {/* Tentang */}
        <div style={{
          background: '#fff', borderRadius: '1.5rem', padding: '2rem',
          boxShadow: '0 4px 24px rgba(0,0,0,0.07)', border: '1px solid var(--gray-100)',
          marginBottom: '1.5rem',
        }}>
          <h2 style={{ fontWeight: 800, fontSize: '1.125rem', color: 'var(--gray-900)', marginBottom: '0.875rem' }}>
            Tentang Karang Taruna
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--gray-600)', lineHeight: 1.8 }}>
            Karang Taruna Kelurahan Duri Selatan adalah organisasi kepemudaan yang bergerak
            di bidang sosial, budaya, dan pemberdayaan masyarakat. Kelurahan Duri Selatan
            sendiri berada di Kecamatan Tambora, Kota Administrasi Jakarta Barat.
          </p>
        </div>

        {/* Visi & Misi */}
        <div style={{
          background: '#fff', borderRadius: '1.5rem', padding: '2rem',
          boxShadow: '0 4px 24px rgba(0,0,0,0.07)', border: '1px solid var(--gray-100)',
          marginBottom: '1.5rem',
        }}>
          <h2 style={{ fontWeight: 800, fontSize: '1.125rem', color: 'var(--gray-900)', marginBottom: '0.875rem' }}>
            Visi & Misi
          </h2>

          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
            Visi
          </p>
          <blockquote style={{
            fontSize: '0.9rem', color: 'var(--gray-700)', lineHeight: 1.7,
            margin: '0 0 1.25rem', padding: '0 0 0 0.875rem',
            borderLeft: '3px solid var(--brand-500)',
          }}>
            Terwujudnya generasi muda Duri Selatan yang mandiri, kreatif, peduli sosial, dan berdaya saing tinggi untuk kemajuan masyarakat kelurahan.
          </blockquote>

          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.625rem' }}>
            Misi
          </p>
          <ol style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', counterReset: 'misi' }}>
            {misi.map((m, i) => (
              <li key={i} style={{ fontSize: '0.875rem', color: 'var(--gray-600)', display: 'flex', gap: '0.75rem', alignItems: 'flex-start', lineHeight: 1.6 }}>
                <span style={{
                  minWidth: 22, height: 22, background: 'var(--brand-700)', color: '#fff',
                  borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.65rem', fontWeight: 800, flexShrink: 0, marginTop: '1px',
                }}>
                  {i + 1}
                </span>
                {m}
              </li>
            ))}
          </ol>
        </div>



        {/* Struktur Organisasi */}
        <h2 style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--gray-900)', marginBottom: '1.25rem', paddingLeft: '0.5rem' }}>Struktur Organisasi</h2>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--gray-600)', marginBottom: '0.75rem', paddingLeft: '0.5rem' }}>Pilih Tingkat Kepengurusan:</p>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', paddingLeft: '0.5rem' }}>
            {allUnits.length === 0 && !loading && (
              <p style={{ fontSize: '0.8125rem', color: 'var(--gray-400)' }}>Tidak ada data unit kepengurusan.</p>
            )}
            {nonRwList.map(unit => (
              <button
                key={unit}
                onClick={() => setActiveTab(unit)}
                style={{
                  padding: '0.5rem 1rem', borderRadius: '0.75rem', fontSize: '0.8125rem', fontWeight: 700, border: 'none', cursor: 'pointer', transition: 'all 0.18s',
                  background: activeTab === unit ? 'var(--brand-700)' : 'var(--gray-100)',
                  color: activeTab === unit ? '#fff' : 'var(--gray-600)',
                }}
              >
                {unit.toLowerCase() === 'kelurahan' ? 'Tingkat Kelurahan' : unit}
              </button>
            ))}
            {rwList.map(rw => (
              <button
                key={rw}
                onClick={() => setActiveTab(rw)}
                style={{
                  padding: '0.5rem 1rem', borderRadius: '0.75rem', fontSize: '0.8125rem', fontWeight: 700, border: 'none', cursor: 'pointer', transition: 'all 0.18s',
                  background: activeTab === rw ? 'var(--brand-700)' : 'var(--gray-100)',
                  color: activeTab === rw ? '#fff' : 'var(--gray-600)',
                }}
              >
                {rw}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <LoadingSpinner text="Memuat struktur pengurus..." />
        ) : groupedPengurus[activeTab] ? (
          <RenderStruktur 
            title={activeTab.toLowerCase() === 'kelurahan' ? 'Pengurus Tingkat Kelurahan' : `Pengurus ${activeTab}`} 
            data={groupedPengurus[activeTab]} 
          />
        ) : (
          <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem', paddingLeft: '0.5rem' }}>Belum ada data pengurus untuk unit ini.</p>
        )}

      </div>
    </div>
  )
}
