<template>
  <div class="dashboard-wrapper">
    <div class="dashboard-header">
      <h2>👩‍⚕️ Hasta Paneli</h2>
      <button class="logout-button" @click="logout">🚪 Çıkış Yap</button>
    </div>

    <div class="dashboard-grid">
      <!-- Hasta Bilgileri Kartı -->
      <div class="dashboard-card patient-info">
        <h3>🧾 Hasta Bilgileri</h3>
        <p><strong>Ad:</strong> {{ patient?.name }}</p>
        <p>
          <strong>Doğum Tarihi:</strong> {{ formatDate(patient?.birth_date) }}
        </p>
        <p><strong>Cinsiyet:</strong> {{ patient?.gender }}</p>
        <p><strong>TC Kimlik No:</strong> {{ patient?.tc }}</p>

        <!-- Mini Kartlar -->
        <div class="mini-info-container">
          <div class="mini-card prescription-card">
            <h4>💊 Son Reçete</h4>
            <p>Metformin 500mg – Günde 2 kez</p>
          </div>
          <div class="mini-card status-card">
            <h4>📈 Durum</h4>
            <p><span class="status-label low">Stabil</span></p>
          </div>
        </div>
      </div>

      <div class="dashboard-card graph-card">
        <h3>📈 Glukoz Ölçüm Grafiği</h3>
        <GlucoseChart :patientId="patient?.id" v-if="patient?.id" />
      </div>

      <div class="calendar-reminder-wrapper">
        <div class="dashboard-card calendar-card">
          <h3>📅 Takvim</h3>
          <CalendarCard :patientId="patient?.id" v-if="patient?.id" />
        </div>

        <div class="dashboard-card events-card">
          <h3>📌 Etkinlikler</h3>
          <UpcomingEventsCard v-if="patient?.id" />
        </div>

        <div class="dashboard-card reminder-card">
          <AidcareReminderCard />
        </div>
      </div>

      <div class="dashboard-card message-card">
        <AidcareMessageCard />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { usePatientStore } from "@/stores/patientStore";
import GlucoseChart from "@/components/GlucoseChart.vue";
import CalendarCard from "@/components/CalendarCard.vue";
import UpcomingEventsCard from "@/components/UpcomingEventsCard.vue";
import AidcareMessageCard from "@/components/AidcareMessageCard.vue";
import AidcareReminderCard from "@/components/AidcareReminderCard.vue";

const router = useRouter();
const patientStore = usePatientStore();
const patient = patientStore.patient;

function logout() {
  patientStore.$reset();
  router.push("/login");
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString();
}
</script>

<style scoped>
.dashboard-wrapper {
  padding: 2rem;
  background: linear-gradient(to bottom right, #fff8e1, #f3e5f5);
  min-height: 100vh;
  font-family: "Segoe UI", sans-serif;
}
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}
.logout-button {
  background-color: #ef5350;
  border: none;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s ease;
}
.logout-button:hover {
  background-color: #e53935;
}
.dashboard-grid {
  display: grid;
  grid-template-areas:
    "info graph message"
    "calendar calendar message";
  grid-template-columns: 1fr 2fr 1.2fr;
  gap: 1.5rem;
  align-items: start;
}
.dashboard-card {
  background: #ffffffd6;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 1.5rem;
  transition: all 0.3s ease-in-out;
}
.dashboard-card:hover {
  transform: scale(1.02);
}
.patient-info {
  grid-area: info;
  height: 460px;
}
.graph-card {
  grid-area: graph;
  height: 460px;
}
.message-card {
  grid-area: message;
  height: 1020px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.graph-card,
.message-card {
  min-width: 0;
}

.calendar-reminder-wrapper {
  grid-area: calendar;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}
.calendar-card {
  flex: 2;
}
.events-card {
  flex: 1.5;
}
.calendar-events {
  display: flex;
  gap: 1rem;
}

.calendar-section {
  flex: 1.3; /* Takvim */
}

.events-section {
  flex: 1.7; /* Yaklaşan Etkinlikler genişletildi */
}

.reminder-card {
  grid-area: reminder;
  align-self: stretch;
  min-height: 400px;
  max-width: 280px;
}
@media (max-width: 1200px) {
  .dashboard-grid {
    display: flex;
    flex-direction: column;
  }
  .dashboard-card {
    width: 100%;
  }
  .calendar-reminder-wrapper {
    flex-direction: column;
  }
}
@media (max-width: 768px) {
  .reminder-card {
    width: 100%;
    max-width: 100%;
    min-height: auto;
  }
}
.mini-info-container {
  display: flex;
  gap: 1rem;
  margin-top: 0.8em;
  flex-wrap: wrap;
}

.mini-card {
  flex: 1 1 40%;
  background-color: #fafafa;
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  font-size: 0.85rem;
  transition: 0.3s ease;
}

.mini-card h4 {
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
  color: #444;
}

.prescription-card {
  border-left: 6px solid #7e57c2;
}

.status-card {
  border-left: 6px solid #26a69a;
}

.status-label {
  padding: 0.2rem 0.6rem;
  border-radius: 8px;
  color: white;
  font-weight: bold;
  font-size: 0.75rem;
}

.status-label.low {
  background-color: #66bb6a;
}

.status-label.medium {
  background-color: #ffa726;
}

.status-label.high {
  background-color: #ef5350;
}

@media (max-width: 500px) {
  .mini-card {
    flex: 1 1 100%;
  }
}
</style>
