import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CompressedAirAssessment, CompressorInventoryItem, PerformancePoint } from '../../../../shared/models/compressed-air-assessment';
import { CompressedAirAssessmentService } from '../../../compressed-air-assessment.service';
import { InventoryService } from '../../inventory.service';
import { NoLoadCalculationsService } from '../calculations/no-load-calculations.service';
import { PerformancePointsFormService, PerformancePointWarnings, ValidationMessageMap } from '../performance-points-form.service';
import { PerformancePointCalculationsService } from '../calculations/performance-point-calculations.service';
import { CompressedAirDataManagementService } from '../../../compressed-air-data-management.service';

@Component({
  selector: '[app-no-load]',
  templateUrl: './no-load.component.html',
  styleUrls: ['./no-load.component.css']
})
export class NoLoadComponent implements OnInit {
  @Input()
  inModification: boolean;

  selectedCompressorSub: Subscription;
  form: FormGroup;
  isFormChange: boolean = false;
  noLoadLabel: string;
  validationMessages: ValidationMessageMap;
  warnings: PerformancePointWarnings;

  showPressureCalc: boolean;
  showAirflowCalc: boolean;
  showPowerCalc: boolean;
  selectedCompressor: CompressorInventoryItem;
  constructor(private inventoryService: InventoryService, private compressedAirAssessmentService: CompressedAirAssessmentService,
    private performancePointsFormService: PerformancePointsFormService,
    private noLoadCalculationsService: NoLoadCalculationsService, private performancePointCalculationsService: PerformancePointCalculationsService,
    private compressedAirDataManagementService: CompressedAirDataManagementService) { }

  ngOnInit(): void {
    this.selectedCompressorSub = this.inventoryService.selectedCompressor.subscribe(compressor => {
      if (compressor) {
        this.selectedCompressor = compressor;
        this.checkShowCalc();
        this.warnings = this.performancePointsFormService.checkMotorServiceFactorExceededWarning(compressor.performancePoints.noLoad.power, compressor);
        if (this.isFormChange == false) {
          this.setNoLoadLabel(compressor.compressorControls.controlType);
          this.form = this.performancePointsFormService.getPerformancePointFormFromObj(compressor.performancePoints.noLoad, compressor, 'noLoad', this.inModification);
          this.validationMessages = this.performancePointsFormService.validationMessageMap.getValue();
        } else {
          this.updateForm(this.selectedCompressor.performancePoints.noLoad);
          this.isFormChange = false;
        }
      }
    });
  }

  ngOnDestroy() {
    this.selectedCompressorSub.unsubscribe();
  }

  save() {
    this.isFormChange = true;
    if (!this.inModification) {
      let noLoad: PerformancePoint = this.performancePointsFormService.getPerformancePointObjFromForm(this.form);
      this.compressedAirDataManagementService.updateNoLoad(noLoad);
    } else {
      let noLoad: PerformancePoint = this.performancePointsFormService.getPerformancePointObjFromForm(this.form);
      this.selectedCompressor.performancePoints.noLoad = noLoad;
      this.selectedCompressor.performancePoints = this.performancePointCalculationsService.updatePerformancePoints(this.selectedCompressor);
      let compressedAirAssessment: CompressedAirAssessment = this.compressedAirAssessmentService.compressedAirAssessment.getValue();
      let selectedModificationId: string = this.compressedAirAssessmentService.selectedModificationId.getValue();
      let modificationIndex: number = compressedAirAssessment.modifications.findIndex(mod => { return mod.modificationId == selectedModificationId });
      let adjustedCompressorIndex: number = compressedAirAssessment.modifications[modificationIndex].useUnloadingControls.adjustedCompressors.findIndex(adjustedCompressor => { return adjustedCompressor.compressorId == this.selectedCompressor.itemId });
      compressedAirAssessment.modifications[modificationIndex].useUnloadingControls.adjustedCompressors[adjustedCompressorIndex].performancePoints = this.selectedCompressor.performancePoints;
      this.compressedAirAssessmentService.updateCompressedAir(compressedAirAssessment);
    }
  }

  focusField(str: string) {
    this.compressedAirAssessmentService.focusedField.next(str);
    if(this.inModification){
      this.compressedAirAssessmentService.focusedField.next('useUnloadingControls');
      this.compressedAirAssessmentService.helpTextField.next(str);
    }
  }

  setNoLoadLabel(controlType: number) {
    if (controlType == 4 || controlType == 6 || controlType == 2 || controlType == 3 || controlType == 8 || controlType == 10) {
      this.noLoadLabel = "(unloaded)";
    } else if (controlType == 5) {
      this.noLoadLabel = "(off)";
    } else if (controlType == 1) {
      this.noLoadLabel = "(modulated)";
    }
  }

  saveDischargePressure() {
    this.form.controls.isDefaultPressure.patchValue(false);
    this.save();
  }

  saveAirFlow() {
    this.form.controls.isDefaultAirFlow.patchValue(false);
    this.save();
  }

  savePower() {
    this.form.controls.isDefaultPower.patchValue(false);
    this.save();
  }

  checkShowCalc() {
    if (!this.selectedCompressor.performancePoints.noLoad.isDefaultAirFlow) {
      let defaultValue: number = this.noLoadCalculationsService.getNoLoadAirFlow(this.selectedCompressor, true);
      this.showAirflowCalc = (this.selectedCompressor.performancePoints.noLoad.airflow != defaultValue);
    } else {
      this.showAirflowCalc = false;
    }

    if (!this.selectedCompressor.performancePoints.noLoad.isDefaultPower) {
      let defaultValue: number = this.noLoadCalculationsService.getNoLoadPower(this.selectedCompressor, true);
      this.showPowerCalc = (this.selectedCompressor.performancePoints.noLoad.power != defaultValue);
    } else {
      this.showPowerCalc = false;
    }

    if (!this.selectedCompressor.performancePoints.noLoad.isDefaultPressure) {
      let defaultValue: number = this.noLoadCalculationsService.getNoLoadPressure(this.selectedCompressor, true);
      this.showPressureCalc = (this.selectedCompressor.performancePoints.noLoad.dischargePressure != defaultValue);
    } else {
      this.showPressureCalc = false;
    }
  }

  setAirFlow() {
    let defaultValue: number = this.noLoadCalculationsService.getNoLoadAirFlow(this.selectedCompressor, true);
    this.form.controls.airflow.patchValue(defaultValue);
    this.form.controls.isDefaultAirFlow.patchValue(true);
    this.save();
  }

  setPower() {
    let defaultValue: number = this.noLoadCalculationsService.getNoLoadPower(this.selectedCompressor, true);
    this.form.controls.power.patchValue(defaultValue);
    this.form.controls.isDefaultPower.patchValue(true);
    this.save();
  }

  setPressure() {
    let defaultValue: number = this.noLoadCalculationsService.getNoLoadPressure(this.selectedCompressor, true);
    this.form.controls.dischargePressure.patchValue(defaultValue);
    this.form.controls.isDefaultPressure.patchValue(true);
    this.save();
  }

  updateForm(performancePoint: PerformancePoint) {
    if (performancePoint.airflow != this.form.controls.airflow.value) {
      this.form.controls.airflow.patchValue(performancePoint.airflow);
    }
    if (performancePoint.dischargePressure != this.form.controls.dischargePressure.value) {
      this.form.controls.dischargePressure.patchValue(performancePoint.dischargePressure);
    }
    if (performancePoint.power != this.form.controls.power.value) {
      this.form.controls.power.patchValue(performancePoint.power);
    }
  }
}
