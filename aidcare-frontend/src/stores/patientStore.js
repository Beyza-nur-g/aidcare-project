import { defineStore } from "pinia";

export const usePatientStore = defineStore("patient", {
  state: () => ({
    patient: null,
  }),
  actions: {
    setPatient(patientData) {
      this.patient = patientData;
    },
    logout() {
      this.patient = null;
    },
  },
  persist: true, // localStorage'da otomatik sakla
});
