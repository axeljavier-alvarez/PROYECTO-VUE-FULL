import { defineStore } from 'pinia';
import { ref } from 'vue';
import analisisService from '../services/analisisService';
export const useAnalisisStore = defineStore(
    'analisis',
    () => {
        const loading = ref(false);
        const solicitudes = ref([]);
        async function fetchSolicitudes(filters = {}) {
            loading.value = true;
            try {
                const response =
                    await analisisService.getSolicitudes(
                        filters
                    );

                solicitudes.value =
                    response.data.data ?? response.data ?? response;
            } finally {

                loading.value = false;

            }
        }
        async function cambiarEstado(id, estado_id){
            const response = await analisisService.cambiarEstado(
                id, estado_id
            ); 
            await fetchSolicitudes(); 
            return response;
        }
        
        return {
            loading,
            solicitudes,
            fetchSolicitudes,
            cambiarEstado
        };
    }
);