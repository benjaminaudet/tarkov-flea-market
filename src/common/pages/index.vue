<script setup lang="ts">
import { refDebounced } from '@vueuse/core'
import type { UseScrollReturn } from '@vueuse/core'
import { vScroll } from '@vueuse/components'
import colors from 'tailwindcss/colors'
import { useGetItemsQuery } from '~/common/services/useGetItems.query'

import IconAscendingSort from '~icons/bi/sort-numeric-down'
import IconDescendingSort from '~icons/bi/sort-numeric-up'

const { result, loading, error } = useGetItemsQuery()

const pageIndex = ref(80)
const searchInput = ref('')
const searchInputDebounced = refDebounced(searchInput, 500) // fire finished
const searchInputDebouncedLoading = refDebounced(searchInput, 50) // fire loading
const data = ref([])
const dataToUse = ref([])
const sortDirectionAsc = ref(true)
const sortType = ref('avg24hPrice')
const scrollContainerRef = ref<HTMLElement | undefined>(undefined)
const target = scrollContainerRef.value
const globalActiveTab = ref('default')

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
  pageIndex.value += 80
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
  console.log('finished')
})

watch(result, () => {
  if (result.value) {
    data.value = result.value.items
    sort('avg24hPrice')
  }
})

const sortByTraderToBuy = (key: string) => {
  sortType.value = key
  dataToUse.value = [...data.value]
  globalActiveTab.value = 'traders'
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
  sortType.value = key
  dataToUse.value = [...data.value]
  globalActiveTab.value = 'traders'
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
  sortType.value = key
  dataToUse.value = [...data.value]
  globalActiveTab.value = 'flea'
  dataToUse.value = dataToUse.value.sort((a, b) =>
    sortDirectionAsc.value ? b[key] - a[key] : a[key] - b[key],
  )
}

const toggleSort = (key) => {
  if (key === sortType.value)
    sortDirectionAsc.value = !sortDirectionAsc.value
  if (['avg24hPrice', 'changeLast48h'].includes(key))
    sort(key.split(':')[0])
  else if (key.includes('sell'))
    sortByTraderToSell(key.split(':')[0])
  else if (key.includes('buy'))
    sortByTraderToBuy(key.split(':')[0])
}

const sortOptions = [
  { label: 'Trier par prix moyen 24h', value: 'avg24hPrice' },
  { label: 'Trier par variation du prix dernières 48h', value: 'changeLast48h' },
  { label: 'Trier avec la Toubib pour vendre', value: 'La Toubib:sell' },
  { label: 'Trier avec Jaeger pour vendre', value: 'Jaeger:sell' },
  { label: 'Trier avec Peacekeeper pour vendre', value: 'Peacekeeper:sell' },
  { label: 'Trier avec Ragman pour vendre', value: 'Ragman:sell' },
  { label: 'Trier avec Fence pour vendre', value: 'Fence:sell' },
  { label: 'Trier avec Skier pour vendre', value: 'Skier:sell' },
  { label: 'Trier avec Prapor pour vendre', value: 'Prapor:sell' },
  { label: 'Trier avec la Toubib pour acheter', value: 'La Toubib:buy' },
  { label: 'Trier avec Jaeger pour acheter', value: 'Jaeger:buy' },
  { label: 'Trier avec Peacekeeper pour acheter', value: 'Peacekeeper:buy' },
  { label: 'Trier avec Ragman pour acheter', value: 'Ragman:buy' },
  { label: 'Trier avec Fence pour acheter', value: 'Fence:buy' },
  { label: 'Trier avec Skier pour acheter', value: 'Skier:buy' },
  { label: 'Trier avec Prapor pour acheter', value: 'Prapor:buy' },
]
</script>

<template>
  <div>
    <div>
      <div v-if="loading">
        <div>
          <n-space vertical>
            <n-input type="text" placeholder="Search..." />
            <n-grid x-gap="12" y-gap="12" cols="5 xs:1 s:2 m:2 l:3 xl:4 2xl:5" responsive="screen">
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
          <n-select filterable placeholder="Choisir un filtre" :options="sortOptions" @update:value="toggleSort">
            <template #arrow>
              <transition name="slide-left">
                <IconAscendingSort v-if="sortDirectionAsc" :style="`color: ${colors.teal[400]}`" />
                <IconDescendingSort v-else :style="`color: ${colors.teal[400]}`" />
              </transition>
            </template>
          </n-select>
          <n-back-top
            :listen-to="target"
            :bottom="220"
            :visibility-height="10"
            :style="{
              transition: 'all .3s cubic-bezier(.4, 0, .2, 1)',
            }"
          />
          <n-grid
            v-if="dataToUse" ref=""
            v-scroll="onScroll"
            class="overflow-y-scroll h-[100vh] pr-2"
            x-gap="12" y-gap="12" cols="5 xs:1 s:2 m:2 l:3 xl:4 2xl:5"
            responsive="screen"
          >
            <n-gi v-for="item in dataToUse?.slice(0, pageIndex)" :key="item.id">
              <VItemCard :loading="loading" :item="item" :global-active-tab="globalActiveTab" />
            </n-gi>
          </n-grid>
        </n-space>
      </div>
    </div>
  </div>
</template>
