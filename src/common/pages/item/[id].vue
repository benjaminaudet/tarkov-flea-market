<script setup lang="ts">

const router = useRouter();

const props = defineProps({
  id: String,
})
console.log(props)
</script>

<template>
  <div>
    <n-loading-bar-provider />
  </div>
  <router-link to="/">back</router-link>
</template>
