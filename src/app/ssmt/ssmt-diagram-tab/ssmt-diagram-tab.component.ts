import { Component, OnInit, Input } from '@angular/core';
import { SSMT, SSMTInputs } from '../../shared/models/steam/ssmt';
import { Settings } from '../../shared/models/settings';
import { SSMTOutput } from '../../shared/models/steam/steam-outputs';
import { CalculateModelService } from '../ssmt-calculations/calculate-model.service';

@Component({
  selector: 'app-ssmt-diagram-tab',
  templateUrl: './ssmt-diagram-tab.component.html',
  styleUrls: ['./ssmt-diagram-tab.component.css']
})
export class SsmtDiagramTabComponent implements OnInit {
  @Input()
  ssmt: SSMT;
  @Input()
  settings: Settings;
  @Input()
  containerHeight: number;

  outputData: SSMTOutput;
  inputData: SSMTInputs;
  tabSelect: string = 'results';
  hoveredEquipment: string = 'default';
  selectedTable: string = 'default';

  selectedSSMT: SSMT;
  ssmtOptions: Array<SSMT>;
  showOptions: boolean = false;
  dataCalculated: boolean = false;
  displayCalculators: boolean = false;
  constructor(private calculateModelService: CalculateModelService) { }

  ngOnInit() {
    this.ssmt.name = 'Baseline';
    this.selectedSSMT = this.ssmt;
    this.ssmtOptions = new Array<SSMT>();
    if (this.ssmt.modifications) {
      this.ssmtOptions.push(this.ssmt);
      this.ssmt.modifications.forEach(modification => {
        this.ssmtOptions.push(modification.ssmt);
      });
    }
    if (this.ssmt.setupDone) {
      setTimeout(() => {
        this.calculateResults();
      }, 100);
    }
  }

  // setOption(ssmt: SSMT) {
  //   this.selectedSSMT = ssmt;
  //   this.calculateResults();
  //   this.showOptions = false;
  // }

  calculateResults() {
    let resultsData: { inputData: SSMTInputs, outputData: SSMTOutput } = this.calculateModelService.initDataAndRun(this.selectedSSMT, this.settings, true, true);
    this.inputData = resultsData.inputData;
    this.outputData = resultsData.outputData;
    this.dataCalculated = true;
  }
  
  setTab(str: string) {
    this.tabSelect = str;
  }

  setHover(str: string) {
    this.hoveredEquipment = str;
  }

  selectTable(str: string) {
    this.selectedTable = str;
  }

  toggleShowOptions() {
    this.showOptions = !this.showOptions;
  }

  showCalculators() {
    this.displayCalculators = true;
  }

  closeCalculator() {
    this.displayCalculators = false;
  }
}
