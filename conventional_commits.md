🛠️ Standar Format Commit Message
Setiap pesan commit sebaiknya mengikuti format berikut: type: description

1. Jenis-Jenis Type (Kategori)
Gunakan prefix berikut sesuai dengan apa yang kamu kerjakan:


feat: Untuk fitur baru (misalnya: integrasi AI, setup database).
+1


fix: Untuk memperbaiki bug atau kesalahan kode.
+1


docs: Perubahan pada dokumentasi (misalnya: update README atau api_contract.json).
+1

style: Perubahan tampilan atau format kode (CSS, indentasi) tanpa mengubah logika.

refactor: Mengubah struktur kode agar lebih rapi tanpa mengubah fiturnya.


chore: Pekerjaan rutin seperti update dependensi atau inisialisasi proyek.
+1

📝 Contoh Implementasi untuk EduResolve AI
Berikut adalah contoh pesan commit yang bisa langsung kamu dan rekanmu gunakan:

Sisi Backend (Kamu)
chore: init golang gin project and go mod

feat: setup firebase admin sdk and service account connection

feat: implement ai sentiment analysis for student messages

fix: resolve jwt token verification error in auth middleware

docs: update api_contract.json for analytics overview endpoint

Sisi Frontend (Rekanmu)
feat: create real-time message inbox with firestore

style: add urgency color indicators for message list

feat: implement chart.js for issue distribution dashboard

fix: fix alignment issue on mobile view for chat detail

💡 Tips PM untuk Riwayat Commit yang Bagus
Atomic Commits: Lakukan commit untuk satu tugas kecil yang spesifik. Jangan menggabungkan fitur Login, Integrasi AI, dan Desain Dashboard dalam satu commit besar.

Gunakan Bahasa Inggris: Konsisten menggunakan Bahasa Inggris akan memberikan kesan lebih profesional di mata juri GDGOC.

Hindari Pesan yang Tidak Jelas: Jangan pernah menggunakan pesan seperti update, fix, atau coba-coba. Hal ini akan mengurangi nilai pada kriteria version control practices.
+1


Sync Sebelum Push: Biasakan melakukan git pull sebelum git push untuk menghindari konflik, terutama karena kalian bekerja berpasangan dalam satu tim.


Catatan Penilaian: Juri akan melihat GitHub kalian untuk memverifikasi "task distribution" (siapa mengerjakan apa) dan konsistensi pengembangan selama 3 minggu ini.
+1
