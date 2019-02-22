import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { SSMT, GeneralSteamOperations } from '../../shared/models/steam/ssmt';
import { Settings } from '../../shared/models/settings';
import { FormGroup } from '@angular/forms';
import { OperationsService } from './operations.service';
import { OperatingHours, OperatingCosts } from '../../shared/models/operations';

@Component({
  selector: 'app-operations',
  templateUrl: './operations.component.html',
  styleUrls: ['./operations.component.css']
})
export class OperationsComponent implements OnInit {
  @Input()
  ssmt: SSMT;
  @Input()
  settings: Settings;
  @Output('emitSave')
  emitSave = new EventEmitter<SSMT>();
  @Input()
  selected: boolean;
  @Input()
  inSetup: boolean;
  @Input()
  isBaseline: boolean;

  idString: string = 'baseline_';

  operationsForm: FormGroup;

  constructor(private operationsService: OperationsService) { }

  ngOnInit() {
    this.operationsForm = this.operationsService.getForm(this.ssmt, this.settings);
    if (!this.isBaseline) {
      this.idString = 'modification_';
    }
  }

  save() {
    let newData: {
      operatingHours: OperatingHours, operatingCosts: OperatingCosts, generalSteamOperations: GeneralSteamOperations
    } = this.operationsService.getOperationsDataFromForm(this.operationsForm);
    this.ssmt.operatingCosts = newData.operatingCosts;
    this.ssmt.operatingHours = newData.operatingHours;
    this.ssmt.generalSteamOperations = newData.generalSteamOperations;
    this.emitSave.emit(this.ssmt);
  }
}
