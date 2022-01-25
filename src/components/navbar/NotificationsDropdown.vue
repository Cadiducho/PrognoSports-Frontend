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
                                <a class="has-text-info" v-if="unreadNotificationsCount > 0" @click="clearNotification()">Marcar como leídas</a>
                            </div>
                        </div>
                        <article v-for="noti in notificationList" class="message is-small">
                            <header class="message-header">
                                <p>{{ noti.title() }}</p>
                                <span v-if="noti.readAt === undefined && !leidas" class="tag is-success">Nueva</span>
                            </header>
                            <section class="message-body">
                                <span v-html="noti.body()" />
                            </section>
                            <footer class="modal-card-foot">
                                <span class="has-text-info is-italic has-text-right">Recibida el
                                    <b-tooltip :label="noti.createdAt | dateDiff" position="is-right">
                                        {{ noti.createdAt | humanDateTime }}
                                    </b-tooltip>
                                </span>
                            </footer>
                        </article>
                    </section>
                </div>
        </b-dropdown-item>
    </b-dropdown>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import {notificationService} from "@/_services";
    import { Notification } from "@/types/Notification";

    @Component
    export default class NotificationsDropdown extends Vue {
        private unreadNotificationsCount = 0;
        private notificationList: Array<Notification> = [];
        private leidas: boolean = false;

        created() {
            this.getNotifications();
        }

        public clearNotification() {
            this.$buefy.toast.open({
                message: "Has limpiado tus notificaciones",
                type: "is-success",
            });
            notificationService.clearNotifications().then(() => {
                this.unreadNotificationsCount = 0;
                this.leidas = true;
            });
        }

        public getNotifications()  {
            notificationService.getNotifications().then((result) => {
                this.notificationList = result;
                this.notificationList.forEach(notification => {
                    if (notification.readAt == undefined) {
                        this.unreadNotificationsCount++;
                    }
                });
            });
        }
    }
</script>

<style lang="css" scoped>
.modal-card-foot {
    padding-top: 3px;
    padding-bottom: 6px;
    text-align: right;
}
</style>