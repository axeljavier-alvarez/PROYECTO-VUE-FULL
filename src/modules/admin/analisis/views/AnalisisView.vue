<script setup>
import { ref, computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useAnalisisStore } from '../stores/analisisStore';
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
} from 'lucide-vue-next'

const analisisStore = useAnalisisStore();
const { solicitudes, loading } = storeToRefs(analisisStore);
const search = ref('');
const selectedSolicitud = ref(null);
// confirmar dialog
const confirmDialog = ref(false);
const accionSeleccionada = ref({
   estadoId: null,
   titulo: '',
   mensaje: ''
});

function verSolicitud(solicitud) {
   console.log(solicitud);
   selectedSolicitud.value = solicitud;
}

// funcion para abrir modal
function confirmarCambioEstado(estadoId, titulo, mensaje) {
   accionSeleccionada.value = {
      estadoId,
      titulo,
      mensaje
   };
   confirmDialog.value = true;
}

// actualizar estado
async function actualizarEstado(estadoId) {
   try {
      await analisisStore.cambiarEstado(
         selectedSolicitud.value.id,
         accionSeleccionada.value.estadoId
      );

      confirmDialog.value = false;
      await analisisStore.fetchSolicitudes();

      selectedSolicitud.value = null;

   } catch (error) {
      console.error(error);
   }
}

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
onMounted(async () => {
   await analisisStore.fetchSolicitudes();
})
</script>
<template>
   <Card>
      <CardContent class="p-6">
         <div class="mb-4">
            <Input v-model="search" placeholder="Buscar solicitud..." />
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
                     <Button type="button" @click="verSolicitud(solicitud)">
                        Continuar revisión
                     </Button>
                  </TableCell>
               </TableRow>
            </TableBody>
         </Table>
         <Dialog :open="!!selectedSolicitud" @update:open="selectedSolicitud = null">
            <DialogContent class="max-w-4xl max-h-[90vh] flex flex-col p-0 overflow-hidden gap-0">

               <!-- Encabezado -->
               <div class="bg-blue-600 p-4 text-white flex justify-between items-center shrink-0">
                  <div class="flex items-center gap-3">
                     <div class="bg-white/20 p-2 rounded-lg">
                        <FileText class="w-6 h-6" />
                     </div>

                     <div>
                        <DialogHeader class="border-b p-4">
                           <DialogTitle class="text-lg font-bold">
                              Detalles de la Solicitud
                           </DialogTitle>
                        </DialogHeader>
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

                  <div class="mt-6">
                     <div class="flex items-center gap-2 mb-4">
                        <FileText class="w-5 h-5 text-blue-600" />
                        <h3 class="font-bold">
                           Documentos Adjuntos
                        </h3>
                     </div>

                     <div v-if="selectedSolicitud?.documentos?.length"
                        class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        <div v-for="doc in selectedSolicitud.documentos" :key="doc.id"
                           class="border rounded-lg p-4 bg-gray-50 hover:shadow transition">
                           <div class="flex items-center justify-between">

                              <div class="flex items-center gap-2 min-w-0">
                                 <a :href="`http://127.0.0.1:8000/storage/${doc.path}`" target="_blank"
                                    class="text-blue-600 hover:text-blue-800" title="Ver documento">
                                    <Eye class="w-5 h-5" />
                                 </a>

                                 <span class="font-medium truncate">
                                    {{ doc.requisito?.nombre }}
                                 </span>

                                 <a :href="`http://127.0.0.1:8000/storage/${doc.path}`"
                                    :download="doc.requisito?.nombre" class="text-green-600 hover:text-green-800"
                                    title="Descargar">
                                    <Download class="w-5 h-5" />
                                 </a>

                              </div>
                           </div>
                        </div>
                     </div>

                     <p v-else class="text-sm text-gray-500">
                        No hay documentos adjuntos.
                     </p>
                  </div>
                  <div class="mt-6 grid grid-cols-1 md:grid-cols-4 gap-3">
                     <Button variant="destructive"
                        class="w-full flex items-center justify-center gap-2 uppercase font-semibold text-xs tracking-wider"
                        @click="confirmarCambioEstado(
                           9,
                           'Rechazar Solicitud',
                           '¿Está seguro de que desea rechazar esta solicitud?'
                        )">
                        <CircleX class="w-4 h-4" />
                        Rechazar Solicitud
                     </Button>
                     <Button variant="outline"
                        class="w-full border-amber-600 text-amber-800 hover:bg-amber-50 flex items-center justify-center gap-2 uppercase font-semibold text-xs tracking-wider"
                        @click="confirmarCambioEstado(
                           3,
                           'Inspección de Campo',
                           '¿Está seguro de que desea enviar esta solicitud para inspección de campo?'
                        )">
                        <Search class="w-4 h-4" />
                        Inspección de Campo
                     </Button>
                     <Button variant="outline"
                        class="w-full border-orange-600 text-orange-800 hover:bg-orange-50 flex items-center justify-center gap-2 uppercase font-semibold text-xs tracking-wider"
                        @click="confirmarCambioEstado(
                           8,
                           'Enviar a Previo',
                           '¿Está seguro de que desea enviar esta solicitud para revisión previa?'
                        )">
                        <TriangleAlert class="w-4 h-4" />
                        Enviar a Previo
                     </Button>
                     <Button
                        class="w-full bg-blue-900 hover:bg-blue-800 text-white flex items-center justify-center gap-2 uppercase font-semibold text-xs tracking-wider"
                        @click="confirmarCambioEstado(
                           5,
                           'Enviar a Autorizar',
                           '¿Está seguro de que desea enviar esta solicitud para autorización?'
                        )">
                        <FileCheck class="w-4 h-4" />
                        Enviar a Autorizar
                     </Button>
                  </div>
               </div>
               <!-- Footer -->
               <div class="border-t p-4 flex justify-end shrink-0">
                  <DialogClose as-child>
                     <Button class="bg-green-600 hover:bg-green-700">
                        Aceptar
                     </Button>
                  </DialogClose>
               </div>
            </DialogContent>
         </Dialog>

         <Dialog :open="confirmDialog" @update:open="confirmDialog = false">
            <DialogContent class="max-w-md">

               <DialogHeader>
                  <DialogTitle>
                     {{ accionSeleccionada.titulo }}
                  </DialogTitle>
               </DialogHeader>

               <p class="text-sm text-gray-600">
                  {{ accionSeleccionada.mensaje }}
               </p>

               <DialogFooter class="mt-6">

                  <Button variant="outline" @click="confirmDialog = false">
                     Cancelar
                  </Button>

                  <Button @click="actualizarEstado">
                     Aceptar
                  </Button>

               </DialogFooter>

            </DialogContent>
         </Dialog>

      </CardContent>
   </Card>
</template>