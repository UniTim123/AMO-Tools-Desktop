import { Component, OnInit, Input } from '@angular/core';
import { PHAST } from '../../../../shared/models/phast/phast';

@Component({
  selector: 'app-energy-input-summary',
  templateUrl: './energy-input-summary.component.html',
  styleUrls: ['./energy-input-summary.component.css']
})
export class EnergyInputSummaryComponent implements OnInit {
  @Input()
  phast: PHAST;

  numLosses: number = 0;
  collapse: boolean = true;
  lossData: Array<any>;
  constructor() { }

  ngOnInit() {
    this.lossData = new Array();
    if (this.phast.losses) {
      if (this.phast.losses.energyInputEAF) {
        this.numLosses = this.phast.losses.energyInputEAF.length;
        let index = 0;
        this.phast.losses.energyInputEAF.forEach(loss => {
          let modificationData = new Array();
          if (this.phast.modifications) {
            this.phast.modifications.forEach(mod => {
              let modData = mod.phast.losses.energyInputEAF[index];
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
