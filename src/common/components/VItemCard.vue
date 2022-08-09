<script setup lang="ts">
import { computed } from 'vue'
import { useElementVisibility } from '@vueuse/core'
import _ from 'lodash'

import colors from 'tailwindcss/colors'
import IconWIP from '~icons/wpf/maintenance'

const props = defineProps({
  item: Object,
  loading: Boolean,
})

const activeTab = ref('flea')
const sellFor = ref([])
const buyFor = ref([])

if (props && props.item) {
  sellFor.value = [...props.item.sellFor]
  buyFor.value = [...props.item.buyFor]

  sellFor.value.pop()
  buyFor.value.pop()
  sellFor.value = _.orderBy(sellFor.value, 'priceRUB', 'desc')
  buyFor.value = _.orderBy(buyFor.value, 'priceRUB', 'desc')
}

const getSellForObjectByTrader = (trader) => {
  return sellFor.value.find(el => el.vendor.name === trader)
}

const getBuyForObjectByTrader = (trader) => {
  return props.item.buyFor.find(el => el.vendor.name === trader)
}

const handleChange = (tab) => {
  activeTab.value = tab
}
</script>

<template>
  <n-space v-if="!item" vertical>
    <n-card bg="black" flex>
      <template #header align-center>
        <n-skeleton height="50px" width="50px" />
        <n-skeleton text />
      </template>
      <n-tabs type="card" size="large" :tabs-padding="20" pane-style="padding: 20px;">
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
      <n-tabs :on-update:value="handleChange" type="card" size="large" :tabs-padding="20" class="mb-4">
        <n-tab name="flea" class="active:text-teal-400">
          Flea Info
        </n-tab>
        <n-tab name="traders">
          Traders Info
        </n-tab>
        <n-tab name="quests">
          Quests Info
        </n-tab>
      </n-tabs>
      <div v-if="activeTab === 'flea'">
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
      </div>
      <div v-else-if="activeTab === 'traders'">
        <n-grid x-gap="12" y-gap="12" cols="1">
          <n-gi v-for="trader in ['Prapor', 'La Toubib', 'Fence', 'Skier', 'Peacekeeper', 'Mechanic', 'Ragman', 'Jaeger']" :key="`${item.id}:${trader}`">
            <n-tag v-if="getSellForObjectByTrader(trader) || getBuyForObjectByTrader(trader)" :bordered="false" class="rounded-r-none w-[33%] text-center">
              {{ trader }}
            </n-tag>
            <n-tag v-if="getSellForObjectByTrader(trader) || getBuyForObjectByTrader(trader)" :bordered="false" type="success" class="bold rounded-l-none rounded-r-none w-[33%] text-center">
              <n-number-animation
                ref="numberAnimationInstRef"
                :duration="300" show-separator :from="0" :to="getSellForObjectByTrader(trader)?.priceRUB || 0"
              />
              ₽
            </n-tag>
            <n-tag v-if="getSellForObjectByTrader(trader) || getBuyForObjectByTrader(trader)" :bordered="false" type="warning" class="bold rounded-l-none w-[33%] text-center">
              <n-number-animation
                ref="numberAnimationInstRef"
                :duration="300" show-separator :from="0" :to="getBuyForObjectByTrader(trader)?.price"
              />
              {{ getBuyForObjectByTrader(trader)?.currency }}
            </n-tag>
          </n-gi>
        </n-grid>
      </div>
      <div v-else-if="activeTab === 'quests'">
        <IconWIP style="display:inline" />
        Work in progress
        <IconWIP style="display:inline" />
      </div>
    </n-card>
  </n-space>
</template>

<style>
</style>
