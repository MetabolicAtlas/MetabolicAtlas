const data = {
  repositories: [],
  loading: false,
  error: '',
  count: 0,
};

const actions = {
  async fetchRepositories({ commit }) {
    commit('setLoading', true);
    commit('setError', '');
    const baseUrl = 'https://metabolicatlas.github.io/standard-GEM-validation';
    const indexUrl = `${baseUrl}/index.json`;
    try {
      const index = await fetch(indexUrl).then(r => r.json());
      const repoEntries = Object.entries(index).flatMap(([provider, repos]) =>
        repos.map(repoKey => ({ provider, repoKey })),
      );
      const repos = await Promise.all(
        repoEntries.map(async ({ provider, repoKey }) => {
          try {
            const i = repoKey.lastIndexOf("/");
            const [organization, repoName] = [repoKey.slice(0, i), repoKey.slice(i + 1)];
            const resultsUrl = `${baseUrl}/results/${repoName}.json`;
            const response = await fetch(resultsUrl);
            if (!response.ok) return null;
            const json = await response.json();
            const repoData = json[repoName] || json[repoKey];
            if (!repoData) return null;
            const metadata = repoData.metadata || {};
            const lastUpdated = metadata.latest_commit_date
              ? metadata.latest_commit_date.split('T')[0]
              : 'Unknown';
            const image = metadata.avatar
              ? `${baseUrl}/avatars/${metadata.avatar}`
              : 'https://placehold.co/48x48';
            const commits = Number(metadata.commits) || "n/a";
            const contributors = Number(metadata.contributors) || "n/a";
            let version = 'n/a';
            let releaseUrl = null;
            if (Array.isArray(repoData.releases) && repoData.releases.length > 1) {
              const first = repoData.releases[1];
              const [entryVersion] = Object.keys(first);
              version = entryVersion;
              releaseUrl =
                provider === 'gitlab'
                  ? `https://gitlab.com/${repoKey}/-/releases/${version}`
                  : `https://github.com/${repoKey}/releases/tag/${version}`;
            }
            const orgUrl =
              provider === 'gitlab'
                ? `https://gitlab.com/${organization}`
                : `https://github.com/${organization}`;
            const repoUrl =
              provider === 'gitlab'
                ? `https://gitlab.com/${repoKey}`
                : `https://github.com/${repoKey}`;
            return {
              name: repoName,
              organization,
              version,
              lastUpdated,
              commits,
              contributors,
              image,
              releaseUrl,
              provider,
              repoUrl,
              orgUrl,
            };
          } catch {
            commit('setError', "Could not load data on all GEM repositories. Please try again later.");
            return null;
          }
        }),
      );
      const validRepos = repos.filter(Boolean);
      commit('setCount', repoEntries.length);
      commit('setRepositories', validRepos);
    } catch {
      commit('setError', "Could not load data on all GEM repositories. Please try again later.");
    } finally {
      commit('setLoading', false);
    }
  },
};

const mutations = {
  setRepositories: (state, repositories) => {
    state.repositories = [...repositories].sort((a, b) => b.commits - a.commits);
  },
  setLoading: (state, loading) => {
    state.loading = loading;
  },
  setError: (state, error) => {
    state.error = error;
  },
  setCount: (state, count) => {
    state.count = count;
  },
};

export default {
  namespaced: true,
  state: data,
  actions,
  mutations,
};
