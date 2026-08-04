<script setup>
import { ref, computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useSolicitudStore }
   from '../stores/autorizacionesStore';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button'
import {
   Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { FileText, User, History, Eye, Download, File, CircleX, Search, TriangleAlert, FileCheck, XCircle, CheckCircle } from 'lucide-vue-next'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const solicitudStore = useSolicitudStore();
const { solicitudes, loading, currentPage, lastPage } = storeToRefs(solicitudStore);
const search = ref('');
async function cambiarPagina(page){
   await solicitudStore.fetchSolicitudes(page);
}
const selectedSolicitud = ref(null);
function verSolicitudes(solicitud) {
   console.log(solicitud);
   selectedSolicitud.value = solicitud;
}
const filtroEstado = ref('todos');
/**
 * Computed encargado de generar la lista de solicitudes filtradas.
 *
 * Aplica dos tipos de filtros:
 * 1. Filtro por estado:
 *    - Permite mostrar únicamente solicitudes que pertenecen a un estado específico.
 *    - Si el filtro es "todos", retorna todas las solicitudes sin filtrar.
 *
 * 2. Filtro de búsqueda:
 *    - Permite buscar solicitudes por diferentes campos:
 *      - Número de solicitud.
 *      - Nombres.
 *      - Apellidos.
 *      - CUI.
 *      - Estado.
 *      - Tipo de trámite.
 *
 * El resultado se actualiza automáticamente cuando cambian:
 * - La lista de solicitudes.
 * - El estado seleccionado.
 * - El texto de búsqueda.
 */
const filteredSolicitudes = computed(() => {
   // Obtiene la lista completa de solicitudes almacenada en el estado.
   let resultado = solicitudes.value;
   /**
    * Filtrado por estado.
    *
    * Si el usuario selecciona un estado diferente a "todos",
    * se filtran únicamente las solicitudes cuyo estado_id
    * coincida con el estado seleccionado.
    */
   if (filtroEstado.value !== 'todos') {

      resultado = resultado.filter(
         solicitud =>
            solicitud.estado_id === Number(filtroEstado.value)
      );
   }
   /**
    * Filtrado por texto de búsqueda.
    *
    * Busca coincidencias en múltiples campos de la solicitud.
    * Se construye un texto con la información disponible y se
    * convierte a minúsculas para realizar una búsqueda
    * independiente de mayúsculas y minúsculas.
    */
   if (search.value) {
      resultado = resultado.filter(solicitud => {
         const texto = `
                ${solicitud.no_solicitud}
                ${solicitud.nombres}
                ${solicitud.apellidos}
                ${solicitud.cui}
                ${solicitud.estado?.nombre}
                ${solicitud.tramite?.nombre}
            `.toLowerCase();
         // Verifica si el texto buscado existe dentro
         // de la información de la solicitud.
         return texto.includes(
            search.value.toLowerCase()
         );
      });
   }
   // Retorna la lista final después de aplicar los filtros.
   return resultado;
});
// modal de rechazar
const showRechazarModal = ref(false);
const motivoRechazo = ref('');
function abrirRechazo() {
   showRechazarModal.value = true;
}
async function confirmarRechazo() {
   try {
      await solicitudStore.noAutorizar(
         selectedSolicitud.value.id,
         {
            estado_id: 9,
            descripcion: motivoRechazo.value
         }
      );
      // cerrar el modal de rechazo
      showRechazarModal.value = false;
      // cerrar modal principal
      selectedSolicitud.value = null;
      // limpiar el textarea
      motivoRechazo.value = '';
   } catch(error){
      console.log(error);
   }
}
// actualizar estado
const showAutorizarModal = ref(false);
function abrirAutorizar() {
   showAutorizarModal.value = true;
}
async function confirmarAutorizar() {
   try {
      await solicitudStore.cambiarEstado(
         selectedSolicitud.value.id,
         7
      );
      showAutorizarModal.value = false;
      selectedSolicitud.value = null;
   } catch (error) {
      console.log(error);
   }
}

onMounted(async () => {
   console.log('COMPONENTE MONTADO');
   await solicitudStore.fetchSolicitudes();
});
</script>

<template>
   <Card>
      <CardContent class="p-6">
         <div class="flex gap-4 mb-4">
            <Input v-model="search" placeholder="Buscar solicitud..." class="flex-1" />
            <Select v-model="filtroEstado">
               <SelectTrigger class="w-[220px]">
                  <SelectValue placeholder="Filtrar por estado" />
               </SelectTrigger>
               <SelectContent>
                  <SelectItem value="todos">
                     Todos
                  </SelectItem>
                  <SelectItem value="1">
                     Pendiente
                  </SelectItem>
                  <SelectItem value="2">
                     Analisis
                  </SelectItem>
                  <SelectItem value="3">
                     Visita asignada
                  </SelectItem>
                  <SelectItem value="4">
                     Visita realizada
                  </SelectItem>
                  <SelectItem value="5">
                     Por autorizar
                  </SelectItem>
                  <SelectItem value="6">
                     Emitido
                  </SelectItem>
                  <SelectItem value="7">
                     Autorizado
                  </SelectItem>
                  <SelectItem value="8">
                     Previo
                  </SelectItem>
                  <SelectItem value="9">
                     Rechazado
                  </SelectItem>
               </SelectContent>
            </Select>
         </div>
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
                     {{ solicitud.nombres }}
                     {{ solicitud.apellidos }}
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
                     <Button type="button" @click="verSolicitudes(solicitud)">
                        Continuar revisión
                     </Button>
                  </TableCell>
               </TableRow>
            </TableBody>
         </Table>
         <div class="flex items-center justify-end gap-2 mt-4">
            <Button variant="outline" :disabled="currentPage === 1" @click="cambiarPagina(currentPage - 1)">
               Anterior
            </Button>
            <span>Página {{ currentPage }} de {{ lastPage }}</span>
            <Button variant="outline" :disabled="currentPage === lastPage" @click="cambiarPagina(currentPage + 1)">
               Siguiente
            </Button>
         </div>
         <Dialog :open="!!selectedSolicitud" @update:open="selectedSolicitud = null">
            <DialogContent class="max-w-4xl max-h-[90vh] flex flex-col p-0 overflow-hidden gap-0">

               <!-- Encabezado -->
               <div class="bg-blue-600 p-4 text-white flex justify-between items-center shrink-0">
                  <div class="flex items-center gap-3">
                     <div class="bg-white/20 p-2 rounded-lg">
                        <FileText class="w-6 h-6" />
                     </div>

                     <div>
                        <h2 class="text-lg font-semibold">
                           Detalle de Solicitud
                        </h2>
                        <p class="text-sm text-blue-100">
                           No. {{ selectedSolicitud?.no_solicitud }}
                        </p>
                     </div>
                  </div>
               </div>
               <!-- Contenido con scroll -->
               <div class="flex-1 overflow-y-auto p-6">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <!-- Información -->
                     <div class="space-y-4">
                        <div
                           class="flex items-center gap-2 text-sm text-gray-500 uppercase font-semibold tracking-wider">
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
               </div>
               <!-- Footer -->
               <div class="border-t p-4 flex justify-end gap-3 shrink-0">
                  <Button class="bg-red-600 hover:bg-red-700 text-white" type="button"
                     v-if="selectedSolicitud?.estado_id === 6" @click="abrirRechazo">
                     <XCircle class="w-4 h-4 mr-2" />
                     No autorizar
                  </Button>
                  <Button v-if="selectedSolicitud?.estado_id === 6" class="bg-green-600 hover:bg-green-700"
                     type="button" @click="abrirAutorizar">
                     <CheckCircle class="w-4 h-4 mr-2" />
                     Autorizar Solicitud
                  </Button>
               </div>
            </DialogContent>
         </Dialog>
         <Dialog v-model:open="showRechazarModal">
            <DialogContent class="max-w-md">
               <DialogHeader>
                  <DialogTitle>
                     No autorizar
                  </DialogTitle>
               </DialogHeader>
               <div class="space-y-4">
                  <p class="text-sm text-gray-600">
                     Está acción no se puede deshacer
                  </p>
                  <p>
                     ¿Está seguro de no autorizar la solicitud
                     <strong>
                        {{ selectedSolicitud?.no_solicitud }}
                     </strong>?
                  </p>
                  <div>
                     <label class="text-sm font-medium">
                        Motivo
                     </label>
                     <textarea v-model="motivoRechazo" class="w-full border rounded-md p-3 mt-2" rows="4"
                        placeholder="Describa por qué se rechaza la solicitud" />
                  </div>
               </div>
               <DialogFooter>
                  <Button variant="outline" @click="showRechazarModal = false">
                     Cancelar
                  </Button>
                  <Button class="bg-red-600 hover:bg-red-700" @click="confirmarRechazo" :disabled="!motivoRechazo">
                     No autorizar
                  </Button>
               </DialogFooter>
            </DialogContent>
         </Dialog>
         <Dialog v-model:open="showAutorizarModal">
            <DialogContent class="max-w-md">
               <DialogHeader>
                  <DialogTitle>
                     Autorizar Solicitud
                  </DialogTitle>
               </DialogHeader>
               <div class="space-y-4">
                  <p class="text-sm text-gray-600">
                     Esta acción cambiará el estado de la solicitud.
                  </p>
                  <p>
                     ¿Está seguro de autorizar la solicitud
                     <strong>
                        {{ selectedSolicitud?.no_solicitud }}
                     </strong>?
                  </p>
               </div>
               <DialogFooter>
                  <Button variant="outline" @click="showAutorizarModal = false">
                     Cancelar
                  </Button>
                  <Button class="bg-green-600 hover:bg-green-700" @click="confirmarAutorizar">
                     <CheckCircle class="w-4 h-4 mr-2" />
                     Autorizar
                  </Button>
               </DialogFooter>
            </DialogContent>
         </Dialog>
      </CardContent>
   </Card>
</template>