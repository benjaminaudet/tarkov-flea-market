<script setup lang="ts">
import { refDebounced } from '@vueuse/core'
import type { UseScrollReturn } from '@vueuse/core'
import { vScroll } from '@vueuse/components'
import colors from 'tailwindcss/colors'
import { useLoadingBar } from 'naive-ui'
import { GChart } from 'vue-google-charts'
import { GET_ITEM_HISTORICAL_PRICES_BY_ID, useGetItemHistoricalPricesQuery, useGetItemsCategoriesQuery, useGetItemsQuery } from '~/common/services/useGetItems.query'

import IconAscendingSort from '~icons/bi/sort-numeric-down'
import IconDescendingSort from '~icons/bi/sort-numeric-up'

const { t, locale, availableLocales } = useI18n()

let lang = 'en'
const router = useRouter()
if (router.currentRoute.value.fullPath === '/') {
  router.push('/en')
}
else {
  ['cz', 'de', 'en', 'es', 'fr', 'hu', 'ru', 'tr', 'zh'].forEach((path) => {
    if (router.currentRoute.value.fullPath.startsWith(`/${path}`))
      lang = router.currentRoute.value.fullPath.replace('/', '')
  })
}
locale.value = lang

const { result, loading, error } = useGetItemsQuery(lang)
const { resultItemsCategories } = useGetItemsCategoriesQuery(lang)
const { load, resultHistoricalPrices } = useGetItemHistoricalPricesQuery()

const loadingBar = useLoadingBar()
loadingBar.start()

const DEFAULT_PAGE_INDEX = 8
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
const itemDetails = ref({})
const itemDetailsHistoricalPrices = ref([])
const filterButtons = ref([])
const selectedCategory = ref('')

watch(searchInputDebouncedLoading, () => {
  loadingBar.start()
})

watch(searchInputDebounced, () => {
  if (searchInput.value === '') {
    data.value = result.value.items
  }
  else {
    data.value = result.value.items.filter(a =>
      a.name.toLowerCase().replace(' ', '').replace('-', '').includes(searchInput.value.toLowerCase().replace(' ', '').replace('-', '')),
    )
  }
  loadingBar.finish()
  toggleSort(sortType.value, null, false)
})

const watchSafe = (toWatch: ref<any>, cb: Function) => {
  watch(toWatch, () => {
    if (!toWatch.value)
      return
    cb()
  })
}

watchSafe(result, () => {
  loadingBar.finish()
  data.value = result.value.items
  toggleSort('avg24hPrice', null, false)
})

watchSafe(resultHistoricalPrices, () => {
  loadingBar.finish()
  itemDetails.value = resultHistoricalPrices.value.item
  itemDetailsHistoricalPrices.value = [...resultHistoricalPrices.value.item.historicalPrices.map(el => [new Date(parseInt(el.timestamp)), el.price])]
  active.value = true
})

watchSafe(resultItemsCategories, () => {
  filterButtons.value = resultItemsCategories.value.itemCategories.map((f) => {
    return {
      ...f,
      value: f.normalizedName,
      label: f.name,
      children: f.children.map((c) => {
        return { ...c, value: c.normalizedName, label: c.name }
      }),
    }
  })
  filterButtons.value = filterButtons.value.filter(f => f.children.length > 0)
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

const filterByCategory = (categoryNormalizedName: string) => {
  dataToUse.value = data.value.filter((el) => {
    return el.category.normalizedName === categoryNormalizedName || el.category.parent.normalizedName === categoryNormalizedName
  })
  sort('avg24hPrice')
  scrollItemsToTop()
}

const sort = (key: string) => {
  globalActiveTab.value = 'default'
  dataToUse.value = dataToUse.value.sort((a, b) =>
    sortDirectionAsc.value ? b[key] - a[key] : a[key] - b[key],
  )
}

const toggleSort = (key: string, _: any, force = false) => {
  if (sortOptions.map(s => s.value).includes(sortType.value))
    dataToUse.value = [...data.value]
  if (key === sortType.value || force)
    sortDirectionAsc.value = !sortDirectionAsc.value

  sortType.value = key
  if (['avg24hPrice', 'changeLast48h'].includes(key))
    sort(key.split(':')[0])
  else if (key.includes('sell'))
    sortByTraderToSell(key.split(':')[0])
  else if (key.includes('buy'))
    sortByTraderToBuy(key.split(':')[0])
  scrollItemsToTop()
}

const openGraph = (item: Object) => {
  if (item.id === itemDetails.value.id) {
    active.value = true
    return
  }
  loadingBar.start()
  load(GET_ITEM_HISTORICAL_PRICES_BY_ID, { id: item.id })
}

const increasePageIndex = () => {
  pageIndex.value += DEFAULT_PAGE_INDEX
}

const scrollItemsToTop = () => {
  document.querySelector('#items').scrollTop = 0
}

const onScroll = (state: UseScrollReturn) => {
  if (state.arrivedState.bottom)
    increasePageIndex()
}

const sortOptions = [
  { label: t('label.avg-24h-price-flea'), value: 'avg24hPrice' },
  { label: t('label.variation-price-flea'), value: 'changeLast48h' },
  { label: 'Therapist pour vendre', value: 'Therapist:sell' },
  { label: 'Jaeger pour vendre', value: 'Jaeger:sell' },
  { label: 'Peacekeeper pour vendre', value: 'Peacekeeper:sell' },
  { label: 'Ragman pour vendre', value: 'Ragman:sell' },
  { label: 'Fence pour vendre', value: 'Fence:sell' },
  { label: 'Skier pour vendre', value: 'Skier:sell' },
  { label: 'Prapor pour vendre', value: 'Prapor:sell' },
  { label: 'Therapist pour acheter', value: 'Therapist:buy' },
  { label: 'Jaeger pour acheter', value: 'Jaeger:buy' },
  { label: 'Peacekeeper pour acheter', value: 'Peacekeeper:buy' },
  { label: 'Ragman pour acheter', value: 'Ragman:buy' },
  { label: 'Skier pour acheter', value: 'Skier:buy' },
  { label: 'Prapor pour acheter', value: 'Prapor:buy' },
]
</script>

<template>
  <div>
    <n-loading-bar-provider />
    <div>
      <div v-if="loading">
        <div>
          <n-space vertical>
            <n-input v-model:value.lazy="searchInput" type="text" :placeholder="t('label.search')" />
            <n-grid x-gap="12" y-gap="12" cols="2">
              <n-gi>
                <n-select
                  filterable placeholder="Choisir un filtre" :options="sortOptions" class="w-[100%]"
                  default-value="avg24hPrice" @update:value="toggleSort"
                >
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
                  {{ sortDirectionAsc ? t('button.descending') : t('button.ascending') }}
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
          <n-input v-model:value.lazy="searchInput" type="text" :placeholder="t('label.search')" />
          <n-grid x-gap="12" y-gap="12" cols="2">
            <n-gi>
              <n-select
                filterable placeholder="Choisir un filtre" :options="sortOptions" class="w-[100%]"
                default-value="avg24hPrice" @update:value="toggleSort"
              >
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
                {{ sortDirectionAsc ? t('button.descending') : t('button.ascending') }}
              </n-button>
            </n-gi>
          </n-grid>
          <n-cascader
            v-model:value="selectedCategory"
            placeholder="Category"
            clearable
            :options="filterButtons"
            :cascade="true"
            check-strategy="child"
            :show-path="true"
            :filterable="true"
            :clear-filter-after-select="true"
            @update:value="filterByCategory"
          />
          <n-back-top
            :listen-to="target" :bottom="220" :visibility-height="10" :style="{
              transition: 'all .3s cubic-bezier(.4, 0, .2, 1)',
            }"
          />
          <n-grid
            v-if="dataToUse"
            id="items" ref="" v-scroll="onScroll" class="overflow-y-scroll h-[100vh] pr-2" x-gap="12"
            y-gap="12" cols="5 xs:1 s:1 m:1 l:2 xl:3 2xl:4 3xl:4" responsive="screen"
          >
            <n-gi v-for="item in dataToUse?.slice(0, pageIndex)" :key="item.id">
              <VItemCard :loading="loading" :item="item" :global-active-tab="globalActiveTab" :open-graph="openGraph" />
            </n-gi>
          </n-grid>
        </n-space>
        <n-drawer v-model:show="active" default-height="80vh" placement="top" resizable>
          <n-drawer-content title="Graphique prix de cette dernière semaine">
            <div class="text-white mb-[30px] flex flex-col space-y-5">
              <img :src="itemDetails.gridImageLink" class="object-scale-down h-[20vh]">
              <div class="text-xl text-center">
                {{ itemDetails.name }}
              </div>
            </div>
            <GChart
              type="LineChart" :data="[['Day', 'Price'], ...itemDetailsHistoricalPrices]"
              :options="{ curveType: 'function', colors: [colors.teal[400]], backgroundColor: '#18181c', hAxis: { textStyle: { color: colors.teal[400] } }, vAxis: { textStyle: { color: colors.teal[400] } } }"
            />
          </n-drawer-content>
        </n-drawer>
      </div>
    </div>
  </div>
</template>
