<template>
    <article class="box">

        <UserProfileCard :profile="currentUser" :showSettingsButton="false" />

        <hr/>

        <UserLevelResume :user="currentUser" />

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

                    <o-field label="Biografía">
                        <o-input v-model="editedUser.bio" name="bio" expanded lazy></o-input>
                    </o-field>

                    <o-field label="Localización">
                        <o-input v-model="editedUser.location" name="location" expanded lazy></o-input>
                    </o-field>

                    <o-field label="Cumpleaños">
                        <Calendar :value="editedUser.birthdate" :options="calendarOptions" v-on:input="editedUser.birthdate = $event;" />
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

    <div v-if="!isLoading" class="box">
        <div class="columns">
            <div class="column">

                <h2 class="subtitle">Notificaciones</h2>

                <PrognoAlert message="Pulsa sobre los iconos para ajustar tus preferencias de notificaciones." />

                <table class="table is-fullwidth">
                    <thead>
                    <tr>
                        <td></td>
                        <th v-for="(methodLabel, methodId) in notificationMethods">
                            {{ methodLabel }}
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(typeLabel, typeId) in notificationTypes">
                        <td>{{ typeLabel }}</td>

                        <td v-for="(methodLabel, methodId) in notificationMethods">
                            <template v-if="currentUser.preferences[`notify-${typeId}-${methodId}`]">
                                <span class="icon has-text-success cursor-pointer" @click="toggleNotification(typeId, typeLabel, methodId, methodLabel)">
                                    <i class="fas fa-check"></i>
                                </span>
                            </template>
                            <template v-else>
                                <span class="icon has-text-danger cursor-pointer" @click="toggleNotification(typeId, typeLabel, methodId, methodLabel)">
                                    <i class="fas fa-times"></i>
                                </span>
                            </template>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div class="column">
                <AuthTokenList />
            </div>
        </div>

    </div>

    <PrognoModal v-show="changePasswordModal.show" @close="closeChangePassword()" @handle="changePassword()">
        <template v-slot:title>Cambiar contraseña</template>
        <template v-slot:content>
            <o-field label="Nueva contraseña">
                <o-input v-model="changePasswordModal.newPassword" name="newPassword" type="password" expanded lazy></o-input>
            </o-field>
            <o-field label="Contraseña actual" message="Debes introducir tu contraseña actual para confirmar cambios en tus ajustes">
                <o-input v-model="changePasswordModal.confirmPassword" name="confirmPassword" type="password" expanded lazy></o-input>
            </o-field>
        </template>
    </PrognoModal>

    <PrognoModal v-show="changeMailModal.show" @close="closeChangeMail()" @handle="changeMail()">
        <template v-slot:title>Cambiar email</template>
        <template v-slot:content>
            <o-field label="Nuevo email">
                <o-input v-model="changeMailModal.newMail" name="mail" type="email" expanded lazy></o-input>
            </o-field>
            <o-field label="Confirmar contraseña" message="Debes introducir tu contraseña actual para confirmar cambios en tus ajustes">
                <o-input v-model="changeMailModal.confirmPassword" name="confirmPassword" type="password" expanded lazy></o-input>
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
            <div ref="telegramLoginButton"></div>
        </template>
    </PrognoModal>
</template>

<script lang="ts">
import UserLevelResume from "@/components/user/UserLevelResume.vue";
import UserProfileCard from "@/components/user/UserProfileCard.vue";

import {defineComponent} from "vue";
import {useAuthStore} from "@/store/authStore";
import {useCommunityStore} from "@/store/communityStore";
import useEmitter from "@/composables/useEmitter";
import {useDayjs} from "@/composables/useDayjs";
import {User} from "@/types/User";
import {notificationService, userService} from "@/_services";
import PrognoModal from "@/components/lib/PrognoModal.vue";
import AuthTokenList from "@/components/user/settings/AuthTokenList.vue";
import Calendar from "@/components/lib/Calendar.vue";
import {Dictionary} from "@/types/Dictionary";
import PrognoAlert from "@/components/lib/PrognoAlert.vue";

export default defineComponent({
    name: "UserSettings",
    components: {
        PrognoAlert,
        AuthTokenList,
        PrognoModal,
        UserLevelResume,
        UserProfileCard,
        Calendar
    },
    setup() {
        const dayjs = useDayjs();
        const emitter = useEmitter();
        const authStore = useAuthStore();
        const communityStore = useCommunityStore();

        const dateDiff = dayjs.dateDiff;
        const humanDateTime = dayjs.humanDateTime;
        const humanDate = dayjs.humanDate;
        const currentUser = authStore.loggedUser;
        const currentCommunity = communityStore.currentCommunity;

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
            notificationMethods: {} as Dictionary<string, string>,
            notificationTypes: {} as Dictionary<string, string>,
            isLoading: true,
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
        Promise.all([
            notificationService.getNotificationMethods(),
            notificationService.getNotificationTypes(),
        ]).then(([notificationMethods, notificationTypes]) => {
            this.notificationMethods = notificationMethods;
            this.notificationTypes = notificationTypes;
            this.isLoading = false;
        }).catch((reason) => {
            notificationService.showNotification("Error al cargar los ajustes", "error");
            console.error(reason);
        });

        // Login Telegram
        this.renderTelegramLoginAndScripts();
    },
    methods: {
        save() {
            if (!this.editedUser.password) {
                notificationService.showNotification("Debes introducir tu contraseña actual para confirmar cambios en tus ajustes", "error");
                this.noPassword = true;
                return;
            }

            this.noPassword = false;
            userService.updateUser(this.editedUser).then(() => {
                notificationService.showNotification("Ajustes cambiados correctamente");
            }).catch((reason) => {
                if (reason.code === 600) {
                    notificationService.showNotification("Contraseña incorrecta", "error");
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
            const payload = {
                password: this.changePasswordModal.confirmPassword,
                newPassword: this.changePasswordModal.newPassword,
            };
            userService.changePasswordInSettings(this.currentUser, payload).then(() => {
                notificationService.showNotification("Contraseña cambiada correctamente");

                this.closeChangePassword();
            }).catch((reason) => {
                if (reason.code === 600) {
                    notificationService.showNotification("Contraseña incorrecta", "error");
                    this.noPassword = true;
                }
            });
        },
        showChangeMail() {
            this.changeMailModal.show = true;
        },
        closeChangeMail() {
            console.log("close")
            this.changeMailModal.show = false;
        },
        changeMail() {
            const payload = {
                password: this.changeMailModal.confirmPassword,
                email: this.changeMailModal.newMail,
            };
            userService.changeEmail(this.currentUser, payload).then(() => {
                notificationService.showNotification("Email cambiado correctamente");

                this.closeChangeMail();
            }).catch((reason) => {
                if (reason.code === 600) {
                    notificationService.showNotification("Contraseña incorrecta", "error");
                    this.noPassword = true;
                } else if (reason.code === 770) {
                    notificationService.showNotification("Email ya en uso por otro usuario", "error");
                    this.noPassword = true;
                } else if (reason.code === 700) {
                    notificationService.showNotification("Email inválido", "error");
                    this.noPassword = true;
                }
            });
        },
        renderTelegramLoginAndScripts() {
            if (!this.currentUser.preferences['telegram-id']) {
                // Solo mostrar este botón si no está iniciado sesión
                const script = document.createElement('script');
                script.async = true;
                script.src = 'https://telegram.org/js/telegram-widget.js?19';
                script.setAttribute('data-size', 'medium');
                script.setAttribute('data-userpic', 'false');
                script.setAttribute('data-telegram-login', 'PrognoSportsBot');
                script.setAttribute('data-request-access', 'write');
                // @ts-ignore
                window.onTelegramAuth = this.onTelegramAuth;
                script.setAttribute('data-onauth', 'window.onTelegramAuth(user)');
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
                notificationService.showNotification("Cuenta desvinculada de Telegram", "action");

                this.currentUser.preferences['telegram-id'] = '';
                this.currentUser.preferences['telegram-firstname'] = '';
                this.currentUser.preferences['telegram-username'] = '';

                this.closeLinkTelegram();
                this.renderTelegramLoginAndScripts();
            });
        },
        onTelegramAuth(telegramPayload: {'id': number, 'first_name': string | null, 'username': string | null}) {
            userService.linkTelegram(this.currentUser, telegramPayload).then(() => {
                notificationService.showNotification("Cuenta enlazada a Telegram");

                this.currentUser.preferences['telegram-id'] = telegramPayload.id;
                this.currentUser.preferences['telegram-firstname'] = telegramPayload.first_name;
                this.currentUser.preferences['telegram-username'] = telegramPayload.username;

                this.closeLinkTelegram();
            });
        },
        toggleNotification(typeId: string, typeLabel: string, methodId: string, methodLabel: string) {
            this.currentUser.preferences[`notify-${typeId}-${methodId}`] = !this.currentUser.preferences[`notify-${typeId}-${methodId}`];

            notificationService.changeNotificationPreference(typeId, methodId, this.currentUser.preferences[`notify-${typeId}-${methodId}`]).then(() => {
                notificationService.showNotification(`Notificaciones de ${typeLabel} por ${methodLabel} ${this.currentUser.preferences[`notify-${typeId}-${methodId}`] ? 'activadas' : 'desactivadas'}`);
            });

        }
    }
});
</script>