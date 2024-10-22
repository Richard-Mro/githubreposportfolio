<template>
  <ErrorBoundary>
    <div class="container mx-auto p-4">
      <img src="/pro.jpg" alt="My Image" class="w-40 h-30 rounded-full mb-6 mx-auto" />
      <h2 class="text-3xl font-bold mb-6 text-center text-blue-600">My Repositories</h2>

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
        <select v-model="selectedLanguage" class="w-full p-2 border border-gray-300 rounded">
          <option value="">All Languages</option>
          <option v-for="language in languages" :key="language" :value="language">
            {{ language }}
          </option>
        </select>
      </div>

      <!-- Create Repository -->
      <div class="mb-4">
        <h3 class="text-xl font-bold mb-2 text-blue-500">Create New Repository</h3>
        <input
          v-model="newRepoName"
          type="text"
          placeholder="Repository Name"
          class="w-full p-2 border border-gray-300 rounded mb-2"
        />
        <button @click="handleCreateRepo" class="bg-blue-500 text-white px-4 py-2 rounded">
          Create Repository
        </button>
      </div>

      <!-- Loading or Error Messages -->
      <div v-if="loading" class="text-center text-gray-600">Loading...</div>
      <div v-else-if="error" class="text-center text-red-500">
        <p>Error: {{ error.message }}</p>
        <button @click="resetError">Try Again</button>
      </div>

      <!-- Repository List -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <router-link
          v-for="repo in filteredRepos"
          :key="repo.id"
          :to="{ name: 'RepoDetail', params: { id: repo.id } }"
          class="bg-white rounded-lg shadow p-6 block"
        >
          <!-- Repo Name with Blue Color -->
          <h3 class="text-lg font-bold text-blue-600">{{ repo.name }}</h3>
          <p>{{ repo.description || 'No description available' }}</p>
        </router-link>
      </div>

      <!-- Pagination Buttons -->
      <div class="flex justify-between items-center mt-6">
        <button 
          @click="prevPage" 
          :disabled="currentPage === 1" 
          class="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Previous
        </button>

        <span>Page {{ currentPage }} of {{ totalPages }}</span>

        <button 
          @click="nextPage" 
          :disabled="currentPage === totalPages" 
          class="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  </ErrorBoundary>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useFetchRepos } from '../composables/useFetchRepos'; // Assuming this handles the API calls

export default {
  setup() {
    const { repos, loading, error, fetchRepos, createRepo, currentPage, totalPages } = useFetchRepos();

    const searchQuery = ref('');
    const selectedLanguage = ref('');
    const newRepoName = ref('');

    // Define the languages for filtering
    const languages = ref(['JavaScript', 'Python', 'Java']);  // Add more languages as needed

    // Computed property for filtering repositories based on searchQuery and selectedLanguage
    const filteredRepos = computed(() => {
      return repos.value.filter(repo => {
        const matchesSearch = repo.name.toLowerCase().includes(searchQuery.value.toLowerCase());
        const matchesLanguage = !selectedLanguage.value || repo.language === selectedLanguage.value;
        return matchesSearch && matchesLanguage;
      });
    });

    const handleCreateRepo = () => {
      if (!newRepoName.value) {
        alert("Repository name cannot be empty.");
        return;
      }
      createRepo({ name: newRepoName.value });
      newRepoName.value = ''; // Clear input field after creation
    };

    const resetError = () => {
      error.value = null;
    };

    // Pagination controls
    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        fetchRepos(currentPage.value + 1);
      }
    };

    const prevPage = () => {
      if (currentPage.value > 1) {
        fetchRepos(currentPage.value - 1);
      }
    };

    onMounted(() => {
      fetchRepos(1);  // Fetch repositories on component mount
    });

    return {
      repos,
      loading,
      error,
      searchQuery,
      selectedLanguage,
      newRepoName,
      filteredRepos,
      languages,  // Make sure this is available for the language filter dropdown
      handleCreateRepo,
      resetError,
      currentPage,
      totalPages,
      nextPage,
      prevPage,
    };
  }
};
</script>

<style scoped>
.container {
  max-width: 800px;
  margin-top: 40px;
}
.bg-blue-500:hover {
  background-color: #3b82f6;
}
.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
