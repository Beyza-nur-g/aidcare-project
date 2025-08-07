<template>
  <div class="dashboard-card message-card">
    <h3>💬 AidCare'e Soru Sor</h3>

    <form @submit.prevent="submitMessage" class="message-form">
      <textarea v-model="newMessage" placeholder="Bir soru yazın..." required />
      <button type="submit">Gönder</button>
    </form>

    <div class="message-history" v-if="messages.length">
      <h4>📜 Önceki Mesajlar</h4>
      <div v-for="msg in messages" :key="msg.id" class="message-bubble-group">
        <div class="message-sent">
          <span class="sender">Sen:</span>
          <div class="bubble">{{ msg.message }}</div>
        </div>
        <div v-if="msg.reply" class="message-received">
          <span class="sender">AidCare:</span>
          <div class="bubble">{{ msg.reply }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { usePatientStore } from "@/stores/patientStore";

const newMessage = ref("");
const messages = ref([]);

const patientStore = usePatientStore();
const patient = patientStore.patient;

onMounted(fetchMessages);

async function fetchMessages() {
  if (!patient?.id) return;
  try {
    const res = await axios.get(
      `http://localhost:3001/api/patients/${patient.id}/messages`
    );
    messages.value = res.data;
  } catch (err) {
    console.error("Mesajlar yüklenemedi:", err);
  }
}

async function submitMessage() {
  if (!newMessage.value.trim()) return;

  try {
    await axios.post(
      `http://localhost:3001/api/patients/${patient.id}/messages`,
      {
        message: newMessage.value,
      }
    );
    newMessage.value = "";
    fetchMessages();
  } catch (err) {
    console.error("Mesaj gönderilemedi:", err);
  }
}
</script>

<style scoped>
.message-card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.message-form textarea {
  width: 100%;
  min-height: 80px;
  border-radius: 8px;
  border: 1px solid #ccc;
  padding: 0.5rem;
  font-size: 0.9rem;
}

.message-form button {
  align-self: flex-end;
  background-color: #673ab7;
  color: white;
  border: none;
  padding: 0.4rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 0.5rem;
}

.message-item {
  background: #f8f8f8;
  padding: 0.7rem;
  border-radius: 8px;
  font-size: 0.85rem;
}
.message-card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 100%;
  min-height: 850px;
}
.message-form textarea {
  width: 100%;
  min-height: 80px;
  border-radius: 8px;
  border: 1px solid #ccc;
  padding: 0.5rem;
  font-size: 0.9rem;
  resize: vertical;
}
.message-form {
  margin-bottom: 1rem;
}

.message-form button {
  align-self: flex-end;
  background-color: #673ab7;
  color: white;
  border: none;
  padding: 0.4rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 0.5rem;
}

.message-history {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  scroll-behavior: smooth;
  border-radius: 10px;
  border: 1px solid #e0e0e0;
  padding: 1rem;
  background-color: #fdfdfd;
  min-height: 0; /* 💡 flex container içindeyken scroll için gerekli */
}

.message-bubble-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

.message-sent,
.message-received {
  display: flex;
  flex-direction: column;
  max-width: 75%;
}

.message-sent {
  align-self: flex-end;
  align-items: flex-end;
}

.message-received {
  align-self: flex-start;
  align-items: flex-start;
}

.bubble {
  background-color: #eceaff;
  padding: 0.6rem 0.9rem;
  border-radius: 16px;
  margin-top: 0.2rem;
}

.message-received .bubble {
  background-color: #e0f7fa;
}

.sender {
  font-size: 0.75rem;
  color: #777;
}
</style>
