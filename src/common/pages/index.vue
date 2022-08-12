<script setup lang="ts">
import { refDebounced } from '@vueuse/core'
import type { UseScrollReturn } from '@vueuse/core'
import { vScroll } from '@vueuse/components'
import colors from 'tailwindcss/colors'
import { useLoadingBar } from 'naive-ui'
import { GChart } from 'vue-google-charts'
import { GET_ITEM_HISTORICAL_PRICES, useGetItemHistoricalPricesQuery, useGetItemsQuery } from '~/common/services/useGetItems.query'

import IconAscendingSort from '~icons/bi/sort-numeric-down'
import IconDescendingSort from '~icons/bi/sort-numeric-up'

const { result, loading, error } = useGetItemsQuery()
const { load, resultHistoricalPrices } = useGetItemHistoricalPricesQuery()
const loadingBar = useLoadingBar()
loadingBar.start()

const DEFAULT_PAGE_INDEX = 20
const pageIndex = ref(DEFAULT_PAGE_INDEX)
const searchInput = ref('')
const searchInputDebounced = refDebounced(searchInput, 500) // fire finished
const searchInputDebouncedLoading = refDebounced(searchInput, 50) // fire loading
const data = ref([])
const dataToUse = ref([])
const sortDirectionAsc = ref(false)
const sortType = ref('avg24hPrice')
const scrollContainerRef = ref<HTMLElement | undefined>(undefined)
const target = scrollContainerRef.value
const globalActiveTab = ref('default')
const active = ref(false)
// const itemDetails = reactive({ name: '', historicalPrices: [] })

const onScroll = (state: UseScrollReturn) => {
  if (state.arrivedState.bottom)
    increasePageIndex()
}

// Routing
const router = useRouter()
const go = () => {
  router.push('/users/home')
}

// Internationalization
const { t } = useI18n()
const timestamp = ref(1183135260000)

const increasePageIndex = () => {
  pageIndex.value += DEFAULT_PAGE_INDEX
}

watch(searchInputDebouncedLoading, () => {
  console.log('loading')
})

watch(searchInputDebounced, () => {
  if (searchInput.value === '')
    data.value = result.value.items

  data.value = result.value.items.filter(a =>
    a.name.toLowerCase().replace(' ', '').includes(searchInput.value.toLowerCase().replace(' ', '')),
  )
  toggleSort(sortType.value)
})

watch(result, () => {
  if (result.value) {
    loadingBar.finish()
    data.value = result.value.items
    toggleSort('avg24hPrice')
  }
})

watch(resultHistoricalPrices, () => {
  if (resultHistoricalPrices.value) {
    console.log('yeah')
    itemDetails.value = { name: resultHistoricalPrices.value.item, historicalPrices: [...resultHistoricalPrices.value.item.historicalPrices.map(el => [new Date(parseInt(el.timestamp)), el.price])] }
    console.log(itemDetails.value)
  }
})

const sortByTraderToBuy = (key: string) => {
  globalActiveTab.value = 'tradersBuy'
  dataToUse.value = dataToUse.value.filter((el) => {
    return el.buyFor.find(_el => _el.vendor.name === key)
  })
  dataToUse.value = dataToUse.value.sort((a, b) => {
    const _a = a?.buyFor?.find(_el => _el?.vendor?.name === key)?.priceRUB
    const _b = b?.buyFor?.find(_el => _el?.vendor?.name === key)?.priceRUB
    return sortDirectionAsc.value ? _b - _a : _a - _b
  })
}

const sortByTraderToSell = (key: string) => {
  globalActiveTab.value = 'tradersSell'
  dataToUse.value = dataToUse.value.filter((el) => {
    return el.sellFor.find(_el => _el.vendor.name === key)
  })
  dataToUse.value = dataToUse.value.sort((a, b) => {
    const _a = a?.sellFor?.find(_el => _el?.vendor?.name === key)?.priceRUB
    const _b = b?.sellFor?.find(_el => _el?.vendor?.name === key)?.priceRUB
    return sortDirectionAsc.value ? _b - _a : _a - _b
  })
}

const sort = (key: string) => {
  globalActiveTab.value = 'default'
  dataToUse.value = dataToUse.value.sort((a, b) =>
    sortDirectionAsc.value ? b[key] - a[key] : a[key] - b[key],
  )
}

const toggleSort = (key, _, force = false) => {
  dataToUse.value = [...data.value]
  if (key === sortType.value || force) {
    sortDirectionAsc.value = !sortDirectionAsc.value
  }
  sortType.value = key
  if (['avg24hPrice', 'changeLast48h'].includes(key))
    sort(key.split(':')[0])
  else if (key.includes('sell'))
    sortByTraderToSell(key.split(':')[0])
  else if (key.includes('buy'))
    sortByTraderToBuy(key.split(':')[0])
}

const openGraph = (item) => {
  active.value = true
  load(GET_ITEM_HISTORICAL_PRICES, { id: item.id })
}

const sortOptions = [
  { label: 'Prix moyen 24h', value: 'avg24hPrice' },
  { label: 'Variation du prix dernières 48h', value: 'changeLast48h' },
  { label: 'La Toubib pour vendre', value: 'La Toubib:sell' },
  { label: 'Jaeger pour vendre', value: 'Jaeger:sell' },
  { label: 'Peacekeeper pour vendre', value: 'Peacekeeper:sell' },
  { label: 'Ragman pour vendre', value: 'Ragman:sell' },
  { label: 'Fence pour vendre', value: 'Fence:sell' },
  { label: 'Skier pour vendre', value: 'Skier:sell' },
  { label: 'Prapor pour vendre', value: 'Prapor:sell' },
  { label: 'La Toubib pour acheter', value: 'La Toubib:buy' },
  { label: 'Jaeger pour acheter', value: 'Jaeger:buy' },
  { label: 'Peacekeeper pour acheter', value: 'Peacekeeper:buy' },
  { label: 'Ragman pour acheter', value: 'Ragman:buy' },
  { label: 'Fence pour acheter', value: 'Fence:buy' },
  { label: 'Skier pour acheter', value: 'Skier:buy' },
  { label: 'Prapor pour acheter', value: 'Prapor:buy' },
]
console.log(resultHistoricalPrices.value)
</script>

<template>
  <div>
    <n-loading-bar-provider>
      <content />
    </n-loading-bar-provider>
    <div>
      <div v-if="loading">
        <div>
          <n-space vertical>
            <n-input v-model:value.lazy="searchInput" type="text" placeholder="Search..." />
            <n-grid x-gap="12" y-gap="12" cols="2">
              <n-gi>
                <n-select filterable placeholder="Choisir un filtre" :options="sortOptions" class="w-[100%]"
                  default-value="avg24hPrice" @update:value="toggleSort">
                  <template #arrow>
                    <transition name="slide-left">
                      <IconAscendingSort v-if="sortDirectionAsc" :style="`color: ${colors.teal[400]}`" />
                      <IconDescendingSort v-else :style="`color: ${colors.teal[400]}`" />
                    </transition>
                  </template>
                </n-select>
              </n-gi>
              <n-gi>
                <n-button class="w-[100%]" @click="toggleSort(sortType, null, true)">
                  {{ sortDirectionAsc ? 'Croissant' : 'Décroissant' }}
                </n-button>
              </n-gi>
            </n-grid>
            <n-grid x-gap="12" y-gap="12" cols="5 xs:1 s:1 m:1 l:2 xl:3 2xl:3 3xl:4" responsive="screen">
              <n-gi v-for="i in new Array(40)" :key="i">
                <VItemCard :loading="loading" />
              </n-gi>
            </n-grid>
            <VButton @click="increasePageIndex">
              More...
            </VButton>
          </n-space>
        </div>
      </div>
      <div v-else-if="error">
        Error: {{ error.message }}
      </div>
      <div>
        <n-space vertical>
          <n-input v-model:value.lazy="searchInput" type="text" placeholder="Search..." />
          <n-grid x-gap="12" y-gap="12" cols="2">
            <n-gi>
              <n-select filterable placeholder="Choisir un filtre" :options="sortOptions" class="w-[100%]"
                :default-value="avg24hPrice" @update:value="toggleSort">
                <template #arrow>
                  <transition name="slide-left">
                    <IconAscendingSort v-if="sortDirectionAsc" :style="`color: ${colors.teal[400]}`" />
                    <IconDescendingSort v-else :style="`color: ${colors.teal[400]}`" />
                  </transition>
                </template>
              </n-select>
            </n-gi>
            <n-gi>
              <n-button class="w-[100%]" @click="toggleSort(sortType, true)">
                {{ sortDirectionAsc ? 'Croissant' : 'Décroissant' }}
              </n-button>
            </n-gi>
          </n-grid>
          <n-back-top :listen-to="target" :bottom="220" :visibility-height="10" :style="{
            transition: 'all .3s cubic-bezier(.4, 0, .2, 1)',
          }" />
          <n-grid v-if="dataToUse" ref="" v-scroll="onScroll" class="overflow-y-scroll h-[100vh] pr-2" x-gap="12"
            y-gap="12" cols="5 xs:1 s:1 m:1 l:2 xl:3 2xl:4 3xl:4" responsive="screen">
            <n-gi v-for="item in dataToUse?.slice(0, pageIndex)" :key="item.id">
              <VItemCard :loading="loading" :item="item" :global-active-tab="globalActiveTab" :open-graph="openGraph" />
            </n-gi>
          </n-grid>
        </n-space>
        <n-drawer v-model:show="active" default-height="80vh" placement="top" resizable>
          <n-drawer-content title="Graphique prix de cette dernière semaine">
            <div class="text-white">
              <h1>{{ itemDetails.name }}</h1>
              <!-- <GChart
                type="LineChart"
                :data="[['Day', 'Price'], ...itemDetails.historicalPrices]"
                :options="{ curveType: 'function', colors: [colors.teal[400]], backgroundColor: '#18181c', hAxis: { textStyle: { color: colors.teal[400] } }, vAxis: { textStyle: { color: colors.teal[400] } } }"
              /> -->
            </div>
          </n-drawer-content>
        </n-drawer>
      </div>
    </div>
  </div>
</template>
