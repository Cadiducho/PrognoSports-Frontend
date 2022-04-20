<template>
    <div class="card">
        <div class="card-content">
            <div class="media">
                <div class="media-left">
                    <figure class="image is-64x64 zuga">
                        <img :src="userProfileImage(user)" alt="Profile image" class="profile-image is-rounded" />
                    </figure>
                </div>
                <hr />
                <div class="media-content">
                    <div style="media-content-header">
                        <span class="title is-4 multiline-text">{{ user.username }}</span>

                        <span class="content-rank">
                            <span :style="{ color: `#${user.rank.color}`, 'border-color': `#${user.rank.color}` }" class="content-rank-name">
                                {{ user.rank.name }}
                            </span>
                        </span>
                    </div>
                    <p v-if="user.bio" class="subtitle is-6 multiline-text">{{ user.bio }}</p>
                </div>
            </div>
            <div class="divisor"></div>
            <div class="content">
                <p v-if="user.location" class="content-icon content-location">
                    <span class="icon is-small">
                        <i class="fas fa-map-marker-alt fa-sm mr-2"></i>
                    </span>
                    <span class="multiline-text">{{ user.location }}</span>
                </p>
                <p class="content-icon content-last_activity">
                    <span class="icon is-small">
                        <i class="fas fa-clock fa-sm mr-2"></i>
                    </span>
                    <span class="multiline-text">Visto por última vez {{ user.last_activity | dateDiff }}</span>
                </p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { User } from "@/types/User";

@Component
export default class ScoreComponents extends Vue {
    @Prop({ required: true }) user!: User;
}
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
