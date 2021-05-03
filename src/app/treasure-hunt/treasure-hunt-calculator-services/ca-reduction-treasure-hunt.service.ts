import { Injectable } from '@angular/core';
import { CompressedAirReductionService } from '../../calculator/compressed-air/compressed-air-reduction/compressed-air-reduction.service';
import { ConvertUnitsService } from '../../shared/convert-units/convert-units.service';
import { Settings } from '../../shared/models/settings';
import { CompressedAirReductionData, CompressedAirReductionResults } from '../../shared/models/standalone';
import { CompressedAirReductionTreasureHunt, EnergyUsage, OpportunitySummary, TreasureHunt, TreasureHuntOpportunityResults } from '../../shared/models/treasure-hunt';
import { OpportunityCardData } from '../treasure-chest/opportunity-cards/opportunity-cards.service';

@Injectable()
export class CaReductionTreasureHuntService {

  constructor(private compressedAirReductionService: CompressedAirReductionService,
    private convertUnitsService: ConvertUnitsService) { }

  
  initNewCalculator() {
    this.resetCalculatorInputs();
  }

  setCalculatorInputFromOpportunity(compressedAirReduction: CompressedAirReductionTreasureHunt) {
    this.compressedAirReductionService.baselineData = compressedAirReduction.baseline;
    this.compressedAirReductionService.modificationData = compressedAirReduction.modification;
  }

  deleteOpportunity(index: number, treasureHunt: TreasureHunt): TreasureHunt {
    treasureHunt.compressedAirReductions.splice(index, 1);
    return treasureHunt;
  }

  saveTreasureHuntOpportunity(compressedAirReduction: CompressedAirReductionTreasureHunt, treasureHunt: TreasureHunt): TreasureHunt {
    if (!treasureHunt.compressedAirReductions) {
      treasureHunt.compressedAirReductions = new Array();
    }
    treasureHunt.compressedAirReductions.push(compressedAirReduction);
    return treasureHunt;
  }

  resetCalculatorInputs() {
    this.compressedAirReductionService.baselineData = undefined;
    this.compressedAirReductionService.modificationData = undefined;
  }


  getTreasureHuntOpportunityResults(compressedAirReduction: CompressedAirReductionTreasureHunt, settings: Settings): TreasureHuntOpportunityResults {
    this.compressedAirReductionService.calculateResults(settings, compressedAirReduction.baseline, compressedAirReduction.modification);
    let results: CompressedAirReductionResults = this.compressedAirReductionService.compressedAirResults.getValue(); 
    let treasureHuntOpportunityResults: TreasureHuntOpportunityResults = {
      costSavings: results.annualCostSavings,
      energySavings: results.annualEnergySavings,
      baselineCost: results.baselineAggregateResults.energyCost,
      modificationCost: results.modificationAggregateResults.energyCost,
      utilityType: '',
    }

    if (compressedAirReduction.baseline[0].utilityType == 0) {
      treasureHuntOpportunityResults.utilityType = 'Compressed Air';
    } else {
      treasureHuntOpportunityResults.utilityType = 'Electricity';
    }

    return treasureHuntOpportunityResults;
  }

  getCompressedAirReductionCardData(reduction: CompressedAirReductionTreasureHunt, opportunitySummary: OpportunitySummary, settings: Settings, currentEnergyUsage: EnergyUsage, index: number): OpportunityCardData {
    let utilityCost: number = currentEnergyUsage.compressedAirCosts;
    let unitStr: string = 'kSCF'
    //electricity utility
    if (reduction.baseline[0].utilityType == 1) {
      utilityCost = currentEnergyUsage.electricityCosts;
      unitStr = 'kWh'
    } else if (settings.unitsOfMeasure == 'Metric') {
      unitStr = 'Nm3'
    }
    let cardData: OpportunityCardData = {
      implementationCost: opportunitySummary.totalCost,
      paybackPeriod: opportunitySummary.payback,
      selected: reduction.selected,
      opportunityType: 'compressed-air-reduction',
      opportunityIndex: index,
      annualCostSavings: opportunitySummary.costSavings,
      annualEnergySavings: [{
        savings: opportunitySummary.totalEnergySavings,
        energyUnit: unitStr,
        label: opportunitySummary.utilityType
      }],
      utilityType: [opportunitySummary.utilityType],
      percentSavings: [{
        percent: (opportunitySummary.costSavings / utilityCost) * 100,
        label: opportunitySummary.utilityType,
        baselineCost: opportunitySummary.baselineCost,
        modificationCost: opportunitySummary.modificationCost,
      }],
      compressedAirReduction: reduction,
      name: opportunitySummary.opportunityName,
      opportunitySheet: reduction.opportunitySheet,
      iconString: 'assets/images/calculator-icons/utilities-icons/compressed-air-reduction-icon.png',
      teamName: reduction.opportunitySheet? reduction.opportunitySheet.owner : undefined
    };
    return cardData;
  }

  convertCompressedAirReductions(compressedAirReductions: Array<CompressedAirReductionTreasureHunt>, oldSettings: Settings, newSettings: Settings): Array<CompressedAirReductionTreasureHunt> {
    compressedAirReductions.forEach(compressedAirReduction => {
      compressedAirReduction.baseline.forEach(reduction => {
        reduction = this.convertCompressedAirReduction(reduction, oldSettings, newSettings);
      });
    // debugger;
      compressedAirReduction.modification.forEach(reduction => {
        reduction = this.convertCompressedAirReduction(reduction, oldSettings, newSettings);
      });
    })
    return compressedAirReductions;
  }

  convertCompressedAirReduction(reduction: CompressedAirReductionData, oldSettings: Settings, newSettings: Settings): CompressedAirReductionData {
    // imperial: $/SCF, metric: $/m3
    reduction.compressedAirCost = this.convertUnitsService.convertDollarsPerFt3AndM3(reduction.compressedAirCost, oldSettings, newSettings);
    //I believe utility cost is just set before sending to calculations so it does not need a conversion,
    //will use electrity cost or compressed air cost
    // reduction.utilityCost

    //imperial: SCF/min, metric: m3/min
    reduction.flowMeterMethodData.meterReading = this.convertUnitsService.convertFt3AndM3Value(reduction.flowMeterMethodData.meterReading, oldSettings, newSettings);
    //imperial: in, metric: cm
    reduction.bagMethodData.height = this.convertUnitsService.convertInAndCmValue(reduction.bagMethodData.height, oldSettings, newSettings);
    //imperial: in, metric: cm
    reduction.bagMethodData.diameter = this.convertUnitsService.convertInAndCmValue(reduction.bagMethodData.diameter, oldSettings, newSettings);
    //imperial: psig, metric: barg
    reduction.pressureMethodData.supplyPressure = this.convertUnitsService.convertPsigAndBargValue(reduction.pressureMethodData.supplyPressure, oldSettings, newSettings);
    //imperial: kSCF/yr, metric: m3/yr
    reduction.otherMethodData.consumption = this.convertUnitsService.convertKSCFAndM3Value(reduction.otherMethodData.consumption, oldSettings, newSettings);
    //imperial: kW/SCFM, metric: kW/(m3/min)
    reduction.compressorElectricityData.compressorSpecificPower = this.convertUnitsService.convertDollarsPerFt3AndM3(reduction.compressorElectricityData.compressorSpecificPower, oldSettings, newSettings);

    return reduction;
  }

}