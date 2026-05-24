export type ChartType =
  | "pie"
  | "doughnut"
  | "bar"
  | "line"
  | "comparison"
  | "circular";

export type DataPoint = {
  id: string;
  label: string;
  value: number;
  /** Used by comparison charts as the secondary value */
  compare?: number;
};

export type Palette = {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
};

export type AnimationSettings = {
  /** seconds */
  duration: number;
  /** "smooth" | "spring" | "linear" */
  easing: "smooth" | "spring" | "linear";
  /** seconds before content starts */
  delay: number;
};

export type ExportSettings = {
  /** image dpi multiplier */
  imageScale: 1 | 2 | 3;
  videoFps: 30 | 60;
  videoSeconds: number;
  watermark: boolean;
  brandLogo?: string | null;
  preset: "square" | "portrait" | "landscape" | "story";
};

export type ChartConfig = {
  type: ChartType;
  title: string;
  subtitle: string;
  data: DataPoint[];
  palette: Palette;
  animation: AnimationSettings;
  export: ExportSettings;
};
