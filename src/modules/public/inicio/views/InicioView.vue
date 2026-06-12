<script setup>
import { Card, CardContent, CardTitle, CardDescription, CardHeader } from '@/components/ui/card'
import iconoMunicipalidad from '@/assets/images/icono_municipalidad.png'
import { FileText, Search, ShieldAlert } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
</script>
<template>
    <div class="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div class="mt-5 w-full max-w-5xl">
            <CardHeader>
                <img :src="iconoMunicipalidad" class="mx-auto h-30 w-auto mb-4">
                <CardTitle class="text-2xl text-center font-bold text-[#000000]">
                    Sistema de Constancia de Residencia
                </CardTitle>
                <CardDescription class="text-center text-base mt-2">
                    Seleccione una opción para continuar
                </CardDescription>
            </CardHeader>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mt-8 px-4">
            <router-link to="/solicitud" class="block group no-underline">
                <Card
                    class="h-full border-t-4 border-[#83BD3F] hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between">
                    <CardHeader class="text-center pb-2">
                        <div
                            class="mx-auto bg-green-50 text-[#83BD3F] p-4 rounded-full w-16 h-16 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                            <FileText class="w-8 h-8" />
                        </div>
                        <CardTitle class="text-xl font-bold text-gray-800">
                            Nueva Solicitud
                        </CardTitle>
                    </CardHeader>
                    <CardContent class="text-center flex-grow flex flex-col justify-between">
                        <p class="text-gray-600 text-sm leading-relaxed mb-4">
                            Llene el formulario de registro para obtener su número de solicitud. Deberá
                            elegir su tipo de trámite y subir sus documentos en formato PDF o JPG para inciar el
                            proceso.
                        </p>
                    </CardContent>
                </Card>
            </router-link>
            <router-link to="" class="block group no-underline">
                <Card class="h-full border-t-4 border-t-[#032C8F] hover:shadow-xl transition-all">
                    <CardHeader class="text-center pb-2">
                        <div
                            class="mx-auto bg-blue-50 text-[#032C8F] p-4 rounded-full w-16 h-16 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                            <Search class="w-8 h-8" />
                        </div>
                        <CardTitle class="text-xl font-bold text-gray-800">
                            Consultar Estado
                        </CardTitle>
                    </CardHeader>
                    <CardContent class="text-center flex-grow flex flex-col justify-between">
                        <p class="text-gray-600 text-sm leading-relaxed mb-4">
                            Vea el estado de su solicitud; solo ingrese su número de DPI y el número de solicitud que
                            recibió en su correo electrónico.
                        </p>
                    </CardContent>
                </Card>
            </router-link>
            <router-link to="" class="block group no-underline">
                <Card
                    class="h-full border-t-4 border-t-gray-800 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between">
                    <CardHeader class="text-center pb-2">
                        <div
                            class="mx-auto bg-gray-100 text-gray-800 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                            <ShieldAlert class="w-8 h-8" />
                        </div>
                        <CardTitle class="text-xl font-bold text-gray-800">Iniciar Sesión</CardTitle>
                    </CardHeader>
                    <CardContent class="text-center flex-grow flex flex-col justify-between">
                        <p class="text-gray-600 text-sm leading-relaxed mb-4">
                            Acceda al sistema para administrar solicitudes, asignar visitas de campo, control de
                            estados, autorización y emisión de constancias de residencia.
                        </p>
                    </CardContent>
                </Card>
            </router-link>
        </div>
    </div>
</template>