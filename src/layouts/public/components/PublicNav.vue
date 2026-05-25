<script setup>
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import PublicNavLink from './PublicNavLink.vue';
import DropdownMenu from '@/modules/shared/components/DropdownMenu.vue';
import AppLogo from '@/modules/shared/components/AppLogo.vue'

const isMenuOpen = ref(false);
const isUserMenuOpen = ref(false);

const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;
};

const toggleUserMenu = () => {
    isUserMenuOpen.value = !isUserMenuOpen.value;
};
</script>

<template>

    <nav class="bg-neutral-primary fixed w-full z-20 top-0 start-0 border-b border-default">
        <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">

            <!-- LOGO -->

            <RouterLink to="/">
                <AppLogo />
            </RouterLink>


            <!-- RIGHT SIDE -->
            <div class="flex items-center md:order-2 gap-3">


                <!-- RESPONSIVO -->

                <DropdownMenu>

                    <!-- BOTON -->
                    <template #trigger>
                        <button type="button"
                            class="flex text-sm bg-neutral-primary rounded-full focus:ring-4 focus:ring-neutral-tertiary">

                            <span class="sr-only">Open user menu</span>

                            <img class="w-8 h-8 rounded-full"
                                src="https://flowbite.com/docs/images/people/profile-picture-5.jpg" alt="user photo" />
                        </button>
                    </template>

                    <!-- ITEMS -->
                    <RouterLink :to="{ name: 'admin.dashboard' }"
                        class="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition">
                        Admin
                    </RouterLink>

                    <RouterLink :to="{ name: 'login' }"
                        class="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition">
                        Iniciar sesión
                    </RouterLink>

                    <RouterLink :to="{ name: 'register' }"
                        class="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition">
                        Registrarse
                    </RouterLink>

                </DropdownMenu>



                <!-- HAMBURGER -->
                <button @click="toggleMenu" type="button"
                    class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-body rounded-base md:hidden hover:bg-neutral-secondary-soft hover:text-heading focus:outline-none focus:ring-2 focus:ring-neutral-tertiary">
                    <span class="sr-only">Open main menu</span>

                    <svg class="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                        viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-width="2"
                            d="M5 7h14M5 12h14M5 17h14" />
                    </svg>
                </button>

            </div>

            <!-- MENU -->
            <div :class="[
                isMenuOpen ? 'flex' : 'hidden',
                'items-center justify-between w-full md:flex md:w-auto md:order-1'
            ]">

                <ul
                    class="font-medium flex flex-col p-4 md:p-0 mt-4 border border-default rounded-base bg-neutral-secondary-soft md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-neutral-primary w-full md:w-auto">



                    <li>
                        <publicNavLink :to="{
                            name: 'home'
                        }">
                            Home
                        </publicNavLink>
                        <PublicNavLink to="/about">
                            About
                        </PublicNavLink>
                    </li>
                </ul>

            </div>

        </div>
    </nav>

</template>