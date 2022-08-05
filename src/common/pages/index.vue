<script setup lang="ts">
// graphql example
import { useGetItemsQuery } from "~/common/services/useExample.query";
import { useFuse } from "@vueuse/integrations/useFuse";
import type { UseScrollReturn } from "@vueuse/core";
import { vScroll } from "@vueuse/components";

const { result, loading, error } = useGetItemsQuery();

const pageIndex = ref(20);
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
  pageIndex.value += 20;
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
  }
});

let sortAvg24hPriceToggle = true
function toggleSortAvg24hPrice() {
  data.value = [...data.value]
  data.value = data.value.sort((a, b) => sortAvg24hPriceToggle ? b.avg24hPrice - a.avg24hPrice : a.avg24hPrice - b.avg24hPrice);
  sortAvg24hPriceToggle = !sortAvg24hPriceToggle
}
</script>

<template>
  <div>
    <div>
      <div v-if="loading">
        <div>
          <n-space vertical>
            <n-input type="text" placeholder="Search" />
            <n-grid x-gap="12" y-gap="12" :cols="5">
              <n-gi v-for="i in new Array(20)">
                <VItemCard :loading="loading" />
              </n-gi>
            </n-grid>
            <VButton @click="increasePageIndex">More...</VButton>
          </n-space>
        </div>
      </div>
      <div v-else-if="error">Error: {{ error.message }}</div>
      <div>
        <VButton @click="toggleSortAvg24hPrice">Trier par prix moyen 24h</VButton>
        <n-space vertical>
          <n-input
            v-model:value.lazy="search"
            type="text"
            placeholder="Search"
          />
          <n-grid
            v-if="data"
            x-gap="12"
            y-gap="12"
            :cols="5"
            class="overflow-y-auto h-[47rem]"
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
