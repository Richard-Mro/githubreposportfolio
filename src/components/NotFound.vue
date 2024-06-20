<template>
  <div class="container mx-auto p-4 text-center">
    <h1 class="text-4xl font-bold text-red-600">404 - Page Not Found</h1>
    <p class="text-lg mt-4">Sorry, the page you are looking for does not exist.</p>
   <router-link to="/" class="inline-block px-4 py-2 mt-4 text-white bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold">Go back to home</router-link>
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
