import { Component, OnInit } from '@angular/core';

import { SymbolService } from '../symbol.service';
import { SYMBOLS } from '../symbols-seed';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css'],
  providers: [ ]
})
export class GraphComponent implements OnInit {
  constructor(private symbolService: SymbolService) {}
  public originalData;
  public metaData;
  public displayChart: string = "monthly";
  public lineChartLegend:boolean = true;
  public lineChartType:string = 'line';
  public lineChartData:Array<any> = [];
  public lineChartLabels:Array<any> = [];
  public lineChartOptions:any = {
    responsive: true
  };
  public lineChartColors:Array<any> = [
    { // blue
      backgroundColor: '#8AC8F1',
      borderColor: '#3DA3E8',
      pointBackgroundColor: '#3DA3E8',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#3DA3E8',
      pointHoverBorderColor: '#3DA3E8'
    },
    { // red
      backgroundColor: '#FDA2B6',
      borderColor: '#FD6585',
      pointBackgroundColor: '#FD6585',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#FD6585',
      pointHoverBorderColor: '#FD6585'
    }
  ];

  public barChartOptions:any = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabels:string[] = [];
  public barChartType:string = 'bar';
  public barChartLegend:boolean = true;
  public barChartData:any[] = [];

  ngOnInit() {
    this.symbolService.fetchSymbolData(SYMBOLS[0], 'Monthly');
    this.symbolService.state$.subscribe((chartdata) => {
      const { chartData, metaData } = chartdata;
      if (this.lineChartData.length !== 0 && this.lineChartLabels.length !== 0) {
        this.lineChartData.length = 0;
        this.lineChartLabels.length = 0;
      } 
      if (this.barChartData.length !== 0 && this.barChartLabels.length !== 0) {
        this.barChartData.length = 0;
        this.barChartLabels.length = 0;
      } 
      this.metaData = metaData;
      this.originalData = chartData.reverse()
      this.generateMonthlyChart(this.originalData);
      this.generateYearlyChart(this.originalData);
    });
  }
 

  public generateMonthlyChart(chartData): void {
    const lowChart = {data: [], label: 'Low'};
    const highChart = {data: [], label: 'High'};
    for (let i = 0; i < chartData.length; i++) {
      let date = chartData[i].date;
      let low = chartData[i].low;
      let high = chartData[i].high;
      this.lineChartLabels.push(date);
      lowChart.data.push(low);
      highChart.data.push(high);
    }
    this.lineChartData = [lowChart, highChart];
  }

  public generateYearlyChart(chartData): void {
    const lowChart = {data: [], label: 'High average'};
    const highChart = {data: [], label: 'Low average'};
    let totalLow = 0;
    let totalHigh = 0;
    let currentYear;
    let yearFrequency = 0;
    for (let i = 0; i < chartData.length; i++) {
      let year = chartData[i].date.slice(0,4);
      let low = Number(chartData[i].low);
      let high = Number(chartData[i].high);
      if (this.barChartLabels.indexOf(year) === -1) this.barChartLabels.push(year);
      if (currentYear === undefined) {
        currentYear = year;
      } else if (currentYear !== year) {
        let lowAverage = totalLow / yearFrequency;
        let highAverage = totalHigh / yearFrequency;
        highChart.data.push(Number(lowAverage.toString().slice(0, 4)));
        lowChart.data.push(Number(highAverage.toString().slice(0, 4)));
        totalLow = 0;
        totalHigh = 0;
        yearFrequency = 0;
        currentYear = year;
      }
      totalLow = totalLow + low;
      totalHigh = totalHigh + high;
      yearFrequency = yearFrequency + 1;
    }
    this.barChartData = [lowChart, highChart];
  }

  switchToDailyGraph() {
    this.displayChart = 'monthly';
  }

  switchToYearlyGraph() {
    this.displayChart = 'year';
  }

}

