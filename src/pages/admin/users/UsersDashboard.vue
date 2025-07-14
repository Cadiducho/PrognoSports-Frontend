<template>
  <div
    id="adminUsers"
    class="box"
  >
    <PTitle
      class="mb-5"
      name="Administración de usuarios"
    />

    <PField>
      <PInput
        v-model="filtroUsuario"
        placeholder="Buscar usuario"
        type="search"
        icon="fas fa-search"
      />
    </PField>

    <div class="block">
      <o-switch v-model="isPaginated">
        Paginated
      </o-switch>
    </div>

    <o-table
      :data="filteredUsers"
      hoverable
      striped
      :paginated="isPaginated"
      per-page="15"
    >
      <o-table-column
        v-slot="props"
        field="id"
        label="ID"
        width="40"
        sortable
      >
        {{ props.row.id }}
      </o-table-column>

      <o-table-column
        v-slot="props"
        field="username"
        label="Username"
        sortable
      >
        {{ props.row.username }}
      </o-table-column>

      <o-table-column
        v-slot="props"
        field="email"
        label="Email"
        sortable
      >
        {{ props.row.email }}
      </o-table-column>

      <o-table-column
        v-slot="props"
        field="rank.name"
        label="Rango"
        sortable
        width="60"
      >
        <span class="tag is-primary is-rounded">
          {{ props.row.rank.name }}
        </span>
      </o-table-column>

      <o-table-column
        v-slot="props"
        field="created"
        label="Creado"
        centered
        sortable
      >
        <span
          v-if="props.row.verified_at"
          class="tag is-success"
        >
          {{ humanDateTime(props.row.verified_at) }}
        </span>
        <span
          v-else
          class="tag is-warning"
        >
          No verificado
        </span>
      </o-table-column>

      <o-table-column
        v-slot="props"
        field="created"
        label="Verificado"
        centered
        sortable
      >
        <span
          v-if="props.row.isVerified()"
          class="tag is-info"
        >
          {{ humanDateTime(props.row.verified_at) }}
        </span>
        <span
          v-else
          class="tag is-warning"
        >
          No verificado
        </span>
      </o-table-column>

      <o-table-column
        v-slot="props"
        field="last_activity"
        label="Última actividad"
        centered
        sortable
      >
        <span
          v-if="props.row.last_activity"
          class="tag is-success"
        >
          {{ humanDateTime(props.row.last_activity) }}
        </span>
        <span
          v-else
          class="tag is-warning"
        >
          Sin fecha
        </span>
      </o-table-column>

      <o-table-column
        v-slot="props"
        label="Actions"
      >
        <span class="tags">
          <span class="tag is-link">Ver</span>
          <span class="tag is-warning">Editar</span>
          <span class="tag is-danger">Eliminar</span>
        </span>
      </o-table-column>
    </o-table>
  </div>
</template>

<script lang="ts">
import PTitle from "@/components/lib/PTitle.vue";
import {User} from "@/types/User";
import AlertNoPermission from "@/components/lib/AlertNoPermission.vue";
import {userService} from "@/_services";

import {defineComponent} from "vue";
import {useAuthStore} from "@/store/authStore";
import {useDayjs} from "@/composables/useDayjs";
import PField from "@/components/lib/forms/PField.vue";
import PInput from "@/components/lib/forms/PInput.vue";

export default defineComponent({
  name: "DriversAdmin",
  components: {
    PInput,
    PField,
    AlertNoPermission,
    PTitle,
  },
  setup() {
    const dayjs = useDayjs();
    const authStore = useAuthStore();

    const humanDateTime = dayjs.humanDateTime;
    const currentUser = authStore.loggedUser;
    return {currentUser, humanDateTime};
  },
  data() {
    return {
      isPaginated: true,
      filtroUsuario: '',
      users: new Array<User>(),
    }
  },
  computed: {
    filteredUsers(): Array<User> {
      if (!this.filtroUsuario.trim()) {
        return this.users;
      }

      const filtroLowerCase: string = this.filtroUsuario.toLowerCase().trim();

      return this.users.filter((user) => {
        return (
          user.username
            .toLowerCase()
            .includes(filtroLowerCase) ||
          user.email
            .toLowerCase()
            .includes(filtroLowerCase) ||
          user.rank.name
            .toLowerCase()
            .includes(filtroLowerCase)
        );
      });
    }
  },
  mounted() {
    userService.getAllUsers().then((users) => {
      this.users = [];
      this.users.push(...users);
      console.log('this.users', this.users);
    })
  }
});
</script>
