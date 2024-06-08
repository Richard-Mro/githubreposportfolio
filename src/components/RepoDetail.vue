<template>
  <div v-if="loading" class="text-center text-gray-600">Loading...</div>
  <div v-else-if="error" class="text-center text-red-500">Error: {{ error }}</div>
  <div v-else>
    <h1 class="text-3xl font-bold mb-6 text-center text-blue-600">{{ repo.name }}</h1>
    <p class="text-gray-700">{{ repo.description }}</p>
    <router-link to="/" class="text-blue-500 underline mt-4">Go back to home</router-link>
  </div>
</template>

<script>
import { onMounted } from 'vue';
import { useFetchRepoById } from '@/composables/useFetchRepoById';

export default {
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const { repo, loading, error, fetchRepoById } = useFetchRepoById();

    onMounted(() => {
      fetchRepoById(props.id);
    });

    return {
      repo,
      loading,
      error,
    };
  },
};
</script>

<style scoped>
/* Additional styles */
</style>
