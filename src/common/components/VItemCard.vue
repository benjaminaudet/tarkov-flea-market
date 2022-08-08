<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  item: Object,
  loading: Boolean,
})

function numberWithCommas(x) {
  return x?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
</script>

<template>
  <n-space v-if="!item" vertical>
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
  <n-space v-else vertical>
    <n-card bg="black">
      <template #header>
        <img :src="item.gridImageLink" class="object-scale-down h-[20vh]">

        <div class="h-10 text-center">
          {{ item.name }}
        </div>
      </template>
      <n-tabs type="line" size="small" :tabs-padding="20" pane-style="padding: 20px;">
        <n-tab-pane name="Price Stats">
          <n-space>
            <div>
              <n-space>
                <n-tag :bordered="false">
                  Prix Moyen 24h
                </n-tag>
                <n-tag :bordered="false" type="success" class="bold">
                  {{ numberWithCommas(item.avg24hPrice) }}₽
                </n-tag>
              </n-space>
            </div>
            <div>
              <n-space>
                <n-tag :bordered="false">
                  Variation Prix Moyen vs 48h
                </n-tag>
                <n-tag :bordered="false" type="success" class="bold">
                  {{ numberWithCommas(item.changeLast48h) }}₽
                </n-tag>
              </n-space>
            </div>
          </n-space>
          <VButton>
            <a :href="item.wikiLink" target="_blank">Page Wiki</a>
          </VButton>
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
