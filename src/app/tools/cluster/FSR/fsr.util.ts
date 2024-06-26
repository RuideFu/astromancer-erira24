import {range} from "./histogram-slider-input/histogram-slider-input.component";

export interface FsrParameters {
  distance: range | null,
  pm_ra: range | null,
  pm_dec: range | null,
}

export interface FsrComponents {
  bin: number,
  range: range,
  histogramRange: range
}

export interface FsrHistogramPayload {
  data: number[],
  isNew: boolean,
  fullData?: number[],
  histogramRange?: range | null,
  range?: range | null,
  bin?: number | null,
}
