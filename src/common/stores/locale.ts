import { acceptHMRUpdate, defineStore } from 'pinia'

export const useLocaleStore = defineStore('locale', () => {
  /**
   * Current locale name.
   */
  const locale = ref('en')

  function setLocale(_locale: string) {
      locale.value = _locale
  }

  return {
    setLocale,
    locale
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useLocaleStore, import.meta.hot))
