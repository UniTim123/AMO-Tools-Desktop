import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Settings } from '../../../shared/models/settings';
import { Quantity } from '../../../shared/models/steam/steam-inputs';
import { CondensingTurbineOperationTypes } from '../../../shared/models/steam/ssmt';
import { SsmtService } from '../../ssmt.service';
import { CompareService } from '../../compare.service';

@Component({
  selector: 'app-condensing-turbine-form',
  templateUrl: './condensing-turbine-form.component.html',
  styleUrls: ['./condensing-turbine-form.component.css']
})
export class CondensingTurbineFormComponent implements OnInit {
  @Input()
  turbineForm: FormGroup;
  @Input()
  selected: boolean;
  @Input()
  settings: Settings;
  @Output('emitSave')
  emitSave = new EventEmitter<boolean>();
  @Input()
  inSetup: boolean;

  turbineOptionTypes: Array<Quantity>;
  constructor(private ssmtService: SsmtService, private compareService: CompareService) {
  }

  ngOnInit() {
    this.turbineOptionTypes = CondensingTurbineOperationTypes;
    if (this.selected == false) {
      this.disableForm();
    } else {
      this.enableForm();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.selected && !changes.selected.isFirstChange()) {
      if (this.selected == false) {
        this.disableForm();
      } else {
        this.enableForm();
      }
    }
  }

  enableForm(){
    this.turbineForm.controls.operationType.enable();
  }

  disableForm(){
    this.turbineForm.controls.operationType.disable();
  }

  save() {
    this.emitSave.emit(true);
  }

  focusField(str: string) {
    this.ssmtService.currentField.next(str);
  }

  focusOut() {
    this.ssmtService.currentField.next('default');
  }

  canCompare() {
    if (this.compareService.baselineSSMT && this.compareService.modifiedSSMT && !this.inSetup) {
      return true;
    } else {
      return false;
    }
  }
  isIsentropicEfficiencyDifferent() {
    if (this.canCompare()) {
      return this.compareService.isIsentropicEfficiencyDifferent('condensingTurbine');
    } else {
      return false;
    }
  }

  isGenerationEfficiencyDifferent() {
    if (this.canCompare()) {
      return this.compareService.isGenerationEfficiencyDifferent('condensingTurbine');
    } else {
      return false;
    }
  }
  isCondenserPressureDifferent() {
    if (this.canCompare()) {
      return this.compareService.isCondenserPressureDifferent('condensingTurbine');
    } else {
      return false;
    }
  }
  isOperationTypeDifferent() {
    if (this.canCompare()) {
      return this.compareService.isOperationTypeDifferent('condensingTurbine');
    } else {
      return false;
    }
  }
  isOperationValueDifferent() {
    if (this.canCompare()) {
      return this.compareService.isOperationValueDifferent();
    } else {
      return false;
    }
  }
  isUseTurbineDifferent() {
    if (this.canCompare()) {
      return this.compareService.isUseTurbineDifferent('condensingTurbine');
    } else {
      return false;
    }
  }
}
