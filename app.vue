<script setup lang="ts">
import Toast from 'primevue/toast';

</script>
<template>
  <div>
    <Navbar></Navbar>
    <NuxtPage/>
    <Toast />
    <slot />
  </div>
</template>
