<script setup>
import { ref, computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useEmisionConstanciaStore }
   from '../stores/emisionConstanciaStore';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button'
import {
   Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

import { FileText, User, History, Eye, Download, File, } from 'lucide-vue-next'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
   Accordion,
   AccordionContent,
   AccordionItem,
   AccordionTrigger
} from '@/components/ui/accordion';
const solicitudStore = useEmisionConstanciaStore();
const { solicitudes, loading } = storeToRefs(solicitudStore);
const search = ref('');
const selectedSolicitud = ref(null);
function verSolicitud(solicitud) {
   console.log(solicitud.constancia);
   selectedSolicitud.value = solicitud;
}
const filtroEstado = ref('todos');
const filteredSolicitudes = computed(() => {
   let resultado = solicitudes.value;
   if (filtroEstado.value !== 'todos') {
      resultado = resultado.filter(
         solicitud =>
            solicitud.estado_id === Number(filtroEstado.value)
      );
   }
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
         return texto.includes(
            search.value.toLowerCase()
         );
      });
   }
   return resultado;
});
const showRechazarModal = ref(false);
const showEmitirModal = ref(false);
const motivoRechazo = ref('');
function abrirRechazo() {
   showRechazarModal.value = true;
}
function abrirEmitir() {
   showEmitirModal.value = true;
}
function confirmarRechazo() {
   console.log('Rechazar:', selectedSolicitud.value.id);
   console.log('Motivo:', motivoRechazo.value);
   showRechazarModal.value = false;
}

async function confirmarEmision() {
   try {

      const response = await solicitudStore.emitirConstancia(
         selectedSolicitud.value.id
      );

      const url = window.URL.createObjectURL(
         new Blob([response.data], {
            type: 'application/pdf'
         })
      );

      const link = document.createElement('a');
      link.href = url;
      link.download = 'constancia.pdf';
      link.click();

      window.URL.revokeObjectURL(url);

      showEmitirModal.value = false;

   } catch (error) {
      console.error(error);
   }
}



onMounted(async () => {
   //  console.log('COMPONENTE MONTADO');
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
                  <div v-if="selectedSolicitud?.estado_id === 6" class="mt-4">
                     <Accordion type="single" collapsible>
                        <AccordionItem value="documentacion">
                           <AccordionTrigger>
                              Documentación de la solicitud
                           </AccordionTrigger>
                           <AccordionContent>
                              <div class="mb-4">
                                 <div class="flex items-center gap-2 mb-4">
                                    <FileText class="w-5 h-5 text-blue-600" />
                                    <h3 class="font-bold">
                                       Constancia generada
                                    </h3>
                                 </div>

                                 <div v-if="selectedSolicitud?.constancia?.length" class="grid grid-cols-1 gap-4 mt-2">
                                    <div v-for="constancia in selectedSolicitud.constancia" :key="constancia.id"
                                       class="border rounded-lg p-4 bg-gray-50 hover:shadow transition">
                                       <div class="flex items-center justify-between">

                                          <div class="flex items-center gap-2">
                                             <a :href="constancia.url" target="_blank"
                                                class="text-blue-600 hover:text-blue-800" title="Ver constancia">
                                                <Eye class="w-5 h-5" />
                                             </a>
                                             <span class="font-medium">
                                                Constancia emitida
                                             </span>
                                             <a :href="constancia.url" download
                                                class="text-green-600 hover:text-green-800"
                                                title="Descargar constancia">
                                                <Download class="w-5 h-5" />
                                             </a>
                                          </div>
                                       </div>
                                    </div>
                                 </div>
                                 <div v-else class="text-sm text-gray-500 mt-2">
                                    No existe una constancia generada.
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
                                                :download="doc.requisito?.nombre"
                                                class="text-green-600 hover:text-green-800" title="Descargar">
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
                              <div class="mb-4 mt-6">
                                 <div class="flex items-center gap-2 mb-4">
                                    <FileText class="w-5 h-5 text-blue-600" />
                                    <h3 class="font-bold">
                                       Resultados de visita de campo
                                    </h3>
                                 </div>

                                 <div class="mb-4">
                                    <label class="text-xs text-gray-500">
                                       Descripción
                                    </label>
                                    <p class="mt-2 text-gray-600">
                                      {{ selectedSolicitud.descripcion_visita || 'No se ingresó descripción de la visita.' }}
                                    </p>
                                 </div>
                                 <div v-if="selectedSolicitud.fotos_visita?.length"
                                    class="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    <img v-for="foto in selectedSolicitud.fotos_visita" :key="foto.id" :src="foto.url"
                                       class="rounded-lg border object-cover h-40 w-full">

                                 </div>
                                 <div v-else class="text-sm text-gray-500">
                                    No existen fotografías.
                                 </div>

                              </div>

                           </AccordionContent>
                        </AccordionItem>
                     </Accordion>
                  </div>
               </div>
               <!-- Footer -->
               <div class="border-t p-4 flex justify-end gap-3 shrink-0">
                  <Button class="bg-red-600 hover:bg-red-700 text-white" type="button" @click="abrirRechazo">
                     <XCircle class="w-4 h-4 mr-2" />
                     Rechazar
                  </Button>

                  <Button class="bg-green-600 hover:bg-green-700 text-white" type="button"
                     v-if="selectedSolicitud?.estado_id === 5" @click="abrirEmitir">
                     <FileCheck class="w-4 h-4 mr-2" />
                     Emitir constancia
                  </Button>

               </div>
            </DialogContent>
         </Dialog>
         <!-- RECHAZAR SOLICITUD -->
         <Dialog v-model:open="showRechazarModal">
            <DialogContent class="max-w-md">
               <DialogHeader>
                  <DialogTitle>
                     Rechazar Solicitud
                  </DialogTitle>
               </DialogHeader>
               <div class="space-y-4">
                  <p class="text-sm text-gray-600">
                     Está acción no se puede deshacer
                  </p>
                  <p>
                     ¿Está seguro que desa rechazar la solicitud
                     <strong>
                        {{ selectedSolicitud?.no_solicitud }}
                     </strong>?
                  </p>
                  <div>
                     <label class="text-sm font-medium">
                        Motivo del rechazo *
                     </label>
                     <textarea v-model="motivoRechazo" class="w-full border rounded-md p-3 mt-2" rows="4"
                        placeholder="Describa por qué se rechaza la solicitud" />
                  </div>
               </div>
               <DialogFooter>
                  <Button variant="outline" @click="showRechazarModal = false">
                     No, cancelar
                  </Button>
                  <Button class="bg-red-600 hover:bg-red-700" @click="confirmarRechazo" :disabled="!motivoRechazo">
                     Confirmar rechazo
                  </Button>
               </DialogFooter>
            </DialogContent>
         </Dialog>
         <Dialog v-model:open="showEmitirModal">
            <DialogContent class="max-w-md">
               <DialogHeader>
                  <DialogTitle>
                     Emitir constancia
                  </DialogTitle>
               </DialogHeader>
               <div class="space-y-4">
                  <p class="text-sm text-gray-600">
                     Esta acción generará el documento oficial
                  </p>
                  <p>
                     ¿Desea generar la constancia de la solicitud
                     <strong>
                        {{ selectedSolicitud?.no_solicitud }}
                     </strong>?
                  </p>

                  <div class="bg-gray-50 rounded-lg p-3 text-sm">

                     <p>
                        ✓ Se generará la constancia
                     </p>

                     <p>
                        ✓ El estado cambiará a emitido
                     </p>

                     <p>
                        ✓ Se registrará en bitácora
                     </p>
                  </div>

               </div>
               <DialogFooter>

                  <Button variant="outline" @click="showEmitirModal = false">
                     Cancelar
                  </Button>


                  <Button class="bg-green-600 hover:bg-green-700" @click="confirmarEmision">
                     Sí, emitir constancia
                  </Button>
               </DialogFooter>
            </DialogContent>
         </Dialog>
      </CardContent>
   </Card>
</template>