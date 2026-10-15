import { computed, onMounted, ref, type Ref } from "vue";
import { communityService, grandPrixService, scoreService, seasonService } from "@/_services";
import { GrandPrix } from "@/types/GrandPrix";
import { Season } from "@/types/Season";
import { User } from "@/types/User";
import { HitsLevel, RankingHitsCell, RankingLinePoint, TableEntry } from "@/pages/ranking/types/ranking";
import { Community } from "@/types/Community";

/** Tramo de aciertos según el porcentaje respecto al máximo del Gran Premio */
function hitsLevel(hits: number, maxHits: number): HitsLevel {
  if (hits <= 0) {
    return "zero";
  }
  const percentage = (hits / maxHits) * 100;
  if (percentage > 99) return "max";
  if (percentage > 66) return "high";
  if (percentage > 33) return "mid";
  return "low";
}

export function useRankingData(currentCommunity: Ref<Community>) {
  const isLoading = ref(true);
  const tableHasData = ref(false);
  const seasonList = ref<Season[]>([]);
  const chosenSeason = ref<Season | null>(null);

  const activeTab = ref('byGp');
  const grandPrixes = ref<GrandPrix[]>([]);
  const grandPrixesWithPointsIds = ref<number[]>([]);

  const maxGpPoints = ref<Map<number, number>>(new Map<number, number>());
  const maxAccumulatedGpPoints = ref<Map<number, number>>(new Map<number, number>());
  const maxGpHits = ref<Map<number, number>>(new Map<number, number>());

  const communityMembers = ref<Map<string, User>>(new Map<string, User>());

  const byGpRows = ref<TableEntry[]>([]);
  const accumulatedRows = ref<TableEntry[]>([]);
  const hitsRows = ref<TableEntry[]>([]);

  const topScorerUsers = ref<string[]>([]);

  // Usuarios con puntos ordenados por clasificación total (dominio de color y orden del heatmap)
  const rankedUsernames = ref<string[]>([]);

  const gpPointsData = ref<RankingLinePoint[]>([]);
  const accumulatedPointsData = ref<RankingLinePoint[]>([]);
  const standingsData = ref<RankingLinePoint[]>([]);
  const hitsCells = ref<RankingHitsCell[]>([]);

  const orderedSeasonList = computed(() => {
    return [...seasonList.value].sort((a, b) => b.id - a.id);
  });

  const grandPrixesWithPoints = computed(() => {
    return grandPrixes.value.filter((gp) => grandPrixesWithPointsIds.value.includes(Number(gp.id)));
  });

  const checkGpWinner = (gpId: number, score: number) => {
    return maxGpPoints.value.get(gpId) === score;
  };

  const checkAccumulatedWinner = (gpId: number, score: number) => {
    return maxAccumulatedGpPoints.value.get(gpId) === score;
  };

  const checkMaxHits = (gpId: number, hits: number) => {
    return maxGpHits.value.get(gpId) === hits;
  };

  const resetSeriesAndRows = () => {
    byGpRows.value = [];
    accumulatedRows.value = [];
    hitsRows.value = [];

    gpPointsData.value = [];
    accumulatedPointsData.value = [];
    standingsData.value = [];
    hitsCells.value = [];
    rankedUsernames.value = [];
    topScorerUsers.value = [];

    grandPrixesWithPointsIds.value = [];
    maxGpPoints.value = new Map<number, number>();
    maxAccumulatedGpPoints.value = new Map<number, number>();
    maxGpHits.value = new Map<number, number>();
  };

  const loadRanking = (season: Season) => {
    isLoading.value = true;
    resetSeriesAndRows();

    return Promise.all([
      grandPrixService.getGrandPrixesList(season),
      communityService.getMembers(currentCommunity.value),
      scoreService.getUserPointsByGP(currentCommunity.value, season),
      scoreService.getTotalUserPoints(currentCommunity.value, season),
    ]).then(([gpList, members, grandPrixPoints, totalPointsByUser]) => {
      const totalPointsMap = totalPointsByUser as Record<string, number | undefined>;
      grandPrixes.value = gpList.filter((gp) => !gp.suspended);

      const membersMap = new Map<string, User>();
      members.forEach((member) => {
        membersMap.set(member.user.username, member.user);
      });
      communityMembers.value = membersMap;

      const entriesByUser = new Map<string, TableEntry>();
      const accumulatedEntriesByUser = new Map<string, TableEntry>();
      const hitsEntriesByUser = new Map<string, TableEntry>();

      members.forEach((member) => {
        const username = member.user.username;
        const base: TableEntry = {
          gps: new Map(),
          totalScore: 0,
          user: member.user,
        };
        entriesByUser.set(username, { ...base, gps: new Map() });
        accumulatedEntriesByUser.set(username, { ...base, gps: new Map() });
        hitsEntriesByUser.set(username, { ...base, gps: new Map() });
      });

      Object.entries(grandPrixPoints).forEach(([gp, gpEntry]) => {
        const gpId = Number(gp);
        grandPrixesWithPointsIds.value.push(gpId);
        maxGpPoints.value.set(gpId, -Infinity);
        maxAccumulatedGpPoints.value.set(gpId, -Infinity);
        maxGpHits.value.set(gpId, -Infinity);

        for (const [, userPoints] of Object.entries(gpEntry ?? {})) {
          if (!userPoints) {
            continue;
          }

          const username = userPoints.user?.username;
          if (!username) continue;

          if (
            entriesByUser.has(username)
            || accumulatedEntriesByUser.has(username)
            || hitsEntriesByUser.has(username)
          ) {
            entriesByUser.get(username)?.gps.set(gpId, userPoints);
            accumulatedEntriesByUser.get(username)?.gps.set(gpId, userPoints);
            hitsEntriesByUser.get(username)?.gps.set(gpId, userPoints);

            if (userPoints.pointsInGP > (maxGpPoints.value.get(gpId) ?? -Infinity)) {
              maxGpPoints.value.set(gpId, userPoints.pointsInGP);
            }
            if (userPoints.accumulatedPoints > (maxAccumulatedGpPoints.value.get(gpId) ?? -Infinity)) {
              maxAccumulatedGpPoints.value.set(gpId, userPoints.accumulatedPoints);
            }
            if (userPoints.hitsInGP > (maxGpHits.value.get(gpId) ?? -Infinity)) {
              maxGpHits.value.set(gpId, userPoints.hitsInGP);
            }
          }
        }
      });

      topScorerUsers.value = Object.entries(totalPointsMap)
        .filter(([, totalScore]) => Number(totalScore ?? 0) !== 0)
        .sort((a, b) => Number(b[1] ?? 0) - Number(a[1] ?? 0))
        .slice(0, 8)
        .map(([username]) => username);

      rankedUsernames.value = Object.entries(totalPointsMap)
        .filter(([, totalScore]) => Number(totalScore ?? 0) !== 0)
        .sort((a, b) => Number(b[1] ?? 0) - Number(a[1] ?? 0))
        .map(([username]) => username);

      const gpsWithPoints = grandPrixes.value.filter((gp) => grandPrixesWithPointsIds.value.includes(Number(gp.id)));

      Object.entries(totalPointsMap).forEach(([username, totalScore]) => {
      if (totalScore !== 0) {
        const entry = entriesByUser.get(username);
        const accumulatedEntry = accumulatedEntriesByUser.get(username);
        if (!entry || !accumulatedEntry) {
          return;
        }

        entry.totalScore = totalScore || 0;

        byGpRows.value.push(entry);
        accumulatedRows.value.push(accumulatedEntry);
        hitsRows.value.push(accumulatedEntry);

        const gpPointsRows: RankingLinePoint[] = [];
        const accumulatedPointsRows: RankingLinePoint[] = [];
        const standingsRows: RankingLinePoint[] = [];
        const hitsRowsForUser: RankingHitsCell[] = [];

        // Siempre se recorren los GPs en orden para que todas las gráficas compartan el eje X
        gpsWithPoints.forEach((gp) => {
          const userPoints = entry.gps.get(gp.id);
          const base = { gpCode: gp.code, gpName: gp.name, username };

          gpPointsRows.push({ ...base, value: userPoints ? userPoints.pointsInGP : null });
          accumulatedPointsRows.push({ ...base, value: userPoints ? userPoints.accumulatedPoints : null });
          standingsRows.push({
            ...base,
            value: userPoints && userPoints.standings > 0 ? userPoints.standings : null,
          });

          const rawMaxHits = maxGpHits.value.get(gp.id);
          const maxHits = rawMaxHits !== undefined && Number.isFinite(rawMaxHits) && rawMaxHits > 0 ? rawMaxHits : 0;
          const participated = userPoints !== undefined && userPoints.hitsInGP >= 0;
          const hits = participated ? userPoints.hitsInGP : 0;

          hitsRowsForUser.push({
            ...base,
            hits,
            maxHits,
            participated,
            level: participated ? hitsLevel(hits, maxHits) : "none",
          });
        });

        gpPointsData.value = [...gpPointsData.value, ...gpPointsRows];
        accumulatedPointsData.value = [...accumulatedPointsData.value, ...accumulatedPointsRows];
        standingsData.value = [...standingsData.value, ...standingsRows];
        hitsCells.value = [...hitsCells.value, ...hitsRowsForUser];
      }
      });

      tableHasData.value = Object.keys(totalPointsMap).length > 0;
      isLoading.value = false;
    });
  };

  onMounted(() => {
    loadRanking(currentCommunity.value.competition.currentSeason).then(() => {
      seasonService.getSeasonList().then((seasons) => {
        seasonList.value = [];
        seasonList.value.push(...seasons);
        chosenSeason.value = seasonList.value[seasonList.value.length - 1] ?? null;
      });
    });
  });

  return {
    activeTab,
    isLoading,
    tableHasData,
    seasonList,
    orderedSeasonList,
    chosenSeason,
    communityMembers,
    byGpRows,
    accumulatedRows,
    hitsRows,
    grandPrixes,
    grandPrixesWithPoints,
    rankedUsernames,
    topScorerUsers,
    gpPointsData,
    accumulatedPointsData,
    standingsData,
    hitsCells,
    loadRanking,
    checkGpWinner,
    checkAccumulatedWinner,
    checkMaxHits,
  };
}



