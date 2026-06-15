<script setup>
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import iconoMunicipalidad from '@/assets/images/icono_municipalidad.png'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

</script>
<template>
    <div>

        <Card class="max-w-4xl mx-auto mt-5">
            <CardHeader>
                <img :src="iconoMunicipalidad" class="mx-auto h-30 w-auto mb-4">
                <CardTitle class="text-3xl text-center font-bold text-[#032C8F]">
                    Consulta de Estado
                </CardTitle>
            </CardHeader>
            <CardDescription class="mt-2 mx-6 rounded-md bg-[#FEF9C3] text-[#DD3426] text-base py-2 px-4
            text-center">
                Debe ingresar los datos exactos que colocó en su solicitud
            </CardDescription>
            <CardContent>
                <form class="grid gap-6" @submit.prevent>
                    <div class="grid gap-2">
                        <Label>
                            Número de dpi/cui
                        </Label>
                        <Input placeholder="0000 00000 0000"/>
                    </div>
                    <div class="grid gap-2">
                        <Label>
                            Número de solicitud
                        </Label>
                        <Input placeholder="Ej: 1-2025"/>
                    </div>

                    <div class="grid md:grid-cols-2 gap-4">
                        <Button type="button">
                            Consultar ahora
                        </Button>
                        <Button type="button">
                            Limpiar
                        </Button>
                    </div>
                </form>
            </CardContent>

        </Card>

    </div>
</template>