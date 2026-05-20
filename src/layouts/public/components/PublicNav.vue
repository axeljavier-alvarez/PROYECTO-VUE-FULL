<template>
    
<nav class="bg-neutral-primary fixed w-full z-20 top-0 start-0 border-b border-default">
        <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">

            <a href="#" class="flex items-center space-x-3">
                <img
                    src="https://flowbite.com/docs/images/logo.svg"
                    class="h-7"
                    alt="Logo"
                />

                <span class="self-center text-xl text-heading font-semibold whitespace-nowrap">
                    Flowbite
                </span>
            </a>

            <div class="flex md:order-2">
                <button
                    type="button"
                    class="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-4 py-2"
                >
                    Login
                </button>
            </div>

            <div class="hidden md:flex md:w-auto">
                <ul class="flex flex-row gap-8 font-medium">
                    <li>
                        <a href="#" class="text-heading hover:text-blue-500">
                            Home
                        </a>
                    </li>

                    <li>
                        <a href="#" class="text-heading hover:text-blue-500">
                            About
                        </a>
                    </li>

                    <li>
                        <a href="#" class="text-heading hover:text-blue-500">
                            Contact
                        </a>
                    </li>
                </ul>
            </div>

        </div>
    </nav>
</template>