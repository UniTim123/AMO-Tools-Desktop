import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CompressorControls } from '../../../shared/models/compressed-air-assessment';
import { Settings } from '../../../shared/models/settings';
import { CompressedAirAssessmentService } from '../../compressed-air-assessment.service';
import { CompressedAirDataManagementService } from '../../compressed-air-data-management.service';
import { InventoryService } from '../inventory.service';
import { ControlTypes } from '../inventoryOptions';

@Component({
  selector: 'app-control-data',
  templateUrl: './control-data.component.html',
  styleUrls: ['./control-data.component.css']
})
export class ControlDataComponent implements OnInit {
  settings: Settings;
  selectedCompressorSub: Subscription;
  isFormChange: boolean = false;
  form: FormGroup;
  controlTypeOptions: Array<{ value: number, label: string, compressorTypes: Array<number> }>;
  displayUnload: boolean;
  displayAutomaticShutdown: boolean;
  displayUnloadSumpPressure: boolean;
  contentCollapsed: boolean;
  compressorType: number;
  settingsSub: Subscription;
  constructor(private inventoryService: InventoryService, private compressedAirAssessmentService: CompressedAirAssessmentService,
    private compressedAirDataManagementService: CompressedAirDataManagementService) { }

  ngOnInit(): void {
    this.contentCollapsed = this.inventoryService.collapseControls;
    this.settingsSub = this.compressedAirAssessmentService.settings.subscribe(settings => this.settings = settings);
    this.selectedCompressorSub = this.inventoryService.selectedCompressor.subscribe(val => {
      if (val) {
        if (this.isFormChange == false) {
          this.compressorType = val.nameplateData.compressorType;
          this.form = this.inventoryService.getCompressorControlsFormFromObj(val.compressorControls, this.compressorType);
          this.toggleDisableControls();
          this.setControlTypeOptions(val.nameplateData.compressorType);
          this.setDisplayValues();
        } else {
          this.isFormChange = false;
        }
      }
    });
  }

  ngOnDestroy() {
    this.selectedCompressorSub.unsubscribe();
    this.settingsSub.unsubscribe();
    this.inventoryService.collapseControls = this.contentCollapsed;
  }

  setControlTypeOptions(compressorType: number) {
    if (compressorType) {
      this.controlTypeOptions = ControlTypes.filter(type => { return type.compressorTypes.includes(compressorType) });
    } else {
      this.controlTypeOptions = [];
    }
    let controlOptionSelected: { value: number, label: string, compressorTypes: Array<number> } = this.controlTypeOptions.find(option => {
      return option.value == this.form.controls.controlType.value;
    });
    
    if (!controlOptionSelected && this.controlTypeOptions.length != 0) {
      // Has controlType from previously selected compressorType, set default for new compressorType
      this.form.controls.controlType.patchValue(this.controlTypeOptions[0].value);
      if (this.compressorType == 6) {
        // changed from non-centrifugal to centrifugal,save with patched valid controlType
        this.save()
      }
    }
    this.changeControlType(false);

  }

  changeControlType(isUserFormChange: boolean) {
    this.form = this.inventoryService.setCompressorControlValidators(this.form);
    if (this.form.controls.controlType.value == 2 || this.form.controls.controlType.value == 3
      || this.form.controls.controlType.value == 4 || this.form.controls.controlType.value == 6 || this.form.controls.controlType.value == 5) {
      this.form.controls.numberOfUnloadSteps.patchValue(2);
    }
    if (this.form.controls.controlType.value == 4 || this.form.controls.controlType.value == 6 || this.form.controls.controlType.value == 7 || this.form.controls.controlType.value == 5) {
      this.form.controls.unloadPointCapacity.patchValue(100);
    }
    this.toggleDisableControls();
    this.setDisplayValues();
    if (isUserFormChange) {
      this.save();
    }
  }

  toggleDisableControls() {
    if (this.form.controls.controlType.value == 4 || this.form.controls.controlType.value == 7 || this.form.controls.controlType.value == 5) {
      this.form.controls.unloadPointCapacity.disable();
    } else {
      this.form.controls.unloadPointCapacity.enable();
    }

    if (this.form.controls.controlType.value == 2 || this.form.controls.controlType.value == 3
      || this.form.controls.controlType.value == 4 || this.form.controls.controlType.value == 5) {
      this.form.controls.numberOfUnloadSteps.disable();
    } else {
      this.form.controls.numberOfUnloadSteps.enable();
    }
  }

  setDisplayValues() {
    this.displayUnload = this.inventoryService.checkDisplayUnloadCapacity(this.form.controls.controlType.value);
    this.displayAutomaticShutdown = this.inventoryService.checkDisplayAutomaticShutdown(this.form.controls.controlType.value);
    this.displayUnloadSumpPressure = this.inventoryService.checkDisplayUnloadSlumpPressure(this.compressorType)
  }

  save() {
    this.isFormChange = true;
    let compressorControls: CompressorControls = this.inventoryService.getCompressorControlsObjFromForm(this.form);
    this.compressedAirDataManagementService.updateControlData(compressorControls, true);
  }

  focusField(str: string) {
    this.compressedAirAssessmentService.focusedField.next(str);
  }

  toggleCollapse() {
    this.contentCollapsed = !this.contentCollapsed;
  }
}
