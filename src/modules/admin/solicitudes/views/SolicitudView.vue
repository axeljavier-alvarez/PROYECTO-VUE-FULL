<script setup>
import { ref, computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useSolicitudStore }
   from '../stores/solicitudStore';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
const solicitudStore = useSolicitudStore();
const { solicitudes, loading } = storeToRefs(solicitudStore);
const search = ref('');
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
               </TableRow>
            </TableBody>
         </Table>
      </CardContent>
   </Card>
</template>