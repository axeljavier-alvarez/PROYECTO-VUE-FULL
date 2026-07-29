import { defineStore } from 'pinia';
import { ref } from 'vue';
import solicitudService from '../services/emisionConstanciaService';

export const useEmisionConstanciaStore = defineStore(
    'emisionConstancia',
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

        async function emitirConstancia(id) {
            return await solicitudService.emitirConstancia(id);
        }

        async function rechazar(id, data){
            const response = await solicitudService.rechazarSolicitud(
            id, data
            );
            await fetchSolicitudes();
            return response;
        }

        return {
            loading,
            solicitudes,
            fetchSolicitudes,
            emitirConstancia,
            rechazar
        }
    }
);