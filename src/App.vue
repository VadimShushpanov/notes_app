<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
body {
  background: #ededed;
}
#app {
  max-width: 810px;
  margin: 0 auto;
}
form input {
  padding-left: 10px;
}
button {
  cursor: pointer;
}
</style>
