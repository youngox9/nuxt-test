<!-- Please remove this file from your project -->
<template>
  <div>
    <div class="loading" v-if="isLoading"></div>

    <div class="navbar">
      <ul class="nav">
        <li v-for="(item, index) in menuList" :index="index">
          <nuxt-link :to="item.path">{{ item.label }}</nuxt-link>
        </li>
      </ul>
      <div class="profile">{{ profile.username }}</div>
    </div>
    <div class="container">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import "@/styles/style.scss";

export default {
  props: ["auth"],
  computed: {
    isLoading() {
      return this.$store.state.global.isLoading;
    },
    profile() {
      return this.$store.state.global.profile;
    },
  },
  data() {
    return {
      isLogin: false,
      activeIndex: "1",
      activeIndex2: "1",
      menuList: [
        { label: "5PACKAGE", path: "5PACKAGE" },
        // { label: "CSFT335", path: "CSFT335" },
        // { label: "001", path: "001" },
      ],
    };
  },
  mounted() {
    if (this.auth) {
      const profile = this.getProfile() || {};
      const { accessToken = "" } = profile;
      if (accessToken) {
        this.isLogin = true;
        this.$store.commit("global/setProfile", profile);
      } else {
        this.isLogin = false;
        this.$router.push({ name: "index" });
      }
    }
  },
  methods: {
    getProfile() {
      try {
        return JSON.parse(localStorage.getItem("auth"));
      } catch (e) {}
      return {};
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
  },
};
</script>
