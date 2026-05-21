<script setup>
import { RouterView } from 'vue-router'
import AdminNav from './components/AdminNav.vue';
import AdminAside from './components/AdminAside.vue';
import { ref }  from 'vue';
const openSidebar = ref(false);
</script>

<template>

    <AdminNav v-model="openSidebar"/>

    <AdminAside v-model="openSidebar" />
    

<div class="p-4 mt-14 sm:ml-64">       
     <div class="p-4 border-1 border-default border-dashed rounded-base">
            <RouterView />
        </div>
    </div>

</template>