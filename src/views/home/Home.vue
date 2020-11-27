<template>
    <div id="homeComponent" class="box">

        <PrognoPageTitle name="Dashboard" />

        <div class="columns is-variable is-5">
            <div class="column is-4">
                <NextGrandPrix />
            </div>
            <div class="column is-8">
                <div class="tile">
                    <article class="tile is-child box">
                        <p class="title">Resumen</p>
                        <nav class="level is-mobile">
                            <div class="level-item has-text-centered">
                                <div>
                                    <p class="heading">Puesto</p>
                                    <p class="title">7º</p>
                                </div>
                            </div>
                            <div class="level-item has-text-centered">
                                <div>
                                    <p class="heading">Puntos</p>
                                    <p class="title">557</p>
                                </div>
                            </div>
                            <div class="level-item has-text-centered">
                                <div>
                                    <p class="heading">Sesiones ganadas</p>
                                    <p class="title">3</p>
                                </div>
                            </div>
                            <div class="level-item has-text-centered">
                                <div>
                                    <p class="heading">Grandes Premios ganados</p>
                                    <p class="title">1</p>
                                </div>
                            </div>
                        </nav>
                        <PointsAccumulated :user="getProfile" />
                    </article>
                </div>
            </div>
        </div>

    </div>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import PrognoPageTitle from "@/components/lib/PrognoPageTitle.vue";
    import NextGrandPrix from "@/components/gps/NextGrandPrix.vue";
    import {AuthModule} from "@/_store/modules/AuthModule";
    import VueApexCharts from "vue-apexcharts";
    import PointsAccumulated from "@/components/user/PointsAccumulated.vue";
    import {User} from "@/types/User";
    import {namespace} from 'vuex-class'

    const usermodule = namespace('user')

    @Component({
        components: {
            PointsAccumulated,
            NextGrandPrix,
            PrognoPageTitle,
            VueApexCharts
        }
    })
    export default class Home extends Vue {

        @usermodule.Getter private getProfile?: User;

        get loading() {
            return AuthModule.authStatus === 'loading' && !AuthModule.isAuthenticated;
        }

        private breadcumbItems = [
            {
                text: 'Inicio',
                to: '/home'
            },
            {
                text: 'Dashboard',
                active: true
            }
        ];
    }
</script>