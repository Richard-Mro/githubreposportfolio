import { ref } from "vue";
import axios from "axios";

const PROJECT_IDENTIFIER = "[newly-setup-repo]";

export function useFetchRepos() {
  const repos = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const currentPage = ref(1);
  const totalPages = ref(1);
  const perPage = 6;
  const rateLimitRemaining = ref(null);
  const rateLimitReset = ref(null);

  const fetchRepos = async (page) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.get(
        `https://api.github.com/users/Richard-Mro/repos`,
        {
          params: {
            page: page,
            per_page: perPage,
          },
          headers: {
            Authorization: `token ${import.meta.env.VITE_GITHUB_ACCESS_TOKEN}`,
          },
        }
      );

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

      rateLimitRemaining.value = response.headers["x-ratelimit-remaining"];
      rateLimitReset.value = response.headers["x-ratelimit-reset"];

      repos.value = response.data;
      currentPage.value = page;
    } catch (err) {
      if (err.response && err.response.status === 403) {
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

  const createRepo = async (repoData) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.post(
        `https://api.github.com/user/repos`,
        {
          ...repoData,
          description: `${
            repoData.description ||
            "This is a newly created repository and only this ones can be edited or deleted from the list of repositories"
          } ${PROJECT_IDENTIFIER}`,
        },
        {
          headers: {
            Authorization: `token ${import.meta.env.VITE_GITHUB_ACCESS_TOKEN}`,
          },
        }
      );
      repos.value.unshift(response.data);
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  const editRepo = async (owner, repoName, newRepoData, callback) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.patch(
        `https://api.github.com/repos/${owner}/${repoName}`,
        newRepoData,
        {
          headers: {
            Authorization: `token ${import.meta.env.VITE_GITHUB_ACCESS_TOKEN}`,
          },
        }
      );
      const index = repos.value.findIndex((repo) => repo.name === repoName);
      if (index !== -1) {
        repos.value[index] = response.data;
      }
      if (callback) callback(response.data); // Pass updated repo data to callback
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  const deleteRepo = async (owner, repoName, callback) => {
    loading.value = true;
    error.value = null;
    try {
      await axios.delete(`https://api.github.com/repos/${owner}/${repoName}`, {
        headers: {
          Authorization: `token ${import.meta.env.VITE_GITHUB_ACCESS_TOKEN}`,
        },
      });
      repos.value = repos.value.filter((repo) => repo.name !== repoName);
      if (callback) callback(); // Call the callback after deletion
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
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
    rateLimitRemaining,
    rateLimitReset,
  };
}
