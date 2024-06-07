import { ref } from "vue";
import axios from "axios";

export function useFetchRepos() {
  const repos = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const currentPage = ref(1);
  const totalPages = ref(1);
  const perPage = 6; // Number of repositories per page
  const rateLimitRemaining = ref(null);
  const rateLimitReset = ref(null);

  const fetchRepos = async (page) => {
    loading.value = true;
    error.value = null; // Reset error before making a new request
    try {
      const response = await axios.get(
        `https://api.github.com/users/Richard-Mro/repos`,
        {
          params: {
            page: page,
            per_page: perPage,
          },
          headers: {
            Authorization: `token ${import.meta.env.VITE_GITHUB_ACCESS_TOKEN}`, // Use environment variable
          },
        }
      );

      // Extract pagination information from the Link header
      const linkHeader = response.headers.link;
      if (linkHeader) {
        const links = linkHeader.split(",").reduce((acc, link) => {
          const [url, rel] = link.split(";");
          acc[rel.match(/rel="(.*)"/)[1]] = url.trim().replace(/[<>]/g, "");
          return acc;
        }, {});

        if (links.last) {
          totalPages.value = new URL(links.last).searchParams.get("page");
        } else if (links.prev && !links.next) {
          totalPages.value = currentPage.value;
        }
      }

      // Update rate limit info
      rateLimitRemaining.value = response.headers["x-ratelimit-remaining"];
      rateLimitReset.value = response.headers["x-ratelimit-reset"];

      repos.value = response.data;
      currentPage.value = page;
    } catch (err) {
      if (err.response && err.response.status === 403) {
        // Rate limit exceeded
        const resetTime = new Date(
          err.response.headers["x-ratelimit-reset"] * 1000
        );
        error.value = `Rate limit exceeded. Try again at ${resetTime.toLocaleTimeString()}.`;
      } else {
        error.value = err.message;
      }
    } finally {
      loading.value = false;
    }
  };

  return {
    repos,
    loading,
    error,
    fetchRepos,
    currentPage,
    totalPages,
    rateLimitRemaining,
    rateLimitReset,
  };
}
