import { useState, useRef } from 'react'

/* ── SVG flat icons ── */
const IconDocument = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
  </svg>
)
const IconClock = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
)
const IconInfo = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
)
const IconCheckmark = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)
const IconUpload = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 16 12 12 8 16"/>
    <line x1="12" y1="12" x2="12" y2="21"/>
    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
  </svg>
)
const IconFile = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
    <polyline points="13 2 13 9 20 9"/>
  </svg>
)
const IconX = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)

const jenisSurat = [
  'Surat Keterangan Domisili',
  'Surat Keterangan Tidak Mampu',
  'Surat Keterangan Usaha',
  'Surat Pengantar KTP',
  'Surat Pengantar KK',
  'Surat Keterangan Kelahiran',
  'Surat Keterangan Kematian',
  'Surat Keterangan Pindah',
]

const steps = [
  { num: '01', title: 'Isi Formulir', desc: 'Lengkapi data diri dan pilih jenis surat yang dibutuhkan.' },
  { num: '02', title: 'Verifikasi', desc: 'Pengurus akan memverifikasi data Anda dalam 1×24 jam.' },
  { num: '03', title: 'Ambil Surat', desc: 'Surat siap diambil di kantor kelurahan atau dikirim digital.' },
]

/* Upload field untuk satu dokumen */
function FileUploadField({ label, required, fileKey, files, onFileChange }) {
  const inputRef = useRef()
  const file = files[fileKey]

  const handleChange = (e) => {
    const f = e.target.files[0]
    if (f) onFileChange(fileKey, f)
  }

  const handleRemove = () => {
    onFileChange(fileKey, null)
    inputRef.current.value = ''
  }

  return (
    <div>
      <label className="form-label" style={{ marginBottom: '0.375rem' }}>
        {label}{required && ' *'}
      </label>
      {file ? (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.625rem',
          padding: '0.625rem 0.875rem',
          background: 'var(--brand-50)', border: '1.5px solid var(--brand-300)',
          borderRadius: '0.75rem',
        }}>
          <span style={{ color: 'var(--brand-700)', flexShrink: 0 }}><IconFile /></span>
          <span style={{ fontSize: '0.8125rem', color: 'var(--brand-800)', fontWeight: 600, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {file.name}
          </span>
          <button
            type="button"
            onClick={handleRemove}
            style={{ background: 'var(--brand-200)', border: 'none', borderRadius: '50%', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, color: 'var(--brand-800)' }}
          >
            <IconX />
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current.click()}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.625rem',
            padding: '0.625rem 0.875rem',
            background: '#fff', border: '1.5px dashed var(--gray-300)',
            borderRadius: '0.75rem', cursor: 'pointer', transition: 'all 0.18s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--brand-400)'; e.currentTarget.style.background = 'var(--brand-50)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--gray-300)'; e.currentTarget.style.background = '#fff' }}
        >
          <span style={{ color: 'var(--gray-400)' }}><IconUpload /></span>
          <span style={{ fontSize: '0.8125rem', color: 'var(--gray-500)', fontWeight: 500 }}>Pilih file atau foto…</span>
          <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: 'var(--gray-300)', fontWeight: 600 }}>JPG / PNG / PDF</span>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*,.pdf"
        style={{ display: 'none' }}
        onChange={handleChange}
      />
    </div>
  )
}

const dokumenList = [
  { key: 'ktp',       label: 'Foto KTP',             required: true },
  { key: 'kk',        label: 'Foto Kartu Keluarga',  required: true },
  { key: 'pengantar', label: 'Surat Pengantar dari RT',  required: true },
  { key: 'pendukung', label: 'Dokumen Pendukung',        required: false },
]

export default function Surat() {
  const [form, setForm] = useState({ nama: '', nik: '', jenis: '', keterangan: '', noHp: '' })
  const [files, setFiles] = useState({ ktp: null, kk: null, pengantar: null, pendukung: null })
  const [submitted, setSubmitted] = useState(false)

  const handleFileChange = (key, file) => {
    setFiles(prev => ({ ...prev, [key]: file }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.nama || !form.nik || !form.jenis) return
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="page-enter" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', padding: '3rem 1.5rem' }}>
        <div style={{ textAlign: 'center', maxWidth: 480 }}>
          <div style={{ width: 80, height: 80, background: 'var(--brand-50)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--brand-700)' }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--gray-900)', marginBottom: '0.75rem' }}>Pengajuan Berhasil!</h2>
          <p style={{ color: 'var(--gray-500)', fontSize: '0.9375rem', lineHeight: 1.7, marginBottom: '2rem' }}>
            Permohonan surat Anda telah diterima. Kami akan menghubungi Anda melalui nomor HP yang terdaftar dalam 1×24 jam.
          </p>
          <button className="btn-primary" onClick={() => { setSubmitted(false); setFiles({ ktp: null, kk: null, pengantar: null, pendukung: null }) }}>
            Ajukan Surat Lain
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="page-enter" style={{ paddingBottom: '3rem' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, var(--brand-900) 0%, var(--brand-700) 100%)', padding: '3rem 1.5rem 4rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 300, height: 300, background: 'rgba(255,255,255,0.06)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -40, width: 220, height: 220, background: 'rgba(255,255,255,0.04)', borderRadius: '50%' }} />
        <div className="section-container">
          <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>
            Pengajuan Persuratan
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9375rem', fontWeight: 500 }}>
            Ajukan surat keterangan dan layanan administrasi secara online.
          </p>
        </div>
      </div>

      <div className="section-container" style={{ marginTop: '-1.5rem', position: 'relative', zIndex: 2 }}>
        {/* Steps */}
        <div style={{ background: '#fff', borderRadius: '1.25rem', padding: '1.5rem 2rem', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '1px solid var(--gray-100)', marginBottom: '2rem', display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'space-between' }}>
          {steps.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', flex: '1 1 180px' }}>
              <div style={{ width: 40, height: 40, background: 'var(--brand-800)', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8125rem', flexShrink: 0 }}>
                {s.num}
              </div>
              <div>
                <p style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--gray-900)', marginBottom: '0.25rem' }}>{s.title}</p>
                <p style={{ fontSize: '0.8125rem', color: 'var(--gray-500)', lineHeight: 1.55 }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Form + Info */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ background: '#fff', border: '1.5px solid var(--gray-100)', borderRadius: '1.5rem', padding: '2rem', boxShadow: '0 2px 16px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h2 style={{ fontWeight: 800, fontSize: '1.125rem', color: 'var(--gray-900)', marginBottom: '0.25rem' }}>Formulir Pengajuan</h2>

            <div>
              <label className="form-label">Nama Lengkap *</label>
              <input className="form-input" placeholder="Masukkan nama sesuai KTP" value={form.nama} onChange={e => setForm({...form, nama: e.target.value})} required />
            </div>
            <div>
              <label className="form-label">NIK (Nomor Induk Kependudukan) *</label>
              <input className="form-input" placeholder="16 digit NIK" maxLength={16} value={form.nik} onChange={e => setForm({...form, nik: e.target.value})} required />
            </div>
            <div>
              <label className="form-label">Nomor HP / WhatsApp</label>
              <input className="form-input" placeholder="Contoh: 08123456789" value={form.noHp} onChange={e => setForm({...form, noHp: e.target.value})} />
            </div>
            <div>
              <label className="form-label">Jenis Surat *</label>
              <select className="form-input" value={form.jenis} onChange={e => setForm({...form, jenis: e.target.value})} required style={{ cursor: 'pointer' }}>
                <option value="">-- Pilih jenis surat --</option>
                {jenisSurat.map(j => <option key={j} value={j}>{j}</option>)}
              </select>
            </div>

            {/* Divider */}
            <div style={{ borderTop: '1px solid var(--gray-100)', margin: '0.25rem 0' }} />

            {/* Unggah dokumen */}
            <div>
              <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <span style={{ color: 'var(--brand-700)' }}><IconDocument /></span>
                Lampiran Dokumen
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {dokumenList.map(doc => (
                  <FileUploadField
                    key={doc.key}
                    label={doc.label}
                    required={doc.required}
                    fileKey={doc.key}
                    files={files}
                    onFileChange={handleFileChange}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="form-label">Keterangan Tambahan</label>
              <textarea
                className="form-input"
                placeholder="Tulis keterangan atau keperluan surat..."
                rows={3}
                value={form.keterangan}
                onChange={e => setForm({...form, keterangan: e.target.value})}
                onInput={e => { e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px' }}
                style={{ resize: 'none', fontFamily: 'inherit', overflow: 'hidden' }}
              />
            </div>
            <button type="submit" className="btn-primary" style={{ justifyContent: 'center' }}>
              Kirim Pengajuan
            </button>
          </form>

          {/* Info sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            {/* Dokumen yang diperlukan */}
            <div style={{ background: 'var(--brand-50)', border: '1.5px solid var(--brand-200)', borderRadius: '1.25rem', padding: '1.5rem' }}>
              <h3 style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--brand-800)', marginBottom: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <IconDocument /> Dokumen yang Diperlukan
              </h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                {[
                  { text: 'Foto KTP', req: true },
                  { text: 'Foto Kartu Keluarga', req: true },
                  { text: 'Surat pengantar dari RT', req: true },
                  { text: 'Dokumen pendukung (jika ada)', req: false },
                ].map(d => (
                  <li key={d.text} style={{ fontSize: '0.8125rem', color: 'var(--brand-800)', fontWeight: 500, display: 'flex', gap: '0.625rem', alignItems: 'center' }}>
                    <span style={{
                      width: 18, height: 18, background: d.req ? 'var(--brand-700)' : 'var(--brand-300)',
                      borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', flexShrink: 0,
                    }}>
                      <IconCheckmark />
                    </span>
                    {d.text}
                  </li>
                ))}
              </ul>
            </div>

            {/* Estimasi waktu */}
            <div style={{ background: 'var(--brand-50)', border: '1.5px solid var(--brand-200)', borderRadius: '1.25rem', padding: '1.5rem' }}>
              <h3 style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--brand-800)', marginBottom: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <IconClock /> Estimasi Waktu
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                {[
                  { label: 'Surat Keterangan Domisili', time: '1 Hari Kerja' },
                  { label: 'Surat Keterangan Usaha', time: '2 Hari Kerja' },
                  { label: 'Surat Pengantar KTP/KK', time: '1 Hari Kerja' },
                ].map(t => (
                  <div key={t.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', gap: '0.5rem' }}>
                    <span style={{ color: 'var(--brand-900)', fontWeight: 500 }}>{t.label}</span>
                    <span style={{ color: 'var(--brand-700)', fontWeight: 800, flexShrink: 0 }}>{t.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Info jam kerja */}
            <div style={{ background: 'var(--brand-50)', border: '1.5px solid var(--brand-200)', borderRadius: '1.25rem', padding: '1.5rem' }}>
              <h3 style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--brand-800)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <IconInfo /> Informasi
              </h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--brand-900)', lineHeight: 1.65 }}>
                Pengajuan surat hanya dapat dilakukan pada hari dan jam kerja: Senin–Jumat pukul 08.00–15.00 WIB.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
