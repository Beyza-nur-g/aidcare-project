# 🧬 AIDCARE - Diyabet Öz Yönetim Sistemi (Mini Web Proje)

AIDCARE, diyabetli bireylerin kendi kan şekeri düzeylerini izleyebildikleri, hasta verilerini yönetebildikleri bir öz yönetim platformudur. Bu proje Vue.js tabanlı frontend, Express.js tabanlı cache destekli proxy sunucusu, Node.js + PostgreSQL backend'i ve Docker altyapısı ile geliştirilmiştir.

---

## 🚀 Temel Özellikler

- 📝 Yeni hasta ekleme / düzenleme / silme
- 📃 Hasta listesini filtreleme (isim & cinsiyet)
- 📊 Kan şekeri ölçümlerini çizgi grafik olarak gösterme (Vue Chart.js)
- 📆 Tarih aralığına göre filtreleme
- 🔁 Redis cache entegrasyonu ile proxy performansı
- 📉 Referans dışı ölçüm değerlerini renklendirme

---

## ⚙️ Kullanılan Teknolojiler

| Katman           | Teknolojiler ve Açıklama                                |
|------------------|---------------------------------------------------------|
| Frontend         | Vue 3, Chart.js, chartjs-plugin-annotation              |
| Proxy Sunucu     | Node.js, Express.js, ioredis (Redis cache sistemi)      |
| Backend          | Node.js, Express.js, pg (PostgreSQL veritabanı bağlantısı) |
| Veritabanı       | PostgreSQL (pgAdmin veya terminal erişimi)              |
| Cache Sistemi    | Redis (Docker container olarak)                         |
| Containerizasyon | Docker, Docker Compose                                  |

---

## 🧱 Proje Yapısı

```
aidcare-project/
├── backend/            # Node.js - PostgreSQL backend
├── proxy-server/       # Express.js + Redis cache proxy
├── aidcare-frontend/   # Vue.js arayüz
└── docker-compose.yml  # Redis + PostgreSQL containerları
```

---

## 🛠️ Kurulum ve Çalıştırma Adımları

### 1️⃣ Docker container’larını başlat

```bash
docker-compose up -d
```

> Redis ve PostgreSQL container'ları bu adımda ayağa kalkar.

### 2️⃣ Veritabanı tablolarını terminal üzerinden oluştur

```sql
CREATE TABLE patients (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  birth_date DATE NOT NULL,
  gender TEXT NOT NULL
);

CREATE TABLE sugar_levels (
  id SERIAL PRIMARY KEY,
  patient_id INTEGER REFERENCES patients(id) ON DELETE CASCADE,
  sugar_value INTEGER NOT NULL,
  measured_at TIMESTAMP NOT NULL
);
```

> pgAdmin zorunlu değildir. Terminal ile işlem yapılabilir.

### 3️⃣ Backend sunucusunu çalıştır

```bash
cd backend
npm install
node index.js
```

> Port: `3002`

### 4️⃣ Proxy sunucusunu başlat

```bash
cd proxy-server
npm install
node index.js
```

> Port: `3001`

### 5️⃣ Vue.js Frontend’i çalıştır

```bash
cd aidcare-frontend
npm install
npm run serve
```

> Port: `8080`  
> Erişim adresi: http://localhost:8080

---

## 💻 Kullanım

- 🧾 **Yeni hasta ekleyin:** Sol paneldeki formu doldurun.
- 🧍‍♀️ **Hasta listesini görüntüleyin:** Sağ karttaki filtreleme alanlarını kullanarak hastaları sıralayın.
- ✏️ **Düzenle / sil:** Hasta kartı üzerinden ilgili işlemleri gerçekleştirin.
- 📈 **Şeker grafiği:** `/chart` sayfasından hasta seçin ve verileri görüntüleyin.

> Silme sırasında sistem "Emin misiniz?" sorusunu yöneltir. Eğer hastanın şeker verisi varsa uyarı mesajı da gösterilir.

---

## 📈 Grafik Özellikleri

- Tooltip ile "Değer: XX mg/dL" mesajı gösterilir.

---

## 👩‍💻 Geliştirici

**Beyza Nur G.**  
GitHub: [github.com/Beyza-nur-g](https://github.com/Beyza-nur-g)

---



