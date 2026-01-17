Bagus sekali\! Dengan menambah waktu pengerjaan menjadi **2 jam per hari**, kita memiliki total **20-22 jam efektif** dalam 1,5 minggu. Sebagai Project Manager, saya akan membagi jadwal ini menjadi **"Sprint Akselerasi"** agar target 90% tercapai dengan kualitas yang lebih tinggi.

Kunci utamanya adalah **"Integrasi Cepat"** (menggunakan SDK yang sudah ada) daripada membangun segalanya dari nol.

Berikut adalah rencana harian langkah demi langkah:

---

### **🚀 Sprint Akselerasi: EdTech Intelligence (10 Hari)**

#### **Hari 1: Fondasi & Kontrak Data**

* **Backend (BE):** Inisialisasi Go Gin, setup Firebase Admin SDK, dan koneksi ke API AI (Gemini/OpenAI)1.  
* **Frontend (FE):** Setup proyek (React/Vue/Next.js) dan Firebase Client SDK.  
* **PM Note:** Luangkan 30 menit terakhir untuk mengunci skema JSON untuk *inbox* dan *AI insights* agar tidak ada perubahan struktur di tengah jalan.

#### **Hari 2: Authentication & Real-time Inbox**

* **BE:** Buat *middleware* autentikasi untuk memvalidasi Firebase Token.  
* **FE:** Halaman Login/Register dan UI *sidebar inbox* yang terhubung langsung ke Firestore secara *real-time*.  
* **PM Note:** Fokus pada aliran data; pastikan pesan baru di Firestore langsung muncul di UI tanpa *refresh*.

#### **Hari 3: AI Part 1: Klasifikasi & Urgensi (EdTech Focus)**

* **BE:** Membuat *logic prompting* untuk mengkategorikan pesan ke dalam "Ujian", "Akses Materi", atau "Pembayaran" serta memberikan skor urgensi 1-10.  
* **FE:** Membuat halaman detail percakapan dan komponen *badge* warna untuk tingkat urgensi.  
* **PM Note:** Gunakan *System Prompt* yang kuat agar AI konsisten mengembalikan format JSON.

#### **Hari 4: AI Part 2: Sentimen & Ringkasan**

* **BE:** Implementasi fitur analisis sentimen per pesan dan perangkuman otomatis untuk percakapan panjang.  
* **FE:** UI indikator perasaan (ikon wajah/emoji) dan area ringkasan di samping chat.  
* **PM Note:** Ringkasan sangat penting untuk persona Alex agar ia cepat memahami masalah mahasiswa.

#### **Hari 5: AI Part 3: Saran Balasan (Response Suggestion)**

* **BE:** Membuat *logic* untuk menghasilkan 2-3 draf balasan dengan nada berbeda (Formal & Empatik).  
* **FE:** Menampilkan draf balasan dalam bentuk kartu yang bisa diklik untuk mengisi kolom input *chat* secara otomatis.  
* **PM Note:** Ini adalah fitur "Wow Factor" yang akan sangat membantu efisiensi agen.

#### **Hari 6: Dasar Analytics Dashboard**

* **BE:** Membuat *endpoint* untuk agregasi data (jumlah total pesan per kategori dan rata-rata sentimen).  
* **FE:** Implementasi Chart.js atau Recharts untuk visualisasi *doughnut chart* kategori masalah EdTech.  
* **PM Note:** Cukup tampilkan data statistik sederhana namun informatif bagi Support Lead.

#### **Hari 7: Fitur Kreatif & Polishing UI**

* **BE:** Implementasi fitur "Push Notification" sederhana atau penanda "Red Alert" untuk sentimen sangat negatif.  
* **FE:** Memperhalus UX, transisi halaman, dan memastikan *layout* dashboard terlihat profesional.  
* **PM Note:** Di hari ini, progres kalian seharusnya sudah menyentuh 80%.

#### **Hari 8: Testing & Deployment (Menuju 90%)**

* **BE:** *Deployment* ke Railway/Render dan melakukan pengujian *load* API sederhana2.  
* **FE:** *Deployment* ke Vercel/Netlify dan memastikan semua fungsi terhubung ke API produksi3.  
* **PM Note:** Pastikan semua link (GitHub & Deployment) sudah bekerja karena ini wajib dilampirkan dalam PDF4.

#### **Hari 9: Dokumentasi & Video (Mandatori)**

* **BE:** Menyusun PDF dokumentasi arsitektur sistem dan desain API5.  
* **FE:** Menyusun laporan proses pengembangan dan pembagian tugas6.  
* **PM Note:** Rekam video penjelasan maksimal 5 menit yang menunjukkan fitur AI bekerja secara nyata7.

#### **Hari 10: Final Review & Submission**

* **BE & FE:** Melakukan pengecekan terakhir terhadap semua persyaratan di Google Classroom8.  
* **PM Note:** Pastikan file PDF sudah lengkap dengan semua link yang diminta sebelum *deadline* 31 Januari 20269.

---

### **💡 Tips PM untuk Pemula:**

1. **Gunakan Library:** Untuk grafik, gunakan **Chart.js**. Untuk UI, gunakan **Tailwind CSS** atau **Shadcn UI**. Jangan membuang waktu membuat komponen CSS dari nol.  
2. **AI sebagai Alat Bantu:** Jika bingung dengan sintaks Go Gin, gunakan AI untuk men-generate *boilerplate* fungsi, namun pastikan kamu memahami logikanya.  
3. **Prioritaskan Fungsi, Bukan Estetika:** Juri menilai kompleksitas implementasi dan kreativitas solusi masalah. Pastikan fitur AI-nya "pintar" dulu, baru percantik tampilannya.  
4. **Komunikasi Rutin:** Karena kalian bekerja 2 jam/hari, gunakan 15 menit pertama untuk *sync* apa yang akan dikerjakan hari itu agar tidak terjadi tumpang tindih.

