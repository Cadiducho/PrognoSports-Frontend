<template>
    <div id="adminUsers" class="box">
        <PrognoPageTitle class="mb-5" name="Administración de usuarios" />

        <o-field>
            <o-input
                v-model="filtroUsuario"
                placeholder="Buscar usuario"
                type="search"
                icon-pack="fas"
                icon="search"
            ></o-input>
        </o-field>

        <div class="block">
            <o-switch v-model="isPaginated">Paginated</o-switch>
        </div>

        <o-table :data="filteredUsers"
                 hoverable striped
                 :paginated="isPaginated"
                 per-page="15">

            <o-table-column field="id" label="ID" width="40" sortable v-slot="props">
                {{ props.row.id }}
            </o-table-column>

            <o-table-column field="username" label="Username" sortable v-slot="props">
                {{ props.row.username }}
            </o-table-column>

            <o-table-column field="email" label="Email" sortable v-slot="props">
                {{ props.row.email }}
            </o-table-column>

            <o-table-column field="rank.name" label="Rango" sortable v-slot="props" width="60">
                    <span class="tag is-primary is-rounded">
                        {{ props.row.rank.name }}
                    </span>
            </o-table-column>

            <o-table-column field="created" label="Creado" centered sortable v-slot="props">
                    <span class="tag is-success" v-if="props.row.created">
                        {{ humanDateTime(props.row.created) }}
                    </span>
                <span class="tag is-warning" v-else>
                        Sin fecha
                    </span>
            </o-table-column>

            <o-table-column field="last_activity" label="Última actividad" centered sortable v-slot="props">
                    <span class="tag is-success" v-if="props.row.last_activity">
                        {{ humanDateTime(props.row.last_activity) }}
                    </span>
                <span class="tag is-warning" v-else>
                        Sin fecha
                    </span>
            </o-table-column>

            <o-table-column label="Actions" v-slot="props">
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
import PrognoPageTitle from "@/components/lib/PrognoPageTitle.vue";
import {User} from "@/types/User";
import AlertNoPermission from "@/components/lib/AlertNoPermission.vue";
import {userService} from "@/_services";

import {defineComponent} from "vue";
import {useAuthStore} from "@/store/authStore";
import {useDayjs} from "@/composables/useDayjs";

export default defineComponent({
    name: "DriversAdmin",
    components: {
        AlertNoPermission,
        PrognoPageTitle,
    },
    setup() {
        const dayjs = useDayjs();
        const authStore = useAuthStore();

        const humanDateTime = dayjs.humanDateTime;
        const currentUser = authStore.loggedUser;
        return { currentUser, humanDateTime };
    },
    data() {
        return {
            isPaginated: true,
            filtroUsuario: '',
            users: new Array<User>(),
        }
    },
    mounted() {
        userService.getAllUsers().then((users) => {
            this.users = [];
            this.users.push(...users);
        })
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
    }
});
</script>