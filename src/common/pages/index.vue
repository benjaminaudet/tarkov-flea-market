<script setup lang="ts">
import type { UseScrollReturn, refDebounced } from '@vueuse/core'
import { vScroll } from '@vueuse/components'
import colors from 'tailwindcss/colors'
import { useGetItemsQuery } from '~/common/services/useGetItems.query'

import IconAscendingSort from '~icons/bi/sort-numeric-down'
import IconDescendingSort from '~icons/bi/sort-numeric-up'

const { result } = useGetItemsQuery()

const pageIndex = ref(80)
const searchInput = ref('')
const searchInputDebounced = refDebounced(searchInput, 500) // fire finished
const searchInputDebouncedLoading = refDebounced(searchInput, 50) // fire loading
const data = ref([])
const sortDirectionAsc = ref(true)
const sortType = ref('avg24hPrice')

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


const sortByTrader = (key: string) => {
  console.log(key)
  sortType.value = key
  data.value = [...data.value]
  data.value = data.value.filter((el) => {
    console.log(el)
    return el.sellFor.find((_el) => _el.vendor.name === key)
  })
  data.value = [...data.value]
  data.value = data.value.sort((a, b) => {
    console.log(a?.sellFor?.find((_el => _el?.vendor?.name === key)))
    const _a = a?.sellFor?.find((_el => _el?.vendor?.name === key))?.priceRUB
    console.log(_a)
    const _b = b?.sellFor?.find((_el => _el?.vendor?.name === key))?.priceRUB
    sortDirectionAsc.value ? _b - _a : _a - _b
  })
  console.log(data.value)
}

const sort = (key: string) => {
  console.log('sort')
  sortType.value = key
  data.value = [...data.value]
  data.value = data.value.sort((a, b) =>
    sortDirectionAsc.value ? b[key] - a[key] : a[key] - b[key],
  )
}

const toggleSort = (key) => {
  if (['avg24hPrice', 'changeLast48h'].includes(key))
    sort(key)
  else
    sortByTrader(key)
  sortDirectionAsc.value = !sortDirectionAsc.value
}

const sortOptions = [
  { label: 'Trier par prix moyen 24h', value: 'avg24hPrice' },
  { label: 'Trier par variation du prix dernières 48h', value: 'changeLast48h' },
  { label: 'Trier avec la Toubib pour vendre', value: "La Toubib" }
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
          <n-grid v-if="data" v-scroll="onScroll" x-gap="12" y-gap="12" cols="5 xs:1 s:2 m:2 l:3 xl:4 2xl:5"
            responsive="screen" class="overflow-y-auto h-[100vh] pr-2">
            <n-gi v-for="item in data?.slice(0, pageIndex)" :key="item.id">
              <VItemCard :loading="loading" :item="item" />
            </n-gi>
          </n-grid>
        </n-space>
      </div>
    </div>
  </div>
</template>
