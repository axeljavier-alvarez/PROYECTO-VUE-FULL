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
    // dashboardStore.fetchEstadosDashboard();
    // ver lo que llega en vue
    // console.log(estados.value)

    
    await dashboardStore.fetchEstadosDashboard();

    await dashboardStore.fetchTramitesDashboard();
});
</script>

<template>
    <!-- <div v-if="loading">
        Cargando...
    </div>
    <div v-else>
        <div
            v-for="estado in estados"
            :key="estado.id"
        >
            <h3>{{ estado.nombre }}</h3>
            <p>{{ estado.total_solicitudes }}</p>
        </div>
        <div
        v-for="tramite in tramites"
        :key="tramite.id">
        <h3>{{ tramite.nombre }}</h3>
        <p>{{ tramite.total_solicitudes }}</p>
        </div>
    </div> -->
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card v-for="estado in estados" :key="estado.id">
            <CardHeader>
                <CardTitle class="text-sm text-muted-foreground">
                    {{ estado.nombre }}
                </CardTitle>
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