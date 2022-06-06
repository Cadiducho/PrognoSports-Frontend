<template>
    <nav class="level">
        <div class="level-item has-text-centered">
            <o-tooltip multilined variant="light">
                <template v-slot:content>
                    {{ userResume.standing }}º en el ranking de esta comunidad
                </template>

                <p class="heading">Puesto</p>
                <p class="title">{{ userResume.standing || '?'}}º</p>
            </o-tooltip>
        </div>
        <div class="level-item has-text-centered">
            <div>
                <o-tooltip multilined>
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
                        {{ userResume.points || '?' }}
                    </p>
                </o-tooltip>
            </div>
        </div>
        <div class="level-item has-text-centered">
            <o-tooltip multilined variant="light">
                <template v-slot:content>
                    Esta funcionalidad aún no está implementada
                </template>

                <p class="heading">Sesiones ganadas</p>
                <p class="title">?</p>
            </o-tooltip>
        </div>
        <div class="level-item has-text-centered">
            <o-tooltip multilined variant="light">
                <template v-slot:content>
                    Esta funcionalidad aún no está implementada
                </template>

                <p class="heading">Grandes Premios ganados</p>
                <p class="title">?</p>
            </o-tooltip>
        </div>
    </nav>

</template>

<script lang="ts">
import {UserResume} from "@/types/User";

import {defineComponent, PropType} from "vue";

export default defineComponent({
    name: "UserLevelResume",
    props: {
        userResume: {
            type: Object as PropType<UserResume>
        }
    }

});
</script>