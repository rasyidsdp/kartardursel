import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const kategoriAspirasi = [
  'Infrastruktur & Lingkungan',
  'Keamanan & Ketertiban',
  'Pelayanan Publik',
  'Sosial & Kemasyarakatan',
  'Kebersihan',
  'Lainnya',
]

/* ── SVG Icons ── */
const IconLightbulb = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="9" y1="18" x2="15" y2="18"/>
    <line x1="10" y1="22" x2="14" y2="22"/>
    <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/>
  </svg>
)

const IconArrowRight = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
)

export default function Aspirasi() {
  const [form, setForm] = useState({ nama: '', rw: '', no_hp: '', kategori: '', judul: '', isi: '', anonim: false })
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [recentReports, setRecentReports] = useState([])

  const fetchRecent = async () => {
    const { data } = await supabase
      .from('aspirasi')
      .select('id, kategori, isi, status, created_at')
      .order('created_at', { ascending: false })
      .limit(5)
    
    if (data) setRecentReports(data)
  }

  useEffect(() => {
    fetchRecent()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.judul || !form.isi || !form.kategori || !form.rw) return
    setIsSubmitting(true)

    const payload = {
      nama: form.anonim ? 'Anonim' : form.nama,
      no_hp: form.anonim ? '' : form.no_hp,
      rw: form.rw,
      kategori: form.kategori,
      isi: form.judul + '\n\n' + form.isi,
      status: 'baru'
    }

    const { error } = await supabase.from('aspirasi').insert([payload])
    setIsSubmitting(false)

    if (!error) {
      setSubmitted(true)
      setForm({ nama: '', rw: '', no_hp: '', kategori: '', judul: '', isi: '', anonim: false })
      fetchRecent()
    } else {
      alert('Terjadi kesalahan saat mengirim aspirasi.')
    }
  }

  const getStatusClass = (status) => {
    switch(status.toLowerCase()) {
      case 'selesai': return 'badge-green'
      case 'diproses': return 'badge-orange'
      case 'baru': return 'badge-blue'
      default: return 'badge-gray'
    }
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  return (
    <div className="page-enter" style={{ paddingBottom: '3rem' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, var(--brand-900) 0%, var(--brand-600) 100%)', padding: '3rem 1.5rem 4rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 300, height: 300, background: 'rgba(255,255,255,0.06)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -40, width: 220, height: 220, background: 'rgba(255,255,255,0.04)', borderRadius: '50%' }} />
        <div className="section-container">
          <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>
            Aspirasi & Pengaduan
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9375rem', fontWeight: 500 }}>
            Sampaikan saran, kritik, atau laporkan masalah di lingkungan Anda.
          </p>
        </div>
      </div>

      <div className="section-container" style={{ marginTop: '-1.5rem', position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>

          {/* Form */}
          <div>
            {submitted ? (
              <div style={{ background: '#fff', borderRadius: '1.5rem', padding: '2.5rem', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '1px solid var(--gray-100)', textAlign: 'center' }}>
                <div style={{ width: 72, height: 72, background: 'var(--brand-50)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', color: 'var(--brand-700)' }}>
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                </div>
                <h2 style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--gray-900)', marginBottom: '0.625rem' }}>Aspirasi Terkirim!</h2>
                <p style={{ fontSize: '0.9rem', color: 'var(--gray-500)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                  Terima kasih atas aspirasi Anda. Pengurus akan menindaklanjuti laporan ini secepatnya.
                </p>
                <button className="btn-primary" onClick={() => setSubmitted(false)} style={{ width: '100%', justifyContent: 'center' }}>
                  Kirim Aspirasi Lain
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: '1.5rem', padding: '2rem', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '1px solid var(--gray-100)', display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
                <h2 style={{ fontWeight: 800, fontSize: '1.125rem', color: 'var(--gray-900)' }}>Sampaikan Aspirasi</h2>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                  <input type="checkbox" id="anonim" checked={form.anonim} onChange={e => setForm({...form, anonim: e.target.checked})} style={{ width: 16, height: 16, accentColor: 'var(--brand-700)' }} />
                  <label htmlFor="anonim" style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--gray-600)', cursor: 'pointer' }}>
                    Kirim secara anonim
                  </label>
                </div>

                {!form.anonim && (
                  <>
                    <div>
                      <label className="form-label">Nama Lengkap</label>
                      <input className="form-input" placeholder="Nama Anda" value={form.nama} onChange={e => setForm({...form, nama: e.target.value})} required />
                    </div>
                    <div>
                      <label className="form-label">No HP (Opsional)</label>
                      <input className="form-input" placeholder="08..." value={form.no_hp} onChange={e => setForm({...form, no_hp: e.target.value})} />
                    </div>
                  </>
                )}

                <div>
                  <label className="form-label">Asal RW *</label>
                  <select className="form-input" value={form.rw} onChange={e => setForm({...form, rw: e.target.value})} required style={{ cursor: 'pointer' }}>
                    <option value="">-- Pilih RW --</option>
                    {['RW 001', 'RW 002', 'RW 003', 'RW 004', 'RW 005', 'RW 006', 'Luar Lingkungan'].map(k => <option key={k} value={k}>{k}</option>)}
                  </select>
                </div>

                <div>
                  <label className="form-label">Kategori *</label>
                  <select className="form-input" value={form.kategori} onChange={e => setForm({...form, kategori: e.target.value})} required style={{ cursor: 'pointer' }}>
                    <option value="">-- Pilih kategori --</option>
                    {kategoriAspirasi.map(k => <option key={k} value={k}>{k}</option>)}
                  </select>
                </div>

                <div>
                  <label className="form-label">Judul / Ringkasan *</label>
                  <input className="form-input" placeholder="Ringkas masalah/saran dalam satu kalimat" value={form.judul} onChange={e => setForm({...form, judul: e.target.value})} required />
                </div>

                <div>
                  <label className="form-label">Deskripsi Lengkap *</label>
                  <textarea className="form-input" placeholder="Jelaskan secara detail lokasi, waktu kejadian, dan kondisi yang ada..." rows={5} value={form.isi} onChange={e => setForm({...form, isi: e.target.value})} required style={{ resize: 'vertical', fontFamily: 'inherit' }} />
                </div>

                <button type="submit" className="btn-primary" style={{ justifyContent: 'center' }} disabled={isSubmitting}>
                  {isSubmitting ? 'Mengirim...' : 'Kirim Aspirasi'}
                </button>
              </form>
            )}
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Laporan terbaru */}
            <div style={{ background: '#fff', borderRadius: '1.25rem', padding: '1.5rem', border: '1.5px solid var(--gray-100)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
              <h3 style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--gray-900)', marginBottom: '1rem' }}>Laporan Terbaru</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {recentReports.map((l, i) => {
                  const parts = l.isi.split('\n\n')
                  const judul = parts[0]
                  return (
                    <div key={l.id} style={{ borderBottom: i < recentReports.length - 1 ? '1px solid var(--gray-100)' : 'none', paddingBottom: i < recentReports.length - 1 ? '1rem' : 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.375rem' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--gray-400)', fontFamily: 'monospace' }}>#{l.id.substring(0,8)}</span>
                        <span className={`badge ${getStatusClass(l.status)}`}>{l.status.toUpperCase()}</span>
                      </div>
                      <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--gray-800)', lineHeight: 1.4, marginBottom: '0.25rem' }}>{judul}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>{l.kategori} · {formatDate(l.created_at)}</p>
                    </div>
                  )
                })}
                {recentReports.length === 0 && (
                  <p style={{ color: 'var(--gray-500)', fontSize: '0.8125rem' }}>Belum ada laporan.</p>
                )}
              </div>
            </div>

            {/* Tips */}
            <div style={{ background: '#fff', borderRadius: '1.25rem', padding: '1.5rem', border: '1.5px solid var(--gray-100)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
              <h3 style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--gray-900)', marginBottom: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: 'var(--brand-700)' }}><IconLightbulb /></span>
                Tips Pengaduan Efektif
              </h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                {[
                  'Sertakan lokasi yang jelas (RT/RW)',
                  'Jelaskan kondisi secara detail',
                  'Laporan akan diproses dalam 3 hari kerja',
                ].map(t => (
                  <li key={t} style={{ fontSize: '0.8125rem', color: 'var(--gray-600)', fontWeight: 500, display: 'flex', gap: '0.625rem', alignItems: 'flex-start' }}>
                    <span style={{ color: 'var(--brand-600)', flexShrink: 0, marginTop: '1px' }}><IconArrowRight /></span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
