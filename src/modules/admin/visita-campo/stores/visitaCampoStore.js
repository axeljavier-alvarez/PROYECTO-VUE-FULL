import { defineStore } from 'pinia';
import { ref } from 'vue';
import visitaCampoService from '../services/visitaCampoService';

export const useVisitaCampoStore = defineStore(
    'visitaCampo',
    () => {
        const loading = ref(false);
        const solicitudes = ref([]);
        // VER SOLICITUDES
        async function fetchSolicitudes(filters = {}){
            loading.value = true;
            try {
                const response =
                await visitaCampoService.getSolicitudes(
                    filters
                );
                solicitudes.value =
                response.data.data ?? response.data ?? response;
            } finally {
                loading.value = false;
            }
        }

        return {
            loading,
            solicitudes, 
            fetchSolicitudes
        }
    }
);