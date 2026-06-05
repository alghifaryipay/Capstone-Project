# Deployment Hostinger VPS

Project dijalankan sebagai tiga container:

- `frontend`: React statis, Caddy reverse proxy, dan HTTPS otomatis.
- `backend`: Express API dan SQLite.
- `ai`: FastAPI dan model TensorFlow.

Backend dan AI hanya tersedia di jaringan internal Docker. Pengguna mengakses frontend dan endpoint `/api` melalui satu domain.

## Kebutuhan VPS

- Ubuntu VPS dengan Docker dan Docker Compose.
- Minimal RAM 4 GB. RAM 8 GB lebih aman untuk proses build TensorFlow.
- Ruang disk kosong minimal 15 GB selama proses build image.
- Domain yang diarahkan ke IP VPS.
- Port `80` dan `443` dibuka pada firewall.

## Persiapan

```bash
git clone https://github.com/alghifaryipay/Capstone-Project.git
cd Capstone-Project
git checkout integrate-fe-be-ai
cp .env.production.example .env.production
```

Isi `.env.production`:

```env
DOMAIN=energy.domainanda.com
HTTP_PORT=80
HTTPS_PORT=443
JWT_SECRET=random-secret-yang-panjang-dan-sulit-ditebak
TARIFF_PER_KWH=1444.7
```

Pastikan DNS domain sudah mengarah ke IP VPS sebelum menjalankan container agar Caddy dapat menerbitkan sertifikat HTTPS.

## Menjalankan

```bash
docker compose --env-file .env.production config
docker compose --env-file .env.production up -d --build
docker compose --env-file .env.production ps
```

Pantau log:

```bash
docker compose --env-file .env.production logs -f
```

Setelah semua service sehat:

```text
https://energy.domainanda.com
https://energy.domainanda.com/api/health
```

## Update Aplikasi

```bash
git pull
docker compose --env-file .env.production up -d --build
```

Data akun dan riwayat tetap tersimpan pada Docker volume `smart-energy_backend_data`.

Image AI menggunakan paket TensorFlow CPU-only karena VPS tidak menyediakan GPU.

## Backup SQLite

Hentikan backend sebentar sebelum menyalin database:

```bash
docker compose --env-file .env.production stop backend
docker run --rm \
  -v smart-energy_backend_data:/data \
  -v "$PWD/backups:/backup" \
  alpine cp /data/smart-energy.sqlite /backup/smart-energy.sqlite
docker compose --env-file .env.production start backend
```

Simpan folder `backups/` di lokasi aman atau storage eksternal.

## Troubleshooting

```bash
docker compose --env-file .env.production ps
docker compose --env-file .env.production logs backend
docker compose --env-file .env.production logs ai
docker compose --env-file .env.production logs frontend
```

Jika AI membutuhkan waktu lama saat pertama start, tunggu proses health check selesai. Backend baru dijalankan setelah AI dinyatakan sehat.
