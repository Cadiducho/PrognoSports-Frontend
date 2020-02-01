<template>
    <div id="notificationsDropdown">
        <b-nav-item-dropdown right no-caret>
            <template v-slot:button-content class="nav-link-notifications">
                <i class="material-icons display-inline-block align-middle">notifications_none</i>
                <span v-if="unreadNotificationsCount > 0" class="nav-link-notification-number" id="notification-count-number">{{unreadNotificationsCount}}</span>
            </template>
            <div class="dropdown-menu-notifications">
                <div class="notifications-header d-flex justify-content-between align-items-center">
                    <span class="notifications-header-title">
                        Notificaciones
                    </span>
                    <a class="d-flex text-primary" @click="clearNotification"><small>Marcar todas como leídas</small></a>
                </div>
                <b-list-group>
                    <b-list-group-item action
                                       v-for="noti in notificationList" :to="'/' + noti.data['gpSeason'] + '/' + noti.data['gpRound']"
                                       v-bind:class="{ unread: noti.readAt === undefined}"
                                       :key="noti.id"
                    >
                        <vswitch :value="noti.type">
                            <template #info>
                                <p class="mb-1">
                                    <strong class="text-info">Info #{{noti.id}}</strong>
                                    <br/>
                                    {{noti.data["info"]}}
                                </p>
                            </template>
                            <template #QUALI_PRE_ALERT>
                                <div class="d-flex w-100 justify-content-between">
                                    <strong class="mb-1 text-primary">Clasificación mañana</strong>
                                    <small class="text-muted">{{ moment(noti.time).fromNow() }}</small>
                                </div>

                                <p class="mb-1">
                                    Realiza tus pronósticos para {{noti.data["gpName"]}} antes del <!--{{noti.data["time"].format('dd/MM/yyyy HH:mm', loggedUser.timeZoneId)}-->
                                </p>
                            </template>
                            <template #QUALI_ALERT>
                                <div class="d-flex w-100 justify-content-between">
                                    <strong class="mb-1 text-warning">Clasificación hoy</strong>
                                    <small class="text-muted">{{ moment(noti.time).fromNow() }}</small>
                                </div>

                                <p class="mb-1">
                                    Realiza tus pronósticos para {{noti.data["gpName"]}} antes del <!--{{noti.data["time"].format('dd/MM/yyyy HH:mm', loggedUser.timeZoneId)}-->
                                </p>
                            </template>
                            <template #RACE_PRE_ALERT>
                                <div class="d-flex w-100 justify-content-between">
                                    <strong class="mb-1 text-primary">Carrera mañana</strong>
                                    <small class="text-muted">{{ moment(noti.time).fromNow() }}</small>
                                </div>

                                <p class="mb-1">
                                    Realiza tus pronósticos para {{noti.data["gpName"]}} antes del <!--{{noti.data["time"].format('dd/MM/yyyy HH:mm', loggedUser.timeZoneId)}-->
                                </p>
                            </template>
                            <template #RACE_ALERT>
                                <div class="d-flex w-100 justify-content-between">
                                    <strong class="mb-1 text-warning">Carrera hoy</strong>
                                    <small class="text-muted">{{ moment(noti.time).fromNow() }}</small>
                                </div>

                                <p class="mb-1">
                                    Realiza tus pronósticos para {{noti.data["gpName"]}} antes del <!--{{noti.data["time"].format('dd/MM/yyyy HH:mm', loggedUser.timeZoneId)}-->
                                </p>
                            </template>
                            <template #QUALI_POINTS>
                                <div class="d-flex w-100 justify-content-between">
                                    <strong class="mb-1 text-success">Puntos de clasificación</strong>
                                    <small class="text-muted">{{ moment(noti.time).fromNow() }}</small>
                                </div>

                                <p class="mb-1" v-for="(community, points) in noti.data.points">
                                    <strong class="text-info">{{community.name}}</strong>: {{points.pointsInQualify}} puntos<br/>
                                    Acumulados un total de {{points.accumulatedPoints}} puntos en la temporada
                                </p>
                                <strong class="text-success">Puntos de clasificación</strong>
                            </template>
                            <template #GRID_CHANGES>
                                <p class="mb-1">
                                    <strong class="text-success">Cambios en la parrilla</strong>
                                    <br/>
                                    Se han producido cambios en la parrilla de salida de {{noti.data["gpName"]}}
                                </p>
                            </template>
                            <template #RACE_POINTS>
                                <div class="d-flex w-100 justify-content-between">
                                    <strong class="mb-1 text-success">Puntos de carrera</strong>
                                    <small class="text-muted">{{ moment(noti.time).fromNow() }}</small>
                                </div>

                                <p class="mb-1" v-for="(community, points) in noti.data.points">
                                    <strong class="text-info">{{community.name}}</strong>: {{points.pointsInQualify}} puntos<br/>
                                    Acumulados un total de {{points.accumulatedPoints}} puntos en la temporada
                                </p>
                            </template>
                            <template #default>
                                <p class="mb-1">
                                    <strong class="text-info">Notificacion #{{noti.id}}</strong>
                                </p>
                            </template>
                        </vswitch>
                    </b-list-group-item>
                </b-list-group>
                <div class="notifications-footer text-center">
                    <router-link to="/notifications"><small>Ver todas las notificaciones</small></router-link>
                </div>
            </div>
        </b-nav-item-dropdown>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from "vue-property-decorator";
    import {notificationService} from "@/_services/notification.service";
    import vswitch from "../lib/v-switch.vue";
    import moment from "moment";

    @Component({
        components: {
            vswitch
        },
    })
    export default class NotificationsDropdown extends Vue {
        private unreadNotificationsCount = 0;
        private notificationList = {};

        created() {
            this.getNotifications();
        }

        public clearNotification() {
            notificationService.clearNotifications().then(() => {
                this.unreadNotificationsCount = 0;
            });
        }

        public getNotifications()  {
            notificationService.getNotifications().then((result) => {
                this.notificationList = result;
            });
        }

        public moment() {
            return moment();
        }
    }
</script>