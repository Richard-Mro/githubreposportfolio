<template>
  <div class="container mx-auto p-4">
    <h2 class="text-3xl font-bold mb-6 text-blue-600">Repository Details</h2>

    <!-- Repo Detail Info -->
    <div v-if="repo" class="detail-item mb-4">
      <strong>Name:</strong>
      <!-- Name with text-blue-600 color -->
      <span class="text-blue-600">{{ repo.name }}</span>
    </div>
    <div v-if="repo" class="detail-item mb-4">
      <strong>Description:</strong>
      <span>{{ repo.description }}</span>
    </div>

    <!-- Loading or Error Messages -->
    <div v-if="loading" class="text-center text-gray-600">Loading...</div>
    <div v-if="error" class="text-center text-red-500">{{ error }}</div>

    <!-- Buttons for Editing/Deleting (Only visible for newly setup repos) -->
    <div v-if="repo && isEditable" class="mb-4">
      <button @click="showEditModal = true" class="btn btn-blue">Edit</button>
      <button @click="handleDeleteRepo" class="btn btn-danger">Delete</button>
    </div>
    <div v-else class="text-center text-gray-500">This repository cannot be edited or deleted.</div>

    <!-- Back to Home Button -->
    <div class="mt-4">
      <button @click="goBackHome" class="btn btn-blue">Back to Home</button>
    </div>

    <!-- Pagination Buttons -->
    <div v-if="totalPages > 1" class="mt-6 flex justify-center">
      <button @click="prevPage" :disabled="currentPage === 1" class="btn" :class="{ 'bg-gray-400': currentPage === 1 }">
        Previous
      </button>
      <span class="mx-4 text-gray-600">Page {{ currentPage }} of {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages" class="btn" :class="{ 'bg-gray-400': currentPage === totalPages }">
        Next
      </button>
    </div>

    <!-- Edit Modal -->
    <div v-if="showEditModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
      <div class="bg-white p-4 rounded-lg shadow-xl">
        <h3 class="text-xl font-bold mb-4">Edit Repository</h3>

        <input v-model="editedRepoName" type="text" placeholder="Repository Name" class="w-full p-2 border mb-2" />
        <textarea v-model="editedRepoDescription" placeholder="Repository Description" class="w-full p-2 border mb-4"></textarea>

        <button @click="saveEdit" class="btn btn-blue">Save</button>
        <button @click="cancelEdit" class="btn btn-danger">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';  
import { useFetchRepoById } from '../composables/useFetchRepoById';
import { useFetchRepos } from '../composables/useFetchRepos';  

const PROJECT_IDENTIFIER = '[newly-setup-repo]';  // Unique identifier for newly created repos

export default {
  setup() {
    const { repo, loading, error, fetchRepoById } = useFetchRepoById();
    const { editRepo, deleteRepo, fetchRepos, currentPage, totalPages } = useFetchRepos(); 
    const showEditModal = ref(false);
    const editedRepoName = ref('');
    const editedRepoDescription = ref('');

    const route = useRoute();   
    const router = useRouter(); 

    fetchRepoById(route.params.id); 

    // Computed property to determine if the repo can be edited/deleted
    const isEditable = computed(() => {
      return repo.value && repo.value.description && repo.value.description.includes(PROJECT_IDENTIFIER);
    });

    const saveEdit = async () => {
      if (!editedRepoName.value) {
        alert("Repository name cannot be empty.");
        return;
      }

      await editRepo(repo.value.owner.login, repo.value.name, {
        name: editedRepoName.value,
        description: editedRepoDescription.value,
      });

      router.push('/');
    };

    const cancelEdit = () => {
      showEditModal.value = false;
    };

    const handleDeleteRepo = async () => {
      if (confirm("Are you sure you want to delete this repository?")) {
        await deleteRepo(repo.value.owner.login, repo.value.name);
        router.push('/');
      }
    };

    const goBackHome = () => {
      router.push('/');  // Navigate back to the home page
    };

    // Pagination functions
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

    return {
      repo,
      loading,
      error,
      showEditModal,
      editedRepoName,
      editedRepoDescription,
      isEditable,   // Make the "editable" status available to the template
      saveEdit,
      cancelEdit,
      handleDeleteRepo,
      goBackHome,   // Method to navigate back to the home page
      currentPage,  // For pagination
      totalPages,   // For pagination
      nextPage,     // Next page function
      prevPage      // Previous page function
    };
  }
};
</script>

<style scoped>
.container {
  max-width: 800px;
  margin-top: 40px;
}
.detail-item {
  background-color: #f9fafb;
  padding: 12px;
  border-radius: 8px;
  text-align: left;
}
.btn {
  display: inline-block;
  padding: 10px 20px;
  margin: 10px;
  background-color: #3182ce;
  color: #ffffff;
  text-align: center;
  border-radius: 5px;
  text-decoration: none;
}
.btn:hover {
  background-color: #2b6cb0;
}
.btn-danger {
  background-color: #e53e3e;
}
.btn-danger:hover {
  background-color: #c53030;
}
.btn[disabled] {
  background-color: gray;
  cursor: not-allowed;
}
.fixed {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}
</style>
