<script setup>
const openSidebar = defineModel();
</script>

<template>

    <div
        v-if="openSidebar"
        @click="openSidebar = false"
        class="fixed inset-0 z-30 bg-black/50 sm:hidden"
    ></div>

    <aside
        id="top-bar-sidebar"
        :class="[
            openSidebar ? 'translate-x-0' : '-translate-x-full',
            'fixed top-0 left-0 z-40 w-64 h-full transition-transform duration-300 sm:translate-x-0'
        ]"
        aria-label="Sidebar"
    >
        <div class="h-full px-3 pt-20 pb-4 overflow-y-auto bg-white border-e border-default">

            <ul class="space-y-2 font-medium">
                <li>
                    <RouterLink
                        :to="{ name: 'admin.dashboard' }"
                        active-class="bg-gray-100 text-gray-900"
                        class="flex items-center px-2 py-1.5 rounded-base hover:bg-gray-100 transition-colors"
                    >
                        <svg
                            class="w-5 h-5"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M10 6.025A7.5 7.5 0 1 0 17.975 14H10V6.025Z"
                            />
                        </svg>

                        <span class="ms-3">Dashboard</span>
                    </RouterLink>
                </li>
            </ul>
        </div>
    </aside>

</template>