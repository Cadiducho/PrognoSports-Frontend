<template>
    <div id="startGridComponent" class="box" v-if="grid !== undefined">
        <nav class="is-flex is-justify-content-space-between">
            <h3>Parrilla de Salida</h3>

            <b-field v-if="Object.keys(chosenSession).length && availableSessions.length > 1"
                     label="Sesión" :label-position="'on-border'">
                <b-select v-model="chosenSession" placeholder="Selecciona la sesión" @input="changeGridSession()">
                    <option
                        v-for="session in availableSessions"
                        :value="session"
                        :key="session.name">
                        {{ session.humanName() }}
                    </option>
                </b-select>
            </b-field>
        </nav>
        <div class="columns">
            <div class="column is-6">
                <StartGridCard v-for="pos in parrillaDerecha" v-bind:key="pos.position"/>
                <div v-for="pos in parrillaIzquierda">
                    <StartGridCard :gridPos="pos"/>
                    <div class="block"></div>
                </div>
            </div>
            <div class="column is-6">
                <div class="block"></div>
                <div v-for="pos in parrillaDerecha">
                    <StartGridCard :gridPos="pos"/>
                    <div class="block"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";
import {StartGridPosition} from "@/types/StartGridPosition";
import StartGridCard from "@/components/gps/StartGridCard.vue";
import {RaceSession} from "@/types/RaceSession";
import EventBus from "@/plugins/eventbus";
import dayjs from "@/plugins/dayjs";
@Component({
    components: {StartGridCard}
})
export default class StartGridList extends Vue {
    @Prop({required: true}) grid!: Map<RaceSession, Array<StartGridPosition>>;

    private chosenSession: RaceSession = {} as RaceSession;
    private availableSessions: Array<RaceSession> = [];

    mounted() {
        this.chosenSession = this.grid.keys().next().value

        for (const ses of this.grid.keys()) {
            this.availableSessions.push(ses);
            if (dayjs(ses.date).isToday()) {
                this.chosenSession = ses;
            }
        }
    }

    changeGridSession() {
        EventBus.$emit('changeGridSession', this.chosenSession);
    }

    get parrillaIzquierda() {
        return this.grid.get(this.chosenSession)?.filter(function (gridPos) {
            return gridPos.position % 2 !== 0 && !gridPos.isFromPit;
        })
    }

    get parrillaDerecha() {
        return this.grid.get(this.chosenSession)?.filter(function (gridPos) {
            return gridPos.position % 2 === 0  && !gridPos.isFromPit;
        })
    }
}
</script>