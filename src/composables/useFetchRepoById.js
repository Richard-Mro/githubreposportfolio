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
        `https://api.github.com/repos/Richard-Mro/${id}`
      );
      repo.value = response.data;
    } catch (error) {
      error.value = error.message;
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
