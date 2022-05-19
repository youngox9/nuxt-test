import { resolve } from "path";

const isDev = process.env.NODE_ENV !== "production";
export default {
  srcDir: "src/",
  // Target: https://go.nuxtjs.dev/config-target
  target: "static",
  // mode: "spa",
  generate: {
    dir: "./dist",
  },
  rootDir: ".",
  router: {
    base: "./",
  },
  build: {
    quiet: false,
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  // ...(isDev
  //   ? {}
  //   : {
  //       router: {
  //         base: "./",
  //       },
  //     }),
  // build: {
  //   publicPath: "./",
  // },
  head: {
    title: "nuxt-test",
    htmlAttrs: {
      lang: "zh-tw",
    },
    meta: [
      // { "http-equiv": "Content-Type", content: "text/html; charset=UTF-8" },
      // {
      //   "http-equiv": "Content-Security-Policy",
      //   content: "upgrade-insecure-requests",
      // },
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" },
      { name: "format-detection", content: "telephone=no" },
      {},
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ["element-ui/lib/theme-chalk/index.css"],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: ["@/plugins/element-ui"],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: ["@nuxtjs/style-resources"],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: ["portal-vue/nuxt"],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: [/^element-ui/],
  },
  alias: {
    "@": resolve(__dirname, "./src"),
  },
};
