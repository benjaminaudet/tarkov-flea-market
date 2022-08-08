<script setup lang="ts">
import { computed } from 'vue'
import { useElementVisibility } from '@vueuse/core'
import _ from 'lodash'

import IconWIP from '~icons/wpf/maintenance'

const props = defineProps({
  item: Object,
  loading: Boolean,
})

const sellFor = ref([])

if (props && props.item) {
  sellFor.value = [...props.item.sellFor]
  sellFor.value.pop()
  sellFor.value = _.orderBy(sellFor.value, 'priceRUB', 'desc')
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
        <n-tab-pane name="Price Info">
          <n-skeleton text />
          <n-skeleton text />
        </n-tab-pane>
        <n-tab-pane name="General Info">
          <n-skeleton text />
          <n-skeleton text />
          <n-skeleton text />
        </n-tab-pane>
        <n-tab-pane name="Quests Info">
          <n-skeleton text />
          <n-skeleton text />
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
      <n-tabs type="segment" size="small" :tabs-padding="20" pane-style="padding: 20px;">
        <n-tab-pane name="Flea Info">
          <n-grid x-gap="12" y-gap="12" cols="1">
            <n-gi class="text-left">
              <n-tag :bordered="false" class="rounded-r-none w-[50%]">
                Prix moyen 24h
              </n-tag>
              <n-tag :bordered="false" type="success" class="bold rounded-l-none w-[50%]">
                <n-number-animation
                  ref="numberAnimationInstRef"
                  :duration="300" show-separator :from="0" :to="item.avg24hPrice"
                />
                ₽
              </n-tag>
            </n-gi>
          </n-grid>
          <n-tag :bordered="false" class="rounded-r-none  w-[50%]">
            Variation prix 48h
          </n-tag>
          <n-tag :bordered="false" type="success" class="bold rounded-l-none w-[50%]">
            <n-number-animation
              ref="numberAnimationInstRef"
              :duration="300" show-separator :from="0" :to="item.changeLast48h"
            />
            ₽
          </n-tag>
          <VButton>
            <a :href="item.wikiLink" target="_blank">Page Wiki</a>
          </VButton>
        </n-tab-pane>
        <n-tab-pane name="Traders Info">
          <n-grid x-gap="12" y-gap="12" cols="1">
            <n-gi v-for="trader in sellFor" :key="`${item.id}:${trader?.vendor?.name}`" class="text-left">
              <n-tag :bordered="false" class="rounded-r-none w-[50%]">
                {{ trader?.vendor?.name }}
              </n-tag>
              <n-tag :bordered="false" type="success" class="bold rounded-l-none w-[50%]">
                <n-number-animation
                  ref="numberAnimationInstRef"
                  :duration="300" show-separator :from="0" :to="trader?.priceRUB"
                />
                ₽
              </n-tag>
            </n-gi>
          </n-grid>
        </n-tab-pane>
        <n-tab-pane name="Quests Info">
          <IconWIP style="display:inline" />
          Work in progress
          <IconWIP style="display:inline" />
        </n-tab-pane>
      </n-tabs>
    </n-card>
  </n-space>
</template>

<style>
</style>
