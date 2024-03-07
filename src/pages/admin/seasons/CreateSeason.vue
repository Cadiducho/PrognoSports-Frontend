<template>
    <div id="createSeason" class="box">
        <PTitle class="mb-5" name="Crear temporada"/>

        <PInput label="Nombre de la temporada" name="name" v-model="createdSeason.name" />
        <PInput label="Número de eventos totales" name="totalEvents" type="number" v-model="createdSeason.totalEvents" />

        <o-select v-model="createdSeason.competitionId" placeholder="Selecciona una competición" expanded>
            <option
                v-for="comp in competitions"
                :value="comp.id"
                :key="comp.id">
                {{ comp.name }} ({{ comp.code }}) - {{ comp.fullname }}
            </option>
        </o-select>

        <PButton class="mt-4" :disabled="!isDataOk()" @click="registerSeason" type="solid" label="Crear temporada" />
    </div>
</template>

<script setup lang="ts">
import PTitle from "@/components/lib/PTitle.vue";
import {competitionService, notificationService, seasonService} from "@/_services";
import {Competition} from "@/types/Competition";

import {onMounted, reactive, ref} from "vue";
import PButton from "@/components/lib/forms/PButton.vue";
import PInput from "@/components/lib/forms/PInput.vue";
import {useRouter} from "vue-router";

const router = useRouter();

const createdSeason = reactive({
    name: '',
    totalEvents: 0,
    competitionId: 0
});
const competitions = ref<Competition[]>([]);

onMounted(() => {
    competitionService.getCompetitionList().then((list) => {
        competitions.value = [];
        competitions.value.push(...list);
    })
});

const optionsName = (option: Competition) => {
        return `${option.name} ${option.code} - ${ option.fullname }`
}

const isDataOk = (): boolean => {
    return ((createdSeason.name.length > 0) && (createdSeason.totalEvents > 0) && (createdSeason.competitionId > 0))
}
const registerSeason = async () =>  {
    let rawSeason = {
        name: createdSeason.name,
        totalEvents: createdSeason.totalEvents,
        competition: createdSeason.competitionId
    }

    try {
        const result = await seasonService.createSeason(rawSeason);
        notificationService.showNotification("Se ha registrado correctamente la temporada `" + result.name + "`");

        router.push({
            name: 'adminSeasons'
        })
    } catch (error: any) {
        notificationService.showNotification(error.message, "error");
    }
}
</script>