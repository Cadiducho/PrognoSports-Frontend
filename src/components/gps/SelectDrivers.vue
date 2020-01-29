<template>
    <div>
        <loading v-if="isLoadingDriverList" />
        <b-form @submit="onSubmit" @reset="onReset" v-else>
            <div v-if="qualiTipps !== undefined" v-for="(tipp, index) in qualiTipps" :key="index">
                <b-form-group>
                    <div v-if="tipp !== undefined || tipp !== null">
                        if {{index}}
                        <b-form-select v-model="form.selectedDriver[index]" :options="drivers" required >
                            <template v-slot:first>
                                <b-form-select-option :value="tipp.driver.id" selected>
                                    {{tipp.driver.lastname}}, {{tipp.driver.firstname}} - {{tipp.driver.team.name}} ({{tipp.driver.team.carname}})
                                </b-form-select-option>
                            </template>
                        </b-form-select>
                    </div>
                    <div v-else>
                        else
                        <b-form-select v-model="form.selectedDriver[index]" :options="drivers" required>
                            <template v-slot:first>
                                <b-form-select-option :value="-1" disabled>## No Pronosticado ##</b-form-select-option>
                            </template>
                        </b-form-select>
                    </div>
                </b-form-group>
            </div>

            Selected: {{JSON.stringify(form.selectedDriver)}}

            <b-button type="submit" variant="primary">Guardar pronóstico</b-button>
            <b-button type="reset" variant="danger">Reiniciar formulario</b-button>
        </b-form>
    </div>
</template>

<script>
    import {mapGetters} from "vuex";
    import {FETCH_DRIVERS_LIST, FETCH_TIPPS_LIST} from "@/_store/actions.type";

    export default {
        name: "SelectDrivers",
        data() {
            return {
                form: {
                    selectedDriver: [],
                },
            }
        },
        props: {
            gp: { type: Object, required: true }
        },
        mounted() {
            this.fetchTippsList();
            this.fetchDriversList();
        },
        computed: {
            ...mapGetters(["qualiTipps", "isLoadingDriverList", "driverList"]),

            drivers: function () {
                let list = [{ value: null, text: '## No Pronosticado ##', disabled: true },];
                this.driverList.forEach(driver => {
                    list.push({
                        value: driver.id,
                        text: `${driver.lastname}, ${driver.firstname} - ${driver.team.name} (${driver.team.carname})`
                    });
                });
                return list;
            }
        },
        methods: {
            fetchTippsList() {
                let payload = {gp: this.gp, community: 1};
                this.$store.dispatch(FETCH_TIPPS_LIST, payload);
            },
            fetchDriversList() {
                this.$store.dispatch(FETCH_DRIVERS_LIST, this.gp);
            },
            onSubmit(evt) {
                evt.preventDefault();
                alert(JSON.stringify(this.form));
            },
            onReset(evt) {
                evt.preventDefault();
                this.form.food = null;
            }
        }
    }
</script>