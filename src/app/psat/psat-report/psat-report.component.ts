import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { PSAT } from '../../shared/models/psat';
import { Assessment } from '../../shared/models/assessment';
import { PsatService } from '../psat.service';

@Component({
  selector: 'app-psat-report',
  templateUrl: './psat-report.component.html',
  styleUrls: ['./psat-report.component.css']
})
export class PsatReportComponent implements OnInit {
  @Input()
  psat: PSAT;
  @Output('closeReport')
  closeReport = new EventEmitter();
  constructor(private psatService: PsatService) { }

  ngOnInit() {
    this.getResults();
  }

  closeAssessment() {
    this.closeReport.emit(true);
  }

  getResults() {
    this.psat.outputs = this.psatService.results(this.psat.inputs);
    if (this.psat.modifications) {
      this.psat.modifications.forEach(modification => {
        modification.psat.outputs = this.psatService.results(modification.psat.inputs);
      })
    }
  }

}
