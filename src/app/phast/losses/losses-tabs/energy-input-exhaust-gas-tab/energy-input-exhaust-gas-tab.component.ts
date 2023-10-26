import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { LossesService } from '../../losses.service';
import { PHAST, PhastResults } from '../../../../shared/models/phast/phast';
import { UntypedFormGroup } from '@angular/forms';
import { EnergyInputExhaustGasService } from '../../energy-input-exhaust-gas-losses/energy-input-exhaust-gas.service';
import { EnergyInputExhaustGasCompareService } from '../../energy-input-exhaust-gas-losses/energy-input-exhaust-gas-compare.service';
import { EnergyInputExhaustGasLoss } from '../../../../shared/models/phast/losses/energyInputExhaustGasLosses';
import { Subscription } from 'rxjs';
import { Settings } from '../../../../shared/models/settings';
import { PhastResultsService } from '../../../phast-results.service';
import { PhastService } from '../../../phast.service';
import { PhastCompareService } from '../../../phast-compare.service';
@Component({
  selector: 'app-energy-input-exhaust-gas-tab',
  templateUrl: './energy-input-exhaust-gas-tab.component.html',
  styleUrls: ['./energy-input-exhaust-gas-tab.component.css']
})
export class EnergyInputExhaustGasTabComponent implements OnInit {
  @Input()
  phast: PHAST;
  @Input()
  inSetup: boolean;
  @Input()
  settings: Settings;

  badgeHover: boolean;
  displayTooltip: boolean;

  numLosses: number = 0;
  inputError: boolean;
  missingData: boolean;
  isDifferent: boolean;
  badgeClass: Array<string> = [];
  enInput2Done: boolean;
  lossSubscription: Subscription;
  dataCheck: { invalid: boolean, hasWarning: boolean };
  constructor(private lossesService: LossesService, 
    private phastResultsService: PhastResultsService, 
    private phastService: PhastService,
    private energyInputExhaustGasService: EnergyInputExhaustGasService, 
    private phastCompareService: PhastCompareService,
    private energyInputExhaustGasCompareService: EnergyInputExhaustGasCompareService, 
    private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.setNumLosses();
    this.lossSubscription = this.lossesService.updateTabs.subscribe(val => {
      this.setNumLosses();
      this.enInput2Done = this.lossesService.enInput2Done;
      this.dataCheck = this.checkLossData();
      this.isDifferent = this.checkDifferent();
      this.setBadgeClass();
    });

    this.badgeHover = false;
  }
  ngOnDestroy() {
    this.lossSubscription.unsubscribe();
  }

  setBadgeClass() {
    let badgeStr: Array<string> = ['success'];
    if (this.dataCheck.invalid || !this.enInput2Done) {
      badgeStr = ['missing-data'];
    } else if (this.dataCheck.hasWarning) {
      badgeStr = ['input-error'];
    } else if (this.isDifferent && !this.inSetup) {
      badgeStr = ['loss-different'];
    }
    this.badgeClass = badgeStr;
    this.cd.detectChanges();
  }

  setNumLosses() {
    if (this.phast.losses) {
      if (this.phast.losses.energyInputExhaustGasLoss) {
        this.numLosses = this.phast.losses.energyInputExhaustGasLoss.length;
      }
    }
  }


  checkLossData(): { invalid: boolean, hasWarning: boolean } {
    let baselineValid = true;
    let baselineWarning: boolean = false;
    if (this.energyInputExhaustGasCompareService.baselineEnergyInputExhaustGasLosses) {
      let baselineResults: PhastResults = this.phastResultsService.getResults(this.phast, this.settings);
      this.energyInputExhaustGasCompareService.baselineEnergyInputExhaustGasLosses.some(loss => {
        baselineValid = this.isLossValid(loss)
        let lossResults = this.phastService.energyInputExhaustGasLosses(loss, this.settings);
        baselineWarning = this.checkHasWarnings(baselineResults, loss, lossResults);
        return !baselineValid || baselineWarning;
      });
    }

    let modificationValid = true;
    let modificationWarning = false;
    if (!this.inSetup && this.energyInputExhaustGasCompareService.modifiedEnergyInputExhaustGasLosses) {
      let modifiedPhast: PHAST = this.phastCompareService.selectedModification.getValue();
      let modificationResults: PhastResults = this.phastResultsService.getResults(modifiedPhast, this.settings);
      this.energyInputExhaustGasCompareService.modifiedEnergyInputExhaustGasLosses.some(loss => {
          modificationValid = this.isLossValid(loss)
          let lossResults = this.phastService.energyInputExhaustGasLosses(loss, this.settings);
          modificationWarning = this.checkHasWarnings(modificationResults, loss, lossResults);
          return !modificationValid || modificationWarning;
      });
    } 

    return { invalid: !baselineValid || !modificationValid, hasWarning: baselineWarning || modificationWarning };
  }
  
  checkHasWarnings(phastResults: PhastResults, loss: EnergyInputExhaustGasLoss, lossResults): boolean {
    let energyInputTotal = phastResults.grossHeatInput;
    let electricalHeatDelivered = energyInputTotal - lossResults.heatDelivered - lossResults.exhaustGasLosses;
    let warnings: { energyInputHeatDelivered: string } = this.energyInputExhaustGasService.checkWarnings(electricalHeatDelivered);
    return warnings.energyInputHeatDelivered != null;
  }


  isLossValid(loss: EnergyInputExhaustGasLoss) {
    let tmpForm: UntypedFormGroup = this.energyInputExhaustGasService.getFormFromLoss(loss);
    if (tmpForm.status === 'VALID') {
      return true;
    } else {
      return false;
    }
  }

  checkDifferent() {
    if (this.energyInputExhaustGasCompareService.baselineEnergyInputExhaustGasLosses && this.energyInputExhaustGasCompareService.modifiedEnergyInputExhaustGasLosses) {
      return this.energyInputExhaustGasCompareService.compareAllLosses();
    }
  }

  showTooltip() {
    this.badgeHover = true;

    setTimeout(() => {
      this.checkHover();
    }, 1000);
  }

  hideTooltip() {
    this.badgeHover = false;
    this.displayTooltip = false;
  }

  checkHover() {
    if (this.badgeHover) {
      this.displayTooltip = true;
    }
    else {
      this.displayTooltip = false;
    }
  }
}
