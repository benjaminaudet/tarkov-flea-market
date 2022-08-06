<script setup lang="ts">
// graphql example
import { useGetItemsQuery } from "~/common/services/useExample.query";
import { useFuse } from "@vueuse/integrations/useFuse";
import type { UseScrollReturn } from "@vueuse/core";
import { vScroll } from "@vueuse/components";

const { result, loading, error } = useGetItemsQuery();

const pageIndex = ref(80);
const search = ref("");
const data = ref([]);

function onScroll(state: UseScrollReturn) {
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

function increasePageIndex() {
  pageIndex.value += 80;
}

watch(search, () => {
  if (search.value === "") {
    data.value = result.value.items;
  }
  data.value = result.value.items.filter((a) =>
    a.name.toLowerCase().includes(search.value.toLowerCase())
  );
});

watch(result, () => {
  if (result.value) {
    data.value = result.value.items;
    toggleSort();
  }
});

let sortToggle = true;
function toggleSort(key: string) {
  console.log();
  data.value = [...data.value];
  data.value = data.value.sort((a, b) =>
    sortToggle ? b[key] - a[key] : a[key] - b[key]
  );
  sortToggle = !sortToggle;
}
</script>

<template>
  <div>
    <div>
      <div v-if="loading">
        <div>
          <n-space vertical>
            <n-input type="text" placeholder="Search" />
            <n-grid
              x-gap="12"
              y-gap="12"
              cols="5 xs:1 s:2 m:2 l:3 xl:4 2xl:5"
              responsive="screen"
            >
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
          <n-space>
            <VButton @click="toggleSort('avg24hPrice')"
              >Trier par prix moyen 24h</VButton
            >
            <VButton @click="toggleSort('changeLast48h')"
              >Trier par changement de prix moyen 48h</VButton
            >
          </n-space>
          <n-input
            v-model:value.lazy="search"
            type="text"
            placeholder="Search"
          />
          <n-grid
            v-if="data"
            x-gap="12"
            y-gap="12"
            cols="5 xs:1 s:2 m:2 l:3 xl:4 2xl:5"
            responsive="screen"
            class="overflow-y-auto h-[100vh]"
            v-scroll="onScroll"
          >
            <n-gi v-for="item in data?.slice(0, pageIndex)" :key="item.id">
              <VItemCard :loading="loading" :item="item" />
            </n-gi>
          </n-grid>
        </n-space>
      </div>
    </div>
  </div>
</template>
