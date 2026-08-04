import { defineStore } from 'pinia';
import { ref } from 'vue';
import solicitudService from '../services/solicitudService';

export const useSolicitudStore = defineStore(
    'solicitudes',
    () => {
        /**
         * Estado de carga.
         * Se utiliza para mostrar spinners
         * o indicadores de carga.
         */
        const loading = ref(false);
        /**
         * Listado de solicitudes obtenido
         * desde la API.
         */
        const solicitudes = ref([]);
        const currentPage = ref(1);
        const lastPage = ref(1);
        const total = ref(0);
        async function fetchSolicitudes(page = 1) {
            loading.value = true;
            try {
                const response = await solicitudService.getSolicitudes({
                page
            });
                /**
                 * Algunas APIs devuelven:
                 * { data: [...] }
                 *
                 * Otras:
                 * [...]
                 *
                 * Se contempla ambos casos.
                 */
                solicitudes.value = response.data;

                currentPage.value = response.meta.current_page;
                lastPage.value = response.meta.last_page;
                total.value = response.meta.total;
            } finally {
                loading.value = false;
            }
        }
        return {
            loading,
            solicitudes,
            currentPage,
            lastPage,
            total,
            fetchSolicitudes
        };
    }
);