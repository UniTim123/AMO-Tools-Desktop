import { Component, OnInit, Input, SimpleChanges, SimpleChange, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash';
import { PhastService } from '../../phast.service';
import { AuxiliaryPowerLoss } from '../../../shared/models/phast/losses/auxiliaryPowerLoss';
import { Losses } from '../../../shared/models/phast/phast';
import { AuxiliaryPowerLossesService } from './auxiliary-power-losses.service';
import { AuxiliaryPowerCompareService } from './auxiliary-power-compare.service';

@Component({
  selector: 'app-auxiliary-power-losses',
  templateUrl: './auxiliary-power-losses.component.html',
  styleUrls: ['./auxiliary-power-losses.component.css']
})
export class AuxiliaryPowerLossesComponent implements OnInit {
  @Input()
  losses: Losses;
  @Input()
  saveClicked: boolean;
  @Input()
  addLossToggle: boolean;
  @Output('savedLoss')
  savedLoss = new EventEmitter<boolean>();
  @Input()
  baselineSelected: boolean;
  @Output('fieldChange')
  fieldChange = new EventEmitter<string>();
  @Input()
  isBaseline: boolean;

  _auxiliaryPowerLosses: Array<any>;
  firstChange: boolean = true;
  constructor(private phastService: PhastService, private auxiliaryPowerLossesService: AuxiliaryPowerLossesService, private auxiliaryPowerCompareService: AuxiliaryPowerCompareService) { }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.firstChange) {
      if (changes.saveClicked) {
        this.saveLosses();
      }
      if (changes.addLossToggle) {
        this.addLoss();
      }
    }
    else {
      this.firstChange = false;
    }
  }

  ngOnInit() {
    if (!this._auxiliaryPowerLosses) {
      this._auxiliaryPowerLosses = new Array();
    }
    if (this.losses.auxiliaryPowerLosses) {
      this.setCompareVals();
      this.auxiliaryPowerCompareService.initCompareObjects();
      this.losses.auxiliaryPowerLosses.forEach(loss => {
        let tmpLoss = {
          form: this.auxiliaryPowerLossesService.getFormFromLoss(loss),
          name: 'Loss #' + (this._auxiliaryPowerLosses.length + 1),
          powerUsed: loss.powerUsed || 0.0
        };
        this.calculate(tmpLoss);
        this._auxiliaryPowerLosses.push(tmpLoss);
      })
    }
    this.auxiliaryPowerLossesService.deleteLossIndex.subscribe((lossIndex) => {
      if (lossIndex != undefined) {
        if (this.losses.auxiliaryPowerLosses) {
          this._auxiliaryPowerLosses.splice(lossIndex, 1);
          if (this.auxiliaryPowerCompareService.differentArray && !this.isBaseline) {
            this.auxiliaryPowerCompareService.differentArray.splice(lossIndex, 1);
          }
        }
      }
    })
    if (this.isBaseline) {
      this.auxiliaryPowerLossesService.addLossBaselineMonitor.subscribe((val) => {
        if (val == true) {
          this._auxiliaryPowerLosses.push({
            form: this.auxiliaryPowerLossesService.initForm(),
            name: 'Loss #' + (this._auxiliaryPowerLosses.length + 1),
            heatLoss: 0.0
          })
        }
      })
    } else {
      this.auxiliaryPowerLossesService.addLossModificationMonitor.subscribe((val) => {
        if (val == true) {
          this._auxiliaryPowerLosses.push({
            form: this.auxiliaryPowerLossesService.initForm(),
            name: 'Loss #' + (this._auxiliaryPowerLosses.length + 1),
            heatLoss: 0.0
          })
        }
      })
    }
  }

  ngOnDestroy() {
    this.auxiliaryPowerCompareService.baselineAuxLosses = null;
    this.auxiliaryPowerCompareService.modifiedAuxLosses = null;
    this.auxiliaryPowerLossesService.deleteLossIndex.next(null);
    this.auxiliaryPowerLossesService.addLossBaselineMonitor.next(false);
    this.auxiliaryPowerLossesService.addLossModificationMonitor.next(false);
  }

  addLoss() {
    this.auxiliaryPowerLossesService.addLoss(this.isBaseline);
    if (this.auxiliaryPowerCompareService.differentArray) {
      this.auxiliaryPowerCompareService.addObject(this.auxiliaryPowerCompareService.differentArray.length - 1);
    }
    this._auxiliaryPowerLosses.push({
      form: this.auxiliaryPowerLossesService.initForm(),
      name: 'Loss #' + (this._auxiliaryPowerLosses.length + 1),
      powerUsed: 0.0
    });
  }

  removeLoss(lossIndex: number) {
    this.auxiliaryPowerLossesService.setDelete(lossIndex);
  }

  renameLossess() {
    let index = 1;
    this._auxiliaryPowerLosses.forEach(loss => {
      loss.name = 'Loss #' + index;
      index++;
    })
  }

  calculate(loss: any) {
    if (loss.form.status == 'VALID') {
      let tmpLoss: AuxiliaryPowerLoss = this.auxiliaryPowerLossesService.getLossFromForm(loss.form);
      loss.powerUsed = this.phastService.auxiliaryPowerLoss(tmpLoss);
    }else{
      loss.powerUsed = null;
    }
  }

  saveLosses() {
    let tmpAuxLosses = new Array<AuxiliaryPowerLoss>();
    this._auxiliaryPowerLosses.forEach(loss => {
      let tmpAuxLoss = this.auxiliaryPowerLossesService.getLossFromForm(loss.form);
      tmpAuxLoss.powerUsed = loss.powerUsed;
      tmpAuxLosses.push(tmpAuxLoss);
    })
    this.losses.auxiliaryPowerLosses = tmpAuxLosses;
    this.setCompareVals();
    this.savedLoss.emit(true);
  }

  changeField(str: string) {
    this.fieldChange.emit(str);
  }

  setCompareVals() {
    if (this.isBaseline) {
      this.auxiliaryPowerCompareService.baselineAuxLosses = this.losses.auxiliaryPowerLosses;
    } else {
      this.auxiliaryPowerCompareService.modifiedAuxLosses = this.losses.auxiliaryPowerLosses;
    }
    if (this.auxiliaryPowerCompareService.differentArray && !this.isBaseline) {
      if (this.auxiliaryPowerCompareService.differentArray.length != 0) {
        this.auxiliaryPowerCompareService.checkAuxLosses();
      }
    }
  }


}
