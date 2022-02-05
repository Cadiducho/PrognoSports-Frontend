<template>
    <div id="adminUsers" class="box">
        <PrognoPageTitle class="mb-5" name="Administración de usuarios" />

        <section v-if="isAdmin(currentUser)">


            <b-field>
                <b-input
                    v-model="filtroUsuario"
                    placeholder="Buscar usuario"
                    type="search"
                    icon-pack="fas"
                    icon="search"
                ></b-input>
            </b-field>

            <div class="block">
                <b-switch v-model="isPaginated">Paginated</b-switch>
            </div>

            <b-table :data="filteredUsers"
                     hoverable striped
                     :paginated="isPaginated"
                     per-page="15">

                <b-table-column field="id" label="ID" width="40" sortable v-slot="props">
                    {{ props.row.id }}
                </b-table-column>

                <b-table-column field="username" label="Username" sortable v-slot="props">
                    {{ props.row.username }}
                </b-table-column>

                <b-table-column field="email" label="Email" sortable v-slot="props">
                    {{ props.row.email }}
                </b-table-column>

                <b-table-column field="rank.name" label="Rango" sortable v-slot="props" width="60">
                    <span class="tag is-primary is-rounded">
                        {{ props.row.rank.name }}
                    </span>
                </b-table-column>

                <b-table-column field="created" label="Creado" centered sortable v-slot="props">
                    <span class="tag is-success" v-if="props.row.created">
                        {{ props.row.created | humanDateTime }}
                    </span>
                    <span class="tag is-warning" v-else>
                        Sin fecha
                    </span>
                </b-table-column>

                <b-table-column field="last_activity" label="Última actividad" centered sortable v-slot="props">
                    <span class="tag is-success" v-if="props.row.last_activity">
                        {{ props.row.last_activity | humanDateTime }}
                    </span>
                    <span class="tag is-warning" v-else>
                        Sin fecha
                    </span>
                </b-table-column>

                <b-table-column label="Actions" v-slot="props">
                    <span class="tags">
                        <span class="tag is-link">Ver</span>
                        <span class="tag is-warning">Editar</span>
                        <span class="tag is-danger">Eliminar</span>
                    </span>
                </b-table-column>

            </b-table>

        </section>
        <section v-else>
            <AlertNoPermission />
        </section>
    </div>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import PrognoPageTitle from "@/components/lib/PrognoPageTitle.vue";
import {User} from "@/types/User";
import {namespace} from "vuex-class";
import AlertNoPermission from "@/components/lib/AlertNoPermission.vue";
import {userService} from "@/_services";
const Auth = namespace('Auth')

@Component({
        components: {
            AlertNoPermission,
            PrognoPageTitle,
        }
    }
)
export default class DriversAdmin extends Vue {
    @Auth.State("user") private currentUser!: User;

    private isPaginated: boolean = true;
    private filtroUsuario: String = '';

    private users: Array<User> = [];

    mounted() {
        userService.getAllUsers().then((users) => {
            this.users = [];
            this.users.push(...users);
        })
    }

    get filteredUsers(): Array<User> {
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
</script>