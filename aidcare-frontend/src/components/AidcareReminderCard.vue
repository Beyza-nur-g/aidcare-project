<template>
  <div class="dashboard-card reminder-card">
    <h3>🔔 AidCare Hatırlatmaları</h3>
    <transition-group name="fade" tag="div" class="reminder-list">
      <div
        class="reminder-bubble"
        v-for="(reminder, index) in reminders"
        :key="index"
      >
        <span class="icon">💡</span>
        <span class="text">{{ reminder }}</span>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
const reminders = [
  "Güne bir bardak su ile başla 💧",
  "Sabah glukoz ölçümünü yapmayı unutma 📊",
  "10 dakikalık esneme molası ver 🧘‍♀️",
  "Yeterince uyuduğundan emin ol 😴",
  "Kendine zaman ayırmayı unutma 💖",
];
</script>

<style scoped>
.reminder-card {
  background: #fff8e1;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  animation: slide-in 0.5s ease-in-out;
}

.reminder-list {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.reminder-bubble {
  background-color: #fff3e0;
  border-left: 5px solid #ff9800;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  font-size: 0.9rem;
  color: #4e342e;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.reminder-bubble:hover {
  transform: translateX(5px);
}

.icon {
  font-size: 1.2rem;
}

@keyframes slide-in {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
