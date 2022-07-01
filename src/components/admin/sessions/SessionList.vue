<template>
    <div id="adminSession" class="box">
        <PrognoPageTitle class="mb-5" name="Administración de Sesión" />

        <AlertNoPermission v-if="!isAdmin(currentUser)"/>
        <section v-else>

            <form @submit.prevent="submitForm($event)">
                <table class="table is-striped is-hoverable is-fullwidth">
                    <thead>
                        <tr>
                            <th v-for="col in columns">
                                <span>{{ col.label }}</span>
                            </th>
                            <th>
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td v-for="(col, colIndex) in columns">
                                <!-- Formulario de creación nuevo elemento -->
                                <input v-if="col.editable" class="input" :required="isEditing" :disabled="isEditing"
                                       :type="col.type" :placeholder="col.label" v-model="newSession[col.field]"
                                       @input="newSession[col.field] = newSession[col.field].toUpperCase()"
                                >
                                <span v-else></span>
                            </td>
                            <td>
                                <button class="button is-primary is-small" type="submit">Añadir</button>
                            </td>
                        </tr>

                        <tr v-for="(session, index) in sessions" :key="index">
                            <td v-for="(col, colIndex) in columns" :key="colIndex">

                                <!-- Si no se está editando se muestra el contenido -->
                                <template v-if="(editedSession?.name !== session.name) || !col.editable">
                                    {{ session[col.field] }}
                                </template>

                                <!-- Editando: mostrar input -->
                                <input v-else class="input" required
                                       :type="col.type" :placeholder="col.label" v-model="editedSession[col.field]"
                                       @input="editedSession[col.field] = editedSession[col.field].toUpperCase()"
                                >
                            </td>

                            <td>
                                <span class="buttons are-small">
                                    <button type="submit" class="button is-primary" v-if="editedSession?.name === session.name">Guardar</button>
                                    <button type="button" class="button is-warning" v-else @click="editedSession = session" >Editar</button>
                                    <button type="button" class="button is-danger" @click="confirmDeleteSession(session)">Eliminar</button>
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>
        </section>

    </div>
</template>

<script lang="ts">
import PrognoPageTitle from "@/components/lib/PrognoPageTitle.vue";
import AlertNoPermission from "@/components/lib/AlertNoPermission.vue";
import {sessionService} from "@/_services";

import {defineComponent} from "vue";
import {useAuthStore} from "@/store/authStore";
import {RaceSession} from "@/types/RaceSession";

export default defineComponent({
    name: "SessionList",
    components: {
        AlertNoPermission,
        PrognoPageTitle,
    },
    setup() {
        const authStore = useAuthStore();

        const currentUser = authStore.user;
        return { currentUser };
    },
    data() {
        return {
            sessions: new Array<RaceSession>(),
            newSession: {
                name: "",
                code: "",
                uses: 0
            } as RaceSession,
            editedSession: {} as RaceSession,
            columns: [
                {
                    editable: true,
                    isEditing: false,
                    type: 'text',
                    field: 'name',
                    label: 'Nombre',
                },
                {
                    editable: true,
                    isEditing: false,
                    type: 'text',
                    field: 'code',
                    label: 'Código',
                },
                {
                    field: 'uses',
                    label: 'Usos en GPs',
                }
            ]
        }
    },
    mounted() {
        sessionService.getSessionList().then((sessions) => {
            this.sessions = [];
            this.sessions.push(...sessions);
        })
    },
    computed: {
        isEditing(): boolean {
            return !!this.editedSession?.name;
        }
    },
    methods: {
        submitForm() {
            // Si se está editando
            if (this.editedSession?.name) {
                this.updateSession(this.editedSession);
            } else {
                this.createSession();
            }
        },
        updateSession(session: RaceSession) {
            sessionService.updateSession(this.editedSession).then((r) => {
                this.$oruga.notification.open({
                    position: 'top',
                    message: `Se ha editado la sesión ${this.editedSession.name}`,
                    variant: "primary",
                });

                this.sessions.splice(this.sessions.findIndex(s => s.name === this.editedSession.name),1);
                this.sessions.unshift(this.editedSession);

                this.editedSession = {
                    name: "",
                    code: "",
                    uses: 0
                } as RaceSession;
            });
        },
        createSession() {
            // Crear nuevo
            sessionService.createSession(this.newSession).then((r) => {
                this.$oruga.notification.open({
                    position: 'top',
                    message: `Se ha creado la sesión ${this.newSession.name}`,
                    variant: "primary",
                });

                this.sessions.unshift(this.newSession);

                this.newSession = {
                    name: "",
                    code: "",
                    uses: 0
                } as RaceSession;
            }).catch((error) => {
                this.$oruga.notification.open({
                    position: 'top',
                    message: error.message,
                    variant: "danger",
                });
            });
        },
        confirmDeleteSession(session: RaceSession) {
            if (session.uses > 0) {
                this.$oruga.notification.open({
                    position: 'top',
                    message: "No se puede elimiar esta sesión porque está siendo usada",
                    variant: "warning",
                });
                return;
            }

            // ToDo: Pedir confirmación
            this.deleteSession(session);
            /*
            this.$oruga.dialog.confirm({
                title: 'Eliminar sesión',
                message: `¿Estás seguro de que quieres <b>eliminar</b> la sesión ${session.name} (${session.code})? <br/>Esta acción se puede deshacer.`,
                confirmText: 'Eliminar sesión',
                type: 'danger',
                hasIcon: true,
                onConfirm: () => this.deleteSession(session),
            })*/
        },
        deleteSession(session: RaceSession) {
            sessionService.deleteSession(session).then((ok) => {

                // Elimino de la lista y por lo tanto de la tabla
                this.sessions.splice(this.sessions.findIndex(s => s.name === session.name),1);

                this.$oruga.notification.open({
                    position: 'top',
                    message: `Se ha eliminado correctamente la sesión ${session.name} (${session.code})`,
                    variant: "primary",
                });
            }).catch((error) => {
                this.$oruga.notification.open({
                    position: 'top',
                    message: error.message,
                    variant: "danger",
                });
            });
        }
    },
});
</script>