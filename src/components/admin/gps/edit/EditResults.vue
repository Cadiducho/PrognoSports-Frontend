<template>
    <h3 class="subtitle">Resultados en {{ session.humanName() }}</h3>

    <section v-if="session.name === 'RACE'" class="mb-4">
        <o-field label="Vuelta rápida">
            <o-select v-model="fastLap" placeholder="Selecciona un circuito" expanded>
                <option
                    v-for="driver in sessionResults"
                    :value="driver"
                    :key="driver.id">
                    {{ driver.lastname}}, {{driver.firstname}} - {{ driver.team.name }} ({{ driver.team.carname }})
                </option>
            </o-select>
        </o-field>
    </section>
    <hr/>

    <label class="label">Resultados</label>
    <SlickList v-model:list="sessionResults" tag="ul" :distance="1"
               class="block-list no-select">

        <SlickItem v-for="(item, index) in sessionResults" :key="item.id" :index="index" tag="li"
                   class="is-highlighted has-text-weight-semibold has-radius is-flex is-justify-content-left"
                   :style="styleDriverCard(item)">

            <span>
                <b>{{ index + 1 }}º.</b> {{ item.firstname }} {{ item.lastname }}
                <span class="tag is-rounded" v-bind:style="styleDorsal(item)">#{{
                        item.number
                    }}</span>
                <o-tooltip class="ml-1"
                           :label="currentUser.preferences['use-long-team-names'] ? item.team.name : item.team.longname">
                    <span v-if="currentUser.preferences['use-long-team-names']">{{
                            item.team.longname
                        }}</span>
                    <span v-else>{{ item.team.name }}</span>
                </o-tooltip>
                ({{ item.team.carname }})
            </span>
        </SlickItem>
    </SlickList>

    <section class="block mt-4">
        <o-checkbox
            v-model="notSendNotification"
            variant="danger"
            passive-variant="primary">
            NO enviar notificación
        </o-checkbox>
        <o-checkbox
            v-model="notOverrideGrid"
            variant="danger"
            passive-variant="primary">
            NO sobreescribir parrilla
        </o-checkbox>
    </section>

    <button class="button is-primary" @click="saveResults()">Guardar resultados</button>
</template>

<script lang="ts">
import {defineComponent, onMounted, PropType} from "vue";
import {SlickItem, SlickList} from "vue-slicksort";
import {useAuthStore} from "@/store/authStore";
import {useStyles} from "@/composables/useStyles";
import {Competition} from "@/types/Competition";
import {Season} from "@/types/Season";
import {RaceSession} from "@/types/RaceSession";
import {Driver} from "@/types/Driver";
import {grandPrixService, notificationService} from "@/_services";
import {GrandPrix} from "@/types/GrandPrix";

export default defineComponent({
    name: "EditResults",
    components: {
        SlickList,
        SlickItem,
    },
    props: {
        grandPrix: {
            type: Object as PropType<GrandPrix>,
            required: true,
        },
        session: {
            type: Object as PropType<RaceSession>,
            required: true,
        },
        resultsInSession: {
            type: Object as PropType<Array<Driver>>,
            required: true,
        },
    },
    setup() {
        const authStore = useAuthStore();
        const styles = useStyles();

        const currentUser = authStore.loggedUser;
        const styleDriverCard = styles.styleDriverCard;
        const styleDorsal = styles.styleDorsal;

        return {currentUser, styleDriverCard, styleDorsal};
    },
    data() {
        return {
            notSendNotification: false,
            notOverrideGrid: false,
            fastLap: {} as Driver,
            sessionResults: [...this.resultsInSession],
        }
    },
    methods: {
        saveResults() {
            const payload = {
                results: new Map(this.sessionResults.map((driver, index, array) => [index + 1, driver.id])),
                notSendNotification: this.notSendNotification,
            };
            grandPrixService.saveResults(this.grandPrix, this.session, payload).then(() => {
                notificationService.showNotification( "¡Has guardado los resultados!");
            });
        }
    }
});
</script>

<style scoped>

</style>