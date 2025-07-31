import { ref, Ref } from 'vue'

export function useTabs(defaultTab: string): {
  activeTab: Ref<string>
  setActiveTab: (tabName: string) => void
} {
  const activeTab = ref<string>(defaultTab)
  const setActiveTab = (tabName: string) => {
    activeTab.value = tabName
  }

  return {
    activeTab,
    setActiveTab
  }
}
