<template>
    <div class="ui-card">
        <div class="ui-card-content">
            <div class="ui-media">
                <div class="ui-media-left">
                    <figure class="ui-image ui-image-64 zuga">
                        <img :src="objUser.profileImage()" alt="Profile image" class="profile-image rounded-full" />
                    </figure>
                </div>
                <hr />
                <div class="ui-media-content">
                    <div class="ui-media-content-header">
                        <span class="ui-title ui-title-4 multiline-text">{{ objUser.username }}</span>

                        <span class="content-rank">
                            <span :style="{ color: `#${objUser.rank.color}`, 'border-color': `#${objUser.rank.color}` }" class="content-rank-name">
                                {{ objUser.rank.name }}
                            </span>
                        </span>
                    </div>
                    <p v-if="objUser.bio" class="ui-subtitle ui-subtitle-6 multiline-text">{{ objUser.bio }}</p>
                </div>
            </div>
            <div class="divisor"></div>
            <div class="ui-content">
                <p v-if="objUser.location" class="content-icon content-location">
                    <span class="ui-icon ui-small">
                        <i class="fas fa-map-marker-alt fa-sm mr-2"></i>
                    </span>
                    <span class="multiline-text">{{ objUser.location }}</span>
                </p>
                <p class="content-icon content-last_activity">
                    <span class="ui-icon ui-small">
                        <i class="fas fa-clock fa-sm mr-2"></i>
                    </span>
                    <span class="multiline-text">Visto por última vez {{ dateDiff(objUser.last_activity) }}</span>
                </p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { User } from "@/types/User";
import {computed, defineComponent, PropType} from "vue";
import {useDayjs} from "@/composables/useDayjs";

export default defineComponent({
    name: "ScoreComponents",
    props: {
        user: {
            type: Object as PropType<User>,
            required: true,
        }
    },
    setup(props) {
        const dayjs = useDayjs();
        const dateDiff = dayjs.dateDiff;
        const objUser = computed(() => new User(props.user));
        return { dateDiff, objUser };
    }
});
</script>

<style lang="css" scoped>
.card {
    max-width: 350px;
    min-width: 350px;
    background-color: whitesmoke;
    -webkit-box-shadow: none;
    box-shadow: none;

    white-space: nowrap;
    overflow: hidden;
}

.divisor {
    display: block;
    position: relative;
    border-top: 0.1rem solid #dbdbdb;
    height: 0.1rem;
    margin: 0.2rem 0;
    text-align: center;
}

.card-content {
    padding: 0.7rem;
}

.title {
    margin-bottom: 0.25em;
}

.media {
    margin-bottom: 0.5rem;
}

.media-content-header {
    display: flex; 
    justify-content: space-between;
}

.content {
    margin-top: 0.5rem;
}

.content-icon {
    margin-bottom: 0.5em;
}

.content-rank-name {
    border: 1px solid transparent;
    border-radius: 4px;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    display: inline-flex;

    padding-left: 0.5em;
    padding-right: 0.5em;

    text-align: center;
    white-space: nowrap;

    background-color: transparent;
}

.profile-image {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
}

.zuga {
    display: flex;
    align-items: center;
    justify-content: center;
}

.multiline-text {
    white-space: initial;
}
</style>
