<script setup>
import {
    LayoutDashboard,
    FileText,
    FileSearch
} from 'lucide-vue-next';
import AdminNav from './AdminNav.vue';
import AdminNavLink from './AdminNavLink.vue';
const openSidebar = defineModel();
</script>

<template>

    <div v-if="openSidebar" @click="openSidebar = false" class="fixed inset-0 z-30 bg-black/50 sm:hidden"></div>

    <aside id="top-bar-sidebar" :class="[
        openSidebar ? 'translate-x-0' : '-translate-x-full',
        'fixed top-0 left-0 z-40 w-64 h-full transition-transform duration-300 sm:translate-x-0'
    ]" aria-label="Sidebar">
        <div class="h-full px-3 pt-20 pb-4 overflow-y-auto bg-white border-e border-default">

            <ul class="space-y-2 font-medium">
                <li>
                    <AdminNavLink :to="{
                        name: 'admin.dashboard'
                    }">
                        <LayoutDashboard class="w-5 h-5" />
                        <span class="ms-3">Dashboard</span>
                    </AdminNavLink>

                </li>
                <li>
                    <AdminNavLink :to="{
                        name: 'admin.solicitudes'
                    }">
                            <FileText class="w-5 h-5" />
                        <span class="ms-3">Solicitudes</span>
                    </AdminNavLink>
                </li>
                <li>
                    <AdminNavLink :to="{
                        name: 'admin.analisis'
                    }">
                            <FileSearch class="w-5 h-5" />

                        <span>Analisis de documentos</span>
                    </AdminNavLink>
                </li>
            </ul>
        </div>
    </aside>

</template>