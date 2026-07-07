<script setup>
import { ref, computed, onMounted } from 'vue';
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
} from 'lucide-vue-next'
const visitaCampoStore = useVisitaCampoStore();
const { solicitudes, loading } = storeToRefs(visitaCampoStore);
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
    await visitaCampoStore.fetchSolicitudes();
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
            <Dialog :open="!!selectedSolicitud" @update:open="selectedSolicitud = null">
                <DialogContent class="max-w-4xl max-h-[90vh] flex flex-col p-0 overflow-hidden gap-0">
                    <!-- encabezado -->
                    <div class="bg-blue-600 p-4 text-white flex justify-between items-center shrink-0">
                        <div class="flex items-center gap-3">
                            <div class="flex items-center gap-3">
                                <div class="bg-white/20 p-2 rounded-lg">
                                    <FileText class="w-6 h-6" />
                                </div>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </CardContent>
    </Card>
</template>