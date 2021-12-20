import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { OtherFuel, otherFuels } from '../../calculator/utilities/co2-savings/co2-savings-form/co2FuelSavingsFuels';
import { Co2SavingsData } from '../../calculator/utilities/co2-savings/co2-savings.service';
import { Settings } from '../../shared/models/settings';
import * as _ from 'lodash';

@Component({
  selector: 'app-mixed-co2-emissions',
  templateUrl: './mixed-co2-emissions.component.html',
  styleUrls: ['./mixed-co2-emissions.component.css']
})
export class MixedCo2EmissionsComponent implements OnInit {

  @Input()
  settings: Settings;
  @Input()
  fuelList: Array<Co2SavingsData>;
  @Output('emitUpdateOtherFuelsOutputRate')
  emitUpdateOtherFuelsOutputRate = new EventEmitter<number>();
  @Output('emitUpdateOtherFuelsMixedList')
  emitUpdateOtherFuelsMixedList = new EventEmitter<Array<Co2SavingsData>>();

  mixedOutputRateResult: number;
  
  otherFuels: Array<OtherFuel>;
  fuelOptions: Array<{
    fuelType: string,
    outputRate: number
  }>;

  fuelOptionsList: Array<any> = new Array<any>();

  constructor() { }

  ngOnInit() {
    this.otherFuels = otherFuels;

    let index: number = 0;

    if(this.fuelList.length == 0){
      this.addFuel();
    }

    if (this.fuelList.length != 0) {
      this.fuelList.forEach(fuel => {
        if (fuel.fuelType) {
          let tmpOtherFuel: OtherFuel = _.find(this.otherFuels, (val) => { return fuel.energySource === val.energySource; });
          this.fuelOptions = tmpOtherFuel.fuelTypes;
          this.fuelOptionsList[index] = this.fuelOptions;
        }
        index++;
      });
    }
    this.calculateMixedFuelCosts();

  }

  setFuelOptions(index: number) {
    let tmpOtherFuel: OtherFuel = _.find(this.otherFuels, (val) => { return this.fuelList[index].energySource === val.energySource; });
    this.fuelOptions = tmpOtherFuel.fuelTypes;
    this.fuelOptionsList[index] = this.fuelOptions;
    this.fuelList[index].fuelType = this.fuelOptions[0].fuelType;
    this.fuelList[index].totalEmissionOutputRate = this.fuelOptions[0].outputRate;
    this.calculateMixedFuelCosts();
  }

  setFuel(index: number) {
    let tmpFuel: { fuelType: string, outputRate: number } = _.find(this.fuelOptionsList[index], (val) => { return this.fuelList[index].fuelType === val.fuelType; });
    this.fuelList[index].totalEmissionOutputRate = tmpFuel.outputRate;
    this.calculateMixedFuelCosts();
  }

  addFuel() {
    let co2SavingsData: Co2SavingsData = {
      energyType: 'fuel',
      energySource: '',
      fuelType: '',
      totalEmissionOutputRate: 0,
      electricityUse: 0,
      eGridRegion: '',
      eGridSubregion: '',
      totalEmissionOutput: 0,
      userEnteredBaselineEmissions: false,
      userEnteredModificationEmissions: false,
      zipcode: '',
      percentFuelUsage: 0
    }
    this.fuelList.push(co2SavingsData);
  }

  deleteFuel(i: number) {
    this.fuelList.splice(i, 1);
    this.fuelOptionsList.splice(i, 1);
    this.calculateMixedFuelCosts();
  }

  calculateMixedFuelCosts() {
    let length: number = this.fuelList.length;
    let sum: number = 0;
    let summedUse: number = 0;
    for (let i = 0; i < length; i++) {
      summedUse += this.fuelList[i].percentFuelUsage;
      sum += (this.fuelList[i].percentFuelUsage * this.fuelList[i].totalEmissionOutputRate);
    }
    sum = sum / (summedUse);
    this.mixedOutputRateResult = this.roundVal(sum);
    this.emitUpdateOtherFuelsOutputRate.emit(this.mixedOutputRateResult);
    this.emitUpdateOtherFuelsMixedList.emit(this.fuelList);
  }

  roundVal(num: number): number {
    return Number(num.toFixed(2));
  }

}