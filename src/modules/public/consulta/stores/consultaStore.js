import { defineStore } from 'pinia';
import { ref } from 'vue';
import consultaService from '../services/consultaService';
export const useConsultaStore = defineStore(
    'consulta',
    () => {
        const solicitud = ref(null);
        const loading = ref(false);
        const error = ref(null);
        async function consultar(data) {
            try {
                loading.value = true;
                error.value = null;
                const response = await consultaService.consultar(data);
                solicitud.value = response.data;
                return true;
            } catch (err) {
                error.value =
                    err.response?.data?.message ?? null;
                throw err;
            } finally {
                loading.value = false;
            }
        }
        function limpiar(){
            solicitud.value = null;
            error.value = null;
        }
        return {
            solicitud,
            loading,
            error,
            consultar,
            limpiar
        }
    }
);