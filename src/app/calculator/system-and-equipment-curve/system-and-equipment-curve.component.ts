import { Component, OnInit, Input } from '@angular/core';
import { Assessment } from '../../shared/models/assessment';
import { Settings } from '../../shared/models/settings';
import { SettingsDbService } from '../../indexedDb/settings-db.service';
import { SystemAndEquipmentCurveService } from './system-and-equipment-curve.service';
import { Subscription } from 'rxjs';
import { RegressionEquationsService } from './regression-equations/regression-equations.service';
import { ByDataInputs, ByEquationInputs, EquipmentInputs } from './equipment-curve/equipment-curve.service';

@Component({
  selector: 'app-system-and-equipment-curve',
  templateUrl: './system-and-equipment-curve.component.html',
  styleUrls: ['./system-and-equipment-curve.component.css']
})
export class SystemAndEquipmentCurveComponent implements OnInit {
  @Input()
  equipmentType: string;
  @Input()
  assessment: Assessment;
  @Input()
  isEquipmentCurvePrimary: boolean;
  @Input()
  settings: Settings;

  calculatorTitle: string;
  tabSelect: string = 'results';
  curveDataSubscription: Subscription;
  byDataSubscription: Subscription;
  byEquationSubscription: Subscription;
  equipmentInputsSubscription: Subscription;
  constructor(private settingsDbService: SettingsDbService, private systemAndEquipmentCurveService: SystemAndEquipmentCurveService,
    private regressionEquationsService: RegressionEquationsService) { }

  ngOnInit() {
    this.setCalculatorTitle();
    if (!this.settings) {
      this.settings = this.settingsDbService.globalSettings;
    }
    if (this.settingsDbService.globalSettings.defaultPanelTab) {
      this.tabSelect = this.settingsDbService.globalSettings.defaultPanelTab;
    }


    if (this.equipmentType == 'pump') {
      this.curveDataSubscription = this.systemAndEquipmentCurveService.pumpSystemCurveData.subscribe(val => {
        if (val != undefined) {
          let systemCurveRegressionEquation: string = this.regressionEquationsService.getPumpSystemCurveRegressionEquation(val);
          this.regressionEquationsService.systemCurveRegressionEquation.next(systemCurveRegressionEquation);
        }
      });
    } else {
      this.curveDataSubscription = this.systemAndEquipmentCurveService.fanSystemCurveData.subscribe(val => {
        if (val != undefined) {
          let systemCurveRegressionEquation: string = this.regressionEquationsService.getFanSystemCurveRegressionEquation(val);
          this.regressionEquationsService.systemCurveRegressionEquation.next(systemCurveRegressionEquation);
        }
      });
    }

    this.byDataSubscription = this.systemAndEquipmentCurveService.byDataInputs.subscribe(byDataInputs => {
      if (byDataInputs != undefined) {
        let equipmentInputs: EquipmentInputs = this.systemAndEquipmentCurveService.equipmentInputs.getValue();
        if (equipmentInputs != undefined) {
          this.calculateByDataRegression(byDataInputs, equipmentInputs);
        }
      }
    });

    this.byEquationSubscription = this.systemAndEquipmentCurveService.byEquationInputs.subscribe(byEquationInputs => {
      if (byEquationInputs != undefined) {
        let equipmentInputs: EquipmentInputs = this.systemAndEquipmentCurveService.equipmentInputs.getValue();
        if (equipmentInputs != undefined) {
          this.calculateByEquationRegressions(byEquationInputs, equipmentInputs);
        }
      }
    });

    this.equipmentInputsSubscription = this.systemAndEquipmentCurveService.equipmentInputs.subscribe(equipmentInputs => {
      if (equipmentInputs != undefined) {
        let byDataInputs: ByDataInputs = this.systemAndEquipmentCurveService.byDataInputs.getValue();
        if (byDataInputs != undefined) {
          this.calculateByDataRegression(byDataInputs, equipmentInputs);
        }
        let byEquationInputs: ByEquationInputs = this.systemAndEquipmentCurveService.byEquationInputs.getValue();
        if (byEquationInputs != undefined) {
          this.calculateByEquationRegressions(byEquationInputs, equipmentInputs);
        }
      }
    });
  }

  ngOnDestroy() {
    this.equipmentInputsSubscription.unsubscribe();
    this.byDataSubscription.unsubscribe();
    this.byDataSubscription.unsubscribe();
    this.curveDataSubscription.unsubscribe();
  }



  calculateByDataRegression(byDataInputs: ByDataInputs, equipmentInputs: EquipmentInputs) {
    let secondValueLabel: string = 'Head';
    if (this.equipmentType == 'fan') {
      secondValueLabel = 'Pressure';
    }
    let results = this.regressionEquationsService.getEquipmentCurveRegressionByData(byDataInputs, equipmentInputs, secondValueLabel);
    this.regressionEquationsService.baselineEquipmentCurveByDataRegressionEquation.next(results.baselineRegressionEquation);
    this.regressionEquationsService.baselineEquipmentCurveByDataRSquared.next(results.baselineRSquared);
    this.regressionEquationsService.modificationEquipmentCurveByDataRegressionEquation.next(results.modificationRegressionEquation);
    this.regressionEquationsService.modificationEquipmentCurveRSquared.next(results.modificationRSquared);
  }

  calculateByEquationRegressions(byEquationInputs: ByEquationInputs, equipmentInputs: EquipmentInputs) {
    let secondValueLabel: string = 'Head';
    if (this.equipmentType == 'fan') {
      secondValueLabel = 'Pressure';
    }
    let results = this.regressionEquationsService.getEquipmentCurveRegressionByEquation(byEquationInputs, equipmentInputs, secondValueLabel);
    this.regressionEquationsService.baselineEquipmentCurveByEquationRegressionEquation.next(results.baselineRegressionEquation);
    this.regressionEquationsService.modificationEquipmentCurveByEquationRegressionEquation.next(results.modificationRegressionEquation);
  }

  setTab(str: string) {
    this.tabSelect = str;
  }

  setCalculatorTitle() {
    if (this.equipmentType == 'fan') {
      if (this.isEquipmentCurvePrimary == true) {
        this.calculatorTitle = 'Fan Curve'
        this.systemAndEquipmentCurveService.focusedCalculator.next('fan-curve');
        this.systemAndEquipmentCurveService.equipmentCurveCollapsed.next('open');
        this.systemAndEquipmentCurveService.systemCurveCollapsed.next('closed');
      } else {
        this.calculatorTitle = 'Fan System Curve';
        this.systemAndEquipmentCurveService.focusedCalculator.next('fan-system-curve');
        this.systemAndEquipmentCurveService.equipmentCurveCollapsed.next('closed');
        this.systemAndEquipmentCurveService.systemCurveCollapsed.next('open');
      }
    } else {
      if (this.isEquipmentCurvePrimary == true) {
        this.calculatorTitle = 'Pump Curve'
        this.systemAndEquipmentCurveService.focusedCalculator.next('pump-curve');
        this.systemAndEquipmentCurveService.equipmentCurveCollapsed.next('open');
        this.systemAndEquipmentCurveService.systemCurveCollapsed.next('closed');
      } else {
        this.calculatorTitle = 'Pump System Curve';
        this.systemAndEquipmentCurveService.focusedCalculator.next('pump-system-curve');
        this.systemAndEquipmentCurveService.equipmentCurveCollapsed.next('closed');
        this.systemAndEquipmentCurveService.systemCurveCollapsed.next('open');
      }
    }
  }

  btnGenerateExample() {

  }

  btnResetDefaults() {

  }

}
