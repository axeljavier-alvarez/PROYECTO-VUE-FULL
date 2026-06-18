<script setup>

/**
 * Importaciones de Vue
 */
import {
    ref,
    computed,
    onMounted
} from 'vue';

/**
 * Importaciones de Pinia
 */
import { storeToRefs } from 'pinia';
import { useSolicitudStore }
from '../stores/solicitudStore';

/**
 * Componentes Shadcn
 */
import {
    Card,
    CardContent
} from '@/components/ui/card';

import {
    Input
} from '@/components/ui/input';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';

/**
 * Instancia del store
 */
const solicitudStore = useSolicitudStore();

/**
 * Obtiene propiedades reactivas
 * del store.
 */
const {
    solicitudes,
    loading
} = storeToRefs(solicitudStore);

/**
 * Texto ingresado por el usuario
 * para realizar búsquedas.
 */
const search = ref('');

/**
 * Lista filtrada de solicitudes.
 *
 * Si no existe texto de búsqueda,
 * devuelve todas las solicitudes.
 *
 * Si existe búsqueda, filtra por:
 * - Número de solicitud
 * - Nombres
 * - Apellidos
 * - CUI
 * - Estado
 * - Trámite
 */
const filteredSolicitudes = computed(() => {

    if (!search.value) {
        return solicitudes.value;
    }

    return solicitudes.value.filter(

        solicitud => {

            const texto = `
                ${solicitud.no_solicitud}
                ${solicitud.nombres}
                ${solicitud.apellidos}
                ${solicitud.cui}
                ${solicitud.estado?.nombre}
                ${solicitud.tramite?.nombre}
            `.toLowerCase();

            return texto.includes(
                search.value.toLowerCase()
            );
        }
    );
});

/**
 * Al cargar el componente
 * se solicitan los datos al store.
 */
onMounted(async () => {

    await solicitudStore.fetchSolicitudes();

});

</script>