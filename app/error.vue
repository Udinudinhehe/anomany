<template>
    <div class="text-center p-10">
        <h1 class="text-2xl font-bold text-red-600">Terjadi Kesalahan</h1>
        <p class="mt-4">{{ error.statusCode }} -  {{ error.message }}</p>
        <NuxtLink to="/" class="text-blue-500 underline mt-4 block">Kembali Ke Beranda</NuxtLink>
    </div>
</template>
<script setup>
defineProps({
    error: Object
})
</script>