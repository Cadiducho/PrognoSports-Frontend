<template>
  <section class="w-full py-6">
    <PContainer size="lg">
      <div class="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <PEditableImage
          v-if="!showSettingsButton"
          class="mx-auto w-full max-w-sm"
          :src="profile.profileImage()"
          alt="Profile image"
          label="Cambiar imagen de perfil"
          @select="onFileSelected"
        />
        <figure
          v-else
          class="relative mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800"
        >
          <img
            class="h-full w-full object-cover"
            :src="profile.profileImage()"
            alt="Profile image"
          >
        </figure>
        <div class="min-w-0 space-y-1 text-gray-700 dark:text-gray-300">
          <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <PTitle
                tag="p"
                type="title"
                class="font-bold"
              >
                {{ profile.username }}

                <PTag
                  :style="profile.styleRankTag()"
                >
                  {{ profile.rank.name }}
                </PTag>
              </PTitle>

              <p
                v-if="profile.bio"
                class="text-sm text-gray-600 dark:text-gray-300"
              >
                {{ profile.bio }}
              </p>
            </div>

            <PButton
              v-if="showSettingsButton && profile.id === currentUser.id"
              color="primary"
              icon="fas fa-cog"
              tag="router-link"
              to="/settings"
            >
              Ajustes
            </PButton>
          </div>

          <div class="block mb-1">
            <span class="inline-flex items-center gap-2">
              <span class="inline-flex shrink-0 items-center justify-center mr-2">
                <i class="fas fa-clock" />
              </span>
              Última conexión: {{ dateDiff(profile.last_activity) }}
            </span>
          </div>
          <div class="block mb-1">
            <span class="inline-flex items-center gap-2">
              <span class="inline-flex shrink-0 items-center justify-center mr-2">
                <i class="fas fa-calendar" />
              </span>
              Registrado el {{ humanDateTime(profile.created) }}
            </span>
          </div>
          <div
            v-if="profile.location"
            class="block mb-1"
          >
            <span class="inline-flex items-center gap-2">
              <span class="inline-flex shrink-0 items-center justify-center mr-2">
                <i class="fas fa-map-marker-alt" />
              </span>
              {{ profile.location }}
            </span>
          </div>
          <div
            v-if="profile.birthdate"
            class="block mb-1"
          >
            <span class="inline-flex items-center gap-2">
              <span class="inline-flex shrink-0 items-center justify-center mr-2">
                <i class="fas fa-birthday-cake" />
              </span>
              {{ humanDate(profile.birthdate) }}
            </span>
          </div>
        </div>
      </div>
    </PContainer>
  </section>

  <UploadFileModal
    v-model="showEditImageModal"
    :file="selectedFile"
    stencil-component="circle"
    @close="showEditImageModal = false"
    @submit-file="uploadProfileImage"
  >
    <template #title>
      Cambiar imagen de perfil
    </template>
    <template #label>
      ¿Quieres cambiar tu imagen de perfil?
    </template>
  </UploadFileModal>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import {useDayjs} from "@/composables/useDayjs";
import {useAuthStore} from "@/store/authStore";
import {useCommunityStore} from "@/store/communityStore";
import {User} from "@/types/User";
import PTag from "@/components/lib/PTag.vue";
import UploadFileModal from "@/components/lib/UploadFileModal.vue";
import {notificationService, userService} from "@/_services";
import PButton from "@/components/lib/forms/PButton.vue";
import PTitle from "@/components/lib/PTitle.vue";
import PEditableImage from "@/components/lib/PEditableImage.vue";
import PContainer from "@/components/lib/PContainer.vue";

export default defineComponent({
    name: "UserProfileCard",
    components: {
    PTitle,
    PContainer,
    PEditableImage,
      PButton,
        UploadFileModal,
        PTag,
    },
    props: {
        profile: {
            type: Object as PropType<User>,
            required: true
        },
        showSettingsButton: {
            type: Boolean,
            required: true,
        }
    },
    setup() {
        const dayjs = useDayjs();
        const authStore = useAuthStore();
        const communityStore = useCommunityStore();

        const dateDiff = dayjs.dateDiff;
        const humanDateTime = dayjs.humanDateTime;
        const humanDate = dayjs.humanDate;
        const currentUser = authStore.loggedUser;

        const currentCommunity = communityStore.currentCommunity;
        return {currentUser, currentCommunity, dateDiff, humanDateTime, humanDate};
    },
    data() {
        return {
            showEditImageModal: false,
            selectedFile: null as File | null,
        }
    },
    methods: {
        onFileSelected(file: File) {
            this.selectedFile = file;
            this.showEditImageModal = true;
        },
        uploadProfileImage(blob: Blob) {
            if (blob.size > 2_097_152) {
                notificationService.showNotification("El archivo escogido es demasiado grande. El tamaño máximo es de 2Mb.", "error");
                return;
            }

            userService.changeProfileImage(this.currentUser, blob).then(() => {
                notificationService.showNotification("¡Has cambiado tu imagen de perfil!");
                this.currentUser.changedProfileImage = blob;
            }).catch(() => {
                notificationService.showNotification("Ha ocurrido un error cambiado tu imagen de perfil", "error");
            });
        }
    }
});
</script>
