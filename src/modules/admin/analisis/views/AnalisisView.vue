<script setup>
import { ref, computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useAnalisisStore } from '../stores/analisisStore';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button'

const analisisStore = useAnalisisStore();
const { solicitudes, loading } = storeToRefs(analisisStore);
const search = ref('');
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
         <div v-if="selectedSolicitud" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            @click.self="selectedSolicitud = null">
            <div class="bg-white w-full max-w-2xl rounded-lg shadow-lg p-6 relative">
               <h2 class="text-lg font-bold mb-4">
                  Revisión de solicitud #{{ selectedSolicitud.no_solicitud }}
               </h2>
               <p><b>Nombre:</b> {{ selectedSolicitud.nombres }} {{ selectedSolicitud.apellidos }}</p>
               <p><b>CUI:</b> {{ selectedSolicitud.cui }}</p>
               <p><b>Teléfono:</b> {{ selectedSolicitud.telefono }}</p>
               <p><b>Domicilio:</b> {{ selectedSolicitud.domicilio }}</p>
               <p><b>Zona:</b> {{ selectedSolicitud.zona }}</p>
               <p><b>Trámite</b> {{ selectedSolicitud.tramite?.nombre }}</p>
               <p><b>Observaciones</b> {{ selectedSolicitud.observaciones }}</p>
               <div class="mt-6">
                  <h3 class="font-bold mb-2">
                     Documentos adjuntos
                  </h3>
                  <div v-if="selectedSolicitud?.documentos?.length" class="space-y-2">
                     <div v-for="doc in selectedSolicitud.documentos" :key="doc.id" class="border rounded p-3">
                        <p class="font-medium">
                           {{ doc.requisito?.nombre }}
                        </p>
                        <a :href="`http://127.0.0.1:8000/storage/${doc.path}`" target="_blank" class="text-blue-600 hover:underline">
                           Ver documento
                        </a>
                     </div>
                  </div>
                  <p v-else class="text-sm text-gray-500">
                     No hay documentos adjuntos
                  </p>
               </div>
               <div class="mt-6">
                  <h3 class="font-bold mb-2">Bitácora</h3>

                  <div v-if="selectedSolicitud?.bitacoras?.length">
                     <ul class="space-y-2">
                        <li v-for="bit in selectedSolicitud?.bitacoras" :key="bit.id" class="border-l-2 pl-3">
                           <p class="text-sm font-semibold">
                              {{ bit.evento }}
                           </p>

                           <p class="text-sm">
                              {{ bit.descripcion }}
                           </p>

                           <p class="text-xs text-gray-500">
                              {{ bit.usuario ?? 'Sistema' }} - {{ bit.created_at }}
                           </p>
                        </li>
                     </ul>
                  </div>

                  <p v-else class="text-sm text-gray-500">
                     Sin historial de movimientos
                  </p>
               </div>

              <div class="mt-6 grid grid-cols-1 md:grid-cols-4 gap-3">
                  <Button 
                     variant="destructive" 
                     class="w-full flex items-center justify-center gap-2 uppercase font-semibold text-xs tracking-wider"
                     @click="console.log('Rechazar')"
                  >
                     <span class="text-sm">×</span>
                     Rechazar Solicitud
                  </Button>

                  <Button 
                     variant="outline" 
                     class="w-full border-amber-600 text-amber-800 hover:bg-amber-50 flex items-center justify-center gap-2 uppercase font-semibold text-xs tracking-wider"
                     @click="console.log('Inspección')"
                  >
                     <span class="text-xs">🔍</span>
                     Inspección de Campo
                  </Button>

                  <Button 
                     variant="outline" 
                     class="w-full border-orange-600 text-orange-800 hover:bg-orange-50 flex items-center justify-center gap-2 uppercase font-semibold text-xs tracking-wider"
                     @click="console.log('Previo')"
                  >
                     <span class="text-xs">⚠️</span>
                     Enviar a Previo
                  </Button>

                  <Button 
                     class="w-full bg-blue-900 hover:bg-blue-850 text-white flex items-center justify-center gap-2 uppercase font-semibold text-xs tracking-wider"
                     @click="console.log('Autorizar')"
                  >
                     <span class="text-xs">📄</span>
                     Enviar a Autorizar
                  </Button>
               </div>
               
            </div>
         </div>
      </CardContent>
   </Card>
</template>