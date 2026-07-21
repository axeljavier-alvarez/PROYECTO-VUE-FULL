import { defineStore } from 'pinia';
import { ref } from 'vue';
import solicitudService from '../services/emisionConstanciaService';

export const useEmisionConstanciaStore = defineStore(
    'solicitudes',
    () => {
        const loading = ref(false);
        const solicitudes = ref([]);

        async function fetchSolicitudes(filters = {}){
            loading.value = true;
            try {
                const response = 
                await solicitudService.getSolicitudes(
                    filters
                );
                solicitudes.value =
                    response.data || response; 
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