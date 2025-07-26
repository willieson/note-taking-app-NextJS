<b>Project Struktur</b>

<li>prisma/schema.prisma -- eloquent migrate Skema database</li>
<li>components -- Template fitur-fitur reusabel</li>
<li>lib -- setting library,authentikasi session database dll</li>
<li>helper -- untuk menangani error reusable</li>
<li>api -- Server side Routes</li>
<li>middleware -- untuk access authentikasi</li>

<b>Rancangan Struktur Database dan Alasan</b>

<img src="https://github.com/willieson/note-taking-app-Laravel/blob/main/ERD_Database_pgs.png" width = "400"/>

<li>users : Menyimpan data akun pengguna.</li>
<li>notes : Menyimpan catatan milik user. Memiliki kolom is_public untuk publikasi.</li>
<li>note_shares : Menyimpan catatan yang dibagikan ke user lain.</li>
<li>comments : Komentar untuk catatan publik. Disimpan bersama info user & note.</li>
</br>
<b>Relasi antar tabel</b>

<li>users ⟶ notes (1-to-many)</li>
<li>users ⟶ comments (1-to-many)</li>
<li>notes ⟶ comments (1-to-many)</li>
<li>notes ⟷ users melalui note_shares (many-to-many)</li>
</br>
<b>Alasan Struktur:</b>
 <p>   Menggunakan note_shares sebagai tabel pivot agar bisa kontrol siapa yang mendapat akses.
    Field is_public pada notes memudahkan memisahkan mana catatan publik dan privat.
    comments hanya diaktifkan untuk catatan publik.</p>

<b>Flow Process Aplikasi</b>

a. User Flow:
-> User login/daftar (validasi)

-> Masuk Dashboard (autentikasi Login -> make JWT token)

Dashboard Menampilkan Notes semua user yang dapat dilihat public
ketika diklik salah satu notes, user dapat memberikan komentar terhadap notes tersebut

-> Menu Notes

Menampilkan Notes User dan Notes yang dishared ke user
+Create Note -> untuk user membuat notes baru

+button Update -> merubah Notes user yang sudah ada, title/content/ Public true:false

+button Delete -> Menghapus Notes User yang sudah ada

+Button Share -> Membagikan Notes User Ke User lain

-> Logout

Mengakhiri Sesi Login (autentikasi --Delete Jwt token)

b. Backend Flow:
/api/auth -> Credentials User

/api/comments -> Mengatur logika komentar user terhadap notes public

/api/notes -> mengatur logika notes management

/api/register -> mengatur logika pendaftaran user baru

/api/users -> menampung user list

<b>Penggunaan SSR, CSR, dan SSG</b>
CSR (Client-Side Rendering): Mayoritas halaman menggunakan CSR dengan React Hooks (e.g. useEffect, useState) alasannya karena:

<li>Data dinamis (notes, shared users)</li>
<li>interaksi end user secara langsung (modal, button share)</li>
SSR & SSG Tidak diimplementasikan secara langsung dalam proyek ini.
komunikasi database dilakukan di sisi server melalui API Routes (Next.js App Router).
proses rendering halaman dilakukan di sisi klien.
Untuk /api/* adalah untuk penanganan Server Side - Fetching data dari database kirim ke client

lib/db.ts -> Kumpulan Query untuk Reusable

<b>Library/Plugin yang di pakai</b>

<li>NextJS (App Router) : Framework utama frontend & API</li>
<li>React : UI Rendering</li>
<li>pg (node-postgres) : Koneksi langsung ke PostgreSQL</li>
<li>Prisma : ORM, Relasi dan migrasi</li>
<li>Tailwind CSS : Styling UI secara efisien dan responsif</li>
<li>Lucide React : 	Ikon UI modern</li>
<li>Bycrpt :  hashing password</li>
<li>Next Auth : untuk JWT token otentikasi</li>

<h1><b>##Setup</b></h1>

Dibuat menggunakan NextJS 15

Required
`NodeJS v24.4.1` ++

`npx & npm v11.4.2`++

copy project `git clone https://github.com/willieson/note-taking-app-NextJS.git`

masuk direktori `cd note-taking-app-NextJS`

install dependencies `npm install`

siapkan database

setup .env `touch .env`

setting database di env contoh silahkan lihat di `env.example` ini menggunakan settingan postgresql

migrasi database `npx prisma migrate dev --name init`

Running dev `npm run dev`
