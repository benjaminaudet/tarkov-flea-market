<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  item: Object,
  loading: Boolean
})
</script>

<template>
  <n-space vertical>
    <n-card bg="black" flex >
      <template #header align-center>
        <img :src="item.iconLink" />
        <div>{{ item.name }}</div>
      </template>
      <n-tabs type="line" size="large" :tabs-padding="20" pane-style="padding: 20px;">
        <n-tab-pane name="PARKLIFE">
          PARKLIFE
        </n-tab-pane>
        <n-tab-pane name="ROCKLIFE">
          ROCKLIFE
        </n-tab-pane>
      </n-tabs>
    </n-card>
  </n-space>
</template>

<style>
</style>