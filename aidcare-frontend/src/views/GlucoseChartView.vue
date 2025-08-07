<template>
  <div class="page-container">
    <!-- Sol Panel -->
    <div class="sidebar">
      <!-- Hasta Arama -->
      <input
        v-model="searchTerm"
        placeholder="🔍 Hasta Ara..."
        class="search-box"
      />

      <!-- Hasta Seçimi Dropdown -->
      <select
        v-model="selectedPatientId"
        @change="onPatientChange"
        class="dropdown"
      >
        <option disabled value="">⬇ Hasta seçin</option>
        <option
          v-for="patient in filteredPatients"
          :key="patient.id"
          :value="patient.id"
        >
          {{ patient.name }} (ID: {{ patient.id }})
        </option>
      </select>

      <!-- Hasta Bilgi Kartı -->
      <div v-if="selectedPatient" class="info-card">
        <h3>👤 {{ selectedPatient.name }}</h3>
        <p>
          <strong>🎂 Doğum Tarihi:</strong>
          {{ formatDate(selectedPatient.birth_date) }}
        </p>
        <p><strong>⚧ Cinsiyet:</strong> {{ selectedPatient.gender }}</p>

        <!-- Yeni Ölçüm Ekleme -->
        <div class="new-measurement">
          <input
            type="datetime-local"
            v-model="newMeasurement.measured_at"
            class="compact-input small-input"
          />
          <input
            type="number"
            v-model="newMeasurement.sugar_value"
            placeholder="Şeker Değeri"
            class="compact-input small-input"
          />
          <button @click="addMeasurement">➕ Şeker Bilgisi Ekle</button>
        </div>
      </div>

      <!-- Tarih Aralığı Filtreleme -->
      <div class="date-filter">
        <label>📅 Tarih Aralığı:</label>
        <div class="date-inputs">
          <input
            type="date"
            v-model="startDate"
            class="compact-input small-input"
          />
          <input
            type="date"
            v-model="endDate"
            class="compact-input small-input"
          />
        </div>
        <button @click="filterByDate" class="filter-button">🔍 Filtrele</button>
      </div>
    </div>

    <!-- Sağ Panel - Grafik -->
    <div class="chart-area">
      <h2>📊 Kan Şekeri Ölçüm Grafiği</h2>
      <div class="chart-wrapper">
        <GlucoseChart
          v-if="filteredMeasurements.length"
          :measurements="filteredMeasurements"
        />
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import GlucoseChart from "../components/GlucoseChart1.vue";

export default {
  name: "GlucoseChartView",
  components: { GlucoseChart },
  data() {
    return {
      patients: [],
      searchTerm: "",
      selectedPatientId: "",
      measurements: [],
      newMeasurement: { measured_at: "", sugar_value: "" },
      startDate: "",
      endDate: "",
    };
  },
  computed: {
    filteredPatients() {
      const term = this.searchTerm.toLowerCase();
      return this.patients.filter(
        (p) =>
          p.name.toLowerCase().includes(term) || String(p.id).includes(term)
      );
    },
    selectedPatient() {
      return this.patients.find((p) => p.id === this.selectedPatientId);
    },
    filteredMeasurements() {
      if (!this.startDate || !this.endDate) return this.measurements;
      const start = new Date(this.startDate);
      const end = new Date(this.endDate);
      return this.measurements.filter((m) => {
        const date = new Date(m.measured_at);
        return date >= start && date <= end;
      });
    },
  },
  methods: {
    async fetchPatients() {
      const response = await axios.get("http://localhost:3001/api/patients");
      this.patients = response.data;
    },
    async onPatientChange() {
      const response = await axios.get(
        `http://localhost:3001/api/patients/${this.selectedPatientId}/glucose`
      );
      this.measurements = response.data;
    },
    formatDate(dateStr) {
      return new Date(dateStr).toLocaleDateString();
    },
    async addMeasurement() {
      await axios.post(
        `http://localhost:3001/api/patients/${this.selectedPatientId}/glucose`,
        this.newMeasurement
      );
      this.newMeasurement = { measured_at: "", sugar_value: "" };
      this.onPatientChange(); // tekrar veriyi çek
    },
    filterByDate() {
      // zaten computed içinde filtreliyoruz
    },
  },
  mounted() {
    this.fetchPatients();
  },
};
</script>

<style scoped>
.page-container {
  display: flex;
  gap: 2rem;
  padding: 2rem;
  background-color: #f0f4f8;
  font-family: "Segoe UI", sans-serif;
}

.sidebar {
  width: 28%;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  background: #ffffff;
  padding: 1rem;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.search-box,
.dropdown,
input[type="number"],
input[type="datetime-local"],
input[type="date"] {
  padding: 0.6rem;
  border-radius: 10px;
  border: 1px solid #ccc;
  width: 100%;
  font-size: 1rem;
  background: #f9f9f9;
  transition: box-shadow 0.3s ease;
}

.compact-input {
  padding: 0.4rem;
  font-size: 0.9rem;
}

.small-input {
  font-size: 0.85rem;
  padding: 0.35rem 0.5rem;
  max-width: 100%;
  box-sizing: border-box;
}

.search-box:focus,
.dropdown:focus,
input:focus {
  box-shadow: 0 0 0 2px #90caf9;
  outline: none;
}

.search-box {
  padding: 0.5rem 0.8rem;
  border-radius: 10px;
  border: 1px solid #ccc;
  background: #f9f9f9;
  font-size: 0.9rem;
  max-width: 99%;
  box-sizing: border-box;
}

.info-card {
  background: #e3f2fd;
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.new-measurement {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.date-filter {
  background: #fff3e0;
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}

.date-inputs {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

button {
  background-color: #4db6ac;
  color: white;
  border: none;
  padding: 0.6rem;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.3s;
  font-weight: 500;
}
button:hover {
  background-color: #00897b;
}

.chart-area {
  flex: 1;
  min-width: 800px;
  background: #fff8e1;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
}
.chart-area h2 {
  margin-bottom: 1.5rem;
  color: #333;
}
.chart-wrapper {
  width: 100%;
  max-width: 900px;
  height: 500px;
}

.compact-input,
input[type="datetime-local"],
input[type="number"],
input[type="date"] {
  font-size: 0.85rem;
  padding: 0.4rem 0.6rem;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}
</style>
