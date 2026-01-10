<div align="center">

# 🚀 <b>APe UI</b> — <i>Simple API Dashboard</i>

<p>
Dashboard dokumentasi API yang <b>ringan</b>, <b>modern</b>, dan <b>mudah dikonfigurasi</b>.<br>
Dibangun dengan <b>Express.js</b> & <b>Tailwind CSS</b>, serta <b>siap dideploy ke Vercel</b>.
</p>

<br>

<img src="https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge">
<img src="https://img.shields.io/badge/Express.js-Framework-blue?style=for-the-badge">
<img src="https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge">

</div>

---

## ✨ <b>Fitur Utama</b>

<ul>
<li>🎨 UI modern simpel</li>
<li>⚡ Performa ringan dan cepat</li>
<li>🔧 Konfigurasi fleksibel via JSON</li>
<li>🔐 Sistem API Key </li>
<li>☁️ Siap deploy ke <b>Vercel</b></li>
</ul>

---

## 🗂️ <b>Struktur Project</b>

APe-UI/  
├── server.js           # Main server (Express)  
├── public/  
│   └── index.html     # Dashboard UI  
├── api/               # Logic setiap endpoint  
│   └── hello.js  
├── endpoints.json     # Database daftar endpoint  
├── settings.json      # Branding & konfigurasi  
└── vercel.json        # Konfigurasi Vercel  

---

## ⚙️ <b>Konfigurasi Utama</b>

### 🏷️ <b>Branding & Identitas</b> — <code>settings.json</code>

{
  "api_name": "Nama API Anda",
  "api_type": "V1.0.0",
  "description": "Deskripsi singkat layanan Anda",
  "owner": "Nama Anda",
  "footer": "© 2026 APe UI Project",
  "api_keys": ["key-1", "key-2"],
  "use_profile": true,
  "owner_profile": "/logo.jpg"
}

---

### 📦 <b>Manajemen Endpoint</b> — <code>endpoints.json</code>

{
  "Main": [
    {
      "name": "Nama Fitur",
      "desc": "Penjelasan kegunaan fitur",
      "path": "/api/fitur?q=",
      "auth": true,
      "status": "online",
      "note": "Catatan tambahan"
    }
  ]
}

---

## 🏗️ <b>Menambahkan Endpoint Baru</b>

### 1️⃣ <b>Buat Logic Endpoint</b>

api/hello.js

module.exports = (app) => {
  app.get('/api/hello', (req, res) => {
    const nama = req.query.nama || 'Guest';
    res.json({
      status: true,
      message: `Hello ${nama}!`
    });
  });
};

### 2️⃣ <b>Daftarkan di JSON</b>

{
  "Main": [
    {
      "name": "Hello World",
      "desc": "Menyapa pengguna",
      "path": "/api/hello?nama=",
      "auth": false,
      "status": "online"
    }
  ]
}

<i>Endpoint otomatis muncul di dashboard UI tanpa edit frontend</i> ✨

---

## 🧪 <b>Menjalankan di Lokal</b>

npm install  
node server.js  

Buka di browser:  
<code>http://localhost:3000</code>

---

## ☁️ <b>Deploy ke Vercel</b>

1. Upload project ke <b>GitHub</b>  
2. Hubungkan repository ke <b>Vercel</b>  
3. Vercel akan otomatis build dari <code>vercel.json</code>  
4. 🎉 <b>Selesai! API kamu online</b>

---

## 🔐 <b>Catatan Keamanan</b>

<blockquote>
Jangan menyimpan API Key penting di repo publik.  
Gunakan environment variable jika dibutuhkan untuk produksi.
</blockquote>

---

<div align="center">


</div>