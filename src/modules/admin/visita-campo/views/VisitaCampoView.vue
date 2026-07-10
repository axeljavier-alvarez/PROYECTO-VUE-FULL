<script setup>
import { ref, computed, onMounted, Text } from 'vue';
import { storeToRefs } from 'pinia';
import { useVisitaCampoStore } from '../stores/visitaCampoStore';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button'
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { FileText, User, History, Eye, Download, File, } from 'lucide-vue-next'
import {
    CircleX,
    Search,
    TriangleAlert,
    FileCheck
} from 'lucide-vue-next';
import { Textarea } from '@/components/ui/textarea';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from '@/components/ui/accordion';
// Se encarga de la gestión de solicitudes de visita de campo
const visitaCampoStore = useVisitaCampoStore();
// extraer propiedades reactivas de store, 
// solicitudes: listado obtenido desde el back
// loading: indicador de carga durante las peticiones
const { solicitudes, loading } = storeToRefs(visitaCampoStore);
/* texto utilizado para filtrar las solicitudes por número 
nombre, apellido, cui, estado o trámite*/
const search = ref('');
// almacena la solicitud seleccionada para visualizar sus detalles dentro del modal
const selectedSolicitud = ref(null);
/* guarda solicitud seleccionada
Al asignar la solicitud, el modal de detalles se abre
automáticamente gracias al binding del component Dialog */
function verSolicitud(solicitud) {
    console.log(solicitud);
    selectedSolicitud.value = solicitud;
}
/* Filtra solicitudes en tiempo real. Si el usuario no escribe
nada en el buscador, se muestran todas las solicitudes.
Si escribe algún texto, se busca coincidencia en:
-Número de solicitud., nombre, apellidos, cui, estado, tramite
*/
const filteredSolicitudes = computed(() => {
    if (!search.value) {
        return solicitudes.value;
    }
    return solicitudes.value.filter(
        solicitud => {
            const texto =
                `
         ${solicitud.no_solicitud}
         ${solicitud.nombres}
         ${solicitud.apellidos}
         ${solicitud.cui}
         ${solicitud.estado?.nombre}
         ${solicitud.tramite?.nombre}
         `
                    .toLowerCase();
            return texto.includes(
                search.value.toLowerCase()
            );
        }
    );
});
// controla la apertura y cierre del modal para registrar la visita de campo.
const mostrarModalVisita = ref(false);
// Descripción u observaciones escritas por el visitador, campo opcional
const descripcion = ref('');
// almacena archivos (file) seleccionados por el user, son enviadas al back
const fotos = ref([]);
// almacena vistas previas imagenes, se utilizan para mostrarlas en pantalla antes de enviarlo a servidor
const previews = ref([]);
// MIME permitido para las fotografías
const permitidos = [
    'image/jpeg',
    'image/png'
]
/* Prepara el form para registrar una nueva visita, 
Se limpia la descripción, fotografías seleccionadas y vistas previas
para evitar conservar información de visita anterior
*/
function abrirModalVisita() {
    descripcion.value = '';
    fotos.value = [];
    previews.value = [];
    mostrarModalVisita.value = true;
}
/* 
Carga las fotografias seleccionadas por el usuario
Flujo
1. Obtiene los archivos seleccionados,  
2. Verificar que sean imágenes JPG o PNG
3. Guardar archivos para enviarlos en el back
4. Generar vista previa de cada imagen
5. Limpiar el input para permitir volver a seleccionar el mismo archivo si es necesario
*/
function cargarFotos(event) {
    const archivos = Array.from(event.target.files);
    archivos.forEach(file => {
        if (!permitidos.includes(file.type)) {
            alert("Solo se permiten imágenes JPG y PNG");
            return;
        }
        // guardar el archivo real
        fotos.value.push(file);
        // genera una URL temporal para mostrar la vista previa.
        previews.value.push({
            file,
            url: URL.createObjectURL(file)
        });
    });
    event.target.value = '';
}
/* referencia al input de tipo file para abrir el explorador
de archivos desde un botón personalizado */
const inputFotos = ref(null);
/* elimina una foto seleccionada, libera memoria utilizada por URL temporal 
creada con URL.createObjectURL()
*/

function eliminarFoto(index) {
    fotos.value.splice(index, 1);
    URL.revokeObjectURL(previews.value[index].url);
    previews.value.splice(index, 1);
}
/*
Envía la información de la visita al backend
Flujo: 1. Crea un FormData para enviar archivos.
2. Agregar la descripción
3. Agregar todas las fotografías
4. Llamar al Store para registrar la visita
5. Si el proceso es exitoso, cierra el modal y  limpia la solicitud
6. Error validación muestra mensajes devueltos por Laravel
 */
async function guardarVisita() {
    // formato para enviar archivos/imagenes
    const formData = new FormData();
    // descripcion
    formData.append(
        'descripcion',
        descripcion.value
    );
    // Recorrer fotografías seleccionadas
    fotos.value.forEach(foto => {
        /* agrega cada fotografía al FormData con el nombre fotos[]
         para que laravel lo reciba como arreglo de imagenes */
        formData.append(
            'fotos[]',
            foto
        );
    });
    try {
        // llama acción de store de pinia para registrar visita campo
        // se envía el id de la solicitud, form data con descripción y fotografías
        await visitaCampoStore.guardarVisita(
            selectedSolicitud.value.id,
            formData
        );
        // se cierra modal si operación fue exitosa
        mostrarModalVisita.value = false;
        // limpia solicitud seleccionada para cerrar, también modal de detalles
        selectedSolicitud.value = null;
    } catch (error) {
        // errores de validación de laravel
        if (error.response?.data?.errors) {
            // obtiene mensajes de error
            Object.values(error.response.data.errors)
            // conviete arreglo de arreglos en uno solo
                .flat()
                // recorre cada mensaje y lo muestra al user
                .forEach(mensaje => {
                    alert(mensaje)
                });
        }
    }
}
/* consulta las solicitudes disponibles para vista de campo y  
las almacena en store para mostrarlas en la tabla */
onMounted(async () => {
    await visitaCampoStore.fetchSolicitudes();
});
</script>
<template>
    <Card>
        <CardContent class="p-6">
            <div class="mb-4">
                <Input v-model="search" placeholder="Buscar solicitud..." />
            </div>
            <!-- tabla principal con solicitudes pendientes de visita -->
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>
                            No.
                        </TableHead>
                        <TableHead>
                            Solicitante
                        </TableHead>
                        <TableHead>
                            CUI
                        </TableHead>
                        <TableHead>
                            Trámite
                        </TableHead>
                        <TableHead>
                            Estado
                        </TableHead>
                        <TableHead>
                            Fecha
                        </TableHead>
                        <TableHead>
                            Acción
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow v-for="solicitud in filteredSolicitudes" :key="solicitud.id">
                        <TableCell>
                            {{ solicitud.no_solicitud }}
                        </TableCell>
                        <TableCell>
                            {{ solicitud.nombres }} {{ solicitud.apellidos }}
                        </TableCell>
                        <TableCell>
                            {{ solicitud.cui }}
                        </TableCell>
                        <TableCell>
                            {{ solicitud.tramite?.nombre }}
                        </TableCell>
                        <TableCell>
                            {{ solicitud.estado?.nombre }}
                        </TableCell>
                        <TableCell>
                            {{ solicitud.created_at }}
                        </TableCell>
                        <TableCell>
                            <Button type="button" @click="verSolicitud(solicitud)">
                                Continuar revisión
                            </Button>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            <!-- visualizar la información de una solicitud -->
            <Dialog :open="!!selectedSolicitud" @update:open="selectedSolicitud = null">
                <DialogContent class="max-w-4xl max-h-[90vh] flex flex-col p-0 overflow-hidden gap-0">
                    <!-- encabezado -->
                    <div class="bg-blue-600 p-4 text-white flex justify-between items-center shrink-0">
                        <div class="flex items-center gap-3">
                            <div class="flex items-center gap-3">
                                <div class="bg-white/20 p-2 rounded-lg">
                                    <FileText class="w-6 h-6" />
                                </div>
                                <div>
                                    <DialogHeader class="border-b p-4">
                                        <DialogTitle class="text-lg font-bold">
                                            Detalles de la solicitud
                                        </DialogTitle>
                                    </DialogHeader>
                                    <p class="text-sm text-blue-100">
                                        No. {{ selectedSolicitud?.no_solicitud }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- contenido con scroll, información general del solicitante -->
                    <div class="flex-1 overflow-y-auto p-6">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="space-y-4">
                                <div class="flex items-center gap-2 text-sm text-gray-500
                                uppercase font-semibold tracking-wider">
                                    <User class="w-4 h-4 text-blue-600" />
                                    <span>Información del Solicitante</span>
                                </div>
                                <div class="border rounded-lg p-3 bg-gray-50">
                                    <label class="text-xs text-gray-400">
                                        NOMBRE COMPLETO
                                    </label>
                                    <div class="font-medium">
                                        {{ selectedSolicitud?.nombres }}
                                        {{ selectedSolicitud?.apellidos }}
                                    </div>
                                </div>
                                <div class="grid grid-cols-2 gap-2">
                                    <div class="border rounded-lg p-3 bg-gray-50">
                                        <label class="text-xs text-gray-400">
                                            DPI / CUI
                                        </label>
                                        <div class="font-medium">
                                            {{ selectedSolicitud?.cui }}
                                        </div>
                                    </div>
                                    <div class="border rounded-lg p-3 bg-gray-50">
                                        <label class="text-xs text-gray-400">
                                            TELÉFONO
                                        </label>
                                        <div class="font-medium">
                                            {{ selectedSolicitud?.telefono }}
                                        </div>
                                    </div>
                                </div>
                                <div class="border rounded-lg p-3 bg-gray-50">
                                    <label class="text-xs text-gray-400">
                                        DOMICILIO / ZONA
                                    </label>
                                    <div class="font-medium">
                                        {{ selectedSolicitud?.domicilio }}
                                        -
                                        {{ selectedSolicitud?.zona }}
                                    </div>
                                </div>
                                <div class="border rounded-lg p-3 bg-gray-50">
                                    <label class="text-xs text-gray-400">
                                        TRÁMITE
                                    </label>
                                    <div class="mt-2">
                                        <Badge variant="secondary">
                                            {{ selectedSolicitud?.tramite?.nombre }}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                            <!-- Historial -->
                            <div class="space-y-4">
                                <div
                                    class="flex items-center gap-2 text-sm text-gray-500 uppercase font-semibold tracking-wider">
                                    <History class="w-4 h-4 text-blue-600" />
                                    <span>Historial de Movimientos</span>
                                </div>
                                <div class="border rounded-lg bg-gray-50 p-4 h-[350px] overflow-y-auto">
                                    <div v-if="selectedSolicitud?.bitacoras?.length" class="space-y-4">
                                        <div v-for="bit in selectedSolicitud.bitacoras" :key="bit.id"
                                            class="border-l-2 border-blue-500 pl-4">
                                            <div class="font-bold text-sm">
                                                {{ bit.evento }}
                                            </div>
                                            <div class="text-sm text-gray-600">
                                                {{ bit.descripcion }}
                                            </div>
                                            <div class="text-xs text-gray-500 mt-1">
                                                {{ bit.usuario ?? 'Sistema' }}
                                            </div>
                                            <div class="text-xs text-gray-400">
                                                {{ bit.created_at }}
                                            </div>
                                        </div>
                                    </div>
                                    <div v-else class="text-sm text-gray-500">
                                        Sin historial de movimientos.
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="mt-4 border rounded-lg p-3 bg-gray-50">
                            <label class="text-xs text-gray-400">
                                Observaciones
                            </label>
                            <div class="font-medium">
                                {{ selectedSolicitud?.observaciones }}
                            </div>
                        </div>
                        <!-- acordeon de visita realizada -->
                        <div v-if="selectedSolicitud?.estado_id === 4" class="mt-4">
                            <Accordion type="single" collapsible>
                                <AccordionItem value="visita">
                                    <AccordionTrigger>
                                        Resultados de visita de campo
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <div class="mb-4">
                                            <label class="text-xs text-gray-500">
                                                Descripción
                                            </label>
                                            <p class="mt-2">
                                                {{ selectedSolicitud.descripcion_visita }}
                                            </p>
                                        </div>
                                        <div v-if="selectedSolicitud.fotos_visita?.length"
                                            class="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            <img v-for="foto in selectedSolicitud.fotos_visita" :key="foto.id"
                                                :src="foto.url" class="rounded-lg border object-cover h-40 w-full">

                                        </div>
                                        <div v-else class="text-sm text-gray-500">
                                            No existen fotografías.
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>
                        <div class="mt-2 ">
                            <Button v-if="selectedSolicitud?.estado_id === 3" @click="abrirModalVisita">
                                Enviar visita de campo
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
            <Dialog :open="mostrarModalVisita" @update:open="mostrarModalVisita = false">
                <DialogContent class="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>
                            Enviar visita de campo
                        </DialogTitle>
                    </DialogHeader>
                    <div class="space-y-2">
                        <label class="text-sm font-medium">
                            Descripción (opcional)
                        </label>
                        <Textarea v-model="descripcion" placeholder="Escriba las observaciones de la visita..."
                            rows="4" />
                        <div class="mt-4">
                            <label class="text-sm font-medium">
                                Fotografías
                            </label>
                            <input ref="inputFotos" type="file" multiple accept=".jpg,.jpeg,.png" class="hidden"
                                @change="cargarFotos" />
                            <Button variant="outline" @click="inputFotos.click()">
                                Agregar fotografías
                            </Button>
                            <div v-if="previews.length" class="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                                <div v-for="(foto, index) in previews" :key="index" class="relative">
                                    <img :src="foto.url" class="h-32 w-full rounded-lg object-cover border">
                                    <Button size="icon" variant="destructive" class="absolute top-2 right-2 h-7 w-7"
                                        @click="eliminarFoto(index)">
                                        <CircleX class="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Button variant="outline" @click="mostrarModalVisita = false">
                        Cancelar
                    </Button>
                    <Button @click="guardarVisita">
                        Guardar visita
                    </Button>
                </DialogContent>
            </Dialog>
        </CardContent>
    </Card>
</template>