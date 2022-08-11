<script setup lang="ts">
import { computed } from 'vue'
import { useElementVisibility } from '@vueuse/core'
import _ from 'lodash'

import colors from 'tailwindcss/colors'
import { GChart } from 'vue-google-charts'
import IconWIP from '~icons/wpf/maintenance'
const props = defineProps({
  item: Object,
  loading: Boolean,
  globalActiveTab: String,
})

const DEFAULT_TAB_ACTIVE = 'flea'
const activeTab = ref(DEFAULT_TAB_ACTIVE)
const sellFor = ref([])
const buyFor = ref([])
const active = ref(false)
const historicalPrices = ref([])

if (props?.item) {
  sellFor.value = [...props.item.sellFor]
  buyFor.value = [...props.item.buyFor]

  sellFor.value = sellFor.value.filter(el => el?.vendor?.name !== 'Marché')
  buyFor.value = buyFor.value.filter(el => el?.vendor?.name !== 'Marché')
  sellFor.value = _.orderBy(sellFor.value, 'priceRUB', 'desc')
  buyFor.value = _.orderBy(buyFor.value, 'priceRUB', 'desc')

  // historicalPrices.value = props.item.historicalPrices.map(el => [(new Date(el.timestamp).getDay()), el.price])
  historicalPrices.value = props.item.historicalPrices.map(el => [new Date(parseInt(el.timestamp)), el.price])
}

if (props?.globalActiveTab !== 'default')
  activeTab.value = props?.globalActiveTab
else
  activeTab.value = DEFAULT_TAB_ACTIVE

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
      <n-tabs type="segment" size="large" :tabs-padding="20" pane-style="padding: 20px;">
        <n-tab-pane name="Price Info">
          <n-skeleton text />
          <n-skeleton text />
        </n-tab-pane>
        <n-tab-pane name="Traders vendre">
          <n-skeleton text />
          <n-skeleton text />
          <n-skeleton text />
        </n-tab-pane>
        <n-tab-pane name="Traders acheter">
          <n-skeleton text />
          <n-skeleton text />
          <n-skeleton text />
        </n-tab-pane>
        <n-tab-pane name="Graphique">
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
      <n-tabs :on-update:value="handleChange" :value="activeTab" type="segment" size="small" :tabs-padding="20" class="mb-4">
        <n-tab name="flea" class="active:text-teal-400">
          Flea Info
        </n-tab>
        <n-tab name="tradersSell">
          Traders vendre
        </n-tab>
        <n-tab name="tradersBuy" :disabled="buyFor.length < 1">
          Traders acheter
        </n-tab>
        <n-tab name="graph">
          Graphique
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
        <VButton :disabled="true" @click="active = !active">
          <a>Details</a>
        </VButton>
      </div>
      <div v-else-if="activeTab === 'tradersSell'">
        <n-grid x-gap="12" y-gap="12" cols="1">
          <n-gi v-for="trader in sellFor" :key="`${item.id}:${trader}`">
            <n-tag :bordered="false" class="rounded-r-none w-[50%] text-center">
              {{ trader?.vendor?.name }}
            </n-tag>
            <n-tag :bordered="false" type="success" class="bold rounded-l-none rounded-r-none w-[50%] text-center">
              <n-number-animation
                ref="numberAnimationInstRef"
                :duration="300" show-separator :from="0" :to="trader?.priceRUB || 0"
              />
              {{ trader?.currency }}
            </n-tag>
          </n-gi>
        </n-grid>
      </div>
      <div v-else-if="activeTab === 'tradersBuy'">
        <n-grid x-gap="12" y-gap="12" cols="1">
          <n-gi v-for="trader in buyFor" :key="`${item.id}:${trader}`">
            <n-tag :bordered="false" class="rounded-r-none w-[50%] text-center">
              {{ trader?.vendor?.name }}
            </n-tag>
            <n-tag :bordered="false" type="warning" class="bold rounded-l-none w-[50%] text-center">
              <n-number-animation
                ref="numberAnimationInstRef"
                :duration="300" show-separator :from="0" :to="trader?.price"
              />
              {{ trader?.currency }}
            </n-tag>
          </n-gi>
        </n-grid>
      </div>
      <div v-else-if="activeTab === 'graph'" class="text-white">
        <GChart
          type="LineChart"
          :data="[['Day', 'Price'], ...historicalPrices]"
          :options="{ curveType: 'function', colors: ['#fff'], backgroundColor: '#18181c', hAxis: { textStyle: { color: '#ffffff' } }, vAxis: { textStyle: { color: '#ffffff' } } }"
        />
      </div>
    </n-card>
  </n-space>
  <n-drawer
    v-model:show="active"
    default-height="80vh"
    placement="top"
    resizable
  >
    <n-drawer-content title="Stoner">
      Stoner is a 1965 novel by the American writer John Williams.
    </n-drawer-content>
  </n-drawer>
</template>

<style>
</style>
