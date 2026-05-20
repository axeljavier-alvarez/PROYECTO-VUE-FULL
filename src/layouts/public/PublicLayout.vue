<script setup>
import { RouterView } from 'vue-router';
</script>

<template>
    
    HOla mundo
    

<nav class="bg-neutral-primary fixed w-full z-20 top-0 start-0 border-b border-default">
  <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
  <a href="https://flowbite.com/" class="flex items-center space-x-3 rtl:space-x-reverse">
      <img src="https://flowbite.com/docs/images/logo.svg" class="h-7" alt="Flowbite Logo" />
      <span class="self-center text-xl text-heading font-semibold whitespace-nowrap">Flowbite</span>
  </a>
  <div class="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
      <button type="button" class="flex text-sm bg-neutral-primary rounded-full md:me-0 focus:ring-4 focus:ring-neutral-tertiary" id="user-menu-button" aria-expanded="false" data-dropdown-toggle="user-dropdown" data-dropdown-placement="bottom">
        <span class="sr-only">Open user menu</span>
        <img class="w-8 h-8 rounded-full" src="data:image/png;base64,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" alt="user photo">
      </button>
      <!-- Dropdown menu -->
      <div class="z-50 hidden bg-neutral-primary-medium border border-default-medium rounded-base shadow-lg w-44" id="user-dropdown">
        <div class="px-4 py-3 text-sm border-b border-default">
          <span class="block text-heading font-medium">Joseph McFall</span>
          <span class="block text-body truncate">name@flowbite.com</span>
        </div>
        <ul class="p-2 text-sm text-body font-medium" aria-labelledby="user-menu-button">
          <li>
            <a href="#" class="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded">Dashboard</a>
          </li>
          <li>
            <a href="#" class="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded">Settings</a>
          </li>
          <li>
            <a href="#" class="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded">Earnings</a>
          </li>
          <li>
            <a href="#" class="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded">Sign out</a>
          </li>
        </ul>
      </div>
      <button data-collapse-toggle="navbar-user" type="button" class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-body rounded-base md:hidden hover:bg-neutral-secondary-soft hover:text-heading focus:outline-none focus:ring-2 focus:ring-neutral-tertiary" aria-controls="navbar-user" aria-expanded="false">
        <span class="sr-only">Open main menu</span>
        <svg class="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M5 7h14M5 12h14M5 17h14"/></svg>
      </button>
  </div>
  <div class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-user">
    <ul class="font-medium flex flex-col p-4 md:p-0 mt-4 border border-default rounded-base bg-neutral-secondary-soft md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-neutral-primary">
      <li>
        <a href="#" class="block py-2 px-3 text-white bg-brand rounded md:bg-transparent md:text-fg-brand md:p-0" aria-current="page">Home</a>
      </li>
      <li>
        <a href="#" class="block py-2 px-3 text-heading rounded hover:bg-neutral-tertiary md:hover:bg-transparent md:border-0 md:hover:text-fg-brand md:p-0 md:dark:hover:bg-transparent">About</a>
      </li>
      <li>
        <a href="#" class="block py-2 px-3 text-heading rounded hover:bg-neutral-tertiary md:hover:bg-transparent md:border-0 md:hover:text-fg-brand md:p-0 md:dark:hover:bg-transparent">Services</a>
      </li>
      <li>
        <a href="#" class="block py-2 px-3 text-heading rounded hover:bg-neutral-tertiary md:hover:bg-transparent md:border-0 md:hover:text-fg-brand md:p-0 md:dark:hover:bg-transparent">Pricing</a>
      </li>
      <li>
        <a href="#" class="block py-2 px-3 text-heading rounded hover:bg-neutral-tertiary md:hover:bg-transparent md:border-0 md:hover:text-fg-brand md:p-0 md:dark:hover:bg-transparent">Contact</a>
      </li>
    </ul>
  </div>
  </div>
</nav>

    <RouterView></RouterView>
</template>