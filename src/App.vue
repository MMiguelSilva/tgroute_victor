<template>
  <v-app>
    <Navbar />
    <v-main class="mx-2 mb-4 grey lighten-4">
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import Navbar from "@/components/Navbar";

export default {
  name: "App",
  components: {
    Navbar
  },

  data: () => ({
    //
  })
};
</script>

<style>
@font-face {
  font-family: "Roboto";
  src: local("Roboto"),
    url(~@/assets/fonts/Roboto-Regular.ttf) format("truetype");
}
</style>
