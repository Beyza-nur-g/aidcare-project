<template>
  <div class="login-container">
    <h2>Hasta Girişi</h2>
    <form @submit.prevent="handleLogin">
      <input
        v-model="tc"
        type="text"
        placeholder="TC Kimlik Numarası"
        maxlength="11"
        required
      />
      <button type="submit">Giriş Yap</button>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { usePatientStore } from "@/stores/patientStore";

const tc = ref("");
const errorMessage = ref("");
const router = useRouter();
const patientStore = usePatientStore();

const handleLogin = async () => {
  try {
    const response = await fetch("http://localhost:3001/api/patients/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tc: tc.value }),
    });

    if (!response.ok) throw new Error("Hasta bulunamadı");

    const data = await response.json();
    patientStore.setPatient(data);
    router.push("/dashboard");
  } catch (err) {
    errorMessage.value = err.message;
  }
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 4rem auto;
  padding: 2rem;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
}
input {
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
}
button {
  background-color: #4db6ac;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}
button:hover {
  background-color: #00796b;
}
.error {
  color: red;
  margin-top: 0.5rem;
}
</style>
