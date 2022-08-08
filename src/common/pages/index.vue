<script setup lang="ts">
import { useGetItemsQuery } from "~/common/services/useGetItems.query";
import type { UseScrollReturn } from "@vueuse/core";
import { vScroll } from "@vueuse/components";

import colors from 'tailwindcss/colors'

import IconAscendingSort from '~icons/bi/sort-numeric-down'
import IconDescendingSort from '~icons/bi/sort-numeric-up'

const { result, loading, error } = useGetItemsQuery();

const pageIndex = ref(80);
const search = ref("");
const data = ref([]);
const sortDirectionAsc = ref(true);
const sortType = ref('avg24hPrice')

const onScroll = (state: UseScrollReturn) => {
  if (state.arrivedState.bottom) {
    increasePageIndex();
  }
}

// Routing
const router = useRouter();
const go = () => {
  router.push("/users/home");
};

// Internationalization
const { t } = useI18n();
const timestamp = ref(1183135260000);

const increasePageIndex = () => {
  pageIndex.value += 80;
}

watch(search, () => {
  if (search.value === "") {
    data.value = result.value.items;
  }
  data.value = result.value.items.filter((a) =>
    a.name.toLowerCase().includes(search.value.toLowerCase())
  );
  toggleSort(sortType.value)
});

watch(result, () => {
  if (result.value) {
    data.value = result.value.items;
    sort('avg24hPrice')
  }
});

let sortOptions = [{ 'label': 'Trier par prix moyen 24h', 'value': 'avg24hPrice' }, { 'label': 'Trier par variation du prix dernières 48h', 'value': 'changeLast48h' }];

const sort = (key: string) => {
  sortType.value = key;
  data.value = [...data.value];
  data.value = data.value.sort((a, b) =>
    sortDirectionAsc.value ? b[key] - a[key] : a[key] - b[key]
  );
}

const toggleSort = (key: string) => {
  sort(key);
  console.log('before')
  console.log(sortDirectionAsc.value)
  sortDirectionAsc.value = !sortDirectionAsc.value;
  console.log('after')
  console.log(sortDirectionAsc.value)
}

</script>

<template>
  <div>
    <div>
      <div v-if="loading">
        <div>
          <n-space vertical>
            <n-input type="text" placeholder="Search" />
            <n-grid x-gap="12" y-gap="12" cols="5 xs:1 s:2 m:2 l:3 xl:4 2xl:5" responsive="screen">
              <n-gi v-for="i in new Array(80)">
                <VItemCard :loading="loading" />
              </n-gi>
            </n-grid>
            <VButton @click="increasePageIndex">More...</VButton>
          </n-space>
        </div>
      </div>
      <div v-else-if="error">Error: {{ error.message }}</div>
      <div>
        <n-space vertical>

          <n-input v-model:value.lazy="search" type="text" placeholder="Search" />
          <n-select @update:value="toggleSort" filterable placeholder="Choisir un filtre" default-value="avg24hPrice"
            :options="sortOptions">
            <template #arrow>
              <transition name="slide-left">
                <icon-ascending-sort v-if="sortDirectionAsc" :style="`color: ${colors.teal[400]}`" />
                <icon-descending-sort v-else :style="`color: ${colors.teal[400]}`" />
              </transition>
            </template>
          </n-select>
          <n-grid v-if="data" x-gap="12" y-gap="12" cols="5 xs:1 s:2 m:2 l:3 xl:4 2xl:5" responsive="screen"
            class="overflow-y-auto h-[100vh] pr-2" v-scroll="onScroll">
            <n-gi v-for="item in data?.slice(0, pageIndex)" :key="item.id">
              <VItemCard :loading="loading" :item="item" />
            </n-gi>
          </n-grid>
        </n-space>
      </div>
    </div>
  </div>
</template>
