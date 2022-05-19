export const state = () => ({
  isLoading: false,
  profile: {
    // a: localStorage.getItem("a"),
    accessToken: "",
    email: "",
    id: "",
    roles: [],
    username: "",
  },
});

export const mutations = {
  setProfile(state, profile) {
    state.profile = profile;
    const jsonStr = JSON.stringify(profile);
    window.localStorage.setItem("auth", jsonStr);
  },
  setIsLoading(state, isLoading) {
    state.isLoading = isLoading;
  },
};

export const getters = {
  getProfile(state) {
    return state.profile;
  },
};
