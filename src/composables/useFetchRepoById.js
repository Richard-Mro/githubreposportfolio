import { ref } from "vue";
import axios from "axios";

export function useFetchRepoById() {
  const repo = ref(null);
  const loading = ref(false);
  const error = ref(null);

  const fetchRepoById = async (id) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await axios.get(
        `https://api.github.com/repositories/${id}`
      );
      if (!response.data) {
        throw new Error("Repository not found");
      }
      repo.value = response.data;
    } catch (err) {
      error.value = err.message || "An error occurred";
    } finally {
      loading.value = false;
    }
  };

  return {
    repo,
    loading,
    error,
    fetchRepoById,
  };
}
