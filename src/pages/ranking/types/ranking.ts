import { User } from "@/types/User";
import { UserPoints } from "@/types/UserPoints";
import { ApexAxisChartSeries, ApexOptions } from "apexcharts";

export interface TableEntry {
  user: User;
  gps: Map<number, UserPoints>;
  totalScore: number;
}

export interface RankingHeatmapPoint {
  x: string;
  y: number;
  hits: number;
  maxHits: number;
  username: string;
}

export type RankingLineSeries = ApexAxisChartSeries;
export type RankingHeatmapSeries = Array<{ name: string; data: RankingHeatmapPoint[] }>;
export type RankingChartOptions = ApexOptions;


