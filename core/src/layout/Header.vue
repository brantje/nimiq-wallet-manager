<template>
  <header id="top" class="nq-blue-bg">
    <router-link to="/login"><h1 class="nq-h1 pull-left">Nimiq Wallet Manager</h1></router-link>
    <!-- {% if user %} -->
    <ul v-if="user" class="nav pull-right">
      <li>
        <a class="nq-icon settings" href="#"></a>
      </li>
    </ul>
    <!-- {% endif %} -->
    <div class="clearfix"></div>
  </header>
</template>

<script>
export default {
  data() {
    return {
        user: false, // var for if
    };
  }
};
</script>

<style>
  header .nq-h1{
    color: #fff;
  }
</style>
