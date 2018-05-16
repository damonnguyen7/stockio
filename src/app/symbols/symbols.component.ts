import { Component, OnInit } from '@angular/core';

import { SymbolMetaType } from '../type-class/symbol-meta'; //symbol class
import { SymbolService } from '../symbol.service';

@Component({
  selector: 'app-symbols',
  templateUrl: './symbols.component.html',
  styleUrls: ['./symbols.component.css'],
  providers: [ ]
})
export class SymbolsComponent implements OnInit {
  symbols: SymbolMetaType[];
  filteredSymbols: SymbolMetaType[];
  filterQuery: string;
  period: 'Monthly'
  displayClearButton: boolean = false;

  constructor(private symbolService: SymbolService) { }

  ngOnInit() {
    this.getSymbols();
    this.symbolService.state$.subscribe((chartdata) => {

    });
  }

  getSymbols(): void {
    const setSymbols = (symbols) => { 
      this.symbols = symbols;
    };
    const handleError = (error) => { throw error };
    const end = () => { console.log('completed fetch') };

    this.symbolService.getSymbols()
      .subscribe(setSymbols);
  }

  filterSymbols() {
    const filterQuery = this.filterQuery.toLowerCase();
    const hasList = this.symbols.length > 0;
    function setFilteredSymbols() {
      this.filteredSymbols = this.symbols.filter((symbolObj) => {
        const matchSymbol = symbolObj.Name.toLowerCase().indexOf(filterQuery) > -1;
        const matchSymbolName = symbolObj.Symbol.toLowerCase().indexOf(filterQuery) > -1;
        if (matchSymbol || matchSymbolName) return symbolObj;
      });
    };
    this.filterQuery.length > 0 ? this.displayClearButton = true : this.displayClearButton = false;
    hasList ? setFilteredSymbols.call(this) : console.log('No list to filter');
  }

  selectSymbol(symbol): void {
    const period = this.period;
    this.symbolService.fetchSymbolData(symbol, 'Monthly');
  }

  clearInputField() {
    this.filterQuery = '';
    this.displayClearButton = false;
  }
}
