<script setup>
import { onMounted, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useDashboardStore } from '../stores/dashboardStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// importaciones para chart js
import {
    Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale
} from 'chart.js'
import { Bar } from 'vue-chartjs'
import { Clock3, FileCheck, CheckCircle2, AlertCircle, XCircle} from 'lucide-vue-next'
const estadoIcons = {
    'Por autorizar': Clock3,
    'Emitido': FileCheck,
    'Autorizado': CheckCircle2,
    'Previo': AlertCircle,
    'Rechazado': XCircle,
}
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const dashboardStore = useDashboardStore();

const {
    estados,
    loading,
    tramites
} = storeToRefs(dashboardStore);



const chartData = computed(() => ({
    labels: tramites.value.map(
        tramite => tramite.nombre
    ),
    datasets: [
        {
            label: 'Solicitudes',
            data: tramites.value.map(
                tramite => tramite.total_solicitudes
            )
        }
    ]
}

))

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false
}

onMounted(async () => {


    
    await dashboardStore.fetchEstadosDashboard();

    await dashboardStore.fetchTramitesDashboard();
});
</script>

<template>
    
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card v-for="estado in estados" :key="estado.id">
            <CardHeader  class="flex flex-row items-center justify-between">
                <CardTitle class="text-sm text-muted-foreground">
                    {{ estado.nombre }}
                </CardTitle>
                 <component
            :is="estadoIcons[estado.nombre]"
            class="h-5 w-5 text-muted-foreground"
        />
            </CardHeader>
            <CardContent>
                <div class="text-3xl font-bold">
                    {{ estado.total_solicitudes }}
                </div>
            </CardContent>
        </Card>
    </div>
    <div class="mt-8">
        <Card>
            <CardHeader>
                <CardTitle>
                    Solicitudes por Trámite
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div class="h-[400px]">
                    <Bar :data="chartData" :options="chartOptions"/>
                </div>
            </CardContent>
        </Card>
    </div>
</template>