<template>
  <div>
    <Line :data="chartData" :options="options" />
  </div>
</template>

<script>
import { Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

export default {
  name: "GlucoseChart",
  components: { Line },
  props: ["measurements"],
  computed: {
    chartData() {
      return {
        labels: this.measurements.map((m) =>
          new Date(m.measured_at).toLocaleString()
        ),
        datasets: [
          {
            label: "Kan Şekeri (mg/dL)",
            data: this.measurements.map((m) => m.sugar_value),
            fill: false,
            borderColor: "blue",
            tension: 0.3,
          },
        ],
      };
    },
    options() {
      return {
        responsive: true,
        plugins: {
          legend: { position: "top" },
          title: { display: true, text: "Zaman - Şeker Ölçümü Grafiği" },
        },
      };
    },
  },
};
</script>
