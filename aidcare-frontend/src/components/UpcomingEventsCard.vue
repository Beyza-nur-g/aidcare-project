<template>
  <div class="events-card">
    <h3>📌 Yaklaşan Etkinlikler</h3>
    <ul v-if="upcomingAppointments.length">
      <li v-for="appt in upcomingAppointments" :key="appt.id">
        📅 {{ formatDate(appt.appointment_date) }} - {{ appt.description }}
      </li>
    </ul>
    <p v-else>🚫 Yaklaşan etkinlik bulunamadı.</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { usePatientStore } from "@/stores/patientStore";

const upcomingAppointments = ref([]);
const patient = usePatientStore().patient;

function formatDate(date) {
  return new Date(date).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    weekday: "short",
  });
}

onMounted(async () => {
  if (!patient?.id) return;

  try {
    const res = await axios.get(
      `http://localhost:3001/api/patients/${patient.id}/appointments`
    );
    const today = new Date();
    const twoWeeksLater = new Date();
    twoWeeksLater.setDate(today.getDate() + 14);

    upcomingAppointments.value = res.data.filter((a) => {
      const d = new Date(a.appointment_date);
      return d >= today && d <= twoWeeksLater;
    });
  } catch (err) {
    console.error("Randevu verileri alınamadı:", err);
  }
});
</script>

<style scoped>
.events-card {
  background: #fce4ec;
  padding: 1rem;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  font-family: "Segoe UI", sans-serif;
  max-height: 360px;
  overflow-y: auto;
}
.events-card h3 {
  margin-bottom: 0.8rem;
  color: #880e4f;
}
.events-card ul {
  list-style: none;
  padding: 0;
}
.events-card li {
  margin-bottom: 0.5rem;
  background: #fff;
  padding: 0.5rem;
  border-radius: 8px;
}
</style>
