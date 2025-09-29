<template>
  <PCard>
    <UserProfileCard
      :profile="currentUser"
      :show-settings-button="false"
    />

    <hr>

    <UserLevelResume :user="currentUser" />
  </PCard>

  <PCard class="mt-1">
    <PTitle type="subtitle">
      Cuenta
    </PTitle>

    <div class="buttons">
      <!-- ToDo: Modales con los ajustes de cuenta -->
      <button
        class="button is-info"
        @click="showChangePassword()"
      >
        <span class="icon">
          <i class="fas fa-lock" />
        </span>
        <span>Cambiar contraseña</span>
      </button>
      <button
        class="button is-info"
        @click="showChangeMail()"
      >
        <span class="icon">
          <i class="fas fa-envelope" />
        </span>
        <span>Cambiar email</span>
      </button>
      <button
        class="button is-info"
        @click="showLinkTelegram()"
      >
        <span class="icon">
          <i class="fab fa-telegram" />
        </span>
        <span>Enlazar cuenta a Telegram</span>
      </button>
    </div>
  </PCard>

  <PCard class="mt-1">
    <form @submit.prevent="save()">
      <div class="columns">
        <div class="column">
          <PTitle type="subtitle">
            Datos
          </PTitle>

          <PField label="Nombre">
            <PInput
              v-model="editedUser.username"
              name="name"
              expanded
              lazy
            />
          </PField>

          <PField label="Biografía">
            <PInput
              v-model="editedUser.bio"
              name="bio"
              expanded
              lazy
            />
          </PField>

          <PField label="Localización">
            <PInput
              v-model="editedUser.location"
              name="location"
              expanded
              lazy
            />
          </PField>

          <PField label="Cumpleaños">
            <Calendar
              :value="editedUser.birthdate"
              :options="calendarOptions"
              @input="editedUser.birthdate = $event;"
            />
          </PField>
        </div>

        <div class="column">
          <PTitle type="subtitle">
            Preferencias
          </PTitle>

          <label class="label">Nombres de los equipos</label>
          <div class="field">
            <PRadio
              v-model="editedUser.preferences['use-long-team-names']"
              :value="false"
            >
              Mostrar nombres cortos
            </PRadio>
          </div>
          <div class="field">
            <PRadio
              v-model="editedUser.preferences['use-long-team-names']"
              :value="true"
            >
              Mostrar nombres largos y con empresas patrocinadoras
            </PRadio>
          </div>

          <label class="label">Privacidad</label>
          <div class="field">
            <PRadio
              v-model="editedUser.preferences['hide-tipps-until-start']"
              :value="false"
            >
              No ocultar mis pronósticos
            </PRadio>
          </div>
          <div class="field">
            <PRadio
              v-model="editedUser.preferences['hide-tipps-until-start']"
              :value="true"
            >
              Ocultar mis pronósticos hasta la hora de cierre
            </PRadio>
          </div>

          <p-select
            v-model="editedUser.preferences['time-zone-id']"
            label="Zona horaria para las notificaciones"
            placeholder="Selecciona una zona horaria para tus notificaciones"
            class="mb-3"
          >
            <option
              v-for="(value, tz) in timezones"
              :key="tz"
              :value="tz"
            >
              {{ tz }} (UTC {{ value }})
            </option>
          </p-select>
        </div>
      </div>

      <hr>

      <PField
        label="Contraseña actual"
        message="Debes introducir tu contraseña actual para confirmar cambios en tus ajustes"
        :variant="noPassword ? 'danger' : ''"
      >
        <PInput
          v-model="editedUser.password"
          name="password"
          type="password"
          expanded
          lazy
        />
      </PField>
      <PButton
        native-type="submit"
        :disabled="submiting"
      >
        Guardar cambios
      </PButton>
    </form>
  </PCard>

  <PCard
    v-if="!isLoading"
    class="mt-1"
  >
    <div class="columns">
      <div class="column">
        <PTitle type="subtitle">
          Notificaciones
        </PTitle>

        <PrognoAlert
          variant="info"
          message="Pulsa sobre los iconos para ajustar tus preferencias de notificaciones."
        />

        <NotificationSettingsTable />
      </div>
      <div class="column">
        <AuthTokenList />
      </div>
    </div>
  </PCard>

  <PrognoModal
    v-show="changePasswordModal.show"
    @close="closeChangePassword()"
    @handle="changePassword()"
  >
    <template #title>
      Cambiar contraseña
    </template>
    <template #content>
      <PField label="Nueva contraseña">
        <PInput
          v-model="changePasswordModal.newPassword"
          name="newPassword"
          type="password"
        />
      </PField>
      <PField
        label="Contraseña actual"
        message="Debes introducir tu contraseña actual para confirmar cambios en tus ajustes"
      >
        <PInput
          v-model="changePasswordModal.confirmPassword"
          name="confirmPassword"
          type="password"
        />
      </PField>
    </template>
  </PrognoModal>

  <PrognoModal
    v-show="changeMailModal.show"
    @close="closeChangeMail()"
    @handle="changeMail()"
  >
    <template #title>
      Cambiar email
    </template>
    <template #content>
      <PField label="Nuevo email">
        <PInput
          v-model="changeMailModal.newMail"
          name="mail"
          type="email"
        />
      </PField>
      <PField
        label="Confirmar contraseña"
        message="Debes introducir tu contraseña actual para confirmar cambios en tus ajustes"
      >
        <PInput
          v-model="changeMailModal.confirmPassword"
          name="confirmPassword"
          type="password"
        />
      </PField>
    </template>
  </PrognoModal>

  <PrognoModal
    v-show="linkTelegramModal.show"
    @close="closeLinkTelegram()"
  >
    <template #title>
      <p v-if="currentUser.preferences['telegram-id']">
        Tu cuenta está enlazada a Telegram
      </p>
      <p v-else>
        Enlazar a Telegram
      </p>
    </template>
    <template #content>
      <p v-if="currentUser.preferences['telegram-id']">
        Has iniciado sesión con tu cuenta #{{ currentUser.preferences["telegram-id"] }}
        ({{ currentUser.preferences["telegram-firstname"] ?? "" }}, @{{ currentUser.preferences["telegram-username"] ?? "" }})
      </p>
      <p v-else>
        Enlazando tu cuenta a Telegram podrás recibir notificaciones o mejorar tu seguridad a través de una doble verificación.
      </p>
    </template>
    <template #footer>
      <button
        v-if="currentUser.preferences['telegram-id']"
        class="button is-danger"
        @click="unlinkTelegram()"
      >
        Desvincular cuenta
      </button>
      <div ref="telegramLoginButton" />
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
import PRadio from "@/components/lib/forms/PRadio.vue";
import PButton from "@/components/lib/forms/PButton.vue";
import PSelect from "@/components/lib/forms/PSelect.vue";
import PField from "@/components/lib/forms/PField.vue";
import PInput from "@/components/lib/forms/PInput.vue";
import PCard from "@/components/lib/PCard.vue";
import PTitle from "@/components/lib/PTitle.vue";
import NotificationSettingsTable from "@/components/user/settings/NotificationSettingsTable.vue";

export default defineComponent({
  name: "UserSettings",
  components: {
    NotificationSettingsTable,
    PTitle,
    PCard,
    PInput,
    PField,
    PSelect,
    PButton,
    PRadio,
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
      timezones: {} as Dictionary<string, string>,
      isLoading: true,
      noPassword: false,
      submiting: false,

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
  async mounted() {
    try {
      const timeZonesList = await notificationService.getTimeZonesList();
      this.timezones = timeZonesList;
      this.isLoading = false;
    } catch (reason) {
      notificationService.showNotification("Error al cargar los ajustes", "error");
      console.error(reason);
    }

    // Login Telegram
    this.renderTelegramLoginAndScripts();
  },
  methods: {
    async save() {
      if (!this.editedUser.password) {
        notificationService.showNotification("Debes introducir tu contraseña actual para confirmar cambios en tus ajustes", "error");
        this.noPassword = true;
        return;
      }
      this.submiting = true;

      this.noPassword = false;
      try {
        await userService.updateUser(this.editedUser);
        notificationService.showNotification("Ajustes cambiados correctamente");

      } catch (reason: any) {
        notificationService.showNotification(reason.message, "error");
        console.error(reason);
        this.noPassword = true;
      } finally {
        this.submiting = false;
      }
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
        notificationService.showNotification(reason.message, "error");
        console.error(reason);
        this.noPassword = true;
      });
    },
    showChangeMail() {
      this.changeMailModal.show = true;
    },
    closeChangeMail() {
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
        notificationService.showNotification(reason.message, "error");
        console.error(reason);
        this.noPassword = true;
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
        // @ts-expect-error telegram api
        window.onTelegramAuth = this.onTelegramAuth;
        script.setAttribute('data-onauth', 'window.onTelegramAuth(user)');
        // @ts-expect-error telegram api
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
    onTelegramAuth(telegramPayload: { 'id': number, 'first_name': string | null, 'username': string | null }) {
      userService.linkTelegram(this.currentUser, telegramPayload).then(() => {
        notificationService.showNotification("Cuenta enlazada a Telegram");

        this.currentUser.preferences['telegram-id'] = telegramPayload.id;
        this.currentUser.preferences['telegram-firstname'] = telegramPayload.first_name;
        this.currentUser.preferences['telegram-username'] = telegramPayload.username;

        this.closeLinkTelegram();
      });
    }
  }
});
</script>
