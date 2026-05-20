<script setup>
import { RouterView } from 'vue-router';
import PublicNav from './components/PublicNav.vue';
import PublicFooter from './components/PublicFooter.vue';
</script>

<template>

    <!-- NAV -->
    <PublicNav></PublicNav>

    <!-- ROUTER VIEW -->
    <div class="max-w-screen-xl mx-auto p-4 pt-24">
        <RouterView />
    </div>

    <PublicFooter></PublicFooter>




</template>