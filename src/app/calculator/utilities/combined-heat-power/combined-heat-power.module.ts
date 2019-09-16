import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CombinedHeatPowerComponent } from './combined-heat-power.component';
import { CombinedHeatPowerFormComponent } from './combined-heat-power-form/combined-heat-power-form.component';
import { CombinedHeatPowerHelpComponent } from './combined-heat-power-help/combined-heat-power-help.component';
import { CombinedHeatPowerResultsComponent } from './combined-heat-power-results/combined-heat-power-results.component';
import { CombinedHeatPowerService } from './combined-heat-power.service';
import { SharedModule } from '../../../shared/shared.module';
import { ExportableResultsTableModule } from '../../../shared/exportable-results-table/exportable-results-table.module';
import { OperatingHoursModalModule } from '../../../shared/operating-hours-modal/operating-hours-modal.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    ExportableResultsTableModule,
    OperatingHoursModalModule
  ],
  declarations: [
    CombinedHeatPowerComponent,
    CombinedHeatPowerFormComponent,
    CombinedHeatPowerHelpComponent,
    CombinedHeatPowerResultsComponent
  ],
  exports: [
    CombinedHeatPowerComponent
  ],
  providers: [
    CombinedHeatPowerService
  ]
})
export class CombinedHeatPowerModule { }
