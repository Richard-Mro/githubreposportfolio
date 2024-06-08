<template>
  <div class="container mx-auto p-4 text-center">
    <h1 class="text-4xl font-bold text-red-600">404 - Page Not Found</h1>
    <p class="text-lg mt-4">Sorry, the page you are looking for does not exist.</p>
    <router-link to="/" class="text-blue-500 underline mt-4">Go back to home</router-link>
  </div>
</template>

<script>
export default {
  name: 'NotFound',
};
</script>

<style scoped>
/* Additional styles */
</style>
