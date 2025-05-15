import tailwindcss from "@tailwindcss/vite";
import Lara from "@primeuix/themes/lara";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  
  app:{
    head:{
      title:"Auto Generated Caption",
      htmlAttrs:{
        lang:"en"
      },
    },
  },
  modules:[
    '@primevue/nuxt-module',
  ],
  primevue:{
    options:{
      theme:{
        preset: Lara
      }
    }
  },
 
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  css:['@/assets/css/main.css'],
  vite:{
    plugins:[
      tailwindcss(),
    ]
  }
})
