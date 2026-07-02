<script setup>
import { ref, computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useSolicitudStore }
   from '../stores/solicitudStore';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button'
import {
   Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { FileText, User, History } from 'lucide-vue-next'

const solicitudStore = useSolicitudStore();
const { solicitudes, loading } = storeToRefs(solicitudStore);
const search = ref('');
// para ver la solicitud en un modal
const selectedSolicitud = ref(null);
function verSolicitud(solicitud) {
   console.log(solicitud);
   selectedSolicitud.value = solicitud;
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
   //  console.log('COMPONENTE MONTADO');
   await solicitudStore.fetchSolicitudes();
});
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

                       <div class="flex items-center gap-2 text-sm text-gray-500 uppercase font-semibold tracking-wider">
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
                        <div class="flex items-center gap-2 text-sm text-gray-500 uppercase font-semibold tracking-wider">
                           <History class="w-4 h-4 text-blue-600" />
                           <span>Historial de Movimientos</span>
                        </div>
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
               <div class="border-t p-4 flex justify-end shrink-0">
                  <DialogClose as-child>
                     <Button class="bg-green-600 hover:bg-green-700">
                        Aceptar
                     </Button>
                  </DialogClose>
               </div>
            </DialogContent>
         </Dialog>
      </CardContent>
   </Card>
</template>