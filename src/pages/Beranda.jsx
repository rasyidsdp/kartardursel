import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import berandaImg from '../assets/beranda.webp'
import { supabase } from '../lib/supabase'
import CategoryIcon from '../components/CategoryIcon'
import LoadingSpinner from '../components/LoadingSpinner'

/* ── Icons ── */
const IconUsers = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
)
const IconClock = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
)
const IconCheck = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
)
const IconArrow = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
)
const IconClockSm = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
)
const IconPin = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
)
const IconHelpCircle = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
)
const IconChevronDown = ({ open }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
    style={{ transition: 'transform 0.25s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0 }}>
    <polyline points="6 9 12 15 18 9"/>
  </svg>
)

const faqItems = [
  {
    q: 'Apa saja layanan yang tersedia di website ini?',
    steps: [
      'Informasi & Pengumuman — berita dan info terbaru dari kelurahan.',
      'Agenda Kegiatan — jadwal rapat, acara, dan kegiatan warga.',
      'Pengajuan Persuratan — ajukan surat keterangan secara online.',
      'Aspirasi & Pengaduan — sampaikan saran atau laporan masalah.',
      'Galeri — dokumentasi foto dan video kegiatan warga.',
      'Profil Kelurahan — struktur, visi misi, dan data kelurahan.',
    ],
  },
  {
    q: 'Bagaimana cara mengajukan surat keterangan secara online?',
    steps: [
      'Buka menu Pengajuan Persuratan di halaman utama.',
      'Isi formulir: nama lengkap, NIK, nomor HP, dan pilih jenis surat.',
      'Unggah foto KTP, foto Kartu Keluarga, dan surat pengantar dari RT.',
      'Klik tombol "Kirim Pengajuan".',
      'Pengurus akan memverifikasi dan menghubungi Anda dalam 1×24 jam.',
    ],
  },
  {
    q: 'Dokumen apa yang perlu disiapkan untuk pengajuan surat?',
    steps: [
      'Foto KTP (wajib) — ambil foto KTP yang jelas dan terbaca.',
      'Foto Kartu Keluarga (wajib) — foto KK yang menampilkan data lengkap.',
      'Surat Pengantar dari RT (wajib) — minta ke ketua RT terlebih dahulu.',
      'Dokumen pendukung (jika ada) — sesuai jenis surat yang diajukan.',
      'Pastikan file berformat JPG, PNG, atau PDF.',
    ],
  },
  {
    q: 'Berapa lama proses penerbitan surat?',
    steps: [
      'Surat Keterangan Domisili: 1 hari kerja.',
      'Surat Pengantar KTP / Kartu Keluarga: 1 hari kerja.',
      'Surat Keterangan Usaha: 2 hari kerja.',
      'Proses lebih cepat jika semua dokumen sudah lengkap saat pengajuan.',
    ],
  },
  {
    q: 'Bagaimana cara menyampaikan aspirasi atau pengaduan?',
    steps: [
      'Buka menu Aspirasi & Pengaduan di halaman utama.',
      'Pilih kategori: aspirasi, saran, kritik, atau pengaduan.',
      'Tulis pesan Anda dengan jelas dan lengkap.',
      'Klik "Kirim" — masukan akan dibaca dan ditindaklanjuti oleh pengurus.',
    ],
  },
  {
    q: 'Apakah layanan ini bisa digunakan di luar jam kerja?',
    steps: [
      'Pengisian formulir dan penyampaian aspirasi bisa dilakukan kapan saja.',
      'Verifikasi dan penerbitan surat hanya diproses pada hari kerja.',
      'Jam pelayanan: Senin–Jumat pukul 08.00–15.00 WIB.',
      'Pengajuan di luar jam kerja akan diproses pada hari kerja berikutnya.',
    ],
  },
]

function FaqSection() {
  const [openIdx, setOpenIdx] = useState(null)
  return (
    <section className="section-container" style={{ margin: '4rem auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 className="section-title">Pertanyaan Umum</h2>
        <p className="section-subtitle">Panduan singkat penggunaan layanan digital kelurahan.</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
        {faqItems.map((item, i) => {
          const isOpen = openIdx === i
          return (
            <div key={i} style={{ border: '1.5px solid', borderColor: isOpen ? 'var(--brand-300)' : 'var(--gray-200)', borderRadius: '1rem', overflow: 'hidden', background: '#fff', transition: 'border-color 0.2s' }}>
              <button
                type="button"
                onClick={() => setOpenIdx(isOpen ? null : i)}
                style={{ width: '100%', textAlign: 'left', background: isOpen ? 'var(--brand-50)' : '#fff', border: 'none', padding: '1rem 1.25rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', transition: 'background 0.2s' }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                  <span style={{ color: isOpen ? 'var(--brand-700)' : 'var(--gray-400)', flexShrink: 0, display: 'flex' }}><IconHelpCircle /></span>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--gray-900)', lineHeight: 1.5 }}>{item.q}</span>
                </span>
                <span style={{ color: isOpen ? 'var(--brand-700)' : 'var(--gray-400)', transition: 'color 0.2s', flexShrink: 0 }}>
                  <IconChevronDown open={isOpen} />
                </span>
              </button>
              {isOpen && (
                <div style={{ padding: '0.75rem 1.25rem 1rem 1.25rem', background: 'var(--brand-50)', borderTop: '1px solid var(--brand-200)' }}>
                  <ol style={{ margin: 0, paddingLeft: '1.375rem', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                    {item.steps.map((step, si) => (
                      <li key={si} style={{ fontSize: '0.875rem', color: 'var(--gray-600)', lineHeight: 1.65 }}>{step}</li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}


const menuItems = [
  {
    to: '/pengumuman',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
    title: 'Informasi & Pengumuman',
    desc: 'Lihat berita, pengumuman, dan informasi terbaru dari kelurahan dan RT.',
  },
  {
    to: '/agenda',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    title: 'Agenda Kegiatan',
    desc: 'Cek jadwal kegiatan warga, rapat, dan acara penting lainnya.',
  },
  {
    to: '/surat',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
    title: 'Pengajuan Persuratan',
    desc: 'Ajukan surat keterangan, surat domisili, atau layanan administrasi lainnya.',
  },
  {
    to: '/profil',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    title: 'Profil Kelurahan',
    desc: 'Kenali lebih dekat struktur, visi misi, dan data kelurahan.',
  },
  {
    to: '/galeri',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
    title: 'Galeri',
    desc: 'Lihat dokumentasi kegiatan, foto, dan video kegiatan warga.',
  },
  {
    to: '/aspirasi',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
    title: 'Aspirasi & Pengaduan',
    desc: 'Sampaikan saran, kritik, atau laporkan masalah di lingkungan Anda.',
  },
]

export default function Beranda() {
  const [stats, setStats] = useState({ rw_aktif: 0, kegiatan: 0, anggota: '0', warga: '0' })
  const [announcements, setAnnouncements] = useState([])
  const [agendas, setAgendas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      // stats
      const { data: statsData } = await supabase.from('site_stats').select('*').eq('id', 1).single()
      if (statsData) setStats(statsData)

      // announcements (latest 4)
      const { data: pData } = await supabase.from('pengumuman').select('*').order('tanggal', { ascending: false }).order('created_at', { ascending: false }).limit(4)
      if (pData) setAnnouncements(pData)

      // agendas (latest 4 upcoming based on date)
      const { data: aData } = await supabase.from('agenda').select('*').order('tanggal', { ascending: false }).limit(4)
      if (aData) setAgendas(aData)
      
      setLoading(false)
    }
    fetchData()
  }, [])

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  const formatAgendaDate = (dateStr) => {
    const d = new Date(dateStr)
    return {
      day: d.getDate(),
      month: d.toLocaleDateString('id-ID', { month: 'short' }),
      year: d.getFullYear()
    }
  }

  return (
    <div className="page-enter">
      {/* ── HERO ── */}
      <section style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="section-container" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '3rem', paddingTop: '3rem', paddingBottom: '3rem' }}>

          {/* Text */}
          <div style={{ flex: 1, minWidth: '300px', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--gray-400)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Selamat Datang di Karang Taruna
            </p>
            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)', fontWeight: 800, color: 'var(--gray-900)', lineHeight: 1.15 }}>
              Mewujudkan <br />
              Pelayanan Warga <br />
              yang <span style={{ color: 'var(--brand-600)' }}>Lebih Mudah</span>
            </h1>
            <p style={{ fontSize: '0.9375rem', color: 'var(--gray-500)', maxWidth: '480px', lineHeight: 1.75, fontWeight: 500 }}>
              Sistem informasi digital untuk warga Kelurahan Duri Selatan.
              Akses informasi, ajukan surat, dan kelola kebutuhan warga dalam satu platform.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <a href="#layanan" className="btn-primary" style={{ textDecoration: 'none' }}>Mulai Sekarang</a>
              <Link to="/profil" className="btn-outline" style={{ textDecoration: 'none' }}>Tentang Kami</Link>
            </div>
          </div>

          {/* Hero Image */}
          <div style={{ flex: 1, minWidth: '300px', zIndex: 1 }}>
            <div style={{ borderRadius: '2rem', overflow: 'hidden', boxShadow: '0 20px 60px rgba(22,101,52,0.15)', aspectRatio: '4/3' }}>
              <img
                src={berandaImg}
                alt="Kegiatan Warga"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="section-container" style={{ margin: '1.5rem auto' }}>
        <div style={{ background: 'var(--brand-50)', borderRadius: '1.5rem', padding: '2rem', display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', bottom: -40, right: -40, width: 192, height: 192, background: 'rgba(187,247,208,0.5)', borderRadius: '50%', filter: 'blur(48px)' }} />
          {[
            { icon: <IconUsers />, value: stats.rw_aktif,     label: 'Rukun Warga' },
            { icon: <IconClock />, value: stats.kegiatan,    label: 'Kegiatan Tahun Ini' },
            { icon: <IconCheck />, value: stats.anggota,  label: 'Anggota Aktif' },
            { icon: <IconUsers />, value: stats.warga, label: 'Warga Terlayani' },
          ].map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', zIndex: 1 }}>
              <div style={{ width: 44, height: 44, background: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-700)', boxShadow: '0 1px 8px rgba(0,0,0,0.08)', flexShrink: 0 }}>
                {s.icon}
              </div>
              <div>
                <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--gray-900)', lineHeight: 1 }}>{s.value}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)', fontWeight: 600, marginTop: '0.2rem' }}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── MAIN MENU ── */}
      <section id="layanan" className="section-container" style={{ margin: '4rem auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h2 className="section-title">Halo, Selamat Datang</h2>
          <p className="section-subtitle">Silakan pilih layanan yang Anda butuhkan.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {menuItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div className="card-hover" style={{ background: '#fff', border: '1.5px solid var(--gray-200)', borderRadius: '1.25rem', padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '180px', cursor: 'pointer' }}>
                <div>
                  <div style={{ width: 48, height: 48, background: 'var(--brand-50)', borderRadius: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-700)', marginBottom: '1rem', transition: 'all 0.2s' }}>
                    {item.icon}
                  </div>
                  <h3 style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--gray-900)', marginBottom: '0.375rem' }}>{item.title}</h3>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--gray-500)', lineHeight: 1.6 }}>{item.desc}</p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem', color: 'var(--gray-400)' }}>
                  <IconArrow />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <FaqSection />

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {/* ── PENGUMUMAN TERBARU ── */}
          <section className="section-container" style={{ margin: '4rem auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h2 className="section-title">Pengumuman Terbaru</h2>
            <p className="section-subtitle">Informasi penting seputar kegiatan kelurahan dan RT.</p>
          </div>
          <Link to="/pengumuman" style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--brand-600)', textDecoration: 'none' }}>
            Lihat Semua →
          </Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {announcements.map((item) => (
            <div key={item.id} className="card-hover" style={{ background: '#fff', border: '1.5px solid var(--gray-200)', borderRadius: '1.25rem', padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.875rem' }}>
                <span className={`badge badge-${(item.tag_color || 'blue').toLowerCase()}`} style={{ display: 'inline-flex', alignItems: 'center' }}>
                  <CategoryIcon category={item.kategori} /> {item.kategori}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)', fontWeight: 500 }}>{formatDate(item.tanggal)}</span>
              </div>
              <h4 style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--gray-900)', marginBottom: '0.5rem', lineHeight: 1.4, display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                {item.is_pinned && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--brand-600)' }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>}
                {item.judul}
              </h4>
              <p style={{ fontSize: '0.8125rem', color: 'var(--gray-500)', lineHeight: 1.6 }}>{item.isi}</p>
            </div>
          ))}
          {!loading && announcements.length === 0 && (
            <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>Belum ada pengumuman.</p>
          )}
        </div>
      </section>

      {/* ── AGENDA TERDEKAT ── */}
      <section className="section-container" style={{ margin: '4rem auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h2 className="section-title">Agenda Terdekat</h2>
            <p className="section-subtitle">Jangan lewatkan berbagai kegiatan dan acara warga mendatang.</p>
          </div>
          <Link to="/agenda" style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--brand-600)', textDecoration: 'none' }}>
            Lihat Semua Agenda →
          </Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {agendas.map((item) => {
            const date = formatAgendaDate(item.tanggal)
            return (
            <div key={item.id} className="card-hover" style={{ background: '#fff', border: '1.5px solid var(--gray-200)', borderRadius: '1.25rem', padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ background: 'var(--brand-50)', border: '1.5px solid var(--brand-200)', color: 'var(--brand-800)', borderRadius: '1rem', padding: '0.75rem', display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 64, textAlign: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{date.month}</span>
                <span style={{ fontSize: '1.75rem', fontWeight: 800, lineHeight: 1 }}>{date.day}</span>
                <span style={{ fontSize: '0.625rem', color: 'var(--gray-500)', fontWeight: 600 }}>{date.year}</span>
              </div>
              <div>
                <div style={{ marginBottom: '0.25rem' }}>
                  <span className={`badge badge-${item.tag_color || 'green'}`} style={{ fontSize: '0.65rem', padding: '0.125rem 0.5rem' }}>{item.kategori}</span>
                </div>
                <h4 style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--gray-900)', marginBottom: '0.5rem', lineHeight: 1.4 }}>{item.judul}</h4>
                {item.waktu && <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.25rem' }}><IconClockSm /> {item.waktu}</p>}
                {item.lokasi && <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)', fontWeight: 500, marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><IconPin /> {item.lokasi}</p>}
              </div>
            </div>
          )})}
          {!loading && agendas.length === 0 && (
            <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>Belum ada agenda terdekat.</p>
          )}
        </div>
      </section>
      </>
      )}
    </div>
  )
}
