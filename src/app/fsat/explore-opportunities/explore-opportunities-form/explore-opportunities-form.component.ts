import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, HostListener, SimpleChanges } from '@angular/core';
import { Settings } from '../../../shared/models/settings';
import { FSAT, InletPressureData, OutletPressureData, PlaneData, FanRatedInfo } from '../../../shared/models/fans';
import { HelpPanelService } from '../../help-panel/help-panel.service';
import { ModifyConditionsService } from '../../modify-conditions/modify-conditions.service';
import { FormGroup } from '@angular/forms';
import { FanFieldDataService } from '../../fan-field-data/fan-field-data.service';
import { FanMotorService } from '../../fan-motor/fan-motor.service';
import { FanSetupService } from '../../fan-setup/fan-setup.service';
import { ConvertUnitsService } from '../../../shared/convert-units/convert-units.service';
import { FsatService, InletVelocityPressureInputs } from '../../fsat.service';
import { FanFieldDataWarnings, FanOperationsWarnings, FsatWarningService } from '../../fsat-warning.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { OperationsService } from '../../operations/operations.service';

@Component({
  selector: 'app-explore-opportunities-form',
  templateUrl: './explore-opportunities-form.component.html',
  styleUrls: ['./explore-opportunities-form.component.css']
})
export class ExploreOpportunitiesFormComponent implements OnInit {
  @Input()
  settings: Settings;
  @Input()
  fsat: FSAT;
  @Input()
  exploreModIndex: number;
  @Output('emitSave')
  emitSave = new EventEmitter<boolean>();
  @Output('emitAddNewMod')
  emitAddNewMod = new EventEmitter<boolean>();

  @ViewChild('modalBody', { static: false }) public modalBody: ElementRef;
  @ViewChild('pressureModal', { static: false }) public pressureModal: ModalDirective;
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.getBodyHeight();
  }
  bodyHeight: number;

  baselineFieldDataForm: FormGroup;
  modificationFieldDataForm: FormGroup;

  baselineOperationsForm: FormGroup;
  modificationOperationsForm: FormGroup;

  baselineMotorForm: FormGroup;
  modificationMotorForm: FormGroup;

  baselineFanSetupForm: FormGroup;
  modificationFanSetupForm: FormGroup;
  baselineFanEfficiency: number;

  modificationFanFieldDataWarnings: FanFieldDataWarnings;
  baselineFanFieldDataWarnings: FanFieldDataWarnings;

  modificationOperationsWarnings: FanOperationsWarnings;
  baselineOperationsWarnings: FanOperationsWarnings;

  pressureCalcType: string;
  inletPressureCopy: InletPressureData;
  outletPressureCopy: OutletPressureData;
  pressureModalSub: Subscription;

  inletVelocityPressureInputs: InletVelocityPressureInputs;
  disableApplyData: boolean = true;

  constructor(private helpPanelService: HelpPanelService, private modifyConditionsService: ModifyConditionsService, private fanFieldDataService: FanFieldDataService,
    private fanMotorService: FanMotorService, private fanSetupService: FanSetupService, private convertUnitsService: ConvertUnitsService, private fsatService: FsatService,
    private fsatWarningService: FsatWarningService, private fanOperationsService: OperationsService) { }

  ngOnInit() {
    this.initForms();
    this.checkWarnings();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.exploreModIndex) {
      if (!changes.exploreModIndex.isFirstChange()) {
        this.initForms();
      }
    }
  }

  ngOnDestroy() {
    this.pressureModalSub.unsubscribe();
    if (this.fsat.modifications[this.exploreModIndex] && !this.fsat.modifications[this.exploreModIndex].fsat.name) {
      this.fsat.modifications[this.exploreModIndex].fsat.name = 'Opportunities Modification';
      this.save();
    }
  }

  ngAfterViewInit(){
    this.pressureModalSub = this.pressureModal.onShown.subscribe(() => {
      this.getBodyHeight();
    });
  }

  save() {
    this.saveFieldData();
    this.fsat.modifications[this.exploreModIndex].fsat.fsatOperations = this.fanOperationsService.getObjFromForm(this.modificationOperationsForm);    
    this.fsat.modifications[this.exploreModIndex].fsat.fanMotor = this.fanMotorService.getObjFromForm(this.modificationMotorForm);
    this.fsat.modifications[this.exploreModIndex].fsat.fanSetup = this.fanSetupService.getObjFromForm(this.modificationFanSetupForm);
    this.checkWarnings();
    this.emitSave.emit(true);
  }

  saveFieldData() {
    let tmpInletPressureData: InletPressureData = this.fsat.modifications[this.exploreModIndex].fsat.fieldData.inletPressureData;
    let tmpOutletPressureData: OutletPressureData = this.fsat.modifications[this.exploreModIndex].fsat.fieldData.outletPressureData;
    let tmpPlaneData: PlaneData = this.fsat.modifications[this.exploreModIndex].fsat.fieldData.planeData;
    let tmpfanRatedInfo: FanRatedInfo = this.fsat.modifications[this.exploreModIndex].fsat.fieldData.fanRatedInfo;
    let tmpCalcType: string = this.fsat.modifications[this.exploreModIndex].fsat.fieldData.pressureCalcResultType;
    this.fsat.modifications[this.exploreModIndex].fsat.fieldData = this.fanFieldDataService.getObjFromForm(this.modificationFieldDataForm);
    this.fsat.modifications[this.exploreModIndex].fsat.fieldData.inletPressureData = tmpInletPressureData;
    this.fsat.modifications[this.exploreModIndex].fsat.fieldData.outletPressureData = tmpOutletPressureData;
    this.fsat.modifications[this.exploreModIndex].fsat.fieldData.planeData = tmpPlaneData;
    this.fsat.modifications[this.exploreModIndex].fsat.fieldData.fanRatedInfo = tmpfanRatedInfo;
    this.fsat.modifications[this.exploreModIndex].fsat.fieldData.pressureCalcResultType = tmpCalcType;
  }

  initForms() {
    if (this.fsat.modifications[this.exploreModIndex].fsat.isVFD) {
      this.fsat.modifications[this.exploreModIndex].exploreOppsShowVfd = {hasOpportunity: true, display: "Install VFD"};
      delete this.fsat.modifications[this.exploreModIndex].fsat.isVFD;
    } else if (!this.fsat.modifications[this.exploreModIndex].exploreOppsShowVfd) {
      this.fsat.modifications[this.exploreModIndex].exploreOppsShowVfd = {hasOpportunity: false, display: "Install VFD"};
    }
    this.baselineFieldDataForm = this.fanFieldDataService.getFormFromObj(this.fsat.fieldData);
    this.baselineFieldDataForm.disable();
    this.modificationFieldDataForm = this.fanFieldDataService.getFormFromObj(this.fsat.modifications[this.exploreModIndex].fsat.fieldData);

    this.baselineOperationsForm = this.fanOperationsService.getFormFromObj(this.fsat.fsatOperations);
    this.baselineOperationsForm.disable();
    this.modificationOperationsForm = this.fanOperationsService.getFormFromObj(this.fsat.modifications[this.exploreModIndex].fsat.fsatOperations);

    this.baselineMotorForm = this.fanMotorService.getFormFromObj(this.fsat.fanMotor);
    this.baselineMotorForm.disable();
    this.modificationMotorForm = this.fanMotorService.getFormFromObj(this.fsat.modifications[this.exploreModIndex].fsat.fanMotor);


    this.baselineFanSetupForm = this.fanSetupService.getFormFromObj(this.fsat.fanSetup, false);
    this.baselineFanSetupForm.disable();
    this.modificationFanSetupForm = this.fanSetupService.getFormFromObj(this.fsat.modifications[this.exploreModIndex].fsat.fanSetup, true);

    this.baselineFanEfficiency = this.fsatService.getResults(this.fsat, true, this.settings).fanEfficiency;
    this.baselineFanEfficiency = this.convertUnitsService.roundVal(this.baselineFanEfficiency, 2);
  }

  checkWarnings() {
    this.baselineFanFieldDataWarnings = this.fsatWarningService.checkFieldDataWarnings(this.fsat, this.settings, false);
    this.modificationFanFieldDataWarnings = this.fsatWarningService.checkFieldDataWarnings(this.fsat.modifications[this.exploreModIndex].fsat, this.settings, true);
    this.baselineOperationsWarnings = this.fsatWarningService.checkOperationsWarnings(this.fsat, this.settings, false);
    this.modificationOperationsWarnings = this.fsatWarningService.checkOperationsWarnings(this.fsat.modifications[this.exploreModIndex].fsat, this.settings, true);
  
  }

  focusField(str: string) {
    this.helpPanelService.currentField.next(str);
    this.modifyConditionsService.modifyConditionsTab.next('fan-field-data');
  }

  addNewMod() {
    this.emitAddNewMod.emit(true);
  }

  setVFD() {
    if (this.fsat.modifications[this.exploreModIndex].exploreOppsShowVfd.hasOpportunity) {
      this.modificationFanSetupForm.controls.drive.patchValue(4);
      this.modificationFanSetupForm.controls.specifiedDriveEfficiency.patchValue(95);
    }else {
      this.modificationFanSetupForm.controls.drive.patchValue(this.baselineFanSetupForm.controls.drive.value);
      this.modificationFanSetupForm.controls.specifiedDriveEfficiency.patchValue(95);
    }
    this.save();
  }

  setInletVelocityPressureInputs() {
    this.inletVelocityPressureInputs = {
      ductArea: this.fsat.modifications[this.exploreModIndex].fsat.fieldData.ductArea,
      gasDensity: this.fsat.modifications[this.exploreModIndex].fsat.baseGasDensity.gasDensity,
      flowRate: this.fsat.modifications[this.exploreModIndex].fsat.fieldData.flowRate
    }   
  }

  setCalcInvalid(isCalcValid: boolean) {
    this.disableApplyData = isCalcValid;
  }

  openPressureModal(str: string) {
    this.setInletVelocityPressureInputs();
    if (this.fsat.modifications[this.exploreModIndex].fsat.fieldData.inletPressureData) {
      this.inletPressureCopy = JSON.parse(JSON.stringify(this.fsat.modifications[this.exploreModIndex].fsat.fieldData.inletPressureData));
    }
    if (this.fsat.modifications[this.exploreModIndex].fsat.fieldData.outletPressureData) {
      this.outletPressureCopy = JSON.parse(JSON.stringify(this.fsat.modifications[this.exploreModIndex].fsat.fieldData.outletPressureData));
    }
    this.pressureCalcType = str;
    this.fsatService.modalOpen.next(true);
    this.pressureModal.show();
  }

  hidePressureModal() {
    this.disableApplyData = false;
    this.pressureModal.hide();
  }

  saveAndClose() {
    if (this.pressureCalcType === 'inlet') {
      this.saveInletPressure(this.inletPressureCopy);
    } else if (this.pressureCalcType === 'outlet') {
      this.saveOutletPressure(this.outletPressureCopy);
    }
    this.hidePressureModal();
  }

  saveInletPressure(inletPressureData: InletPressureData) {
    this.inletPressureCopy = inletPressureData;
    if (this.inletPressureCopy) {
      this.fsat.modifications[this.exploreModIndex].fsat.fieldData.inletPressureData = inletPressureData;
      this.modificationFieldDataForm.patchValue({
        inletPressure: this.fsat.modifications[this.exploreModIndex].fsat.fieldData.inletPressureData.calculatedInletPressure
      });
      this.save();
    }
  }

  saveOutletPressure(outletPressureData: OutletPressureData) {
    this.outletPressureCopy = outletPressureData;
    if (this.outletPressureCopy) {
      this.fsat.modifications[this.exploreModIndex].fsat.fieldData.outletPressureData = outletPressureData;
      this.modificationFieldDataForm.patchValue({
        outletPressure: this.fsat.modifications[this.exploreModIndex].fsat.fieldData.outletPressureData.calculatedOutletPressure
      });
      this.save();
    }
  }

  getBodyHeight() {
    if (this.modalBody) {
      this.bodyHeight = this.modalBody.nativeElement.clientHeight;
    } else {
      this.bodyHeight = 0;
    }
  }
}
