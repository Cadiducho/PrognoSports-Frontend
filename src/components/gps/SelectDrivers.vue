<template>
    <div>
        <loading v-if="isLoadingDriverList" />
        <b-form @submit="onSubmit" @reset="onReset" v-else>
            <!--<div v-if="qualiTipps !== undefined" v-for="(tipp, index) in qualiTipps" :key="index">
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
            </div>-->

            Selected: {{JSON.stringify(form.selectedDriver)}}
            Tipps: {{JSON.stringify(qualiTipps)}}

            <b-button type="submit" variant="primary">Guardar pronóstico</b-button>
            <b-button type="reset" variant="danger">Reiniciar formulario</b-button>
        </b-form>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from "vue-property-decorator";
    import {GrandPrix} from "@/types/GrandPrix";
    import {Driver} from "@/types/Driver";
    import {DriversModule} from "@/_store/modules/DriversModule";

    @Component
    export default class SelectDrivers extends Vue {
        private isLoadingDriverList: boolean = DriversModule.isLoadingDriverList;
        private driverList: Array<Driver> = DriversModule.driverList;
        @Prop({required: true}) gp!: GrandPrix;


        private form = {
            selectedDriver: [], //ToDo: Crear interfaz Driver
        };

        mounted() {
            let payload = {gp: this.gp, community: 1};
            DriversModule.fetchDriversList(this.gp);
        }

        get drivers(): Array<any> {
            let list = [{ value: '', text: '## No Pronosticado ##', disabled: true }];
            this.driverList.forEach(driver => {
                list.push({
                    disabled: false,
                    value: driver.id,
                    text: `${driver.lastname}, ${driver.firstname} - ${driver.team.name} (${driver.team.carname})`
                });
            });
            return list;
        }

        onSubmit(evt: any) {
            evt.preventDefault();
            alert(JSON.stringify(this.form));
        }

        onReset(evt: any) {
            evt.preventDefault();
            //this.form.selectedDriver = null; //FixMe
        }

    }
</script>