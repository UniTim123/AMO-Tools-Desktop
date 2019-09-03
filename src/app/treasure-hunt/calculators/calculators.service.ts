import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LightingReplacementService } from '../../calculator/lighting/lighting-replacement/lighting-replacement.service';
import { LightingReplacementTreasureHunt, ReplaceExistingMotorTreasureHunt, MotorDriveInputsTreasureHunt, NaturalGasReductionTreasureHunt, ElectricityReductionTreasureHunt, CompressedAirReductionTreasureHunt, CompressedAirPressureReductionTreasureHunt, WaterReductionTreasureHunt } from '../../shared/models/treasure-hunt';
import { ReplaceExistingService } from '../../calculator/motors/replace-existing/replace-existing.service';
import { MotorDriveService } from '../../calculator/motors/motor-drive/motor-drive.service';
import { NaturalGasReductionService } from '../../calculator/utilities/natural-gas-reduction/natural-gas-reduction.service';
import { ElectricityReductionService } from '../../calculator/utilities/electricity-reduction/electricity-reduction.service';
import { CompressedAirReductionService } from '../../calculator/utilities/compressed-air-reduction/compressed-air-reduction.service';
import { CompressedAirPressureReductionService } from '../../calculator/utilities/compressed-air-pressure-reduction/compressed-air-pressure-reduction.service';
import { WaterReductionService } from '../../calculator/utilities/water-reduction/water-reduction.service';

@Injectable()
export class CalculatorsService {

  selectedCalc: BehaviorSubject<string>;
  itemIndex: number;
  isNewOpportunity: boolean;
  constructor(private lightingReplacementService: LightingReplacementService, private replaceExistingService: ReplaceExistingService,
    private motorDriveService: MotorDriveService, private naturalGasReductionService: NaturalGasReductionService, private electricityReductionService: ElectricityReductionService,
    private compressedAirReductionService: CompressedAirReductionService, private compressedAirPressureReductionService: CompressedAirPressureReductionService,
    private waterReductionService: WaterReductionService) {
    this.selectedCalc = new BehaviorSubject<string>('none');
  }
  cancelCalc() {
    this.itemIndex = undefined;
    this.selectedCalc.next('none');
  }

  //lighting replacement
  addNewLighting() {
    this.isNewOpportunity = true;
    this.lightingReplacementService.baselineData = undefined;
    this.lightingReplacementService.modificationData = undefined;
    this.lightingReplacementService.baselineElectricityCost = undefined;
    this.lightingReplacementService.modificationElectricityCost = undefined;
    this.selectedCalc.next('lighting-replacement');
  }
  editLightingReplacementItem(lightingReplacementTreasureHunt: LightingReplacementTreasureHunt, index: number) {
    this.isNewOpportunity = false;
    this.lightingReplacementService.baselineData = lightingReplacementTreasureHunt.baseline;
    this.lightingReplacementService.modificationData = lightingReplacementTreasureHunt.modifications;
    this.lightingReplacementService.baselineElectricityCost = lightingReplacementTreasureHunt.baselineElectricityCost;
    this.lightingReplacementService.modificationElectricityCost = lightingReplacementTreasureHunt.modificationElectricityCost;
    this.itemIndex = index;
    this.selectedCalc.next('lighting-replacement');
  }
  cancelLightingCalc() {
    this.lightingReplacementService.baselineData = undefined;
    this.lightingReplacementService.modificationData = undefined;
    this.lightingReplacementService.baselineElectricityCost = undefined;
    this.lightingReplacementService.modificationElectricityCost = undefined;
    this.cancelCalc();
  }
  //opportunitySheet
  editOpportunitySheetItem

  //replace existing
  addNewReplaceExistingMotor() {
    this.replaceExistingService.replaceExistingData = undefined;
    this.isNewOpportunity = true;
    this.selectedCalc.next('replace-existing');
  }
  editReplaceExistingMotorsItem(replaceExistingMotorsTreasureHunt: ReplaceExistingMotorTreasureHunt, index: number) {
    this.isNewOpportunity = false;
    this.replaceExistingService.replaceExistingData = replaceExistingMotorsTreasureHunt.replaceExistingData;
    this.itemIndex = index;
    this.selectedCalc.next('replace-existing');
  }
  cancelReplaceExistingMotors() {
    this.replaceExistingService.replaceExistingData = undefined;
    this.cancelCalc();
  }
  //motor drive
  addNewMotorDrive() {
    this.motorDriveService.motorDriveData = undefined;
    this.isNewOpportunity = true;
    this.selectedCalc.next('motor-drive');
  }
  editMotorDrivesItem(motorDriveTreasureHunt: MotorDriveInputsTreasureHunt, index: number) {
    this.itemIndex = index;
    this.isNewOpportunity = false;
    this.motorDriveService.motorDriveData = motorDriveTreasureHunt.motorDriveInputs;
    this.selectedCalc.next('motor-drive');
  }
  cancelMotorDrive() {
    this.motorDriveService.motorDriveData = undefined;
    this.cancelCalc();
  }
  //natural gas reduction
  addNewNaturalGasReduction() {
    this.isNewOpportunity = true;
    this.naturalGasReductionService.baselineData = undefined;
    this.naturalGasReductionService.modificationData = undefined;
    this.selectedCalc.next('natural-gas-reduction');
  }
  editNaturalGasReductionsItem(naturalGasReductionTreasureHunt: NaturalGasReductionTreasureHunt, index: number) {
    this.itemIndex = index;
    this.isNewOpportunity = false;
    this.naturalGasReductionService.baselineData = naturalGasReductionTreasureHunt.baseline;
    this.naturalGasReductionService.modificationData = naturalGasReductionTreasureHunt.modification;
    this.selectedCalc.next('natural-gas-reduction');
  }
  cancelNaturalGasReduction() {
    this.naturalGasReductionService.baselineData = undefined;
    this.naturalGasReductionService.modificationData = undefined;
    this.cancelCalc();
  }
  //edit electricity
  addNewElectricityReduction() {
    this.isNewOpportunity = true;
    this.electricityReductionService.baselineData = undefined;
    this.electricityReductionService.modificationData = undefined;
    this.selectedCalc.next('electricity-reduction');
  }
  editElectricityReductionsItem(electricityReduction: ElectricityReductionTreasureHunt, index: number) {
    this.isNewOpportunity = false;
    this.electricityReductionService.baselineData = electricityReduction.baseline;
    this.electricityReductionService.modificationData = electricityReduction.modification;
    this.itemIndex = index;
    this.selectedCalc.next('electricity-reduction');
  }
  cancelElectricityReduction() {
    this.electricityReductionService.baselineData = undefined;
    this.electricityReductionService.modificationData = undefined;
    this.cancelCalc();
  }
  //compressed air reduction
  addNewCompressedAirReduction() {
    this.compressedAirReductionService.baselineData = undefined;
    this.compressedAirReductionService.modificationData = undefined;
    this.isNewOpportunity = true;
    this.selectedCalc.next('compressed-air-reduction');
  }
  editCompressedAirReductionsItem(compressedAirReduction: CompressedAirReductionTreasureHunt, index: number) {
    this.compressedAirReductionService.baselineData = compressedAirReduction.baseline;
    this.compressedAirReductionService.modificationData = compressedAirReduction.modification;
    this.itemIndex = index;
    this.isNewOpportunity = false;
    this.selectedCalc.next('compressed-air-reduction');
  }
  cancelCompressedAirReduction() {
    this.compressedAirReductionService.baselineData = undefined;
    this.compressedAirReductionService.modificationData = undefined;
    this.cancelCalc();
  }
  //compressed air pressure
  addNewCompressedAirPressureReductions() {
    this.compressedAirPressureReductionService.baselineData = undefined;
    this.compressedAirPressureReductionService.modificationData = undefined;
    this.isNewOpportunity = true;
    this.selectedCalc.next('compressed-air-pressure-reduction');
  }
  editCompressedAirPressureReductionsItem(compressedAirPressureReduction: CompressedAirPressureReductionTreasureHunt, index: number) {
    this.compressedAirPressureReductionService.baselineData = compressedAirPressureReduction.baseline;
    this.compressedAirPressureReductionService.modificationData = compressedAirPressureReduction.modification;
    this.itemIndex = index;
    this.isNewOpportunity = false;
    this.selectedCalc.next('compressed-air-pressure-reduction');
  }
  cancelCompressedAirPressureReduction() {
    this.compressedAirPressureReductionService.baselineData = undefined;
    this.compressedAirPressureReductionService.modificationData = undefined;
    this.cancelCalc();
  }
  //water reductions
  addNewWaterReduction() {
    this.waterReductionService.baselineData = undefined;
    this.waterReductionService.modificationData = undefined;
    this.isNewOpportunity = true;
    this.selectedCalc.next('water-reduction');
  }
  editWaterReductionsItem(waterReduction: WaterReductionTreasureHunt, index: number) {
    this.isNewOpportunity = false;
    this.itemIndex = index;
    this.waterReductionService.baselineData = waterReduction.baseline;
    this.waterReductionService.modificationData = waterReduction.modification;
    this.selectedCalc.next('water-reduction');
  }
  cancelWaterReduction() {
    this.waterReductionService.baselineData = undefined;
    this.waterReductionService.modificationData = undefined;
    this.cancelCalc();
  }
}
