<template>
  <div id="app-container">
    <router-view />
  </div>
</template>

<script setup lang="ts">
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body, #app, #app-container {
  height: 100%;
  width: 100%;
  overflow: hidden;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
    'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
    'Noto Color Emoji';
}

html.dark body {
  background-color: #141414;
  color: rgba(255, 255, 255, 0.85);
}
</style>
