<template>
  <PTable
    :columns="columns"
    :rows="rows"
    @click="onPreferenceClick"
  />
</template>

<script setup lang="ts">
import {useAuthStore} from "@/store/authStore";
import {Dictionary} from "@/types/Dictionary";
import {computed, markRaw, onMounted, ref} from "vue";
import {notificationService} from "@/_services";
import PTable from "@/components/lib/table/PTable.vue";
import {Column} from "@/components/lib/table";
import ClickableSettingIcon from "@/components/user/settings/ClickableSettingIcon.vue";

const currentUser = useAuthStore().loggedUser;

const isLoading = ref(false);
const notificationMethods = ref({} as Dictionary<string, string>)
const notificationTypes = ref({} as Dictionary<string, string>)

const columns = computed(() => {
  const cols = [{label: '', field: 'type', formatter: (value: string) => value} as Column];
  for (const methodId in notificationMethods.value) {
    cols.push({
      label: notificationMethods.value[methodId]!,
      field: methodId,
      formatter: markRaw(ClickableSettingIcon),
    });
  }
  return cols;
});

const rows = computed(() => {
  const rws = [];
  for (const typeId in notificationTypes.value) {
    const row: any = {type: notificationTypes.value[typeId]};
    for (const methodId in notificationMethods.value) {
      row[methodId] = currentUser.preferences[`notify-${typeId}-${methodId}`] ?? true;
    }
    rws.push(row);
  }
  return rws;
});

function onPreferenceClick(row: any, column: Column, value: boolean) {
  // Ignorar clicks en la columna de tipo
  if (column.field === 'type') {
    return
  }


  // Buscar typeId a partir del label
  const typeId = Object.keys(notificationTypes.value).find(key => notificationTypes.value[key] === row.type);
  if (!typeId) {
    console.error(`No se encontró el typeId para el label ${row.type}`);
    return;
  }

  const methodId = column.field;
  const methodLabel = notificationMethods.value[methodId];
  const typeLabel = notificationTypes.value[typeId];

  toggleNotification(typeId, typeLabel!, methodId, methodLabel!)
}

async function toggleNotification(typeId: string, typeLabel: string, methodId: string, methodLabel: string) {
  currentUser.preferences[`notify-${typeId}-${methodId}`] = !(currentUser.preferences[`notify-${typeId}-${methodId}`] ?? true);

  try {
    await notificationService.changeNotificationPreference(typeId, methodId, currentUser.preferences[`notify-${typeId}-${methodId}`])
    notificationService.showNotification(`Notificaciones de ${typeLabel} por ${methodLabel} ${currentUser.preferences[`notify-${typeId}-${methodId}`] ? 'activadas' : 'desactivadas'}`);
  } catch (error) {
    notificationService.showNotification('Error cambiando la preferencia de notificación', 'error');
    // Revertir cambio optimista
    currentUser.preferences[`notify-${typeId}-${methodId}`] = !(currentUser.preferences[`notify-${typeId}-${methodId}`] ?? true);
    return;
  }
}

onMounted(async () => {
  isLoading.value = true;
  try {
    const [notificationMethodsResult, notificationTypesResult] = await Promise.all([
      notificationService.getNotificationMethods(),
      notificationService.getNotificationTypes(),
    ]);
    notificationMethods.value = notificationMethodsResult;
    notificationTypes.value = notificationTypesResult;
  } catch (error) {
    notificationService.showNotification('Error cargando los métodos y tipos de notificación', 'error');
    isLoading.value = false;
  }
})
</script>
