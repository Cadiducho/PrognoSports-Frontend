<template>
    <article class="media">
        <div class="media-left">
            <figure class="image is-64x64">
                <img class="is-rounded" :src="userProfileImage(user)" alt="Profile Image">
            </figure>
        </div>
        <div class="media-content">
            <div class="content">
                <p class="overflow">
                    <strong>{{ user.username }}  <b-tag v-bind:style="styleRankTag(user.rank)">{{ user.rank.name }}</b-tag></strong>
                    <span class="icon-text is-size-7">
                        <span class="icon">
                            <i class="fas fa-clock"></i>
                        </span>
                        {{ user.last_activity | dateDiff }}
                    </span>
                    <br>
                    {{ user.bio }}
                </p>
            </div>
        </div>
    </article>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";
import {User} from "@/types/User";
import {UserRank} from "@/types/UserRank";

@Component
export default class ScoreComponents extends Vue {
    @Prop({required: true}) user!: User;
}
</script>

<style lang="css">
.overflow {
    overflow-wrap: break-word;
}
</style>