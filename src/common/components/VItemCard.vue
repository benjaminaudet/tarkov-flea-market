<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  item: Object,
  loading: Boolean
})
</script>

<template>
  <n-space vertical v-if="!item">
    <n-card bg="black" flex>
      <template #header align-center>
        <n-skeleton height="50px" width="50px" />
        <n-skeleton text />
      </template>
      <n-tabs type="line" size="small" :tabs-padding="20" pane-style="padding: 20px;">
        <n-tab-pane name="Price Stats">
          <n-skeleton text />
        </n-tab-pane>
        <n-tab-pane name="General Stats">
          <n-skeleton text />
        </n-tab-pane>
      </n-tabs>
    </n-card>
  </n-space>
  <n-space vertical v-else>
    <n-card bg="black">
      <template #header>
        <img :src="item.iconLink" class="m-2/4" />
        <div class="h-10 text-left">{{ item.name }}</div>
      </template>
      <n-tabs type="line" size="small" :tabs-padding="20" pane-style="padding: 20px;">
        <n-tab-pane name="Price Stats">
          Average Price 24h : {{ item.avg24hPrice }} roubles
          <VButton><a :href="item.wikiLink" target="_blank">Wiki Page</a></VButton>
        </n-tab-pane>
        <n-tab-pane name="General Stats">
          ROCKLIFE
        </n-tab-pane>
      </n-tabs>
    </n-card>
  </n-space>
</template>

<style>
</style>