import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ChartsModule } from 'ng2-charts/ng2-charts';

import { AppComponent } from './app.component';
import { SymbolsComponent } from './symbols/symbols.component';
import { GraphComponent } from './graph/graph.component';

import { SymbolService } from './symbol.service';


@NgModule({
  declarations: [
    AppComponent,
    SymbolsComponent,
    GraphComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ChartsModule
  ],
  providers: [ SymbolService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
