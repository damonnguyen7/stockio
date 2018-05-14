import { SymbolDataPointType } from './symbol-data-point';

export class ChartStateType {
  metaData: object;
  chartData: Array<SymbolDataPointType> = [];
}