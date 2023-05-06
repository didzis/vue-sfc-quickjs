<script lang="ts">
export default {
  data() {
    return {
      greeting: 'Hello World!'
    }
  }
}
</script>

<template>
  <p class="greeting">{{ greeting }}</p>
</template>

<script setup lang="ts">
// variable
const msg: string = 'Hello!'

// functions
function log() {
  console.log(msg)
}
const post = await fetch(`/api/post/1`).then((r) => r.json())
</script>

<style scoped>
.greeting {
  color: red;
  font-weight: bold;
}
</style>
