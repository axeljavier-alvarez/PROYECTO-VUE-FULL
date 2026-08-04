import { defineStore } from 'pinia';
import { ref } from 'vue';
import emisionConstanciaService from '../services/emisionConstanciaService';

export const useEmisionConstanciaStore = defineStore(
    'emisionConstancia',
    () => {
        const loading = ref(false);
        const solicitudes = ref([]);
        const currentPage = ref(1);
        const lastPage = ref(1);
        const total = ref(0);

        async function fetchSolicitudes(page = 1){
            loading.value = true;
            try {
                 const response = await emisionConstanciaService.getSolicitudes({
                                page
                 });
                solicitudes.value = response.data;
                currentPage.value = response.meta.current_page;
                lastPage.value = response.meta.last_page;
                total.value = response.meta.total;
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
            currentPage,
            lastPage,
            total,
            fetchSolicitudes,
            emitirConstancia,
            rechazar,
            descargarDocumento
        }
    }
);