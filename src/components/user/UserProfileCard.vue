<template>

    <div class="section">
        <div class="container">
            <div class="columns is-mobile">
                <div class="column is-1"></div>
                <div class="column">
                    <figure class="image">
                        <img :class="{ photoOpacity : !showSettingsButton}" :src="profile.profileImage()" alt="Profile image"/>

                        <label v-if="!showSettingsButton" class="icon edit-icon">
                            <i class="fa fa-camera"></i>
                            <input @change="onFileChange" accept="image/*" tabindex="-1" type="file" hidden>
                        </label>
                    </figure>
                </div>
                <div class="column is-1"></div>
                <div class="column is-two-thirds content">
                    <p class="is-flex is-mobile is-justify-content-space-between">
                        <span class="title is-bold">
                            {{ profile.username }}

                            <span class="tag" :style="profile.styleRankTag()">{{ profile.rank.name }}</span>
                        </span>

                        <o-button v-if="showSettingsButton && profile.id === currentUser.id"
                                  variant="primary" icon-left="cog" tag="router-link" to="/settings">
                            Ajustes
                        </o-button>
                    </p>
                    <p v-if="profile.bio">
                        <span class="subtitle">
                            <small>{{ profile.bio }}</small>
                        </span>
                    </p>

                    <div class="block mb-1">
                        <span class="icon-text">
                            <span class="icon mr-2">
                                <i class="fas fa-clock"></i>
                            </span>
                            Última conexión: {{ dateDiff(profile.last_activity) }}
                        </span>
                    </div>
                    <div class="block mb-1">
                        <span class="icon-text">
                            <span class="icon mr-2">
                                <i class="fas fa-calendar"></i>
                            </span>
                            Registrado el {{ humanDateTime(profile.created) }}
                        </span>
                    </div>
                    <div v-if="profile.location" class="block mb-1">
                        <span class="icon-text">
                            <span class="icon mr-2">
                                <i class="fas fa-map-marker-alt"></i>
                            </span>
                            {{ profile.location }}
                        </span>
                    </div>
                    <div v-if="profile.birthdate" class="block mb-1">
                        <span class="icon-text">
                            <span class="icon mr-2">
                                <i class="fas fa-birthday-cake"></i>
                            </span>
                            {{ humanDate(profile.birthdate) }}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <ChangeImageModal v-show="showEditImageModal" @close="showEditImageModal = false" :file="selectedFile" />

</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import {useDayjs} from "@/composables/useDayjs";
import {useAuthStore} from "@/store/authStore";
import {useCommunityStore} from "@/store/communityStore";
import {User} from "@/types/User";
import PrognoModal from "@/components/lib/PrognoModal.vue";
import ChangeImageModal from "@/components/user/settings/ChangeImageModal.vue";

export default defineComponent({
    name: "UserProfileCard",
    components: {
        ChangeImageModal,
        PrognoModal
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

        const currentCommunity = communityStore.community;
        return {currentUser, currentCommunity, dateDiff, humanDateTime, humanDate};
    },
    data() {
        return {
            showEditImageModal: false,
            selectedFile: null,
        }
    },
    methods: {
        onFileChange(e: any) {
            this.showEditImageModal = false;
            this.selectedFile = null;

            let file = e.target.files[0];
            if (file) {
                this.selectedFile = file;
                this.showEditImageModal = true;
            }
        },
    }
});
</script>

<style lang="scss" scoped>
@import "bulma/sass/utilities/_all.sass";

.photoOpacity {
    opacity: 0.75;
}

.edit-icon {
    font-size: 1.2rem;
    opacity: 0.85;
    position: absolute;
    color: #fff;
    bottom: 50%;
    left: 50%;
    i {
        background: hsl(171, 100%, 41%);
        padding: 1.5rem;
        border-radius: 50%;
    }
    i:hover {
        background: #00c4a7;
    }
}

// Resolución móvil
@media screen and (max-width: 768px) {
    .image img {
        max-width: 50%;
    }
    .edit-icon {
        left: 25%;
    }
}
</style>