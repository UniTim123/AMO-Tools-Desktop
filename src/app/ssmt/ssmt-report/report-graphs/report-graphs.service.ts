import { Injectable } from '@angular/core';
import { SSMT } from '../../../shared/models/steam/ssmt';
import { Settings } from '../../../shared/models/settings';
import * as d3 from 'd3';
import { SSMTLosses } from '../../../shared/models/steam/steam-outputs';
import { WaterfallItem, WaterfallInput } from '../../../shared/waterfall-graph/waterfall-graph.service';

@Injectable()
export class ReportGraphsService {

  // number formatter for d3
  format: any = d3.format(',.2f');

  constructor() { }

  getProcessUsageData(ssmt: SSMT): Array<number> {
    let processUsageData = new Array<number>();
    if (ssmt.headerInput) {
      if (ssmt.headerInput.highPressure) {
        processUsageData.push(ssmt.headerInput.highPressure.processSteamUsage);
      }
      if (ssmt.headerInput.mediumPressure) {
        processUsageData.push(ssmt.headerInput.mediumPressure.processSteamUsage);
      }
      if (ssmt.headerInput.lowPressure) {
        processUsageData.push(ssmt.headerInput.lowPressure.processSteamUsage);
      }
    }
    else {
      processUsageData = [0, 0, 0];
    }
    return processUsageData;
  }

  getProcessUsageLabels(processUsageData: Array<number>, settings: Settings) {
    let l = processUsageData.length;
    let processUsageLabels = new Array<string>();
    if (l === 1) {
      processUsageLabels.push('HP: ' + this.format(processUsageData[0]) + ' ' + settings.steamMassFlowMeasurement + '/hr');
    }
    else if (l === 2) {
      processUsageLabels.push('HP: ' + this.format(processUsageData[0]) + ' ' + settings.steamMassFlowMeasurement + '/hr');
      processUsageLabels.push('LP: ' + this.format(processUsageData[1]) + ' ' + settings.steamMassFlowMeasurement + '/hr');
    }
    else if (l === 3) {
      processUsageLabels.push('HP: ' + this.format(processUsageData[0]) + ' ' + settings.steamMassFlowMeasurement + '/hr');
      processUsageLabels.push('MP: ' + this.format(processUsageData[1]) + ' ' + settings.steamMassFlowMeasurement + '/hr');
      processUsageLabels.push('LP: ' + this.format(processUsageData[2]) + ' ' + settings.steamMassFlowMeasurement + '/hr');
    }
    return processUsageLabels;
  }

  getGenerationData(ssmt: SSMT): Array<number> {
    let generationData = new Array<number>();
    if (ssmt.turbineInput) {
      if (ssmt.turbineInput.condensingTurbine.useTurbine) {
        generationData.push(ssmt.outputData.condensingTurbine.powerOut);
      }
      if (ssmt.turbineInput.highToLowTurbine.useTurbine) {
        generationData.push(ssmt.outputData.highToLowPressureTurbine.powerOut);
      }
      if (ssmt.turbineInput.highToMediumTurbine.useTurbine) {
        generationData.push(ssmt.outputData.highPressureToMediumPressureTurbine.powerOut);
      }
      if (ssmt.turbineInput.mediumToLowTurbine.useTurbine) {
        generationData.push(ssmt.outputData.mediumToLowPressureTurbine.powerOut);
      }
    }
    else {
      generationData = [0, 0, 0, 0];
    }
    return generationData;
  }

  getGenerationLabels(generationData: Array<number>, ssmt: SSMT, settings: Settings) {
    let l = generationData.length;
    let generationLabels = new Array<string>();
    let i = 0;
    if (ssmt.turbineInput) {
      if (ssmt.turbineInput.condensingTurbine.useTurbine) {
        generationLabels.push('Condensing Turbine: ' + this.format(generationData[i]) + ' ' + settings.steamPowerMeasurement);
        i++;
      }
      if (ssmt.turbineInput.highToLowTurbine.useTurbine) {
        generationLabels.push('HP to LP: ' + this.format(generationData[i]) + ' ' + settings.steamPowerMeasurement);
        i++;
      }
      if (ssmt.turbineInput.highToMediumTurbine.useTurbine) {
        generationLabels.push('HP to MP: ' + this.format(generationData[i]) + ' ' + settings.steamPowerMeasurement);
        i++;
      }
      if (ssmt.turbineInput.mediumToLowTurbine.useTurbine) {
        generationLabels.push('MP to LP: ' + this.format(generationData[i]) + ' ' + settings.steamPowerMeasurement);
      }
    }
    return generationLabels;
  }

  getWaterfallData(selectedSsmt: { name: string, ssmt: SSMT, index: number }, units: string, startColor: string, lossColor: string, netColor: string, baselineLosses: SSMTLosses, modificationLosses: SSMTLosses) {
    let tmpLosses: SSMTLosses;
    if (selectedSsmt.index == 0) {
      tmpLosses = baselineLosses;
    }
    else if (modificationLosses !== undefined && modificationLosses !== null) {
      tmpLosses = modificationLosses;
    }
    else {
      throw "ERROR - Invalid index supplied for waterfall loss data array.";
    }
    let inputObjects: Array<WaterfallItem> = new Array<WaterfallItem>();
    let startNode: WaterfallItem = {
      value: tmpLosses.fuelEnergy + tmpLosses.makeupWaterEnergy,
      label: 'Input Energy',
      isStartValue: true,
      isNetValue: false
    }
    let processUseNetNode: WaterfallItem = {
      value: tmpLosses.allProcessUsageUsefulEnergy,
      label: 'Process Use',
      isStartValue: false,
      isNetValue: true
    };
    let turbineUseNetNode: WaterfallItem = {
      value: tmpLosses.highToLowTurbineUsefulEnergy + tmpLosses.highToMediumTurbineUsefulEnergy + tmpLosses.mediumToLowTurbineUsefulEnergy + tmpLosses.condensingTurbineUsefulEnergy,
      label: 'Turbine Generation',
      isStartValue: false,
      isNetValue: true
    }
    let otherLossNode: WaterfallItem = {
      value: tmpLosses.blowdown + tmpLosses.highPressureHeader + tmpLosses.mediumPressureHeader + tmpLosses.lowPressureHeader + tmpLosses.condensateLosses + tmpLosses.deaeratorVentLoss + tmpLosses.lowPressureVentLoss + tmpLosses.condensateFlashTankLoss,
      label: 'Other Losses',
      isStartValue: false,
      isNetValue: false
    };
    let stackLossNode: WaterfallItem = {
      value: tmpLosses.stack, 
      label: 'Stack Losses',
      isStartValue: false,
      isNetValue: false
    };
    let turbineLossNode: WaterfallItem = {
      value: tmpLosses.highToLowTurbineEfficiencyLoss + tmpLosses.highToMediumTurbineEfficiencyLoss + tmpLosses.mediumToLowTurbineEfficiencyLoss + tmpLosses.condensingTurbineEfficiencyLoss + tmpLosses.condensingLosses,
      label: 'Turbine Losses',
      isStartValue: false,
      isNetValue: false
    };
    let condensateLossNode: WaterfallItem = {
      value: tmpLosses.highPressureProcessLoss + tmpLosses.mediumPressureProcessLoss + tmpLosses.lowPressureProcessLoss,
      label: 'Unreturned Condensate',
      isStartValue: false,
      isNetValue: false
    };
    inputObjects = [startNode, turbineUseNetNode, turbineLossNode, processUseNetNode, condensateLossNode, stackLossNode, otherLossNode];

    let waterfallData: WaterfallInput = {
      name: selectedSsmt.name,
      inputObjects: inputObjects,
      units: units,
      startColor: startColor,
      lossColor: lossColor,
      netColor: netColor
    };
    return waterfallData;
  }
}