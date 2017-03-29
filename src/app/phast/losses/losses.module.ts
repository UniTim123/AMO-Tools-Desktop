import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { ModalModule } from 'ng2-bootstrap';

import { LossesComponent } from './losses.component';
import { ChargeMaterialComponent } from './charge-material/charge-material.component';
import { WallLossesComponent } from './wall-losses/wall-losses.component';
import { AtmosphereLossesComponent } from './atmosphere-losses/atmosphere-losses.component';
import { OpeningLossesComponent } from './opening-losses/opening-losses.component';
import { HeatStorageComponent } from './heat-storage/heat-storage.component';
import { FlueGasLossesComponent } from './flue-gas-losses/flue-gas-losses.component';
import { OtherLossesComponent } from './other-losses/other-losses.component';
import { FixtureLossesComponent } from './fixture-losses/fixture-losses.component';
import { LossesSidebarComponent } from './losses-sidebar/losses-sidebar.component';
import { WallLossesFormComponent } from './wall-losses/wall-losses-form/wall-losses-form.component';
import { SolidChargeMaterialFormComponent } from './charge-material/solid-charge-material-form/solid-charge-material-form.component';
import { FixtureLossesFormComponent } from './fixture-losses/fixture-losses-form/fixture-losses-form.component';
import { WaterCoolingLossesFormComponent } from './cooling-losses/water-cooling-losses-form/water-cooling-losses-form.component';
import { AtmosphereLossesFormComponent } from './atmosphere-losses/atmosphere-losses-form/atmosphere-losses-form.component';
import { HeatStorageFormComponent } from './heat-storage/heat-storage-form/heat-storage-form.component';
import { OtherLossesFormComponent } from './other-losses/other-losses-form/other-losses-form.component';
import { FlueGasLossesFormComponent } from './flue-gas-losses/flue-gas-losses-form/flue-gas-losses-form.component';
import { LiquidChargeMaterialFormComponent } from './charge-material/liquid-charge-material-form/liquid-charge-material-form.component';
import { GasChargeMaterialFormComponent } from './charge-material/gas-charge-material-form/gas-charge-material-form.component';

import { ChargeMaterialService } from './charge-material/charge-material.service';
import { WallLossesService } from './wall-losses/wall-losses.service';
import { LossesTabsComponent } from './losses-tabs/losses-tabs.component';
import { WallLossesLabelsComponent } from './wall-losses/wall-losses-labels/wall-losses-labels.component';
import { WallLossesAdjustmentFormComponent } from './wall-losses/wall-losses-adjustment-form/wall-losses-adjustment-form.component';
import { AtmosphereLossesService } from './atmosphere-losses/atmosphere-losses.service';
import { FixtureLossesService } from './fixture-losses/fixture-losses.service';
import { FlueGasLossesService } from './flue-gas-losses/flue-gas-losses.service';
import { HeatStorageService } from './heat-storage/heat-storage.service';
import { OpeningLossesService } from './opening-losses/opening-losses.service';
import { OpeningLossesFormComponent } from './opening-losses/opening-losses-form/opening-losses-form.component';
import { CoolingLossesComponent } from './cooling-losses/cooling-losses.component';
import { CoolingLossesService } from './cooling-losses/cooling-losses.service';
import { GasCoolingLossesFormComponent } from './cooling-losses/gas-cooling-losses-form/gas-cooling-losses-form.component';
import { LiquidCoolingLossesFormComponent } from './cooling-losses/liquid-cooling-losses-form/liquid-cooling-losses-form.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    ModalModule
  ],
  declarations: [
    LossesComponent,
    ChargeMaterialComponent,
    WallLossesComponent,
    AtmosphereLossesComponent,
    OpeningLossesComponent,
    HeatStorageComponent,
    FlueGasLossesComponent,
    OtherLossesComponent,
    FixtureLossesComponent,
    LossesSidebarComponent,
    WallLossesComponent,
    FixtureLossesFormComponent,
    WaterCoolingLossesFormComponent,
    AtmosphereLossesFormComponent,
    HeatStorageFormComponent,
    OtherLossesFormComponent,
    LiquidChargeMaterialFormComponent,
    GasChargeMaterialFormComponent,
    SolidChargeMaterialFormComponent,
    WallLossesFormComponent,
    FlueGasLossesFormComponent,
    LossesTabsComponent,
    WallLossesLabelsComponent,
    WallLossesAdjustmentFormComponent,
    OpeningLossesFormComponent,
    CoolingLossesComponent,
    GasCoolingLossesFormComponent,
    LiquidCoolingLossesFormComponent
  ],
  providers: [
    ChargeMaterialService,
    WallLossesService,
    AtmosphereLossesService,
    FixtureLossesService,
    FlueGasLossesService,
    HeatStorageService,
    OpeningLossesService,
    CoolingLossesService
  ],
  exports: [
    LossesComponent
  ]
})
export class LossesModule { }
