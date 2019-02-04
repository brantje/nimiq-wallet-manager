<template>
<div>
  <Header />
  <div class="flex-container">
    <Sidebar />
    <div class="content-container nq-style scrollbar-themed"> <!-- Scrollbar not working on firefox -->
      <router-view></router-view>
    </div>
  </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Header from "@/layout/Header.vue"
import Sidebar from "@/layout/Sidebar.vue";

export default {
  name: "app",

  data() {
    return {};
  },

  components: {
    Header,
    Sidebar
  }
};
</script>
