<script setup>

import { ref, computed } from 'vue'
const nuevaTarea = ref('')
const tareas = ref([
    {
        id: 1,
        nombre: 'Estudiar Vue',
        completada: false
    },
    {
        id: 2,
        nombre: 'Practicar Pinia',
        completada: true
    }
]);

function agregarTarea(){
    if(!nuevaTarea.value.trim()) return
    tareas.value.push({
        id:Date.now(),
        nombre:nuevaTarea.value,
        completada:false 
    })
    nuevaTarea.value = ''
}
function eliminarTarea(id){
    tareas.value = tareas.value.filter(
        tarea => tarea.id !== id
    )
}
function cambiarEstado(tarea){
    tarea.completada = ! tarea.completada
}

const totalCompletadas = computed(() => {
    return tareas.value.filter(
        tarea => tarea.completada
    ).length
})
</script>
<template>
    <h2 class="text-xl font-bold mb-4">
        Ejercicio Reactividad Vue
    </h2>
    <div class="space-y-4">

        <input 
        v-model="nuevaTarea"
        placeholder="Nueva tarea"
        class="border p-2">
        <button
        @click="agregarTarea"
        class="border px-4 py-2"
        >
        Agregar
        </button>
        <p>
            Total tareas: {{ tareas.length }}
        </p>

        <p>
            Completadas: {{ totalCompletadas }}
        </p>
        <div
        v-for="tarea in tareas"
        :key="tarea.id"
        class="border p-3 mb-2">
        <h3>
            {{ tarea.nombre }}
        </h3>
        <p>
            Estado
            {{ tarea.completada ? 'Completada' : 'Pendiente' }}
        </p>
        <button
        @click="cambiarEstado(tarea)"
        class="mr-2">
        Cambiar Estado
        </button>
        <button
        @click="eliminarTarea(tarea.id)">
        Eliminar
        </button>
        </div>
    </div>
</template>