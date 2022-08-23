<script setup lang="ts">
import { darkTheme } from 'naive-ui'
import { ApolloClients } from '@vue/apollo-composable'
import { apolloClient } from './common/ApolloClient'

provide(ApolloClients, {
  default: apolloClient,
})

// https://github.com/vueuse/head
// you can use this to manipulate the document head in any components,
// they will be rendered correctly in the html results with vite-ssg
useHead({
  title: 'Tarkov Dashboard',
  link: [
    {
      rel: 'icon',
      type: 'image/png',
      href: '/favicon-32x32.png',
    },
  ],
})

const refMsgTargetEl = ref<any>()
</script>

<template>
  <n-config-provider :theme="darkTheme">
    <n-loading-bar-provider>
      <n-message-provider :to="refMsgTargetEl">
        <n-notification-provider>
          <n-dialog-provider>
            <router-view />
            <div ref="refMsgTargetEl" class="app-msg-target" />
          </n-dialog-provider>
        </n-notification-provider>
      </n-message-provider>
    </n-loading-bar-provider>
  </n-config-provider>
</template>
