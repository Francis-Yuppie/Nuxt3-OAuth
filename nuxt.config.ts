// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: ['nuxt-icon', '@sidebase/nuxt-auth'],
  runtimeConfig:{
    authSecret: '',
    gitHubId: '',
    gitHubSecret: '',
    googleId: '',
    googleScret: '',
    authOrigin: '',
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
})