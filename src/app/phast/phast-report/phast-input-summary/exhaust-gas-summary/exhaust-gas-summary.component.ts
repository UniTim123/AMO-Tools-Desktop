import { Component, OnInit, Input } from '@angular/core';
import { PHAST } from '../../../../shared/models/phast/phast';

@Component({
  selector: 'app-exhaust-gas-summary',
  templateUrl: './exhaust-gas-summary.component.html',
  styleUrls: ['./exhaust-gas-summary.component.css']
})
export class ExhaustGasSummaryComponent implements OnInit {
  @Input()
  phast: PHAST;

  numLosses: number = 0;
  collapse: boolean = true;
  lossData: Array<any>;
  constructor() { }

  ngOnInit() {
    this.lossData = new Array();
    if (this.phast.losses) {
      if (this.phast.losses.exhaustGasEAF) {
        this.numLosses = this.phast.losses.exhaustGasEAF.length;
        let index = 0;
        this.phast.losses.exhaustGasEAF.forEach(loss => {
          let modificationData = new Array();
          if (this.phast.modifications) {
            this.phast.modifications.forEach(mod => {
              let modData = mod.phast.losses.exhaustGasEAF[index];
              modificationData.push(modData);
            })
          }
          this.lossData.push({
            baseline: loss,
            modifications: modificationData
          })
          index++;
        })
      }
    }
  }

  toggleCollapse() {
    this.collapse = !this.collapse;
  }

}
