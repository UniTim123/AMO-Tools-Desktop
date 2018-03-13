import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CompressedAirComponent } from './compressed-air.component';
import { BagMethodComponent } from './bag-method/bag-method.component';
import { SharedModule } from '../../shared/shared.module';
import { BagMethodFormComponent } from './bag-method/bag-method-form/bag-method-form.component';
import { FlowFactorComponent } from './flow-factor/flow-factor.component';
import { FlowFactorFormComponent } from './flow-factor/flow-factor-form/flow-factor-form.component';
import { PneumaticAirComponent } from './pneumatic-air/pneumatic-air.component';
import { PneumaticAirFormComponent } from './pneumatic-air/pneumatic-air-form/pneumatic-air-form.component';
import { ReceiverTankComponent } from './receiver-tank/receiver-tank.component';
import { GeneralMethodComponent } from './receiver-tank/general-method/general-method.component';
import { GeneralMethodFormComponent } from './receiver-tank/general-method/general-method-form/general-method-form.component';
import { PipeSizingComponent } from './pipe-sizing/pipe-sizing.component';
import { PipeSizingFormComponent } from './pipe-sizing/pipe-sizing-form/pipe-sizing-form.component';
import { AirVelocityComponent } from './air-velocity/air-velocity.component';
import { AirVelocityFormComponent } from './air-velocity/air-velocity-form/air-velocity-form.component';
import { OperatingCostComponent } from './operating-cost/operating-cost.component';
import { OperatingCostFormComponent } from './operating-cost/operating-cost-form/operating-cost-form.component';
import { SystemCapacityComponent } from './system-capacity/system-capacity.component';
import { SystemCapacityFormComponent } from './system-capacity/system-capacity-form/system-capacity-form.component';
import { DedicatedStorageComponent } from './receiver-tank/dedicated-storage/dedicated-storage.component';
import { DedicatedStorageFormComponent } from './receiver-tank/dedicated-storage/dedicated-storage-form/dedicated-storage-form.component';
import { AirCapacityComponent } from './receiver-tank/air-capacity/air-capacity.component';
import { AirCapacityFormComponent } from './receiver-tank/air-capacity/air-capacity-form/air-capacity-form.component';
import { DelayMethodComponent } from './receiver-tank/delay-method/delay-method.component';
import { DelayMethodFormComponent } from './receiver-tank/delay-method/delay-method-form/delay-method-form.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [
    CompressedAirComponent,
    BagMethodComponent,
    BagMethodFormComponent,
    FlowFactorComponent,
    FlowFactorFormComponent,
    PneumaticAirComponent,
    PneumaticAirFormComponent,
    ReceiverTankComponent,
    GeneralMethodComponent,
    GeneralMethodFormComponent,
    PipeSizingComponent,
    PipeSizingFormComponent,
    AirVelocityComponent,
    AirVelocityFormComponent,
    OperatingCostComponent,
    OperatingCostFormComponent,
    SystemCapacityComponent,
    SystemCapacityFormComponent,
    DedicatedStorageComponent,
    DedicatedStorageFormComponent,
    AirCapacityComponent,
    AirCapacityFormComponent,
    DelayMethodComponent,
    DelayMethodFormComponent
  ],
  exports: [
    CompressedAirComponent
  ],
})
export class CompressedAirModule { }
