import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SuiteDbMotor } from '../../../shared/models/materials';
import { MotorItem } from '../../motor-inventory';
import { FilterMotorOptions } from './select-motor-modal/filter-motor-options.pipe';
import { MotorInventoryService } from '../../motor-inventory.service';
import { Settings } from '../../../shared/models/settings';
import { PsatService } from '../../../psat/psat.service';

@Injectable()
export class MotorCatalogService {

  selectedDepartmentId: BehaviorSubject<string>;
  selectedMotorItem: BehaviorSubject<MotorItem>;
  filterMotorOptions: BehaviorSubject<FilterMotorOptions>;
  constructor(private motorInventoryService: MotorInventoryService, private psatService: PsatService) {
    this.selectedDepartmentId = new BehaviorSubject<string>(undefined);
    this.selectedMotorItem = new BehaviorSubject<MotorItem>(undefined);
    this.filterMotorOptions = new BehaviorSubject<FilterMotorOptions>(undefined);
  }

  //forms update motorInventoryData, 
  //selectedMotorItem selected by table not always update with latest form changes
  //use function to get most recently updated motorItem
  getUpdatedSelectedMotorItem(): MotorItem {
    let motorInventoryData = this.motorInventoryService.motorInventoryData.getValue()
    let selectedMotorItem = this.selectedMotorItem.getValue();
    let department = motorInventoryData.departments.find(department => { return department.id == selectedMotorItem.departmentId });
    selectedMotorItem = department.catalog.find(motorItem => { return motorItem.id == selectedMotorItem.id });
    return selectedMotorItem;
  }

  setSuiteDbMotorProperties(motor: SuiteDbMotor, motorItem: MotorItem): MotorItem {
    motorItem.nameplateData.efficiencyClass = motor.efficiencyClass;
    motorItem.nameplateData.ratedMotorPower = motor.hp;
    motorItem.nameplateData.lineFrequency = motor.lineFrequency;
    motorItem.nameplateData.enclosureType = motor.enclosureType;
    motorItem.nemaTable = motor.nemaTable;
    motorItem.nameplateData.nominalEfficiency = motor.nominalEfficiency;
    motorItem.manualSpecificationData.poles = motor.poles;
    motorItem.manualSpecificationData.synchronousSpeed = motor.synchronousSpeed;
    motorItem.voltageLimit = motor.voltageLimit;
    return motorItem;
  }

  estimateEfficiency(loadFactor: number, useNominalEfficiency: boolean): number {
    let selectedMotorItem: MotorItem = this.getUpdatedSelectedMotorItem();
    let efficiencyClass: number = selectedMotorItem.nameplateData.efficiencyClass;
    let efficiency: number = selectedMotorItem.nameplateData.nominalEfficiency;
    if (useNominalEfficiency) {
      efficiencyClass = 3;
    }

    let settings: Settings = this.motorInventoryService.settings.getValue();
    let lineFreq: number = selectedMotorItem.nameplateData.lineFrequency;
    let motorRPM: number = selectedMotorItem.nameplateData.fullLoadSpeed;
    let motorPower: number = selectedMotorItem.nameplateData.ratedMotorPower;
    //load factor comes in as %, /100 to convert to decimal
    return this.psatService.motorEfficiency(lineFreq, motorRPM, efficiencyClass, efficiency, motorPower, (loadFactor / 100), settings);
  }
}
