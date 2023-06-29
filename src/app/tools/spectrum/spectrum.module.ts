import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SpectrumComponent} from './spectrum/spectrum.component';
import {SimpleDataButtonModule} from "../shared/simple-data-button/simple-data-button.component";
import {SimpleGraphButtonModule} from "../shared/simple-graph-button/simple-graph-button.component";
import {SpectrumTableComponent} from './spectrum-table/spectrum-table.component';
import {HotTableModule} from "@handsontable/angular";
import {SpectrumService} from "./spectrum.service";
import {SpectrumFormComponent} from './spectrum-form/spectrum-form.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatLegacyFormFieldModule} from "@angular/material/legacy-form-field";
import {MatLegacyOptionModule} from "@angular/material/legacy-core";
import {MatLegacySelectModule} from "@angular/material/legacy-select";
import {MatLegacySlideToggleModule} from "@angular/material/legacy-slide-toggle";


@NgModule({
  declarations: [
    SpectrumComponent,
    SpectrumTableComponent,
    SpectrumFormComponent
  ],
  imports: [
    CommonModule,
    SimpleDataButtonModule,
    SimpleGraphButtonModule,
    HotTableModule,
    FormsModule,
    MatLegacyFormFieldModule,
    MatLegacyOptionModule,
    MatLegacySelectModule,
    MatLegacySlideToggleModule,
    ReactiveFormsModule
  ],
  providers: [SpectrumService]
})
export class SpectrumModule { }
