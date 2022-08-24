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
            <button class="button is-info" @click="showChangePassword()">
                <span class="icon">
                    <i class="fas fa-lock"></i>
                </span>
                <span>Cambiar contraseña</span>
            </button>
            <button class="button is-info" @click="showChangeMail()">
                <span class="icon">
                  <i class="fas fa-envelope"></i>
                </span>
                <span>Cambiar email</span>
            </button>
            <button class="button is-info" @click="showLinkTelegram()">
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

        <table class="table is-fullwidth">
            <thead>
                <tr>
                    <td></td>
                    <th v-for="methodName in methods">
                        {{ methodName }}
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Notificaciones genéricas con información</td>
                    <td>b</td>
                    <td>c</td>
                    <td>d</td>
                </tr>
            </tbody>
        </table>
    </div>

    <PrognoModal v-show="changePasswordModal.show" @close="closeChangePassword()" @save="changePassword()">
        <template v-slot:title>Cambiar contraseña</template>
        <template v-slot:content>
            <o-field label="Nueva contraseña">
                <o-input v-model="changePasswordModal.newPassword" name="password" type="password" expanded lazy></o-input>
            </o-field>
            <o-field label="Confirmar contraseña" message="Debes introducir tu contraseña actual para confirmar cambios en tus ajustes">
                <o-input v-model="changePasswordModal.confirmPassword" name="password" type="password" expanded lazy></o-input>
            </o-field>
        </template>
    </PrognoModal>

    <PrognoModal v-show="changeMailModal.show" @close="closeChangeMail()" @save="changeMail()">
        <template v-slot:title>Cambiar email</template>
        <template v-slot:content>
            <o-field label="Nueva email">
                <o-input v-model="changeMailModal.newMail" name="password" type="password" expanded lazy></o-input>
            </o-field>
            <o-field label="Confirmar contraseña" message="Debes introducir tu contraseña actual para confirmar cambios en tus ajustes">
                <o-input v-model="changeMailModal.confirmPassword" name="password" type="password" expanded lazy></o-input>
            </o-field>
        </template>
    </PrognoModal>

    <PrognoModal v-show="linkTelegramModal.show" @close="closeLinkTelegram()">
        <template v-slot:title>
            <p v-if="currentUser.preferences['telegram-id']">
                Tu cuenta está enlazada a Telegram
            </p>
            <p v-else>
                Enlazar a Telegram
            </p>
        </template>
        <template v-slot:content>
            <p v-if="currentUser.preferences['telegram-id']">
                Has iniciado sesión con tu cuenta #{{ currentUser.preferences["telegram-id"] }}
                    ({{ currentUser.preferences["telegram-firstname"] ?? "" }}, @{{ currentUser.preferences["telegram-username"] ?? "" }})
            </p>
            <p v-else>
                Enlazando tu cuenta a Telegram podrás recibir notificaciones o mejorar tu seguridad a través de una doble verificación.
            </p>
        </template>
        <template v-slot:footer>
            <button v-if="currentUser.preferences['telegram-id']" class="button is-danger" @click="unlinkTelegram()">Desvincular cuenta</button>
            <div v-else ref="telegramLoginButton"></div>
        </template>
    </PrognoModal>
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
import {notificationService, userService} from "@/_services";
import PrognoModal from "@/components/lib/PrognoModal.vue";

interface Timezone {
    id: string,
    offset: string,
}

export default defineComponent({
    name: "UserProfile",
    components: {
        PrognoModal,
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

        const userRequest = authStore.userRequest;

        return {currentUser, editedUser, userRequest, currentCommunity, emitter, dateDiff, humanDateTime, humanDate};
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
            methods: new Array<string>(),
            noPassword: false,

            changePasswordModal: {
                show: false,
                newPassword: '',
                confirmPassword: '',
            },
            changeMailModal: {
                show: false,
                newMail: '',
                confirmPassword: '',
            },
            linkTelegramModal: {
                show: false,
            }
        }
    },
    mounted() {
        axios.get<Dictionary<string, string>>('/timezones').then((result) => {
            this.timeZones = [];
            Object.entries(result).forEach(([id, offset]) => {
                this.timeZones.push({id, offset});
            });
        });
        notificationService.getNotificationMethods().then((result) => {
            this.methods = [];
            this.methods.push(...result);
        });

        // Login Telegram
        this.renderTelegramLoginAndScripts();

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
        },
        showChangePassword() {
            this.changePasswordModal.show = true;
        },
        closeChangePassword() {
            this.changePasswordModal.show = false;
        },
        changePassword() {
            console.log("Cambiando contraseña confirmada " + this.changePasswordModal.confirmPassword + " a la nueva " + this.changePasswordModal.newPassword);
            this.closeChangePassword();
        },

        showChangeMail() {
            this.changeMailModal.show = true;
        },
        closeChangeMail() {
            this.changeMailModal.show = false;
        },
        changeMail() {
            console.log("Cambiando email a " + this.changeMailModal.newMail);
            this.closeChangeMail();
        },
        renderTelegramLoginAndScripts() {
            if (!this.currentUser.preferences['telegram-id']) {
                // Solo mostrar este botón si no está iniciado sesión
                const script = document.createElement('script')
                script.async = true
                script.src = 'https://telegram.org/js/telegram-widget.js?19'
                script.setAttribute('data-size', 'medium')
                script.setAttribute('data-userpic', 'false')
                script.setAttribute('data-telegram-login', 'PrognoSportsBot')
                script.setAttribute('data-request-access', 'write')
                // @ts-ignore
                window.onTelegramAuth = this.onTelegramAuth
                script.setAttribute('data-onauth', 'window.onTelegramAuth(user)')
                // @ts-ignore
                this.$refs.telegramLoginButton.appendChild(script);
            }
        },
        showLinkTelegram() {
            this.linkTelegramModal.show = true;
        },
        closeLinkTelegram() {
            this.linkTelegramModal.show = false;
        },
        unlinkTelegram() {
            userService.unlinkTelegram(this.currentUser).then(() => {
                this.$oruga.notification.open({
                    position: 'top',
                    message: "Cuenta desvinculada de Telegram",
                    variant: "warning",
                });
                this.userRequest().then(() => {
                    this.closeLinkTelegram();
                    this.renderTelegramLoginAndScripts();
                });
            });
        },
        onTelegramAuth(telegramPayload: {'telegram-id': number, 'telegram-firstname': string | null, 'telegram-username': string | null}) {
            console.log(telegramPayload);
            userService.linkTelegram(this.currentUser, telegramPayload).then(() => {
                this.$oruga.notification.open({
                    position: 'top',
                    message: "Cuenta enlazada a Telegram",
                    variant: "info",
                });
                this.userRequest().then(() => {
                    this.closeLinkTelegram();
                });
            });
        }
    }
});
</script>

<style lang="css">
</style>