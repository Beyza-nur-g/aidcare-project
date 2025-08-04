import { createRouter, createWebHistory } from "vue-router";
import PatientsView from "../views/PatientsView.vue";
import GlucoseChartView from "../views/GlucoseChartView.vue";

const routes = [
  {
    path: "/",
    name: "Patients",
    component: PatientsView,
  },
  {
    path: "/chart",
    name: "GlucoseChart",
    component: GlucoseChartView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
