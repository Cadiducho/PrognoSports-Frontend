<template>
    <div class="block" v-if="gridPos !== undefined">
        <div class="card has-text-centered" v-bind:style="gridCardStyle(gridPos.driver)">
            <header class="card-header f1-card-header" v-bind:style="gridCardBackgroundStyle(gridPos.driver)" >
                <div class="tags">
                    <span class="tag is-dark">{{ gridPos.position }}º</span>
                    <span class="tag is-success">#{{ gridPos.driver.number }}</span>
                    <span v-if="gridPos.note !== undefined" class="tag is-warning">!</span>
                </div>
            </header>
            <div class="f1-card-main">
                <div class="f1-card-main-description">
                    <o-tooltip :label="fullname(gridPos.driver)" variant="info" class=f1-card-driver>
                        {{ gridPos.driver.code }}
                    </o-tooltip>
                </div>
            </div>
        </div>
    </div>
</template>


<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";
import {StartGridPosition} from "@/types/StartGridPosition";
import {Driver} from "@/types/Driver";

@Component
export default class StartGridCard extends Vue {
    @Prop() gridPos!: StartGridPosition;

    public fullname(driver: Driver) {
        return driver.firstname + " " + driver.lastname;
    }

    public gridCardStyle(driver: Driver) {
        return {
            'border': '1px solid #'+ driver.team.teamcolor,
        }
    }

    public gridCardBackgroundStyle(driver: Driver) {
        return {
            'background-color': '#'+ driver.team.teamcolor,
        }
    }
}
</script>

<style scoped>

.f1-card-header {
    padding: 5px 0;
}

.f1-card-main {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 10px 0;
}

.f1-card-driver {
    display: block;
    font-size: 17px;
}

.f1-card-main-description {
    font-size: 12px;
    text-align: center;
}
</style>