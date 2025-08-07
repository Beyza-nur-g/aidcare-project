import { createRouter, createWebHistory } from "vue-router";
import PatientsView from "@/views/PatientsView.vue";
import GlucoseChartView from "@/views/GlucoseChartView.vue";
import LoginView from "@/views/LoginView.vue";
import DashboardView from "@/views/PatientDashboardView.vue"; // 📌 Yeni Dashboard

const routes = [
  {
    path: "/",
    name: "Patients",
    component: PatientsView,
  },
  {
    path: "/chart",
    name: "Chart",
    component: GlucoseChartView,
  },
  {
    path: "/login",
    name: "Login",
    component: LoginView,
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: DashboardView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
