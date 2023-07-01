import {MyData} from "../shared/data/data.interface";
import {MyStorage} from "../shared/storage/storage.interface";
import {ChartInfo} from "../shared/charts/chart.interface";

export interface VariableDataDict {
  jd: number | null;
  source1: number | null;
  source2: number | null;
  error1: number | null;
  error2: number | null;
}

export class VariableData implements MyData {
  private dataDict: VariableDataDict[];

  constructor() {
    this.dataDict = VariableData.getDefaultDataDict();
  }

  public static getDefaultDataDict(): VariableDataDict[] {
    const data: VariableDataDict[] = [];
    for (let i = 0; i < 14; i++) {
      data.push({
        jd: i * 10 + Math.random() * 10 - 5,
        source1: Math.random() * 20,
        source2: Math.random() * 20,
        error1: 1,
        error2: 1,
      });
    }
    return data;
  }

  addRow(index: number, amount: number): void {
    if (index > 0) {
      for (let i = 0; i < amount; i++) {
        this.dataDict.splice(index + i, 0,
          {jd: null, source1: null, source2: null, error1: null, error2: null});
      }
    } else {
      this.dataDict.push({jd: null, source1: null, source2: null, error1: null, error2: null});
    }
  }

  getData(): VariableDataDict[] {
    return this.dataDict;
  }

  getDataArray(): (number|null)[][] {
    return this.dataDict.map((entry: VariableDataDict) =>
      [entry.jd, entry.source1, entry.source2, entry.error1, entry.error2]);
  }

  removeRow(index: number, amount: number): void {
    this.dataDict = this.dataDict.slice(0, index).concat(this.dataDict.slice(index + amount));
  }

  setData(data: VariableDataDict[]): void {
    this.dataDict = data;
  }
}


export enum VariableStarOptions {
  NONE = "None",
  SOURCE1 = "Source 1",
  SOURCE2 = "Source 2",
}

export interface VariableInterface {
  getVariableStar(): VariableStarOptions;

  setVariableStar(variableStar: VariableStarOptions): void;

  getReferenceStarMagnitude(): number;

  setReferenceStarMagnitude(magnitude: number): void;

  getIsLightCurveOptionValid(): boolean;
}


export interface VariableInterfaceStorageObject {
  variableStar: VariableStarOptions;
  referenceStarMagnitude: number;
}


export class VariableInterfaceImpl implements VariableInterface {
  private variableStar: VariableStarOptions;
  private referenceStarMagnitude: number;

  constructor() {
    this.variableStar = VariableInterfaceImpl.getDefaultInterface().variableStar;
    this.referenceStarMagnitude = VariableInterfaceImpl.getDefaultInterface().referenceStarMagnitude;
  }

  public static getDefaultInterface(): VariableInterfaceStorageObject {
    return {
      variableStar: VariableStarOptions.NONE,
      referenceStarMagnitude: 0,
    };
  }

  getStorageObject(): VariableInterfaceStorageObject {
    return {
      variableStar: this.variableStar,
      referenceStarMagnitude: this.referenceStarMagnitude,
    };
  }

  setStorageObject(storageObject: VariableInterfaceStorageObject): void {
    this.variableStar = storageObject.variableStar;
    this.referenceStarMagnitude = storageObject.referenceStarMagnitude;
  }

  getVariableStar(): VariableStarOptions {
    return this.variableStar;
  }

  setVariableStar(variableStar: VariableStarOptions): void {
    this.variableStar = variableStar;
  }

  getReferenceStarMagnitude(): number {
    return this.referenceStarMagnitude;
  }

  setReferenceStarMagnitude(magnitude: number): void {
    this.referenceStarMagnitude = magnitude;
  }

  getIsLightCurveOptionValid(): boolean {
    return this.variableStar !== VariableStarOptions.NONE
      && !isNaN(this.referenceStarMagnitude);
  }
}


export interface VariableChartInfoStorageObject {
  title: string;
  xAxisLabel: string;
  yAxisLabel: string;
  dataLabels: string[];
  dataLabel: string;
}

export class VariableChartInfo implements ChartInfo {
  public static readonly defaultHash: string = "XQGeSlw7M6";
  private title: string;
  private xAxisLabel: string;
  private yAxisLabel: string;
  private dataLabels: string[];
  private dataLabel: string;

  constructor() {
    this.title = VariableChartInfo.getDefaultChartInfo().title;
    this.xAxisLabel = VariableChartInfo.getDefaultChartInfo().xAxisLabel;
    this.yAxisLabel = VariableChartInfo.getDefaultChartInfo().yAxisLabel;
    this.dataLabels = VariableChartInfo.getDefaultChartInfo().dataLabels;
    this.dataLabel = VariableChartInfo.getDefaultChartInfo().dataLabel;
  }

  public static getDefaultChartInfo(): VariableChartInfoStorageObject {
    return {
      title: "Title",
      xAxisLabel: "x",
      yAxisLabel: "y",
      dataLabels: ["Source 1", "Source 2"],
      dataLabel: VariableChartInfo.defaultHash,
    }
  }

  getChartTitle(): string {
    return this.title;
  }

  getDataLabel(): string {
    return this.dataLabel;
  }

  getDataLabels(): string {
    if (this.dataLabels[0] === "" && this.dataLabels[1] === "") {
      return "";
    } else {
      return this.dataLabels.join(", ");
    }
  }

  setDataLabels(label: string): void {
    if (label.trim() === "") {
      this.dataLabels = ["", ""];
      return;
    }
    const labelArray = label.split(",").map((label: string) => label.trim());
    for (let i = 0; i < this.dataLabels.length && labelArray.length; i++) {
      this.dataLabels[i] = labelArray[i];
    }
  }

  getStorageObject(): VariableChartInfoStorageObject {
    return {
      title: this.title,
      xAxisLabel: this.xAxisLabel,
      yAxisLabel: this.yAxisLabel,
      dataLabels: this.dataLabels,
      dataLabel: this.dataLabel,
    };
  }

  getXAxisLabel(): string {
    return this.xAxisLabel;
  }

  getYAxisLabel(): string {
    return this.yAxisLabel;
  }

  setChartTitle(title: string): void {
    this.title = title;
  }

  setDataLabel(data: string): void {
    this.dataLabel = data;
  }

  setStorageObject(storageObject: VariableChartInfoStorageObject): void {
    this.title = storageObject.title;
    this.xAxisLabel = storageObject.xAxisLabel;
    this.yAxisLabel = storageObject.yAxisLabel;
    this.dataLabels = storageObject.dataLabels;
    this.dataLabel = storageObject.dataLabel;
  }

  setXAxisLabel(xAxis: string): void {
    this.xAxisLabel = xAxis;
  }

  setYAxisLabel(yAxis: string): void {
    this.yAxisLabel = yAxis;
  }

}


export class VariableStorage implements MyStorage {
  private dataKey: string = "variableData";
  private interfaceKey: string = "variableInterface";
  private chartInfoKey: string = "variableChartInfo";

  getChartInfo(): VariableChartInfoStorageObject {
    if (localStorage.getItem(this.chartInfoKey)) {
      return JSON.parse(localStorage.getItem(this.chartInfoKey) as string);
    } else {
      return VariableChartInfo.getDefaultChartInfo();
    }
  }

  getData(): VariableDataDict[] {
    if (localStorage.getItem(this.dataKey)) {
      return JSON.parse(localStorage.getItem(this.dataKey) as string);
    } else {
      return VariableData.getDefaultDataDict();
    }
  }

  getInterface(): VariableInterfaceStorageObject {
    if (localStorage.getItem(this.interfaceKey)) {
      return JSON.parse(localStorage.getItem(this.interfaceKey) as string);
    } else {
      return VariableInterfaceImpl.getDefaultInterface();
    }
  }

  resetChartInfo(): void {
    localStorage.setItem(this.chartInfoKey, JSON.stringify(VariableChartInfo.getDefaultChartInfo()));
  }

  resetData(): void {
    localStorage.setItem(this.dataKey, JSON.stringify(VariableData.getDefaultDataDict()));
  }

  resetInterface(): void {
    localStorage.setItem(this.interfaceKey, JSON.stringify(VariableInterfaceImpl.getDefaultInterface()));
  }

  saveChartInfo(chartInfo: VariableChartInfoStorageObject): void {
    localStorage.setItem(this.chartInfoKey, JSON.stringify(chartInfo));
  }

  saveData(data: VariableDataDict[]): void {
    localStorage.setItem(this.dataKey, JSON.stringify(data));
  }

  saveInterface(interfaceInfo: VariableInterfaceStorageObject): void {
    localStorage.setItem(this.interfaceKey, JSON.stringify(interfaceInfo));
  }

}
