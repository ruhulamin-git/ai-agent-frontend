"use client";

import dynamic from "next/dynamic";
import { useTranslation } from "react-i18next";

import { WorkforceChartSkeleton } from "./WorkforceChartSkeleton";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ApexChartOptions = any;

const GRADIENT_STOP_0 = 0;
const GRADIENT_STOP_100 = 100;
const STROKE_WIDTH = 3;
const GRID_STROKE_DASH_ARRAY = 4;
const FONT_SIZE_SMALL = 10;
const FONT_SIZE_MEDIUM = 12;

export const WorkforceChart = ({ isLoading }: { isLoading: boolean }) => {
  const { t } = useTranslation();
  if (isLoading) {
    return <WorkforceChartSkeleton />;
  }

  const options: ApexChartOptions = {
    chart: {
      type: "area",
      toolbar: { show: false },
      sparkline: { enabled: false },
      background: "transparent",
      fontFamily: "inherit",
    },
    stroke: {
      curve: "smooth",
      width: STROKE_WIDTH,
      colors: ["#60a5fa"],
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [GRADIENT_STOP_0, GRADIENT_STOP_100],
        colorStops: [
          {
            offset: GRADIENT_STOP_0,
            color: "#60a5fa",
            opacity: 0.4,
          },
          {
            offset: GRADIENT_STOP_100,
            color: "#60a5fa",
            opacity: 0,
          },
        ],
      },
    },
    xaxis: {
      categories: [
        t("date_range.mon"),
        t("date_range.tue"),
        t("date_range.wed"),
        t("date_range.thu"),
        t("date_range.fri"),
        t("date_range.sat"),
        t("date_range.sun"),
      ],
      labels: {
        style: {
          colors: "#94a3b8",
          fontSize: `${FONT_SIZE_MEDIUM}px`,
          fontWeight: 600,
        },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#94a3b8",
          fontSize: `${FONT_SIZE_SMALL}px`,
          fontWeight: 600,
        },
      },
    },
    grid: {
      borderColor: "#ADCCCB",
      strokeDashArray: GRID_STROKE_DASH_ARRAY,
      padding: { left: 0, right: 0, top: 0, bottom: 0 },
    },
    tooltip: {
      theme: "dark",
      x: { show: false },
    },
    dataLabels: { enabled: false },
  };

  const MOCK_DATA_MON = 45;
  const MOCK_DATA_TUE = 52;
  const MOCK_DATA_WED = 38;
  const MOCK_DATA_THU = 65;
  const MOCK_DATA_FRI = 48;
  const MOCK_DATA_SAT = 24;
  const MOCK_DATA_SUN = 30;

  const series = [
    {
      name: t("dashboard.tasks_processed"),
      data: [
        MOCK_DATA_MON,
        MOCK_DATA_TUE,
        MOCK_DATA_WED,
        MOCK_DATA_THU,
        MOCK_DATA_FRI,
        MOCK_DATA_SAT,
        MOCK_DATA_SUN,
      ],
    },
  ];

  return (
    <div className="p-8 rounded-4xl bg-card dark:bg-primary/5 border border-slate-200/60 dark:border-slate-200/15 shadow-sm h-full flex flex-col glass-panel">
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            {t("dashboard.workflow_velocity")}
          </h3>
          <p className="text-xs text-slate-400 font-medium">
            {t("dashboard.tasks_processed_description")}
          </p>
        </div>
        <div className="text-right">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-primary/10 text-emerald-600 dark:text-primary text-xs font-bold">
            <span className="material-symbols-outlined text-[14px]">trending_up</span>
            +18.2%
          </div>
        </div>
      </div>
      <div className="flex-1 min-h-60">
        <Chart options={options} series={series} type="area" height="100%" width="100%" />
      </div>
    </div>
  );
};
