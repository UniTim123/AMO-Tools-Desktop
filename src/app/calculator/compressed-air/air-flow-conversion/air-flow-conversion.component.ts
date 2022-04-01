import { Component, OnInit, ViewChild, ElementRef, HostListener, Input } from '@angular/core';
import { Settings } from '../../../shared/models/settings';
import { AirFlowConversionService } from './air-flow-conversion.service';
import { SettingsDbService } from '../../../indexedDb/settings-db.service';
import { firstValueFrom, Subscription } from 'rxjs';
import { CalculatorDbService } from '../../../indexedDb/calculator-db.service';
import { IndexedDbService } from '../../../indexedDb/indexed-db.service';
import { Calculator } from '../../../shared/models/calculators';
import { Assessment } from '../../../shared/models/assessment';

@Component({
  selector: 'app-air-flow-conversion',
  templateUrl: './air-flow-conversion.component.html',
  styleUrls: ['./air-flow-conversion.component.css']
})
export class AirFlowConversionComponent implements OnInit {
  @Input()
  settings: Settings;
  @Input()
  assessment: Assessment;
  
  headerHeight: number;

  airFlowConversionInputSub: Subscription;

  @ViewChild('leftPanelHeader', { static: false }) leftPanelHeader: ElementRef;
  saving: boolean;
  assessmentCalculator: Calculator;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.resizeTabs();
  }

  
  constructor(private airFlowConversionService: AirFlowConversionService, private calculatorDbService: CalculatorDbService, 
    private indexedDbService: IndexedDbService, private settingsDbService: SettingsDbService) { }

  ngOnInit(): void {
    if (!this.settings) {
      this.settings = this.settingsDbService.globalSettings;
    }
    this.airFlowConversionService.initDefaultEmptyInputs(this.settings);
    this.airFlowConversionService.initDefaultEmptyOutputs();
    this.initSubscriptions();

    if (this.assessment) {
      this.getCalculatorForAssessment();
    }
  }

  ngOnDestroy() {
    this.airFlowConversionInputSub.unsubscribe();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.resizeTabs();
    }, 100);
  }

  resizeTabs() {
    if (this.leftPanelHeader.nativeElement.clientHeight) {
      this.headerHeight = this.leftPanelHeader.nativeElement.clientHeight;
    }
  }

  initSubscriptions() {
    this.airFlowConversionInputSub = this.airFlowConversionService.airFlowConversionInput.subscribe(value => {
      this.calculate();
    })
  }

  calculate() {
    this.airFlowConversionService.calculate(this.settings);
    if (this.assessmentCalculator) {
      this.assessmentCalculator.airFlowConversionInputs = this.airFlowConversionService.airFlowConversionInput.getValue();
      this.saveAssessmentCalculator();
     }
  }

  getCalculatorForAssessment() {
    this.assessmentCalculator = this.calculatorDbService.getByAssessmentId(this.assessment.id);
    debugger;
    if (this.assessmentCalculator) {
      if (this.assessmentCalculator.airFlowConversionInputs) {
        this.airFlowConversionService.airFlowConversionInput.next(this.assessmentCalculator.airFlowConversionInputs);
      } else {
        this.assessmentCalculator.airFlowConversionInputs = this.airFlowConversionService.airFlowConversionInput.getValue();
      }
    } else{
      this.assessmentCalculator = this.initNewAssessmentCalculator();
      this.saveAssessmentCalculator();
    }
  }

  initNewAssessmentCalculator(): Calculator {
    let inputs = this.airFlowConversionService.airFlowConversionInput.getValue();
    let tmpCalculator: Calculator = {
      assessmentId: this.assessment.id,
      airFlowConversionInputs: inputs
    };
    return tmpCalculator;
  }

  async saveAssessmentCalculator(){
    if (!this.saving) {
      if (this.assessmentCalculator.id) {
        let assessments: Assessment[] = await firstValueFrom(this.calculatorDbService.updateWithObservable(this.assessmentCalculator));
        this.calculatorDbService.setAll(assessments);
      } else {
        this.saving = true;
        this.assessmentCalculator.assessmentId = this.assessment.id;
        let addedCalculator: Calculator = await firstValueFrom(this.calculatorDbService.addWithObservable(this.assessmentCalculator));
        this.calculatorDbService.setAll();
        this.assessmentCalculator.id = addedCalculator.id;
        this.saving = false;
      }
    }
  }

  

  btnResetData() {
    this.airFlowConversionService.initDefaultEmptyInputs(this.settings);
    this.airFlowConversionService.resetData.next(true);
  }

  btnGenerateExample() {
    this.airFlowConversionService.generateExampleData(this.settings);
    this.airFlowConversionService.generateExample.next(true);
  }

}
