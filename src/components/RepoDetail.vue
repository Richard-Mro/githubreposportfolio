<template>
  <div v-if="loading" class="text-center text-gray-600">Loading...</div>
  <div v-else-if="error" class="text-center text-red-500">Error: {{ error }}</div>
  <div v-else class="container mx-auto p-6 bg-white shadow-lg rounded-lg">
    <div v-if="repo" class="text-center">
      <h1 class="text-4xl font-bold mb-4 text-blue-600">{{ repo.name }}</h1>
      <p class="text-gray-700 mb-6">{{ repo.description }}</p>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div class="detail-item">
          <strong>Owner:</strong>
          <span>{{ repo.owner.login }}</span>
        </div>
        <div class="detail-item">
          <strong>Stars:</strong>
          <span>{{ repo.stargazers_count }}</span>
        </div>
        <div class="detail-item">
          <strong>Forks:</strong>
          <span>{{ repo.forks_count }}</span>
        </div>
        <div class="detail-item">
          <strong>Open Issues:</strong>
          <span>{{ repo.open_issues_count }}</span>
        </div>
        <div class="detail-item">
          <strong>Language:</strong>
          <span>{{ repo.language }}</span>
        </div>
        <div class="detail-item">
          <strong>Created At:</strong>
          <span>{{ new Date(repo.created_at).toLocaleDateString() }}</span>
        </div>
        <div class="detail-item">
          <strong>Updated At:</strong>
          <span>{{ new Date(repo.updated_at).toLocaleDateString() }}</span>
        </div>
        <div class="detail-item">
          <strong>License:</strong>
          <span>{{ repo.license?.name || 'No license' }}</span>
        </div>
        <div class="detail-item">
          <strong>Default Branch:</strong>
          <span>{{ repo.default_branch }}</span>
        </div>
        <div class="detail-item">
          <strong>Repository URL:</strong>
          <a :href="repo.html_url" target="_blank" class="text-blue-500 underline">{{ repo.html_url }}</a>
        </div>
      </div>
      <!-- Conditionally render Edit and Delete buttons -->
      <div v-if="isNewlyCreatedRepo">
        <button @click="showEditModal = true" class="btn">Edit</button>
        <button @click="deleteRepo(repo.owner.login, repo.name)" class="btn btn-danger">Delete</button>
      </div>
      <router-link to="/" class="btn">Go back to home</router-link>
    </div>
  </div>

  <!-- Edit Modal -->
  <div v-if="showEditModal" class="fixed z-10 inset-0 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 transition-opacity" aria-hidden="true">
        <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
      </div>
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">​</span>
      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mt-3 text-center sm:mt-0 sm:text-left">
              <h3 class="text-lg leading-6 font-medium text-gray-900">Edit Repository</h3>
              <div class="mt-2">
                <input v-model="editedRepoName" id="editedRepoName" name="editedRepoName" placeholder="Repository Name" class="w-full px-4 py-2 border rounded-md">
                <textarea v-model="editedRepoDescription" id="editedRepoDescription" name="editedRepoDescription" placeholder="Description" class="w-full mt-2 px-4 py-2 border rounded-md"></textarea>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button @click="handleEditRepo(repo.owner.login, repo.name)" type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 sm:ml-3 sm:w-auto sm:text-sm">Save</button>
          <button @click="showEditModal = false" type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:w-auto sm:text-sm">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref, computed } from 'vue';
import { useFetchRepoById } from '@/composables/useFetchRepoById';
import { useFetchRepos } from '@/composables/useFetchRepos';
import { useRouter } from 'vue-router';

const PROJECT_IDENTIFIER = "[newly-setup-repo]";

export default {
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const { repo, loading, error, fetchRepoById } = useFetchRepoById();
    const { editRepo } = useFetchRepos();
    const { deleteRepo } = useFetchRepos();
    const repoData = ref(null);
    const showEditModal = ref(false);
    const editedRepoName = ref("");
    const editedRepoDescription = ref("");
    const router = useRouter();

    onMounted(async () => {
      await fetchRepoById(props.id);
      repoData.value = repo.value; // Ensure the ref value is assigned
      if (repoData.value) {
        editedRepoName.value = repoData.value.name;
        editedRepoDescription.value = repoData.value.description.replace(PROJECT_IDENTIFIER, "").trim();
      }
    });

    const handleEditRepo = async (owner, repoName) => {
      const newRepoData = {
        ...repo.value, // Preserve existing values
        name: editedRepoName.value,
        description: editedRepoDescription.value + " " + PROJECT_IDENTIFIER,
      };

      try {
        await editRepo(owner, repoName, newRepoData, () => {
          // Update repo.value after editing
          repo.value = newRepoData;
          showEditModal.value = false;
        });
      } catch (err) {
        console.error("Error updating repository:", err.message);
      }
    };

    const handleDeleteRepo = async (owner, repoName) => {
      try {
        await deleteRepo(owner, repoName, () => {
          router.push('/');
        });
      } catch (err) {
        console.error("Error deleting repository:", err.message);
      }
    };

    // Computed property to determine if the repo is newly created
    const isNewlyCreatedRepo = computed(() => {
      return repo.value && repo.value.description && repo.value.description.includes(PROJECT_IDENTIFIER);
    });

    return {
      repo: repoData,
      loading,
      error,
      editRepo: handleEditRepo,
      deleteRepo: handleDeleteRepo,
      isNewlyCreatedRepo,
      showEditModal,
      editedRepoName,
      editedRepoDescription,
    };
  },
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

.detail-item strong {
  display: block;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 4px;
}

.detail-item span,
.detail-item a {
  color: #4a5568;
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

.bg-gray-500 {
  background-color: rgba(107, 114, 128, 0.5);
}

.bg-white {
  background-color: #ffffff;
}

.rounded-lg {
  border-radius: 0.5rem;
}

.text-gray-700 {
  color: #4a5568;
}

.text-gray-900 {
  color: #1a202c;
}

.text-blue-600 {
  color: #3182ce;
}

.text-blue-500 {
  color: #3b82f6;
}

.text-red-500 {
  color: #ef4444;
}

.shadow-xl {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
</style>
