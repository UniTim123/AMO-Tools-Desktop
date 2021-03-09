import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HeatCascadingInput } from '../../../shared/models/phast/heatCascading';
import { MaterialInputProperties } from '../../../shared/models/phast/losses/flueGas';
import { GreaterThanValidator } from '../../../shared/validators/greater-than';

@Injectable()
export class HeatCascadingFormService {


  constructor(private formBuilder: FormBuilder) { }

  getHeatCascadingForm(inputObj: HeatCascadingInput): FormGroup {
    let form: FormGroup = this.formBuilder.group({
      priFiringRate: [inputObj.priFiringRate, [Validators.required, GreaterThanValidator.greaterThan(0)]],
      priExhaustTemperature: [inputObj.priExhaustTemperature, Validators.required],
      priExhaustO2: [inputObj.priExhaustO2, [Validators.required, Validators.min(0), Validators.max(100)]],
      priCombAirTemperature: [inputObj.priCombAirTemperature, Validators.required],
      priAvailableHeat: [inputObj.priAvailableHeat, [Validators.required, GreaterThanValidator.greaterThan(0), Validators.max(100)]],
      priOpHours: [inputObj.priOpHours, [Validators.required, Validators.min(0), Validators.max(8760)]],
      priFuelHV: [inputObj.priFuelHV, Validators.required],
     
      secFiringRate: [inputObj.secFiringRate, [Validators.required, GreaterThanValidator.greaterThan(0)]],
      secExhaustTemperature: [inputObj.secExhaustTemperature, Validators.required],
      secExhaustO2: [inputObj.secExhaustO2, [Validators.required, Validators.min(0), Validators.max(100)]],
      secCombAirTemperature: [inputObj.secCombAirTemperature, Validators.required],
      secAvailableHeat: [inputObj.secAvailableHeat, [Validators.required, GreaterThanValidator.greaterThan(0), Validators.max(100)]],
      secOpHours: [inputObj.secOpHours, [Validators.required, Validators.min(0), Validators.max(8760)]],
      secFuelCost: [inputObj.secFuelCost, Validators.required],
      
      oxygenCalculationMethod: [inputObj.oxygenCalculationMethod],
      excessAir: [inputObj.excessAir],
      flueGasO2: [inputObj.flueGasO2],
      o2InFlueGas: [inputObj.o2InFlueGas],
      // Gas Material
      materialTypeId: [inputObj.materialTypeId],
      substance: [inputObj.substance],
      CH4: [inputObj.CH4],
      C2H6: [inputObj.C2H6],
      N2: [inputObj.N2],
      H2: [inputObj.H2],
      C3H8: [inputObj.C3H8],
      C4H10_CnH2n: [inputObj.C4H10_CnH2n],
      H2O: [inputObj.H2O],
      CO: [inputObj.CO],
      CO2: [inputObj.CO2],
      SO2: [inputObj.SO2],
      O2: [inputObj.O2],

    });

    return form;
  }

  getHeatCascadingInput(form: FormGroup): HeatCascadingInput {
    let obj: HeatCascadingInput = {
      priFiringRate: form.controls.priFiringRate.value,
      priExhaustTemperature: form.controls.priExhaustTemperature.value,
      priExhaustO2: form.controls.priExhaustO2.value,
      priCombAirTemperature: form.controls.priCombAirTemperature.value,
      priAvailableHeat: form.controls.priAvailableHeat.value,
      priOpHours: form.controls.priOpHours.value,
      priFuelHV: form.controls.priFuelHV.value,

      secFiringRate: form.controls.secFiringRate.value,
      secExhaustTemperature: form.controls.secExhaustTemperature.value,
      secExhaustO2: form.controls.secExhaustO2.value,
      secCombAirTemperature: form.controls.secCombAirTemperature.value,
      secAvailableHeat: form.controls.secAvailableHeat.value,
      secOpHours: form.controls.secOpHours.value,
      secFuelCost: form.controls.secFuelCost.value,
    // Used to calculate gas material element properties
      materialTypeId: form.controls.materialTypeId.value,
      o2InFlueGas: form.controls.o2InFlueGas.value,
      flueGasO2: form.controls.flueGasO2.value,
      oxygenCalculationMethod: form.controls.oxygenCalculationMethod.value,
      excessAir: form.controls.excessAir.value,

      // Gas Material element properties
      gasFuelType: true,
      substance: form.controls.substance.value,
      CH4: form.controls.CH4.value,
      C2H6: form.controls.C2H6.value,
      N2: form.controls.N2.value,
      H2: form.controls.H2.value,
      C3H8: form.controls.C3H8.value,
      C4H10_CnH2n: form.controls.C4H10_CnH2n.value,
      H2O: form.controls.H2O.value,
      CO: form.controls.CO.value,
      CO2: form.controls.CO2.value,
      SO2: form.controls.SO2.value,
      O2: form.controls.O2.value,
    };
    return obj;
  }
  
  getMaterialInputProperties(form: FormGroup): MaterialInputProperties {
    let input: MaterialInputProperties;
    input = {
      CH4: form.controls.CH4.value,
      C2H6: form.controls.C2H6.value,
      N2: form.controls.N2.value,
      H2: form.controls.H2.value,
      C3H8: form.controls.C3H8.value,
      C4H10_CnH2n: form.controls.C4H10_CnH2n.value,
      H2O: form.controls.H2O.value,
      CO: form.controls.CO.value,
      CO2: form.controls.CO2.value,
      SO2: form.controls.SO2.value,
      O2: form.controls.O2.value,
      o2InFlueGas: form.controls.flueGasO2.value,
      excessAir: form.controls.excessAir.value
    };
    return input;
  }

}
