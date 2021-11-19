import { Component, OnInit, ViewChild, ElementRef, HostListener, Input } from '@angular/core';
import { StandaloneService } from "../../standalone.service";
import { AirSystemCapacityInput, AirSystemCapacityOutput } from "../../../shared/models/standalone";
import { Settings } from '../../../shared/models/settings';
import { SystemCapacityService } from './system-capacity.service';
import { SettingsDbService } from '../../../indexedDb/settings-db.service';
import { Output, EventEmitter } from '@angular/core';
import { Assessment } from '../../../shared/models/assessment';
import { Calculator } from '../../../shared/models/calculators';
import { CalculatorDbService } from '../../../indexedDb/calculator-db.service';
import { IndexedDbService } from '../../../indexedDb/indexed-db.service';

@Component({
  selector: 'app-system-capacity',
  templateUrl: './system-capacity.component.html',
  styleUrls: ['./system-capacity.component.css']
})
export class SystemCapacityComponent implements OnInit {
  @Input()
  settings: Settings;
  @Input()
  inModal: boolean
  @Output('emitTotalCapacity')
  emitTotalCapacity = new EventEmitter<number>();
  @Input()
  assessment: Assessment;

  assessmentCalculator: Calculator;

  
  @ViewChild('leftPanelHeader', { static: false }) leftPanelHeader: ElementRef;
  @ViewChild('contentContainer', { static: false }) contentContainer: ElementRef;
  saving: boolean;
  
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.resizeTabs();
  }
  
  bodyHeight: number;
  headerHeight: number;
  inputs: AirSystemCapacityInput;
  outputs: AirSystemCapacityOutput;
  currentField: string = 'default';

  constructor(private standaloneService: StandaloneService, private indexedDbService: IndexedDbService,
     private calculatorDbService: CalculatorDbService, private systemCapacityService: SystemCapacityService, private settingsDbService: SettingsDbService) {
  }

  ngOnInit() {
    this.outputs = this.systemCapacityService.getDefaultEmptyOutput();
    console.log(this.settings);
    if (!this.settings) {
      this.settings = this.settingsDbService.globalSettings;
      console.log('set');
    }
    this.inputs = this.systemCapacityService.inputs;
    this.calculate();
    if (this.assessment) {
      this.getCalculatorForAssessment();
    } else {
      this.inputs = this.systemCapacityService.inputs;
      this.calculate();
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.resizeTabs();
    }, 200);
  }

  ngOnDestroy(){
    this.systemCapacityService.inputs = this.inputs;
  }
  
  btnResetData() {
    this.inputs = this.systemCapacityService.getSystemCapacityDefaults();
    this.calculate();
  }

  resizeTabs() {
    if (this.leftPanelHeader) {
      this.headerHeight = this.leftPanelHeader.nativeElement.clientHeight;
      this.bodyHeight = this.contentContainer.nativeElement.offsetHeight;
    }
  }

  calculate() {
    this.outputs = this.standaloneService.airSystemCapacity(this.inputs, this.settings);
    if (this.inModal) {
      this.emitTotalCapacity.emit(this.outputs.totalCapacityOfCompressedAirSystem);
    } else {
      if(this.assessmentCalculator) {
        this.assessmentCalculator.airSystemCapacityInputs = this.inputs;
        this.saveAssessmentCalculator();
      }else{
        this.systemCapacityService.inputs = this.inputs;
      }
    }
  }

  getCalculatorForAssessment() {
    this.assessmentCalculator = this.calculatorDbService.getByAssessmentId(this.assessment.id);
    if(this.assessmentCalculator) {
      if (this.assessmentCalculator.airSystemCapacityInputs) {
        this.inputs = this.assessmentCalculator.airSystemCapacityInputs;
        this.calculate();
      } else {
        this.assessmentCalculator.airSystemCapacityInputs = this.inputs;
      }
    } else{
      this.assessmentCalculator = this.initNewAssessmentCalculator();
      this.saveAssessmentCalculator();
    }
  }

  initNewAssessmentCalculator(): Calculator {
    this.inputs = this.systemCapacityService.inputs;
    this.calculate();
    let tmpCalculator: Calculator = {
      assessmentId: this.assessment.id,
      airSystemCapacityInputs: this.inputs
    };
    return tmpCalculator;
  }

  saveAssessmentCalculator(){
    if (!this.saving) {
      if (this.assessmentCalculator.id) {
        this.indexedDbService.putCalculator(this.assessmentCalculator).then(() => {
          this.calculatorDbService.setAll();
        });
      } else {
        this.saving = true;
        this.assessmentCalculator.assessmentId = this.assessment.id;
        this.indexedDbService.addCalculator(this.assessmentCalculator).then((result) => {
          this.calculatorDbService.setAll().then(() => {
            this.assessmentCalculator.id = result;
            this.saving = false;
          });
        });
      }
    }
  }

  changeField($event) {
    this.currentField = $event;
  }

  btnGenerateExample() {
    let tempInputs = this.systemCapacityService.getSystemCapacityExample();
    this.inputs = this.systemCapacityService.convertAirSystemCapacityExample(tempInputs, this.settings);
    this.calculate();
  }

}
