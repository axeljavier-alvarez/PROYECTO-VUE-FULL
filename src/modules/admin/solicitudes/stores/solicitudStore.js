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

        /**
         * Obtiene las solicitudes desde
         * el servicio y actualiza el estado.
         *
         * @param {Object} filters
         * Filtros opcionales enviados al backend.
         */
        async function fetchSolicitudes(filters = {}) {

            loading.value = true;

            try {

                const response =
                    await solicitudService.getSolicitudes(
                        filters
                    );

                /**
                 * Algunas APIs devuelven:
                 * { data: [...] }
                 *
                 * Otras:
                 * [...]
                 *
                 * Se contempla ambos casos.
                 */
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

        };
    }
);