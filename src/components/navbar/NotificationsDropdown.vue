<template>
    <b-dropdown id="notificationDropdown" position="is-bottom-left" append-to-body aria-role="menu" trap-focus>
        <a class="navbar-item nav-tag" slot="trigger" role="button">
            <span class="icon">
                <i class="material-icons display-inline-block align-middle">notifications_none</i>
            </span>
            <span v-if="unreadNotificationsCount > 0" class="tag is-danger counter">{{unreadNotificationsCount}}</span>
        </a>

        <b-dropdown-item aria-role="menu-item" :focusable="false" custom paddingless>
                <div class="modal-card" style="width:350px;">
                    <section class="modal-card-body">
                        <div class="level">
                            <div class="level-left">
                                <p class="subtitle is-5">Notificaciones</p>
                            </div>
                            <div class="level-right">
                                <p class="has-text-info" @click="clearNotification()">Marcar como leídas</p>
                            </div>
                        </div>
                        <article v-for="noti in notificationList" class="message is-small">
                            <div class="message-header">
                                <p>Notificación #{{noti.id}}</p>
                            </div>
                            <div class="message-body">
                                Descripción de la notificación
                                <!-- ToDo: Cuerpo -->
                                <br />
                                <span class="has-text-info is-italic">Recibida el
                                    <b-tooltip :label="noti.data.time | dateDiff" position="is-right">
                                        {{ noti.data.time | humanDate }}
                                    </b-tooltip>
                                </span>
                            </div>
                        </article>
                    </section>
                </div>
        </b-dropdown-item>
    </b-dropdown>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import {notificationService} from "@/_services";
    import {Notification} from "@/types/Notification";
    import vswitch from "../lib/v-switch.vue";

    @Component({
        components: {
            vswitch
        },
    })
    export default class NotificationsDropdown extends Vue {
        private unreadNotificationsCount = 0;
        private notificationList: Array<Notification> = [];

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
                this.unreadNotificationsCount = result.length;
            });
        }
    }
</script>