<template>
    <nav class="level is-mobile">
        <div class="level-item has-text-centered">
            <b-tooltip multilined type="is-light">
                <template v-slot:content>
                    {{ userResume.standing }}º en el ranking de esta comunidad
                </template>

                <p class="heading">Puesto</p>
                <p class="title">{{ userResume.standing }}º</p>
            </b-tooltip>
        </div>
        <div class="level-item has-text-centered">
            <div>
                <b-tooltip multilined>
                    <template v-slot:content>
                        <ul>
                            <li>
                                <b>Carreras</b>: {{ userResume.pointsInRaces }}
                            </li>
                            <li>
                                <b>Clasificaciones</b>: {{ userResume.pointsInQualis }}
                            </li>
                        </ul>
                    </template>

                    <p class="heading">Puntos</p>
                    <p class="title">
                        {{ userResume.points }}
                    </p>
                </b-tooltip>
            </div>
        </div>
        <div class="level-item has-text-centered">
            <b-tooltip multilined type="is-light">
                <template v-slot:content>
                    Esta funcionalidad aún no está implementada
                </template>

                <p class="heading">Sesiones ganadas</p>
                <p class="title">?</p>
            </b-tooltip>
        </div>
        <div class="level-item has-text-centered">
            <b-tooltip multilined type="is-light">
                <template v-slot:content>
                    Esta funcionalidad aún no está implementada
                </template>

                <p class="heading">Grandes Premios ganados</p>
                <p class="title">?</p>
            </b-tooltip>
        </div>
    </nav>

</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";
import {UserResume} from "@/types/User";
import {namespace} from "vuex-class";

const Auth = namespace('Auth')

@Component
export default class UserLevelResume extends Vue {
    @Prop() private userResume!: UserResume;
}
</script>

<style scoped>

</style>