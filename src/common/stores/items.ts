import { acceptHMRUpdate, defineStore } from 'pinia'
import { useGetItemsQuery } from '~/common/services/useGetItems.query'
import { useLocaleStore } from '~/common/stores/locale'

export const useItemsStore = defineStore('items', () => {
  const items = ref([])

  const localeStore = useLocaleStore()

  function setItems(_items: Array<Object>) {
    items.value = _items
  }

  function getItems() {
    if (items.length > 0) {
      return items;
    }
    console.log('yeah')
    const { result } = useGetItemsQuery(localeStore.locale)
    watch(result, () => {
      console.log(result.value)
      setItems(result?.value?.items)
  })
  }



  return {
    getItems,
    setItems,
    items
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useItemsStore, import.meta.hot))
