# RE-CRAFT Mobile (`recraft-mobile`)

> *Pindai Bekas, Rakit Presisi* — Asisten Rekayasa 3D (*Direct-to-3D Studio*) & Ekosistem Upcycling berbasis **React 19 + Vite 8 + Tailwind CSS v4 + Three.js + Capacitor 8**.

Saat ini proyek berjalan dalam **Mode UI/UX Tanpa Backend** dengan seluruh data tiruan terpusat di [`src/mocks/`](./src/mocks/) sehingga seluruh alur dapat langsung dijalankan dan diuji di browser maupun HP Android.

---

## 1. Prasyarat Sistem (Wajib Terpasang)

| Alat | Versi Minimum | Catatan |
|---|---|---|
| **Node.js** | `v22+` (LTS) | Dibutuhkan oleh Vite 8 & Capacitor 8 |
| **Git** | Terbaru | Untuk `git clone` |
| **Android Studio** | Terbaru | Dibutuhkan hanya jika ingin menjalankan di Emulator / HP Android |
| **JDK / Gradle JVM** | **JVM 21** (maksimal 24) | Gradle 8.14.3 belum kompatibel dengan Java 25; pilih **Use JVM 21** di Android Studio |

Di Android Studio (**Tools → SDK Manager**), pastikan sudah terpasang:
- Minimal 1 **Android SDK Platform** stabil (disarankan **API 35 / Android 15** atau **API 34**).
- Tab **SDK Tools**: **Android SDK Platform-Tools** (berisi `adb`).

---

## 2. Clone & Install Dependencies

```bash
# 1. Clone repository
git clone <URL_REPO_ANDA>
cd recraft-mobile

# 2. Install seluruh dependency npm
npm install
```

---

## 3. Menjalankan di Browser (Web Dev Mode)

```bash
npm run dev
```

Buka alamat yang tampil di terminal (umumnya `http://localhost:5173`), lalu tekan `F12` → `Ctrl+Shift+M` untuk menguji tampilan mobile (*Device Toolbar*).

### Fitur Debug Khusus Mode `dev`
- Di pojok kanan atas terdapat tombol pil **`Debug`** (`StateDebugger`) yang hanya muncul saat `npm run dev` (otomatis hilang di build produksi).
- Gunakan panel **`Debug`** untuk memicu state secara instan tanpa backend:
  - **Scan:** Loncat ke `IDLE`, `PROCESSING`, `CONFIRMATION`, atau `ERROR`.
  - **Studio 3D:** Muat `P1`, paksa *Zoom* `1.45x` (*Explode*), pilih `C04`, atau *Reset 3D*.
  - **Jaringan:** Aktifkan *Slow Network (3x)* atau paksa error pada request berikutnya.
  - **Proyek & Pasar:** Kosongkan daftar (*Empty State*) atau muat ulang data mock.
  - **Profil:** Ubah peran aktif (`PEMBELI` / `PENYEDIA` / `PERAJIN`).

---

## 4. Menjalankan di Emulator atau HP Android Asli

Folder `dist/` dan aset WebView di dalam `android/` tidak disimpan di Git. Setiap kali habis `git clone` atau setelah mengubah kode di `src/`, wajib jalankan **build + sync**:

```bash
# 1. Compile TypeScript & build aset web ke dist/
npm run build

# 2. Salin dist/ dan plugin Capacitor ke folder android/
npx cap sync android

# 3. Buka project android/ di Android Studio
npx cap open android
```

### Langkah di Android Studio
1. Jika muncul dialog *"Please Select Gradle JVM to Import Project"*, klik **Use JVM 21**.
2. Tunggu proses **Gradle Sync** di kanan bawah selesai.
3. Pilih target perangkat di dropdown toolbar atas:
   - **Opsi A — Emulator Android Studio:**
     Buka **Tools → Device Manager → `+` (Create Virtual Device)** → pilih **`Medium Phone`** (`1080×2400`) → pilih system image **API 35 (`Google Play Intel x86_64 Atom System Image`)** → **Finish**.
   - **Opsi B — HP Android Asli (Kabel USB):**
     1. Di HP: **Pengaturan → Tentang ponsel** → ketuk *Nomor build* 7x → masuk **Opsi pengembang** → aktifkan **Debugging USB** *(untuk Xiaomi/Redmi/POCO aktifkan juga Instal via USB & Debugging USB Setelan Keamanan)*.
     2. Colok kabel data USB → ubah mode USB di notifikasi HP menjadi **Transfer File / MTP** → izinkan dialog *"Izinkan debugging USB?"*.
   - **Opsi C — HP Android Asli (Wireless Wi-Fi jika USB bermasalah / mDNS terblokir):**
     1. Pastikan laptop dan HP di Wi-Fi yang sama.
     2. Di HP: **Opsi pengembang → Debugging Nirkabel** → catat IP & Port utama, lalu buka **Pasangkan perangkat dengan kode penyandingan**.
     3. Di PowerShell laptop:
        ```powershell
        & "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe" pair <IP>:<PORT_PAIRING>
        # masukkan kode 6 digit dari HP

        & "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe" connect <IP>:<PORT_UTAMA>
        & "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe" devices
        ```
4. Klik tombol **Run** (`▶`) di Android Studio.

---

## 5. Daftar Perintah Harian

| Perintah | Fungsi |
|---|---|
| `npm run dev` | Menjalankan dev server lokal dengan HMR (`StateDebugger` aktif) |
| `npm run lint` | Menjalankan `oxlint` untuk cek error/warning React & TypeScript |
| `npm run build` | Memeriksa TypeScript (`tsc -b`) dan mem-build bundle produksi ke `dist/` |
| `npx cap sync android` | Menyinkronkan `dist/` & plugin native ke proyek Android |
| `npx cap open android` | Membuka folder `android/` di Android Studio |

---

## 6. Struktur Proyek & Stack Utama

```text
recraft-mobile/
├── src/
│   ├── components/
│   │   ├── AppShell.tsx          # Navigasi 5 menu + Center FAB Scan + Top Nav Desktop
│   │   ├── LoadingOverlay.tsx    # Animasi blueprint 3 langkah
│   │   ├── StateDebugger.tsx     # Panel penguji state (khusus dev)
│   │   └── studio/               # Kanvas 3D (R3F), Denah SVG, & Sheet Content
│   ├── config/                   # Konfigurasi environment & kontrol simulasi mock
│   ├── mocks/                    # PUSAT DATA & SERVICE MOCK TUNGGAL (siap lepas saat integrasi API)
│   │   ├── mockData.ts
│   │   ├── mockServices.ts
│   │   └── index.ts
│   ├── screens/                  # 8 halaman aplikasi (Beranda, Proyek, Scan, Analisis, Studio3D, Pasar, DetailProduk, Profil)
│   ├── services/                 # Adapter interface (otomatis pilih mock vs real API via VITE_USE_MOCK)
│   ├── store/                    # Zustand v5 stores + persist via @capacitor/preferences
│   ├── types/                    # Kontrak TypeScript (selaras payload Studio 3D & Pasar)
│   └── utils/                    # Delay simulator & Capacitor Haptics wrapper
├── android/                      # Proyek native Android (Capacitor 8)
├── capacitor.config.ts           # Konfigurasi appId, webDir, dan SystemBars edge-to-edge
└── vite.config.ts                # Tailwind CSS v4, alias @/, dan Rolldown codeSplitting
```

### Stack & Library Terpasang
- **Core UI:** React 19, TypeScript, Vite 8, React Router v7, Tailwind CSS v4 (`@tailwindcss/vite`), `lucide-react`, `sonner`
- **State & Storage:** `zustand` v5, `@capacitor/preferences`
- **3D & Bottom Sheet:** `three`, `@react-three/fiber` v9, `@react-three/drei` v10, `vaul`
- **Capacitor 8 Native:** `@capacitor/core`, `@capacitor/android`, `@capacitor/app`, `@capacitor/camera`, `@capacitor/haptics`

---

## 7. Menghubungkan ke Backend Asli (Nanti Saat Siap)

1. Buat file `.env.production` (atau `.env.local`) dan atur:
   ```env
   VITE_USE_MOCK=false
   VITE_API_BASE_URL=https://api.recraft.app/api/v1
   ```
2. Lengkapi implementasi `api*Service` di dalam `src/services/` menggunakan kontrak di `src/types/`.
3. Setelah integrasi selesai, folder [`src/mocks/`](./src/mocks/) dapat dihapus tanpa mengubah komponen UI di `src/screens/` atau `src/store/`.

---

## 8. Troubleshooting Cepat

| Masalah | Solusi |
|---|---|
| `adb` tidak dikenali di PowerShell | Jalankan lewat `& "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe"` atau tambahkan folder `platform-tools` ke Windows PATH |
| Android Studio minta Gradle JVM | Pilih **Use JVM 21** (Gradle `8.14.3` tidak mendukung Java 25) |
| Layar putih atau perubahan kode tidak muncul di HP | Selalu jalankan `npm run build` lalu `npx cap sync android` sebelum klik **Run** di Android Studio |
| Inspect `console.log` WebView di HP | Buka Chrome di laptop → `chrome://inspect/#devices` → klik **inspect** di bawah `RE-CRAFT` |
