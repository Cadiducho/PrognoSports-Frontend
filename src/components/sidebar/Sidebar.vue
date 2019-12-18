<template>
    <div id="sidebarComponent">
        <div class="adminx-sidebar expand-hover push">
            <ul class="sidebar-nav">
                <li class="sidebar-nav-item">
                    <router-link to="/" class="sidebar-nav-link" v-bind:class="{ active: activePage === 'home' }">
                        <span class="sidebar-nav-icon">
                            <i class="material-icons">home</i>
                        </span>
                        <span class="sidebar-nav-name">
                            Dashboard {{ activePage }}
                        </span>
                        <span class="sidebar-nav-end"/>
                    </router-link>
                </li>

                <li class="sidebar-nav-item">
                    <router-link to="/ranking" class="sidebar-nav-link" v-bind:class="{ active: activePage === 'ranking' }">
                        <span class="sidebar-nav-icon">
                            <i class="material-icons">show_chart</i>
                        </span>
                        <span class="sidebar-nav-name">
                            Ranking
                        </span>
                    </router-link>
                </li>

                <li class="sidebar-nav-item">
                    <router-link to="/gps" class="sidebar-nav-link" v-bind:class="{ active: activePage === 'gps' }">
                        <span class="sidebar-nav-icon">
                            <i class="material-icons">done_all</i>
                        </span>
                        <span class="sidebar-nav-name">
                            Pronósticos
                        </span>
                    </router-link>
                </li>

                <li class="sidebar-nav-item">
                    <router-link to="/notifications" class="sidebar-nav-link" v-bind:class="{ active: activePage === 'notifications' }">
                        <span class="sidebar-nav-icon">
                            <i class="material-icons"> notifications</i>
                        </span>
                        <span class="sidebar-nav-name">
                            Notificaciones
                        </span>
                    </router-link>
                </li>

                <li class="sidebar-nav-item">
                    <router-link to="/communities" class="sidebar-nav-link" v-bind:class="{ active: activePage === 'communities' }">
                        <span class="sidebar-nav-icon">
                            <i class="material-icons"> group</i>
                        </span>
                        <span class="sidebar-nav-name">
                            Comunidades
                        </span>
                    </router-link>
                </li>

                <li class="sidebar-nav-item">
                    <router-link to="/rules" class="sidebar-nav-link" v-bind:class="{ active: activePage === 'rules' }">
                        <span class="sidebar-nav-icon">
                            <i class="material-icons">list_alt</i>
                        </span>
                        <span class="sidebar-nav-name">
                            Reglas
                        </span>
                    </router-link>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Sidebar",
        props: ['activePage'],
    }
</script>

<style scoped>

</style>