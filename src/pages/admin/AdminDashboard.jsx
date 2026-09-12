import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('id-ID', { 
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

const IconAspirasi = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
const IconSurat = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
const IconPengumuman = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
const IconAgenda = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('aspirasi')
  const [loading, setLoading] = useState(true)

  const [aspirasi, setAspirasi] = useState([])
  const [surat, setSurat] = useState([])
  const [pengumuman, setPengumuman] = useState([])
  const [agenda, setAgenda] = useState([])

  const [showForm, setShowForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formPengumuman, setFormPengumuman] = useState({ judul: '', isi: '', kategori: 'Kelurahan', tag_color: 'blue', tanggal: '', is_pinned: false })
  const [formAgenda, setFormAgenda] = useState({ judul: '', kategori: 'Kegiatan', tag_color: 'green', rw: '{all}', tanggal: '', waktu: '', lokasi: '' })

  useEffect(() => {
    const isAuth = localStorage.getItem('isAdminAuth')
    if (isAuth !== 'true') {
      navigate('/admin/login')
      return
    }
    fetchData()
  }, [navigate])

  const fetchData = async () => {
    setLoading(true)
    const [resAsp, resSur, resPeng, resAgen] = await Promise.all([
      supabase.from('aspirasi').select('*').order('created_at', { ascending: false }),
      supabase.from('surat').select('*').order('created_at', { ascending: false }),
      supabase.from('pengumuman').select('*').order('created_at', { ascending: false }),
      supabase.from('agenda').select('*').order('tanggal', { ascending: false })
    ])
    
    if (resAsp.data) setAspirasi(resAsp.data)
    if (resSur.data) setSurat(resSur.data)
    if (resPeng.data) setPengumuman(resPeng.data)
    if (resAgen.data) setAgenda(resAgen.data)
    
    setLoading(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('isAdminAuth')
    navigate('/admin/login')
  }

  const submitPengumuman = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    const { error } = await supabase.from('pengumuman').insert([formPengumuman])
    setIsSubmitting(false)
    if (!error) {
      setShowForm(false)
      fetchData()
      setFormPengumuman({ judul: '', isi: '', kategori: 'Kelurahan', tag_color: 'blue', tanggal: '', is_pinned: false })
    } else {
      alert("Error: " + error.message)
    }
  }

  const submitAgenda = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const { error } = await supabase.from('agenda').insert([{
      ...formAgenda,
      rw: formAgenda.rw === '{all}' ? ['all'] : [formAgenda.rw]
    }])
    setIsSubmitting(false)
    if (!error) {
      setShowForm(false)
      fetchData()
      setFormAgenda({ judul: '', kategori: 'Kegiatan', tag_color: 'green', rw: '{all}', tanggal: '', waktu: '', lokasi: '' })
    } else {
      alert("Error: " + error.message)
    }
  }

  const updateStatusSurat = async (id, newStatus) => {
    const { error } = await supabase.from('surat').update({ status: newStatus }).eq('id', id)
    if (!error) fetchData()
  }

  const tabs = [
    { id: 'aspirasi', label: 'Data Aspirasi', icon: <IconAspirasi /> },
    { id: 'surat', label: 'Data Surat', icon: <IconSurat /> },
    { id: 'pengumuman', label: 'Pengumuman', icon: <IconPengumuman /> },
    { id: 'agenda', label: 'Agenda Kegiatan', icon: <IconAgenda /> },
  ]

  return (
    <div style={{ minHeight: '100vh', background: 'var(--gray-50)', display: 'flex' }}>
      {/* Sidebar */}
      <div style={{ width: 260, background: '#fff', borderRight: '1px solid var(--gray-200)', display: 'flex', flexDirection: 'column', flexShrink: 0, position: 'sticky', top: 0, height: '100vh' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--gray-100)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div>
              <img src="/favicon.ico" alt="Logo" style={{ width: 32, height: 32, objectFit: 'contain' }} />
            </div>
            <div>
              <h2 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--gray-900)', lineHeight: 1.2 }}>Portal Admin</h2>
              <p style={{ fontSize: '0.7rem', color: 'var(--gray-500)', fontWeight: 600 }}>Duri Selatan</p>
            </div>
          </div>
        </div>
        
        <div style={{ padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1, overflowY: 'auto' }}>
          {tabs.map(tab => (
            <button 
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setShowForm(false) }}
              style={{ 
                display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', 
                borderRadius: '0.75rem', border: 'none', cursor: 'pointer',
                background: activeTab === tab.id ? 'var(--brand-50)' : 'transparent',
                color: activeTab === tab.id ? 'var(--brand-700)' : 'var(--gray-600)',
                fontWeight: activeTab === tab.id ? 700 : 600,
                transition: 'all 0.15s'
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ padding: '1rem', borderTop: '1px solid var(--gray-200)' }}>
          <button 
            onClick={handleLogout}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', width: '100%',
              borderRadius: '0.75rem', border: 'none', cursor: 'pointer', background: '#fee2e2', color: '#991b1b',
              fontWeight: 700, fontSize: '0.875rem'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '2rem 3rem', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--gray-900)', marginBottom: '0.5rem' }}>
              {activeTab === 'aspirasi' && 'Daftar Aspirasi Warga'}
              {activeTab === 'surat' && 'Daftar Pengajuan Surat'}
              {activeTab === 'pengumuman' && 'Kelola Pengumuman'}
              {activeTab === 'agenda' && 'Kelola Agenda Kegiatan'}
            </h1>
            <p style={{ color: 'var(--gray-500)', fontSize: '0.9375rem' }}>
              {activeTab === 'aspirasi' && 'Kelola dan tindaklanjuti laporan atau saran dari warga.'}
              {activeTab === 'surat' && 'Periksa pengajuan persuratan yang masuk dari warga.'}
              {activeTab === 'pengumuman' && 'Tambahkan info dan pengumuman terbaru untuk warga.'}
              {activeTab === 'agenda' && 'Jadwalkan kegiatan atau rapat di lingkungan RW.'}
            </p>
          </div>
          
          {(activeTab === 'pengumuman' || activeTab === 'agenda') && !showForm && (
            <button onClick={() => setShowForm(true)} className="btn-primary" style={{ padding: '0.625rem 1.25rem' }}>
              + Tambah Data
            </button>
          )}
          {showForm && (
            <button onClick={() => setShowForm(false)} className="btn-outline" style={{ padding: '0.625rem 1.25rem' }}>
              Batal
            </button>
          )}
        </div>

        {/* ================= ASPIRASI ================= */}
        {activeTab === 'aspirasi' && !showForm && (
          <div style={{ background: '#fff', borderRadius: '1rem', border: '1px solid var(--gray-200)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', overflow: 'hidden' }}>
            {loading ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--gray-500)' }}>Memuat data...</div>
            ) : aspirasi.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--gray-500)' }}>Belum ada data.</div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                  <thead style={{ background: 'var(--gray-50)', borderBottom: '1px solid var(--gray-200)' }}>
                    <tr>
                      <th style={{ padding: '1rem', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--gray-600)' }}>Waktu</th>
                      <th style={{ padding: '1rem', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--gray-600)' }}>Pengirim</th>
                      <th style={{ padding: '1rem', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--gray-600)' }}>Kategori & RW</th>
                      <th style={{ padding: '1rem', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--gray-600)' }}>Isi Aspirasi</th>
                      <th style={{ padding: '1rem', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--gray-600)' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {aspirasi.map((item) => (
                      <tr key={item.id} style={{ borderBottom: '1px solid var(--gray-100)' }}>
                        <td style={{ padding: '1rem', fontSize: '0.875rem', color: 'var(--gray-500)' }}>{formatDate(item.created_at)}</td>
                        <td style={{ padding: '1rem' }}>
                          <p style={{ fontWeight: 600, color: 'var(--gray-900)', fontSize: '0.875rem' }}>{item.nama}</p>
                          <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>{item.no_hp || '-'}</p>
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <span style={{ display: 'inline-block', background: 'var(--brand-50)', color: 'var(--brand-700)', padding: '0.2rem 0.6rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                            {item.kategori}
                          </span>
                          <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)', fontWeight: 600 }}>RW {item.rw}</p>
                        </td>
                        <td style={{ padding: '1rem', fontSize: '0.875rem', color: 'var(--gray-700)', maxWidth: 300 }}>
                          {item.isi}
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <span style={{ background: '#f3f4f6', color: '#374151', padding: '0.25rem 0.75rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'capitalize' }}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ================= SURAT ================= */}
        {activeTab === 'surat' && !showForm && (
          <div style={{ background: '#fff', borderRadius: '1rem', border: '1px solid var(--gray-200)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', overflow: 'hidden' }}>
            {loading ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--gray-500)' }}>Memuat data...</div>
            ) : surat.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--gray-500)' }}>Belum ada pengajuan surat.</div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                  <thead style={{ background: 'var(--gray-50)', borderBottom: '1px solid var(--gray-200)' }}>
                    <tr>
                      <th style={{ padding: '1rem', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--gray-600)' }}>Waktu</th>
                      <th style={{ padding: '1rem', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--gray-600)' }}>Pemohon (NIK)</th>
                      <th style={{ padding: '1rem', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--gray-600)' }}>Jenis Surat</th>
                      <th style={{ padding: '1rem', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--gray-600)' }}>Status</th>
                      <th style={{ padding: '1rem', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--gray-600)' }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {surat.map((item) => (
                      <tr key={item.id} style={{ borderBottom: '1px solid var(--gray-100)' }}>
                        <td style={{ padding: '1rem', fontSize: '0.875rem', color: 'var(--gray-500)' }}>{formatDate(item.created_at)}</td>
                        <td style={{ padding: '1rem' }}>
                          <p style={{ fontWeight: 600, color: 'var(--gray-900)', fontSize: '0.875rem' }}>{item.nama}</p>
                          <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>{item.nik}</p>
                          <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>{item.no_hp || '-'}</p>
                        </td>
                        <td style={{ padding: '1rem', fontSize: '0.875rem', color: 'var(--gray-700)' }}>
                          <span style={{ fontWeight: 600 }}>{item.jenis}</span>
                          {item.keterangan && <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: '0.25rem' }}>Ket: {item.keterangan}</p>}
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <span style={{ 
                            background: item.status === 'selesai' ? '#dcfce7' : item.status === 'ditolak' ? '#fee2e2' : '#fef3c7', 
                            color: item.status === 'selesai' ? '#166534' : item.status === 'ditolak' ? '#991b1b' : '#92400e', 
                            padding: '0.25rem 0.75rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'capitalize' 
                          }}>
                            {item.status}
                          </span>
                        </td>
                        <td style={{ padding: '1rem' }}>
                          {item.status === 'menunggu' && (
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <button onClick={() => updateStatusSurat(item.id, 'selesai')} style={{ background: 'var(--brand-600)', color: '#fff', border: 'none', padding: '0.4rem 0.75rem', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>Selesai</button>
                              <button onClick={() => updateStatusSurat(item.id, 'ditolak')} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '0.4rem 0.75rem', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>Tolak</button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ================= PENGUMUMAN ================= */}
        {activeTab === 'pengumuman' && !showForm && (
          <div style={{ background: '#fff', borderRadius: '1rem', border: '1px solid var(--gray-200)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', overflow: 'hidden' }}>
            {loading ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--gray-500)' }}>Memuat data...</div>
            ) : pengumuman.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--gray-500)' }}>Belum ada data.</div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                  <thead style={{ background: 'var(--gray-50)', borderBottom: '1px solid var(--gray-200)' }}>
                    <tr>
                      <th style={{ padding: '1rem', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--gray-600)' }}>Tanggal</th>
                      <th style={{ padding: '1rem', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--gray-600)' }}>Judul & Kategori</th>
                      <th style={{ padding: '1rem', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--gray-600)' }}>Isi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pengumuman.map((item) => (
                      <tr key={item.id} style={{ borderBottom: '1px solid var(--gray-100)' }}>
                        <td style={{ padding: '1rem', fontSize: '0.875rem', color: 'var(--gray-500)' }}>{item.tanggal}</td>
                        <td style={{ padding: '1rem' }}>
                          <p style={{ fontWeight: 600, color: 'var(--gray-900)', fontSize: '0.875rem' }}>{item.judul}</p>
                          <span style={{ display: 'inline-block', background: 'var(--gray-100)', color: 'var(--gray-700)', padding: '0.1rem 0.5rem', borderRadius: '99px', fontSize: '0.7rem', fontWeight: 600, marginTop: '0.25rem' }}>{item.kategori}</span>
                        </td>
                        <td style={{ padding: '1rem', fontSize: '0.875rem', color: 'var(--gray-700)', maxWidth: 300 }}>
                          <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.isi}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ================= AGENDA ================= */}
        {activeTab === 'agenda' && !showForm && (
          <div style={{ background: '#fff', borderRadius: '1rem', border: '1px solid var(--gray-200)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', overflow: 'hidden' }}>
            {loading ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--gray-500)' }}>Memuat data...</div>
            ) : agenda.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--gray-500)' }}>Belum ada data.</div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                  <thead style={{ background: 'var(--gray-50)', borderBottom: '1px solid var(--gray-200)' }}>
                    <tr>
                      <th style={{ padding: '1rem', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--gray-600)' }}>Tanggal / Waktu</th>
                      <th style={{ padding: '1rem', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--gray-600)' }}>Kegiatan</th>
                      <th style={{ padding: '1rem', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--gray-600)' }}>Lokasi</th>
                      <th style={{ padding: '1rem', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--gray-600)' }}>Kategori</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agenda.map((item) => (
                      <tr key={item.id} style={{ borderBottom: '1px solid var(--gray-100)' }}>
                        <td style={{ padding: '1rem', fontSize: '0.875rem', color: 'var(--gray-900)', fontWeight: 600 }}>
                          {item.tanggal}
                          <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', fontWeight: 500 }}>{item.waktu}</div>
                        </td>
                        <td style={{ padding: '1rem', fontSize: '0.875rem', color: 'var(--gray-700)' }}>{item.judul}</td>
                        <td style={{ padding: '1rem', fontSize: '0.875rem', color: 'var(--gray-500)' }}>{item.lokasi || '-'}</td>
                        <td style={{ padding: '1rem' }}>
                          <span style={{ display: 'inline-block', background: 'var(--brand-50)', color: 'var(--brand-700)', padding: '0.2rem 0.6rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 700 }}>{item.kategori}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ================= FORM PENGUMUMAN ================= */}
        {activeTab === 'pengumuman' && showForm && (
          <form onSubmit={submitPengumuman} style={{ background: '#fff', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--gray-200)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label className="form-label">Judul Pengumuman *</label>
                <input required className="form-input" value={formPengumuman.judul} onChange={e => setFormPengumuman({...formPengumuman, judul: e.target.value})} placeholder="Contoh: Kerja Bakti RW 01" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div>
                  <label className="form-label">Tanggal *</label>
                  <input required type="date" className="form-input" value={formPengumuman.tanggal} onChange={e => setFormPengumuman({...formPengumuman, tanggal: e.target.value})} />
                </div>
                <div>
                  <label className="form-label">Kategori *</label>
                  <select required className="form-input" value={formPengumuman.kategori} onChange={e => setFormPengumuman({...formPengumuman, kategori: e.target.value})}>
                    <option value="Kelurahan">Kelurahan</option>
                    <option value="Penting">Penting</option>
                    <option value="Kegiatan">Kegiatan</option>
                    <option value="RT/RW">RT/RW</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="form-label">Isi Pengumuman *</label>
                <textarea required rows={4} className="form-input" value={formPengumuman.isi} onChange={e => setFormPengumuman({...formPengumuman, isi: e.target.value})} placeholder="Tulis rincian pengumuman..."></textarea>
              </div>
              <div style={{ borderTop: '1px solid var(--gray-100)', marginTop: '0.5rem', paddingTop: '1.5rem' }}>
                <button type="submit" className="btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Pengumuman'}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* ================= FORM AGENDA ================= */}
        {activeTab === 'agenda' && showForm && (
          <form onSubmit={submitAgenda} style={{ background: '#fff', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--gray-200)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label className="form-label">Judul Kegiatan *</label>
                <input required className="form-input" value={formAgenda.judul} onChange={e => setFormAgenda({...formAgenda, judul: e.target.value})} placeholder="Contoh: Rapat RT 04" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div>
                  <label className="form-label">Tanggal *</label>
                  <input required type="date" className="form-input" value={formAgenda.tanggal} onChange={e => setFormAgenda({...formAgenda, tanggal: e.target.value})} />
                </div>
                <div>
                  <label className="form-label">Waktu (Opsional)</label>
                  <input className="form-input" value={formAgenda.waktu} onChange={e => setFormAgenda({...formAgenda, waktu: e.target.value})} placeholder="Contoh: 19:30 WIB" />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div>
                  <label className="form-label">Kategori *</label>
                  <select required className="form-input" value={formAgenda.kategori} onChange={e => setFormAgenda({...formAgenda, kategori: e.target.value, tag_color: e.target.value === 'Rapat' ? 'blue' : 'green'})}>
                    <option value="Kegiatan">Kegiatan Warga</option>
                    <option value="Rapat">Rapat</option>
                    <option value="Posyandu">Posyandu</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Target RW *</label>
                  <select required className="form-input" value={formAgenda.rw} onChange={e => setFormAgenda({...formAgenda, rw: e.target.value})}>
                    <option value="{all}">Semua RW</option>
                    <option value="01">RW 01</option>
                    <option value="02">RW 02</option>
                    <option value="03">RW 03</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="form-label">Lokasi (Opsional)</label>
                <input className="form-input" value={formAgenda.lokasi} onChange={e => setFormAgenda({...formAgenda, lokasi: e.target.value})} placeholder="Contoh: Balai RW 02" />
              </div>
              <div style={{ borderTop: '1px solid var(--gray-100)', marginTop: '0.5rem', paddingTop: '1.5rem' }}>
                <button type="submit" className="btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Agenda'}
                </button>
              </div>
            </div>
          </form>
        )}

      </div>
    </div>
  )
}
