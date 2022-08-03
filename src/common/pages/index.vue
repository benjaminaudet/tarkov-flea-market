<script setup lang="ts">
// graphql example
import { useExampleQuery } from '~/common/services/useExample.query'

const { result, loading, error } = useExampleQuery()

// Routing
const router = useRouter()
const go = () => {
  router.push('/users/home')
}

// Internationalization
const { t } = useI18n()
const timestamp = ref(1183135260000)
</script>

<template>
  <div>
    <div>
      <div v-if="loading">
        <n-loading-bar-provider>
          <content />
        </n-loading-bar-provider>
      </div>
      <div v-else-if="error">
        Error: {{ error.message }}
      </div>
      <div>
        <n-grid x-gap="12" y-gap="12" :cols="5">
          <n-gi v-for="item in result?.items?.slice(0, 10)">
            <VItemCard :loading="loading" :item="item"/>
          </n-gi>
        </n-grid>
      </div>
    </div>
  </div>
</template>
