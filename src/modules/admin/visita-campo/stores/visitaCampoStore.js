import { defineStore } from 'pinia';
import { ref } from 'vue';
import visitaCampoService from '../services/visitaCampoService';

export const useVisitaCampoStore = defineStore(
    'visitaCampo',
    () => {
        // indicador carga interfaz
        const loading = ref(false);
        // actualizar solicitudes
        const solicitudes = ref([]);
        
        const currentPage = ref(1);
        const lastPage = ref(1);
        const total = ref(0);
        /* VER SOLICITUDES filters: objeto opcional con filtros de búsqueda
        estado, página, nombre, etc */
        async function fetchSolicitudes(page = 1) {
            // activa estado de carga
            loading.value = true;
            try {
                // petición al back mediante service 
                const response =
                    await visitaCampoService.getSolicitudes({
                        page
                    });
                    /* guarda solicitudes en estado store, 
                    se utiliza operador ?? estructura varia según el endpoint */
                    /* response.data.data -> API devuelve recursos paginados 
                       response.data -> Devuelve un objeto JSON 
                       response -> último respaldo*/
                    solicitudes.value = response.data;
                    currentPage.value = response.meta.current_page;
                    lastPage.value = response.meta.last_page;
                    total.value = response.meta.total;
            } finally {
                // finaliza estado carga
                loading.value = false;
            }
        }
        /* registra una visita de campo desde el store */
        async function guardarVisita(id, formData) {
            // activa indicador de carga
            loading.value = true;
            try {
                // envía información de la visita del backend
                await visitaCampoService.guardarVisita(
                    id,
                    formData
                );
                /* actualiza la lista de solicitudes para reflejar el cambio de estado realizado
                por el backend */
                await fetchSolicitudes();
            } finally {
                // desactiva el indicador de carga
                loading.value = false;
            }
        }
        async function descargarFoto(id){
            return await visitaCampoService.descargarFoto(id);
        }
        return {
            loading,
            solicitudes,
            currentPage,
            lastPage,
            total,
            fetchSolicitudes,
            guardarVisita,
            descargarFoto
        }
    }
);