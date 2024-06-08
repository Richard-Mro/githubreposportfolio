<template>
  <ErrorBoundary>
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
          <div v-if="repo.description && repo.description.includes(PROJECT_IDENTIFIER)">
            <button @click="editRepository(repo)" class="bg-yellow-500 text-white px-4 py-2 rounded mt-2">
              Edit
            </button>
            <button @click="deleteRepository(repo)" class="bg-red-500 text-white px-4 py-2 rounded mt-2 ml-2">
              Delete
            </button>
          </div>
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

      <div class="mb-4 text-center">
        <button @click="testError" class="bg-red-500 text-white px-4 py-2 rounded">
          Test Error Boundary
        </button>
      </div>

      <!-- Button to test 404 page -->
      <div class="text-center mt-6">
        <router-link to="/non-existent-page">
          <button class="bg-red-500 text-white px-4 py-2 rounded">
            Test 404 Page
          </button>
        </router-link>
      </div>
    </div>
  </ErrorBoundary>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useFetchRepos } from "@/composables/useFetchRepos";
import ErrorBoundary from "@/components/ErrorBoundary.vue";

const PROJECT_IDENTIFIER = "[my-vue-project]";

export default {
  components: {
    ErrorBoundary,
  },
  setup() {
    const {
      repos,
      loading,
      error,
      fetchRepos,
      createRepo,
      editRepo,
      deleteRepo,
      currentPage,
      totalPages,
      rateLimitRemaining,
      rateLimitReset,
    } = useFetchRepos();
    const searchQuery = ref("");
    const selectedLanguage = ref("");
    const newRepoName = ref("");
    const editRepoName = ref("");
    const deleteRepoName = ref("");

    const languages = computed(() => {
      const allLanguages = repos.value.map((repo) => repo.language);
      return [...new Set(allLanguages.filter(Boolean))];
    });

    onMounted(() => {
      fetchRepos(1);
    });

    const filteredRepos = computed(() => {
      return repos.value.filter((repo) => {
        const matchSearch =
          repo.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          (repo.description &&
            repo.description
              .toLowerCase()
              .includes(searchQuery.value.toLowerCase()));

        const matchLanguage = selectedLanguage.value
          ? repo.language === selectedLanguage.value
          : true;

        return matchSearch && matchLanguage;
      });
    });

    const handleCreateRepo = async () => {
      if (newRepoName.value) {
        await createRepo({ name: newRepoName.value });
        newRepoName.value = "";
        fetchRepos(currentPage.value);
      }
    };

    const handleEditRepo = async () => {
      if (editRepoName.value && newRepoName.value) {
        await editRepo(editRepoName.value, { name: newRepoName.value });
        editRepoName.value = "";
        newRepoName.value = "";
        fetchRepos(currentPage.value);
      }
    };

    const handleDeleteRepo = async () => {
      if (deleteRepoName.value) {
        await deleteRepo(deleteRepoName.value);
        deleteRepoName.value = "";
        fetchRepos(currentPage.value);
      }
    };

    const editRepository = (repo) => {
      editRepoName.value = repo.name;
      newRepoName.value = prompt("Enter new name for the repository:", repo.name);
      if (newRepoName.value) {
        handleEditRepo();
      }
    };

    const deleteRepository = (repo) => {
      if (confirm(`Are you sure you want to delete the repository "${repo.name}"?`)) {
        deleteRepoName.value = repo.name;
        handleDeleteRepo();
      }
    };

    const testError = () => {
      try {
        throw new Error("This is a test error");
      } catch (error) {
        console.error("Test error:", error);
        throw error; // Re-throw the error to propagate it to the error boundary
      }
    };

    return {
      repos,
      loading,
      error,
      fetchRepos,
      createRepo,
      editRepo,
      deleteRepo,
      currentPage,
      totalPages,
      searchQuery,
      selectedLanguage,
      newRepoName,
      editRepoName,
      deleteRepoName,
      languages,
      filteredRepos,
      rateLimitRemaining,
      rateLimitReset,
      handleCreateRepo,
      handleEditRepo,
      handleDeleteRepo,
      editRepository,
      deleteRepository,
      testError,
      PROJECT_IDENTIFIER,
    };
  },
};
</script>

<style scoped>
/* Additional styles */
</style>
