# 🧬 AIDCARE - Diyabet Öz Yönetim Sistemi (Mini Web Proje)

AIDCARE, diyabetli bireylerin kendi kan şekeri düzeylerini izleyebildikleri, hasta verilerini yönetebildikleri bir öz yönetim platformudur. Bu proje Vue.js tabanlı frontend, Express.js tabanlı cache destekli proxy sunucusu, Node.js + PostgreSQL backend'i ve Docker altyapısı ile geliştirilmiştir.

---
🎬 **Tanıtım Videosu:**  
👉 [https://drive.google.com/file/d/1aDDF8W42p14V2MA04uSUoj9KCvxJnywW/view?usp=sharing](https://drive.google.com/file/d/1aDDF8W42p14V2MA04uSUoj9KCvxJnywW/view?usp=sharing)

👉[https://drive.google.com/file/d/13mzFVPtv-1xWmqWxHRBuKJcaFLRQit1a/view?usp=sharing](https://drive.google.com/file/d/13mzFVPtv-1xWmqWxHRBuKJcaFLRQit1a/view?usp=sharing)

---

## 📸 Görseller

### 🧾 Hasta Paneli – Genel Görünüm

<img src="./Ekran görüntüsü 2025-08-08 022607.png" alt="Hasta Paneli" width="100%"/>

### 📆 Takvim, Etkinlikler ve Hatırlatmalar

<img src="./Ekran görüntüsü 2025-08-08 022621.png" alt="Takvim ve Hatırlatmalar" width="100%"/>

---
## 🚀 Temel Özellikler

- 📝 Yeni hasta ekleme / düzenleme / silme
- 📃 Hasta listesini filtreleme (isim & cinsiyet)
- 📊 Kan şekeri ölçümlerini çizgi grafik olarak gösterme (Vue Chart.js)
- 📆 Tarih aralığına göre filtreleme
- 🔁 Redis cache entegrasyonu ile proxy performansı
- 💬 AidCare'e soru sorabilme ve sistem yanıtlarını görebilme
- 🔔 Hatırlatıcılar (günlük su içme, ilaç saati vb.) kartı
- 🧾 Hasta panelinde reçete bilgisi ve sağlık durumu özeti
- 🧍‍♀️ Responsive hasta paneli: grafik, takvim, mesajlaşma, hatırlatma, etkinlik ve hasta bilgileri bir arada

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

### 2️⃣ Veritabanı tablolarını terminal üzerinden oluştur

```sql
CREATE TABLE patients (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  birth_date DATE NOT NULL,
  gender TEXT NOT NULL,
  tc TEXT NOT NULL UNIQUE
);

CREATE TABLE sugar_levels (
  id SERIAL PRIMARY KEY,
  patient_id INTEGER REFERENCES patients(id) ON DELETE CASCADE,
  sugar_value INTEGER NOT NULL,
  measured_at TIMESTAMP NOT NULL
);

CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  patient_id INTEGER,
  message TEXT,
  reply TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE appointments (
  id SERIAL PRIMARY KEY,
  patient_id INTEGER REFERENCES patients(id) ON DELETE CASCADE,
  appointment_time TIMESTAMP NOT NULL,
  description TEXT
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
- 📈 **Şeker grafiği:** `/chart` sayfasından hasta seçin ve verileri görüntüleyin , yeni şeker verisi ekleyin.
- 📬 **AidCare’e soru sorun:** Mesajlaşma kartından soru gönderin, sistem yanıtlarını alın.
- 🔔 **Hatırlatmalar:** Günlük sağlık önerilerini kart üzerinde baloncuklar şeklinde görüntüleyin.
- 🧾 **Reçete ve sağlık özeti:** Hasta panelinde iki mini kart olarak görüntülenir.
- 📆 **Randevu takvimi:** Tarihlere göre randevular ve ölçüm geçmişi takvim üzerinde gösterilir.


---

## 📈 Grafik Özellikleri

- Tooltip ile "Değer: XX mg/dL" mesajı gösterilir.

---

## 👩‍💻 Geliştirici

- **Beyza Nur Gültekin**  
- GitHub: [github.com/Beyza-nur-g](https://github.com/Beyza-nur-g)
- Gmail : Beyzanurgultekin124@gmail.com | beyzanurgultekin00@gmail.com

---



