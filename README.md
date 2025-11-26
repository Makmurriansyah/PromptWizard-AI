<p align="center">
  <img src="https://image.prntscr.com/image/7saau5aETFumCqxZMK1WOw.png" width="100%">
</p>


# 🧙‍♂️ PromptWizard AI

**PromptWizard AI** adalah alat *prompt engineering* berbasis web yang mengubah ide sederhana (1-2 kata) menjadi instruksi tingkat lanjut yang sangat detail. Aplikasi ini dirancang untuk memaksimalkan potensi AI Generatif seperti Midjourney, ChatGPT, dan GitHub Copilot.

---

## ✨ Fitur & Panduan Konfigurasi

Kekuatan utama PromptWizard terletak pada panel konfigurasinya yang mendalam. Berikut adalah penjelasan setiap fitur beserta contoh penggunaannya:

### 1. Target Application (Aplikasi Target)
Fitur ini menentukan "siapa" yang akan menerima prompt tersebut. Setiap AI memiliki "bahasa" yang berbeda.

*   **Image Generation:** Mengoptimalkan prompt untuk visual (pencahayaan, tekstur, sudut kamera).
    *   *Input:* "Kucing"
    *   *Output:* "Cinematic shot of a fluffy calico cat, golden hour lighting, 8k resolution, macro photography."
*   **General LLM:** Mengoptimalkan untuk Chatbot (ChatGPT/Gemini) agar jawaban lebih terstruktur.
    *   *Input:* "Jelaskan AI"
    *   *Output:* "Act as a computer scientist. Explain Artificial Intelligence to a 10-year-old using simple analogies."
*   **Coding:** Fokus pada struktur kode, keamanan, dan best practices.
    *   *Input:* "Form Login"
    *   *Output:* "Create a secure React functional component for a login form using TypeScript, Zod validation, and Tailwind CSS."

### 2. Target Platform (Khusus Image Generation)
Setiap model gambar memiliki sintaks unik. PromptWizard menyesuaikan formatnya secara otomatis:

*   **Midjourney:** Menggunakan struktur parameter (contoh: `--v 6`, `--ar 16:9`, `--stylize`).
*   **DALL-E 3:** Menggunakan bahasa natural yang deskriptif dan naratif.
*   **Stable Diffusion:** Menggunakan format *tag-based* dengan pembobotan (contoh: `(masterpiece:1.2), best quality`).

### 3. Negative Prompt
Fitur ini memberitahu AI apa yang **TIDAK** boleh ada dalam hasil. Sangat krusial untuk Image Generation.

*   **Kegunaan:** Menghindari cacat visual atau elemen yang tidak diinginkan.
*   **Contoh:** Jika diaktifkan, AI akan otomatis menambahkan: `text, watermark, blurry, bad anatomy, extra fingers, low quality, distorted`.

### 4. Tone (Nada Bicara)
Mengatur gaya bahasa dan suasana dari prompt yang dihasilkan.

*   **Creative:** Bahasa yang puitis, imajinatif, dan berbunga-bunga (Cocok untuk novel/seni).
*   **Precise:** Bahasa yang tajam, langsung pada inti, dan spesifik (Cocok untuk teknis).
*   **Professional:** Bahasa formal, sopan, dan bisnis (Cocok untuk email/laporan).

### 5. Complexity (Kompleksitas)
Mengatur seberapa panjang dan detail instruksi yang dihasilkan.

*   **Basic:** Prompt pendek (1-2 kalimat). Cepat dan mudah dipahami.
*   **Intermediate:** Prompt menengah dengan detail yang cukup seimbang.
*   **Advanced:** Prompt sangat panjang ("Mega Prompt") yang mencakup setiap detail kecil, edge-cases, dan konteks mendalam.

### 6. Quantity
Menentukan jumlah variasi prompt yang ingin dihasilkan dalam sekali klik (1 hingga 50 variasi). Berguna untuk mendapatkan banyak opsi sudut pandang dari satu ide dasar.

---

## 🛠️ Teknologi yang Digunakan

*   **Frontend:** React 19, TypeScript, Vite
*   **Styling:** Tailwind CSS (Modern Glassmorphism UI)
*   **AI Core:** Google Gemini API (`@google/genai`)
*   **Icons:** Lucide React

---

## 💻 Cara Menjalankan (Instalasi)

Ikuti langkah-langkah ini untuk menjalankan proyek di komputer Anda:

### Prasyarat
Pastikan Anda sudah menginstall [Node.js](https://nodejs.org/) di komputer Anda.

### 1. Clone Repositori
```bash
git clone https://github.com/USERNAME-ANDA/prompt-wizard.git
cd prompt-wizard
```
## 2. Install Dependencies
```bash
npm install
```
### 3. Jalankan Mode Development
```bash
npm run dev
```
Buka browser dan akses alamat yang muncul (biasanya http://localhost:5173).
### 4. Konfigurasi API Key
Buka aplikasi di browser.
Klik tombol "Set API Key" di pojok kanan atas.
Masukkan Google Gemini API Key Anda (Dapatkan gratis di Google AI Studio).
Key akan tersimpan di local storage browser Anda (aman dan tidak dikirim ke server manapun selain Google).
### 5. Build untuk Production (Opsional)
Jika ingin mengunggah ke Vercel atau hosting lain:
```bash
npm run build
```
🔒 Privasi & Keamanan
Aplikasi ini bersifat Client-Side Only.
API Key Anda disimpan secara lokal di browser Anda.
Tidak ada database backend yang menyimpan prompt atau key Anda.
Komunikasi data terjadi langsung antara browser Anda dan Google Gemini API.

Dibuat dengan ❤️ oleh Makmurriansyah
