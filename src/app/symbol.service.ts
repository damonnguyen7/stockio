import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';

import { Store } from './utils/store';
import { SymbolMetaType } from './type-class/symbol-meta';
import { ChartStateType } from './type-class/chart-state';
import { SymbolDataPointType } from './type-class/symbol-data-point';
import { SYMBOLS } from './symbols-seed';

@Injectable()
export class SymbolService extends Store<ChartStateType> {
  private apiKey: string = 'IQ9I0JXUNRSRFPTP';

  constructor(private http: HttpClient) {
    super(new ChartStateType());
  }

  getSymbols(): Observable<SymbolMetaType[]> {
    return Observable.of(SYMBOLS);
  }

  fetchSymbolData(symbolMetaData, periodType): void {
    let period;
    switch(periodType) {
        case 'Daily':
            period = 'TIME_SERIES_DAILY'
            break;
        case 'Weekly':
            period = 'TIME_SERIES_WEEKLY'
            break;
        case 'Monthly':
            period = 'TIME_SERIES_MONTHLY'
            break;
        default:
            period = 'TIME_SERIES_MONTHLY'
    };
    const url = `https://www.alphavantage.co/query?function=${period}&symbol=${symbolMetaData.Symbol}&apikey=${this.apiKey}`;
    this.http.get(url)
      .subscribe((response) => {
        let dataObj = response[`${periodType} Time Series`];
        let metaData = symbolMetaData;
        const symbolDataBatches = [];
        for (let date in dataObj) {
          let batch = {};
          batch['date'] = date;
          batch['high'] = dataObj[date]['2. high'];
          batch['low'] = dataObj[date]['3. low'];
          symbolDataBatches.push(batch);
        };
        this.setState({
          ...this.state,
          metaData,
          chartData: symbolDataBatches
        });
      });
  }

}