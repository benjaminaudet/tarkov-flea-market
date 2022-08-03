<script setup lang="ts">
// graphql example
import { useExampleQuery } from '~/common/services/useExample.query'
import { useFuse } from '@vueuse/integrations/useFuse'

const { result, loading, error } = useExampleQuery()


const pageIndex = ref(20)
const search = ref('')

const { results } = useFuse(search, result)
console.log(results)
// Routing
const router = useRouter()
const go = () => {
  router.push('/users/home')
}

// Internationalization
const { t } = useI18n()
const timestamp = ref(1183135260000)

function increasePageIndex() {
  pageIndex.value += 20;
}

</script>

<template>
  <div>
    <div v-if="loading">
    <div>
      <n-space vertical>
        <n-input v-model:value="search" type="text" placeholder="Search" />
        <n-grid x-gap="12" y-gap="12" :cols="5">
          <n-gi v-for="i in new Array(20)">
            <VItemCard :loading="loading" />
          </n-gi>
        </n-grid>
        <VButton @click="increasePageIndex">More...</VButton>
      </n-space>
    </div>
    </div>
    <div v-else-if="error">
      Error: {{ error.message }}
    </div>
    <div v-else-if="result">
      <n-space vertical>
        <n-input v-model:value="value" type="text" placeholder="Search" />
        <n-grid x-gap="12" y-gap="12" :cols="5">
          <n-gi v-for="item in result?.items.slice(0, pageIndex)">
            <VItemCard :loading="loading" :item="item" />
          </n-gi>
        </n-grid>
        <VButton @click="increasePageIndex">More...</VButton>
      </n-space>
    </div>
  </div>
</template>
