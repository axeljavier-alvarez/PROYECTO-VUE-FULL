<script setup>
import { ref } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import { useAuthStore } from '@/modules/auth/stores/authStore';
import AppLogo from '@/modules/shared/components/AppLogo.vue';

const openSidebar = defineModel();

// 🌟 Variable reactiva para controlar el menú desplegable del usuario
const isDropdownOpen = ref(false);

const authStore = useAuthStore();
const router = useRouter();

// Función para cerrar sesión de forma segura
const handleLogout = () => {
    authStore.logout(); // Asegúrate de tener este método en tu authStore para borrar el token
    isDropdownOpen.value = false;
    router.push('/'); // Redirigimos a la página de inicio pública
};
</script>

<template>
     <nav class="fixed top-0 z-50 w-full bg-neutral-primary-soft border-b border-default">
        <div class="px-3 py-3 lg:px-5 lg:pl-3">
            <div class="flex items-center justify-between">
                <div class="flex items-center justify-start rtl:justify-end">
                    <button 
                        @click="openSidebar = !openSidebar"
                        aria-controls="top-bar-sidebar" 
                        type="button"
                        class="sm:hidden text-heading bg-transparent box-border border border-transparent hover:bg-neutral-secondary-medium focus:ring-4 focus:ring-neutral-tertiary font-medium leading-5 rounded-base text-sm p-2 focus:outline-none"
                    >
                        <span class="sr-only">Open sidebar</span>
                        <svg class="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M5 7h14M5 12h14M5 17h10" />
                        </svg>
                    </button>
                    <RouterLink to="/">
                        <AppLogo />
                    </RouterLink>
                </div>
                
                <div class="flex items-center">
                    <div class="flex items-center ms-3 relative"> <div>
                            <button 
                                type="button"
                                @click="isDropdownOpen = !isDropdownOpen"
                                class="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                                :aria-expanded="isDropdownOpen"
                            >
                                <span class="sr-only">Open user menu</span>
                                <img class="w-8 h-8 rounded-full"
                                    src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                                    alt="user photo">
                            </button>
                        </div>

                        <div 
                            :class="[isDropdownOpen ? 'block' : 'hidden', 'absolute right-0 top-10 z-50 bg-white border border-gray-200 rounded-base shadow-lg w-44']"
                            id="dropdown-user"
                        >
                            <div v-if="authStore.isAuthenticated" class="px-4 py-3 border-b border-gray-100" role="none">
                                <p class="text-sm font-medium text-gray-900" role="none">
                                    Usuario Administrador
                                </p>
                                <p class="text-xs text-gray-500 truncate" role="none">
                                    admin@sistema.com
                                </p>
                            </div>

                            <ul class="p-2 text-sm text-gray-700 font-medium space-y-1" role="none">
                                <template v-if="authStore.isAuthenticated">
                                    <li>
                                        <RouterLink to="/admin/dashboard" @click="isDropdownOpen = false" class="flex w-full p-2 hover:bg-gray-100 text-gray-700 rounded">
                                            Dashboard
                                        </RouterLink>
                                    </li>
                                    <li>
                                        <button 
                                            @click="handleLogout" 
                                            class="flex w-full text-left p-2 hover:bg-red-50 text-red-600 rounded"
                                        >
                                            Cerrar sesión
                                        </button>
                                    </li>
                                </template>

                                <template v-else>
                                    <li>
                                        <RouterLink to="/auth/login" @click="isDropdownOpen = false" class="flex w-full p-2 hover:bg-gray-100 text-gray-700 rounded">
                                            Iniciar sesión
                                        </RouterLink>
                                    </li>
                                    <li>
                                        <RouterLink to="#" @click="isDropdownOpen = false" class="flex w-full p-2 hover:bg-gray-100 text-gray-700 rounded">
                                            Registrarse
                                        </RouterLink>
                                    </li>
                                </template>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </nav>
</template>