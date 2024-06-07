<template>
  <div class="container mx-auto p-4">
    <img
      src="/pro.jpg"
      alt="My Image"
      class="w-40 h-30 rounded-full mb-6 mx-auto"
    />
    <h2 class="text-3xl font-bold mb-6 text-center text-blue-600">
      My Repositories
    </h2>

    <!-- Search Input Field -->
    <div class="mb-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search Repositories..."
        class="w-full p-2 border border-gray-300 rounded"
      />
    </div>

    <!-- Filter Input Field -->
    <div class="mb-4">
      <select
        v-model="selectedLanguage"
        class="w-full p-2 border border-gray-300 rounded"
      >
        <option value="">All Languages</option>
        <option v-for="language in languages" :key="language" :value="language">
          {{ language }}
        </option>
      </select>
    </div>

    <div v-if="loading" class="text-center text-gray-600">Loading...</div>
    <div v-else-if="error" class="text-center text-red-500">
      Error: {{ error }}
    </div>
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      <div
        v-for="repo in filteredRepos"
        :key="repo.id"
        class="bg-white rounded-lg shadow p-6"
      >
        <h3 class="text-xl font-bold mb-2 text-blue-500">{{ repo.name }}</h3>
        <p class="text-gray-700">{{ repo.description }}</p>
      </div>
    </div>

    <!-- Pagination Controls -->
    <div class="flex justify-center mt-6">
      <button
        @click="fetchRepos(currentPage - 1)"
        :disabled="currentPage <= 1"
        class="bg-gray-500 text-white px-4 py-2 rounded mr-2"
      >
        Previous
      </button>
      <span class="px-4 py-2">{{ currentPage }} / {{ totalPages }}</span>
      <button
        @click="fetchRepos(currentPage + 1)"
        :disabled="currentPage >= totalPages"
        class="bg-gray-500 text-white px-4 py-2 rounded ml-2"
      >
        Next
      </button>
       </div>
    <div class="text-center mt-6" v-if="rateLimitRemaining !== null">
      <p>Rate Limit Remaining: {{ rateLimitRemaining }}</p>
      <p>
        Rate Limit Resets At:
        {{ new Date(rateLimitReset * 1000).toLocaleTimeString() }}
      </p>
    </div>    
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useFetchRepos } from "@/composables/useFetchRepos";

export default {
  setup() {
    const {
      repos,
      loading,
      error,
      fetchRepos,
      currentPage,
      totalPages,
      rateLimitRemaining,
      rateLimitReset,
    } = useFetchRepos();
    const searchQuery = ref("");
    const selectedLanguage = ref("");

    const languages = computed(() => {
      // Extract unique languages from repositories
      const allLanguages = repos.value.map((repo) => repo.language);
      return [...new Set(allLanguages.filter(Boolean))]; // Filter out null/undefined and get unique values
    });

    onMounted(() => {
      fetchRepos(1);
    });

    const filteredRepos = computed(() => {
      return repos.value.filter((repo) => {
        // Check if repository name or description contains search query
        const matchSearch =
          repo.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          (repo.description &&
            repo.description
              .toLowerCase()
              .includes(searchQuery.value.toLowerCase()));

        // Check if repository matches selected language (if any)
        const matchLanguage = selectedLanguage.value
          ? repo.language === selectedLanguage.value
          : true;

        return matchSearch && matchLanguage;
      });
    });

    return {
      repos,
      loading,
      error,
      fetchRepos,
      currentPage,
      totalPages,
      searchQuery,
      selectedLanguage,
      languages,
      filteredRepos,
      rateLimitRemaining,
      rateLimitReset,
    };
  },
};
</script>

<style scoped>
/* Additional styles */
</style>
