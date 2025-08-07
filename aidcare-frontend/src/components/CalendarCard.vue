<template>
  <div class="calendar-wrapper">
    <VDatePicker
      v-model="selectedDate"
      :attributes="calendarAttributes"
      is-expanded
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { usePatientStore } from "@/stores/patientStore";

const selectedDate = ref(new Date());
const calendarAttributes = ref([]);
const patientStore = usePatientStore();
const patient = patientStore.patient;

onMounted(async () => {
  if (!patient?.id) return;

  try {
    const glucoseRes = await axios.get(
      `http://localhost:3001/api/patients/${patient.id}/glucose`
    );
    const glucoseAttributes = glucoseRes.data.map((m) => ({
      key: `glucose-${m.id}`,
      dates: m.measured_at.split("T")[0],
      dot: {
        color: "#2196F3", // Mavi daire
        content: "🩸", // Emoji içerik
      },
      popover: { label: `Şeker ölçümü: ${m.sugar_value}` },
    }));

    const appointmentRes = await axios.get(
      `http://localhost:3001/api/patients/${patient.id}/appointments`
    );
    const appointmentAttributes = appointmentRes.data.map((a) => ({
      key: `appointment-${a.id}`,
      dates: a.appointment_date.split("T")[0],
      dot: {
        color: "#E53935", // Kırmızı daire
        content: "📅", // Emoji içerik
      },
      popover: { label: `Randevu: ${a.description}` },
    }));

    calendarAttributes.value = [...glucoseAttributes, ...appointmentAttributes];
  } catch (err) {
    console.error("Takvim verisi alınamadı:", err);
  }
});
</script>

<style scoped>
.calendar-wrapper {
  background: #ffffffd6;
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease-in-out;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.calendar-wrapper:hover {
  transform: scale(1.02);
}

.vc-container {
  width: 100%;
  max-width: 500px;
  font-family: "Segoe UI", sans-serif;
  --vc-bg: #fefefe;
  --vc-border: #dcd6f7;
  --vc-text-primary: #333;
  --vc-accent-50: #f3e5f5;
  --vc-accent-100: #ce93d8;
}

/* 🔹 Bugün işaretlemesi */
.vc-day-content.vc-highlight-content.vc-today {
  background-color: #ffe082 !important;
  color: #000 !important;
  font-weight: bold;
  border-radius: 8px;
}

/* 🔸 Hover efekti */
.vc-day-content:hover {
  background-color: #e1bee7 !important;
  cursor: pointer;
  transition: background-color 0.2s;
}
</style>
