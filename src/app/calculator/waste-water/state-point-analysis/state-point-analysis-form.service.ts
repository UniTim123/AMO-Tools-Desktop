import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StatePointAnalysisInput } from '../../../shared/models/waste-water';

@Injectable()
export class StatePointAnalysisFormService {

  constructor(private formBuilder: FormBuilder) { }

  getEmptyForm(): FormGroup {
    let formGroup: FormGroup = this.formBuilder.group({
      sviValue: [0, [Validators.required, Validators.min(0)]],
      sviParameter: [1, [Validators.required, Validators.min(0)]],
      numberOfClarifiers: [0, [Validators.required, Validators.min(0)]],
      areaOfClarifier: [0, [Validators.required, Validators.min(0)]],
      MLSS: [0, [Validators.required, Validators.min(0)]],
      influentFlow: [0, [Validators.required, Validators.min(0)]],
      rasFlow: [0, [Validators.required, Validators.min(0)]],
      sludgeSettlingVelocity: [1, [Validators.required, Validators.min(0)]],
    });
    return formGroup;
  }

  getFormFromInput(input: StatePointAnalysisInput, updatedBaselineInput?: StatePointAnalysisInput): FormGroup {
    let sviValue: number = input.sviValue;
    let sviParameter: number = input.sviParameter;
    let numberOfClarifiers: number = input.numberOfClarifiers;
    let areaOfClarifier: number = input.areaOfClarifier;
    let mlss: number = input.MLSS;
    let sludgeSettlingVelocity: number = input.sludgeSettlingVelocity;

    if (updatedBaselineInput) {
      sviValue = updatedBaselineInput.sviValue;
      sviParameter = updatedBaselineInput.sviParameter;
      numberOfClarifiers = updatedBaselineInput.numberOfClarifiers;
      areaOfClarifier = updatedBaselineInput.areaOfClarifier;
      mlss = updatedBaselineInput.MLSS;
      sludgeSettlingVelocity = updatedBaselineInput.sludgeSettlingVelocity;
    }

    let formGroup: FormGroup = this.formBuilder.group({
      sviValue: [sviValue, [Validators.required, Validators.min(0)]],
      sviParameter: [sviParameter, [Validators.required, Validators.min(0)]],
      numberOfClarifiers: [numberOfClarifiers, [Validators.required, Validators.min(0)]],
      areaOfClarifier: [areaOfClarifier, [Validators.required, Validators.min(0)]],
      MLSS: [mlss, [Validators.required, Validators.min(0)]],
      influentFlow: [input.influentFlow, [Validators.required, Validators.min(0)]],
      rasFlow: [input.rasFlow, [Validators.required, Validators.min(0)]],
      sludgeSettlingVelocity: [sludgeSettlingVelocity, [Validators.required, Validators.min(0)]],
    });
    return formGroup;
  }

  
  getInputFromForm(form: FormGroup): StatePointAnalysisInput {
    let input: StatePointAnalysisInput = {
      sviValue: form.controls.sviValue.value,
      sviParameter: form.controls.sviParameter.value,
      numberOfClarifiers: form.controls.numberOfClarifiers.value,
      areaOfClarifier: form.controls.areaOfClarifier.value,
      MLSS: form.controls.MLSS.value,
      influentFlow: form.controls.influentFlow.value,
      rasFlow: form.controls.rasFlow.value,
      sludgeSettlingVelocity: form.controls.sludgeSettlingVelocity.value,
    };
    return input;
  }
}
