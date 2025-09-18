<template>
  <div
    id="adminUsers"
    class="box"
  >
    <PTitle
      class="mb-5"
      name="Administración de usuarios"
    />

    <nav class="flex mb-4">
      <section class="flex flex-wrap">
        <PButton
          color="info"
          icon="fa fa-chevron-left"
          :to="{ name: 'admin' }"
          tag="router-link"
          class="mr-2"
        >
          Volver a Administración
        </PButton>
      </section>
    </nav>

    <div class="block">
      <PSwitch v-model="isPaginated">
        Paginated
      </PSwitch>
    </div>

    <PTable
      :columns="columns"
      :rows="users"
      :paginated="isPaginated"
      :per-page="15"
      :with-filter="filterUsers"
      has-view-button
      has-edit-button
      has-delete-button
    >
      <template #actions="{ row }">
        <router-link :to="{ name: 'user', params: { user: (row as User).id } }">
          <i
            class="fa fa-eye cursor-pointer p-1 text-brand-accent-500 hover:text-brand-accent-600 dark:text-brand-600 dark:hover:bg-brand-700"
            title="Ver"
          />
        </router-link>
        <!--
        <i
          class="fa fa-pencil cursor-pointer text-warning-500 hover:text-warning-600 p-1"
          title="Editar"
        />
        <i
          class="fa fa-trash cursor-pointer text-error-600 hover:text-error-700 p-1"
          title="Eliminar"
        />-->
      </template>
    </PTable>
  </div>
</template>

<script setup lang="ts">
import PTitle from "@/components/lib/PTitle.vue";
import { User } from "@/types/User";
import { userService } from "@/_services";
import { ref, onMounted } from "vue";
import { useDayjs } from "@/composables/useDayjs";
import PSwitch from "@/components/lib/forms/PSwitch.vue";
import PTable from "@/components/lib/table/PTable.vue";
import PButton from "@/components/lib/forms/PButton.vue";
import {Constructor} from "@/types/Constructor";

const dayjs = useDayjs();
const humanDateTime = dayjs.humanDateTime;

const isPaginated = ref(true);
const users = ref<User[]>([]);

const columns = [
  { label: 'ID', field: 'id' },
  { label: 'Username', field: 'username' },
  { label: 'Email', field: 'email' },
  { label: 'Rango', field: 'rank.name' },
  { label: 'Creado', field: 'created', type: 'datetime', formatter: (date: Date) => humanDateTime(date) },
  { label: 'Verificado', field: 'verified_at', type: 'datetime', formatter: (date: Date) => date ? humanDateTime(date) : 'No verificado' },
  { label: 'Última actividad', field: 'last_activity', type: 'datetime', formatter: (date: Date) => date ? humanDateTime(date) : 'Sin fecha' },
];

const filterUsers = ((original: User[], filter: string): User[] => {
  console.log('Filtering users with filter:', filter);
  if (!filter) return original;
  return original.filter((user) => {
    return (
      user.username.toLowerCase().includes(filter) ||
      user.email.toLowerCase().includes(filter) ||
      user.rank.name.toLowerCase().includes(filter)
    );
  });
});

onMounted(() => {
  userService.getAllUsers().then((data) => {
    users.value = [];
    users.value.push(...data);
  });
});
</script>
