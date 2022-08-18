<template>
    <article class="box">

        <UserProfileCard :profile="currentUser" :showSettingsButton="false" />

        <hr/>

        <UserLevelResume />

    </article>

    <div class="box">
        <h2 class="subtitle">Cuenta</h2>

        <div class="buttons">
            <!-- ToDo: Modales con los ajustes de cuenta -->
            <button class="button is-info">
                <span class="icon">
                  <i class="fas fa-lock"></i>
                </span>
                <span>Cambiar contraseña</span>
            </button>
            <button class="button is-info">
                <span class="icon">
                  <i class="fas fa-envelope"></i>
                </span>
                <span>Cambiar email</span>
            </button>
            <button class="button is-info">
                <span class="icon">
                  <i class="fab fa-telegram"></i>
                </span>
                <span>Enlazar cuenta a Telegram</span>
            </button>
        </div>
    </div>

    <section class="box">
        <form @submit.prevent="save()">
            <div class="columns">
                <div class="column">

                    <h2 class="subtitle">Datos</h2>

                    <o-field label="Nombre">
                        <o-input v-model="editedUser.username" name="name" expanded lazy></o-input>
                    </o-field>

                    <o-field label="Imagen de perfil">
                        <o-input v-model="editedUser.profileImageUrl" name="profileImageUrl" expanded lazy></o-input>
                    </o-field>

                    <o-field label="Biografía">
                        <o-input v-model="editedUser.bio" name="bio" expanded lazy></o-input>
                    </o-field>

                    <o-field label="Localización">
                        <o-input v-model="editedUser.location" name="location" expanded lazy></o-input>
                    </o-field>

                    <o-field label="Cumpleaños">
                        <bulma_calendar :value="editedUser.birthdate" :options="calendarOptions" v-on:input="editedUser.birthdate = $event;" />
                    </o-field>

                </div>

                <div class="column">

                    <h2 class="subtitle">Preferencias</h2>

                    <label class="label">Nombres de los equipos</label>
                    <div class="field">
                        <o-radio v-model="editedUser.preferences['use-long-team-names']" native-value="false">
                            Mostrar nombres cortos
                        </o-radio>
                    </div>
                    <div class="field">
                        <o-radio v-model="editedUser.preferences['use-long-team-names']" native-value="true">
                            Mostrar nombres largos y con empresas patrocinadoras
                        </o-radio>
                    </div>

                    <label class="label">Privacidad</label>
                    <div class="field">
                        <o-radio v-model="editedUser.preferences['hide-tipps-until-start']" native-value="false">
                            No ocultar mis pronósticos
                        </o-radio>
                    </div>
                    <div class="field">
                        <o-radio v-model="editedUser.preferences['hide-tipps-until-start']" native-value="true">
                            Ocultar mis pronósticos hasta la hora de cierre
                        </o-radio>
                    </div>

                    <o-field label="Zona Horaria">
                        <o-select v-model="editedUser.preferences['time-zone-id']" placeholder="Selecciona una zona horaria" expanded>
                            <option v-for="tz in timeZones"
                                    :value="tz.id">{{ tz.id }} (UTC {{ tz.offset }})</option>
                        </o-select>
                    </o-field>
                </div>

            </div>

            <hr />

            <o-field label="Contraseña actual" message="Debes introducir tu contraseña actual para confirmar cambios en tus ajustes"
                :variant="noPassword ? 'danger' : ''">
                <o-input v-model="editedUser.password" name="password" type="password" expanded lazy></o-input>
            </o-field>
            <button class="button is-primary" type="submit">
                Guardar cambios
            </button>
        </form>
    </section>


    <div class="box">
        <!-- ToDo: Sistema de notificaciones. -->
        <h2 class="subtitle">Notificaciones</h2>
    </div>

</template>

<script lang="ts">
import UserLevelResume from "@/components/user/UserLevelResume.vue";
import UserProfileCard from "@/components/user/UserProfileCard.vue";
import bulma_calendar from "bulma-calendar/dist/components/vue/bulma_calendar.vue";

import {defineComponent} from "vue";
import {useAuthStore} from "@/store/authStore";
import {useCommunityStore} from "@/store/communityStore";
import useEmitter from "@/composables/useEmitter";
import {useDayjs} from "@/composables/useDayjs";
import axios from "axios";
import {Dictionary} from "@/types/Dictionary";
import {User} from "@/types/User";
import {userService} from "@/_services";

interface Timezone {
    id: string,
    offset: string,
}

export default defineComponent({
    name: "UserProfile",
    components: {
        UserLevelResume,
        UserProfileCard,
        bulma_calendar
    },
    setup() {
        const dayjs = useDayjs();
        const emitter = useEmitter();
        const authStore = useAuthStore();
        const communityStore = useCommunityStore();

        const dateDiff = dayjs.dateDiff;
        const humanDateTime = dayjs.humanDateTime;
        const humanDate = dayjs.humanDate;
        const currentUser = authStore.user;
        const currentCommunity = communityStore.community;

        const editedUser = currentUser as Partial<User>;
        delete editedUser.currentCommunity;

        return {currentUser, editedUser, currentCommunity, emitter, dateDiff, humanDateTime, humanDate};
    },
    data() {
        return {
            calendarOptions: {
                dateFormat: 'dd/MM/yyyy',
                lang: 'es',
                showTodayButton: false,
                showClearButton: false,
                weekStart: 1,
                validateLabel: 'Confirmar',
                minuteSteps: 1,
                type: 'date',
            },
            timeZones: new Array<Timezone>(),
            noPassword: false,
        }
    },
    mounted() {
        axios.get<Dictionary<string, string>>('/timezones').then((result) => {
            Object.entries(result).forEach(([id, offset]) => {
                this.timeZones.push({id, offset});
            });
        })
    },
    methods: {
        save() {
            if (!this.editedUser.password) {
                this.$oruga.notification.open({
                    position: 'top',
                    message: "Debes introducir tu contraseña actual para confirmar cambios en tus ajustes",
                    variant: "danger",
                });
                this.noPassword = true;
                return;
            }

            this.noPassword = false;
            console.log("save" + JSON.stringify(this.editedUser));
            userService.updateUser(this.editedUser).then(() => {
                this.$oruga.notification.open({
                    position: 'top',
                    message: "Ajustes cambiados correctamente",
                    variant: "info",
                });
            }).catch((reason) => {
                if (reason.code === 600) {
                    this.$oruga.notification.open({
                        position: 'top',
                        message: "Contraseña incorrecta",
                        variant: "danger",
                    });
                    this.noPassword = true;
                }
            });
        }
    }
});
</script>

<style lang="css">
</style>