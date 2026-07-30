import { defineStore } from 'pinia';
import { ref } from 'vue';
import emisionConstanciaService from '../services/emisionConstanciaService';

export const useEmisionConstanciaStore = defineStore(
    'emisionConstancia',
    () => {
        const loading = ref(false);
        const solicitudes = ref([]);

        async function fetchSolicitudes(filters = {}){
            loading.value = true;
            try {
                const response = 
                await emisionConstanciaService.getSolicitudes(
                    filters
                );
                solicitudes.value =
                    response.data || response; 
            } finally {
                loading.value = false;
            }
        }

        async function emitirConstancia(id) {
            return await emisionConstanciaService.emitirConstancia(id);
        }

        async function rechazar(id, data){
            const response = await emisionConstanciaService.rechazarSolicitud(
            id, data
            );
            await fetchSolicitudes();
            return response;
        }

        async function descargarDocumento(id){
            return await emisionConstanciaService.descargarDocumento(id);
        }
        return {
            loading,
            solicitudes,
            fetchSolicitudes,
            emitirConstancia,
            rechazar,
            descargarDocumento
        }
    }
);