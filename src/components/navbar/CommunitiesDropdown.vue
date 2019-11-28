<template>
    <div id="communitiesDropdown">
        <b-nav-item-dropdown :text="currentCommunity.name" right class="navbar-communities">
            <b-dropdown-item active :to="'/communities/' + currentCommunity.id">{{currentCommunity.name}}</b-dropdown-item>
            <b-dropdown-divider />
            <b-dropdown-item variant="info" to="/communities" >Todas las comunidades</b-dropdown-item>
        </b-nav-item-dropdown>
    </div>
</template>

<script>
    export default {
        name: "CommunitiesDropdown",
        props: ['currentCommunity']
    }
</script>