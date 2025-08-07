<template>
  <div class="patients-wrapper">
    <!-- Sol Kart: Form -->
    <div class="form-card">
      <h2>📝 Yeni Hasta Ekle</h2>
      <form @submit.prevent="addPatient" class="patient-form">
        <input v-model="newPatient.tc" placeholder="TC Kimlik No" required />
        <input v-model="newPatient.name" placeholder="İsim" required />
        <input v-model="newPatient.birth_date" type="date" required />
        <select v-model="newPatient.gender" required>
          <option disabled value="">Cinsiyet Seçin</option>
          <option value="Kadın">Kadın</option>
          <option value="Erkek">Erkek</option>
          <option value="Diğer">Diğer</option>
        </select>
        <button type="submit">
          {{ editingId ? "📂 Güncelle" : "➕ Kaydet" }}
        </button>
      </form>
    </div>

    <!-- Sağ Kart: Liste -->
    <div class="list-card">
      <div class="list-header">
        <h2>📚 Hasta Listesi</h2>
        <div class="filters">
          <input v-model="searchTerm" placeholder="🔍 İsim ara..." />
          <select v-model="selectedGender">
            <option value="">Tüm Cinsiyetler</option>
            <option value="Kadın">Kadın</option>
            <option value="Erkek">Erkek</option>
            <option value="Diğer">Diğer</option>
          </select>
        </div>
      </div>

      <div class="patient-list">
        <div
          v-for="patient in filteredPatients"
          :key="patient.id"
          class="patient-card"
        >
          <h3><strong>ID:</strong> {{ patient.id }}</h3>
          <p><strong>TC:</strong> {{ patient.tc }}</p>
          <p><strong>İsim:</strong> {{ patient.name }}</p>
          <p>
            <strong>Doğum Tarihi:</strong> {{ formatDate(patient.birth_date) }}
          </p>
          <p><strong>Cinsiyet:</strong> {{ patient.gender }}</p>
          <div class="card-actions">
            <button class="edit" @click="editPatient(patient)">
              ✏ Düzenle
            </button>
            <button class="delete" @click="deletePatient(patient.id)">
              🗑 Sil
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "PatientsView",
  data() {
    return {
      newPatient: { tc: "", name: "", birth_date: "", gender: "" },
      patients: [],
      editingId: null,
      searchTerm: "",
      selectedGender: "",
    };
  },
  computed: {
    filteredPatients() {
      return this.patients
        .filter((p) => {
          const nameMatch = p.name
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase());
          const genderMatch =
            this.selectedGender === "" || p.gender === this.selectedGender;
          return nameMatch && genderMatch;
        })
        .sort((a, b) => a.id - b.id);
    },
  },
  methods: {
    async fetchPatients() {
      const response = await axios.get("http://localhost:3001/api/patients");
      this.patients = response.data;
    },
    async addPatient() {
      const url = this.editingId
        ? `http://localhost:3002/patients/${this.editingId}`
        : "http://localhost:3002/patients";
      const method = this.editingId ? "put" : "post";

      await axios[method](url, this.newPatient);
      this.newPatient = { tc: "", name: "", birth_date: "", gender: "" };
      this.editingId = null;
      this.fetchPatients();
    },
    async deletePatient(id) {
      const glucoseRes = await axios.get(
        `http://localhost:3001/api/patients/${id}/glucose`
      );
      const hasGlucoseData = glucoseRes.data.length > 0;

      let message = "Bu hastayı silmek istediğinize emin misiniz?";
      if (hasGlucoseData) {
        message =
          "Bu hastaya ait şeker ölçüm verileri de bulunmaktadır.\nHepsini silmek istediğinize emin misiniz?";
      }

      const confirmed = confirm(message);
      if (!confirmed) return;

      try {
        if (hasGlucoseData) {
          await axios.delete(`http://localhost:3002/patients/${id}/glucose`);
        }

        await axios.delete(`http://localhost:3002/patients/${id}`);

        this.fetchPatients();
      } catch (err) {
        console.error("Silme işlemi başarısız:", err);
      }
    },
    editPatient(patient) {
      this.newPatient = {
        tc: patient.tc,
        name: patient.name,
        gender: patient.gender,
        birth_date: new Date(patient.birth_date).toISOString().split("T")[0],
      };
      this.editingId = patient.id;
    },
    formatDate(dateStr) {
      return new Date(dateStr).toLocaleDateString();
    },
  },
  mounted() {
    this.fetchPatients();
  },
};
</script>

<style scoped>
.patients-wrapper {
  display: flex;
  gap: 2rem;
  padding: 2rem;
  background: linear-gradient(to bottom right, #fffde7, #fce4ec);
  font-family: "Segoe UI", sans-serif;
}

/* Form Kartı */
.form-card {
  width: 30%;
  background: #ffffffcc;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 1.5rem;
}

/* Hasta Formu */
.patient-form {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}
.patient-form input,
.patient-form select {
  padding: 0.5rem;
  font-size: 1rem;
  border-radius: 8px;
  border: 1px solid #ccc;
}
.patient-form button {
  background-color: #aed581;
  padding: 0.6rem;
  border-radius: 8px;
  border: none;
  font-weight: bold;
  color: white;
  cursor: pointer;
}
.patient-form button:hover {
  background-color: #9ccc65;
}

/* Liste Kartı */
.list-card {
  width: 70%;
  background: #fffefec2;
  border-radius: 16px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.filters {
  display: flex;
  gap: 0.5rem;
}
.filters input,
.filters select {
  padding: 0.4rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 0.9rem;
}

/* Hasta Kartları */
.patient-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  max-height: 520px;
  overflow-y: auto;
}
.patient-card {
  background: #ffffffa3;
  border-radius: 14px;
  padding: 1rem;
  width: 230px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease-in-out;
}
.patient-card:hover {
  transform: scale(1.04);
}
.card-actions {
  margin-top: 1rem;
  display: flex;
  gap: 0.5rem;
}
.card-actions button {
  flex: 1;
  padding: 0.45rem;
  font-size: 0.9rem;
  border-radius: 8px;
  border: none;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s ease-in-out;
}
.card-actions .edit {
  background: #4fc3f7;
}
.card-actions .delete {
  background: #ef5350;
}
.card-actions button:hover {
  opacity: 0.9;
}
</style>
