import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Settings } from '../../shared/models/settings';
import { ByDataInputs, ByEquationInputs, EquipmentInputs, PumpSystemCurveData, FanSystemCurveData, ModificationEquipment } from '../../shared/models/system-and-equipment-curve';
import { RegressionEquationsService } from './regression-equations.service';
import * as _ from 'lodash';
import { SystemCurveDataPoint } from './system-and-equipment-curve-graph/system-and-equipment-curve-graph.service';

@Injectable()
export class SystemAndEquipmentCurveService {
  //persistent data objects for calculator
  pumpByDataInputs: ByDataInputs;
  pumpByEquationInputs: ByEquationInputs;
  pumpEquipmentInputs: EquipmentInputs;
  fanByDataInputs: ByDataInputs;
  fanByEquationInputs: ByEquationInputs;
  fanEquipmentInputs: EquipmentInputs;

  //behavior subjects for calculator state
  currentField: BehaviorSubject<string>;
  focusedCalculator: BehaviorSubject<string>;
  selectedEquipmentCurveFormView: BehaviorSubject<string>;
  equipmentCurveCollapsed: BehaviorSubject<string>;
  systemCurveCollapsed: BehaviorSubject<string>;
  pumpModificationCollapsed: BehaviorSubject<string>;
  fanModificationCollapsed: BehaviorSubject<string>;
  updateGraph: BehaviorSubject<boolean>;

  //form data behavior subjects
  pumpSystemCurveData: BehaviorSubject<PumpSystemCurveData>;
  fanSystemCurveData: BehaviorSubject<FanSystemCurveData>;
  byDataInputs: BehaviorSubject<ByDataInputs>;
  equipmentInputs: BehaviorSubject<EquipmentInputs>;
  byEquationInputs: BehaviorSubject<ByEquationInputs>;

  //calcuated data points
  baselineEquipmentCurveDataPairs: Array<{ x: number, y: number }>;
  modifiedEquipmentCurveDataPairs: Array<{ x: number, y: number }>;
  systemCurveRegressionData: Array<{ x: number, y: number, fluidPower: number }>;
  baselinePowerDataPairs: Array<{ x: number, y: number }>;
  modificationPowerDataPairs: Array<{ x: number, y: number }>;

  //data points for system curve dropdown in assessment
  systemCurveDataPoints: Array<{ pointName: string, flowRate: number, yValue: number }>;
  systemCurveIntersectionData: BehaviorSubject<IntersectionData>;
  modificationEquipment: BehaviorSubject<ModificationEquipment>;

  // Performance limits for data pair lengths
  medCoordinateLimit: number = 25000;
  highCoordinateLimit: number = 100000;
  existingInputUnits: string; 

  constructor(private regressionEquationsService: RegressionEquationsService) {
    this.currentField = new BehaviorSubject<string>('default');
    this.pumpSystemCurveData = new BehaviorSubject<PumpSystemCurveData>(undefined);
    this.fanSystemCurveData = new BehaviorSubject<FanSystemCurveData>(undefined);
    this.focusedCalculator = new BehaviorSubject<string>(undefined);
    this.byDataInputs = new BehaviorSubject<ByDataInputs>(undefined);
    this.equipmentInputs = new BehaviorSubject<EquipmentInputs>(undefined);
    this.byEquationInputs = new BehaviorSubject<ByEquationInputs>(undefined);
    this.selectedEquipmentCurveFormView = new BehaviorSubject<string>('Equation');
    this.equipmentCurveCollapsed = new BehaviorSubject<string>('closed');
    this.systemCurveCollapsed = new BehaviorSubject<string>('closed');
    this.pumpModificationCollapsed = new BehaviorSubject<string>('closed');
    this.fanModificationCollapsed = new BehaviorSubject<string>('closed');
    this.updateGraph = new BehaviorSubject<boolean>(false);
    this.systemCurveIntersectionData = new BehaviorSubject<IntersectionData>(undefined);
    this.modificationEquipment = new BehaviorSubject<ModificationEquipment>(undefined);
  }

  //calculation functions
  getMaxFlowRate(equipmentType: string): number {
    //50, system curve point (1,2) flow rate, byData max flow rate from data rows, byEquation max flow
    let maxFlowRate: number = 50;
    let maxEquipmentCurve: number = 0;
    let maxSystemCurve: number = 0;
    //max system curve
    if (this.systemCurveCollapsed.getValue() == 'open') {
      if (equipmentType == 'pump' && this.pumpSystemCurveData.getValue() != undefined) {
        maxSystemCurve = _.max([this.pumpSystemCurveData.getValue().pointOneFlowRate, this.pumpSystemCurveData.getValue().pointTwoFlowRate]);
      } else if (equipmentType == 'fan' && this.fanSystemCurveData.getValue() != undefined) {
        maxSystemCurve = _.max([this.fanSystemCurveData.getValue().pointOneFlowRate, this.fanSystemCurveData.getValue().pointTwoFlowRate]);
      }
    }
    //max equipment curve;
    if (this.equipmentCurveCollapsed.getValue() == 'open') {
      if (this.selectedEquipmentCurveFormView.getValue() == 'Equation' && this.byEquationInputs.getValue() != undefined) {
        maxEquipmentCurve = this.byEquationInputs.getValue().maxFlow;
      } else if (this.selectedEquipmentCurveFormView.getValue() == 'Data' && this.byDataInputs.getValue() != undefined) {
        maxEquipmentCurve = _.maxBy(this.byDataInputs.getValue().dataRows, (val) => { return val.flow }).flow;
      }

      if (this.equipmentInputs.getValue() != undefined 
          && this.modificationEquipment.getValue() != undefined 
          && this.equipmentInputs.getValue().baselineMeasurement > 0
          && (this.equipmentInputs.getValue().baselineMeasurement < this.modificationEquipment.getValue().speed)) {
        // ratio creates infinite loop because baselineIntersect recalculation changes speed value every time
        // ratio = this.modificationEquipment.getValue().speed / this.equipmentInputs.getValue().baselineMeasurement;

        // Use spacing buffer instead
        let graphSpacing = this.modificationEquipment.getValue().flow * .25;
        maxFlowRate = this.modificationEquipment.getValue().flow + graphSpacing;
      }
    }

    // maxFlowRate = _.max([maxFlowRate, maxEquipmentCurve, maxSystemCurve]) * ratio;
    maxFlowRate = _.max([maxFlowRate, maxEquipmentCurve, maxSystemCurve]);
    return maxFlowRate;
  }

  resetModificationEquipment() {
    let modificationEquipment: ModificationEquipment = {
      head: 0,
      flow: 0,
      pressure: 0,
      speed: 0,
    };
    this.modificationEquipment.next(modificationEquipment);
  }

  calculatePumpEfficiency(baselinePowerDataPairs: Array<{ x: number, y: number }>, point: SystemCurveDataPoint, settings: Settings, isModification = false): SystemCurveDataPoint {
    let pumpSystemCurveData = this.pumpSystemCurveData.getValue();
    let modificationEquipment = this.modificationEquipment.getValue();
    let equipmentInputs = this.equipmentInputs.getValue();
    let intersectionData = this.systemCurveIntersectionData.getValue();
    let baselineOperatingFlow = intersectionData.baseline.x;

    // roundoff flow offset to find match
    let match = Math.round(baselineOperatingFlow / 10) * 10;
    let powerAtBaselineFlow = baselinePowerDataPairs.find(pair => {
      return pair.x == match;
    });

    if (powerAtBaselineFlow) {
      let baselinePower = powerAtBaselineFlow.y;
      let fluidPower: number = this.regressionEquationsService.getPumpFluidPower(intersectionData.baseline.y, intersectionData.baseline.x, pumpSystemCurveData.specificGravity, settings);
      // Efficiency (either baseline or mod)|at OP = (fluidPower|OP/power|OP) * 100%
      point.power = baselinePower;
      point.efficiency = (fluidPower / baselinePower) * 100;
      if (isModification && modificationEquipment.speed > 0) {
        // Power|mod = Power|BL * (Speed|mod / Speed|BL) ^3
        let modificationPower = baselinePower * Math.pow((modificationEquipment.speed / equipmentInputs.baselineMeasurement), 3);
        point.power = modificationPower,
        point.efficiency = (fluidPower / modificationPower) * 100
      }
    }
    return point;
  }

  calculateFanEfficiency(baselinePowerDataPairs: Array<{ x: number, y: number }>, point: SystemCurveDataPoint, settings: Settings, isModification = false): SystemCurveDataPoint {
    let fanSystemCurveData: FanSystemCurveData = this.fanSystemCurveData.getValue();
    let equipmentInputs: EquipmentInputs = this.equipmentInputs.getValue();
    let modificationEquipment = this.modificationEquipment.getValue();
    let intersectionData = this.systemCurveIntersectionData.getValue();
    
    if (intersectionData && intersectionData.baseline &&  baselinePowerDataPairs.length > 0) {
      let baselineOperatingFlow = intersectionData.baseline.x;
      let smallestDiff = baselinePowerDataPairs[baselinePowerDataPairs.length - 1].x;
      let closestPowerVal;

      // Approximate closest x value (off less than a 10th/100th of a percent)
      for (let i = 0; i < baselinePowerDataPairs.length; i++) {
        let current = Math.abs(baselineOperatingFlow - baselinePowerDataPairs[i].x);
        if (current < smallestDiff) {
          smallestDiff = current;
          closestPowerVal = baselinePowerDataPairs[i].y;
        }
      }
      let baselinePower = closestPowerVal;

      if (baselinePower) {
        // Power|mod = Power|BL * (Speed|mod / Speed|BL) ^3
        let fluidPower: number = this.regressionEquationsService.getFanFluidPower(intersectionData.baseline.y, intersectionData.baseline.x, fanSystemCurveData.compressibilityFactor, settings);
        // Efficiency (either baseline or mod)|at OP = (fluidPower|OP/power|OP) * 100%
        point.power = baselinePower;
        point.efficiency = (fluidPower / baselinePower) * 100;
        if (isModification && modificationEquipment.speed > 0) {
          // Power|mod = Power|BL * (Speed|mod / Speed|BL) ^3
          let modificationPower = baselinePower * Math.pow((modificationEquipment.speed / equipmentInputs.baselineMeasurement), 3);
          point.power = modificationPower;
          point.efficiency = (fluidPower / modificationPower) * 100;
        }
      }
    }
    return point;
  }


  calculateByDataRegression(equipmentType: string, maxFlowRate: number) {
    if (this.byDataInputs.getValue() != undefined && this.equipmentInputs.getValue() != undefined) {
      let secondValueLabel: string = 'Head';
      let powerDataPairs;
      this.setCoordinatePairIncrement(maxFlowRate);
      powerDataPairs = this.regressionEquationsService.getEquipmentPowerRegressionByData(this.byDataInputs.getValue(), this.modificationEquipment.getValue(), this.equipmentInputs.getValue(), maxFlowRate);
      if (equipmentType == 'fan') {
        secondValueLabel = 'Pressure';
      }
      let results = this.regressionEquationsService.getEquipmentCurveRegressionByData(this.byDataInputs.getValue(), this.equipmentInputs.getValue(), this.modificationEquipment.getValue(), secondValueLabel, maxFlowRate);
      this.regressionEquationsService.baselineEquipmentCurveByDataRegressionEquation.next(results.baselineRegressionEquation);
      this.regressionEquationsService.baselineEquipmentCurveByDataRSquared.next(results.baselineRSquared);
      this.regressionEquationsService.modificationEquipmentCurveByDataRegressionEquation.next(results.modificationRegressionEquation);
      this.regressionEquationsService.modificationEquipmentCurveRSquared.next(results.modificationRSquared);
      if (this.selectedEquipmentCurveFormView.getValue() == 'Data') {
        this.baselineEquipmentCurveDataPairs = results.baselineDataPairs;
        this.modifiedEquipmentCurveDataPairs = results.modifiedDataPairs;
        this.baselinePowerDataPairs = powerDataPairs.baseline;
        this.modificationPowerDataPairs = powerDataPairs.modification;
      }
    }
  }

  setCoordinatePairIncrement(maxFlowRate: number) {
    let increment = 2;
    if (maxFlowRate > this.medCoordinateLimit && maxFlowRate < this.highCoordinateLimit) {
      increment = Math.round(maxFlowRate / 100);
    } else if (maxFlowRate >= this.highCoordinateLimit) {
      increment = Math.round(maxFlowRate / 1000);
    } 
    this.regressionEquationsService.dataPairCoordinateIncrement = increment;
  }

  calculateByEquationRegressions(equipmentType: string, maxFlowRate: number, settings: Settings) {
    if (this.byEquationInputs.getValue() != undefined && this.equipmentInputs.getValue() != undefined) {
      let secondValueLabel: string = 'Head';
      let powerDataPairs;
      this.setCoordinatePairIncrement(maxFlowRate);
      powerDataPairs = this.regressionEquationsService.getEquipmentPowerRegressionByEquation(this.byEquationInputs.getValue(), this.equipmentInputs.getValue(), this.modificationEquipment.getValue(),  maxFlowRate);
      if (equipmentType == 'fan') {
        secondValueLabel = 'Pressure';
      }
      let results = this.regressionEquationsService.getEquipmentCurveRegressionByEquation(this.byEquationInputs.getValue(), this.equipmentInputs.getValue(), this.modificationEquipment.getValue(), secondValueLabel, maxFlowRate);
      this.regressionEquationsService.baselineEquipmentCurveByEquationRegressionEquation.next(results.baselineRegressionEquation);
      this.regressionEquationsService.modificationEquipmentCurveByEquationRegressionEquation.next(results.modificationRegressionEquation);
      if (this.selectedEquipmentCurveFormView.getValue() == 'Equation') {
        this.baselineEquipmentCurveDataPairs = results.baselineDataPairs;
        this.modifiedEquipmentCurveDataPairs = results.modifiedDataPairs;
        this.baselinePowerDataPairs = powerDataPairs.baseline;
        this.modificationPowerDataPairs = powerDataPairs.modification;
      }
    }
  }

  calculateSystemCurveRegressionData(equipmentType: string, settings: Settings, maxFlowRate: number) {
    if (equipmentType == 'pump' && this.pumpSystemCurveData.getValue() != undefined) {
      this.setCoordinatePairIncrement(maxFlowRate);
      let systemCurveRegressionEquation: string = this.regressionEquationsService.getPumpSystemCurveRegressionEquation(this.pumpSystemCurveData.getValue());
      this.regressionEquationsService.systemCurveRegressionEquation.next(systemCurveRegressionEquation);
      this.systemCurveRegressionData = this.regressionEquationsService.calculatePumpSystemCurveData(this.pumpSystemCurveData.getValue(), maxFlowRate, settings);
      this.calculateModificationEquipment();
    } else if (equipmentType == 'fan' && this.fanSystemCurveData.getValue() != undefined) {
      this.setCoordinatePairIncrement(maxFlowRate);
      let systemCurveRegressionEquation: string = this.regressionEquationsService.getFanSystemCurveRegressionEquation(this.fanSystemCurveData.getValue());
      this.regressionEquationsService.systemCurveRegressionEquation.next(systemCurveRegressionEquation);
      this.systemCurveRegressionData = this.regressionEquationsService.calculateFanSystemCurveData(this.fanSystemCurveData.getValue(), maxFlowRate, settings);
      this.calculateModificationEquipment(true);
    }
  }

  calculateModificationEquipment(isFanEquipment = false) {
    let equipmentInputs = this.equipmentInputs.getValue();
    let modificationEquipment: ModificationEquipment = {head: 0, flow: 0, speed: 0};
    
    // check if no pairs on reset
    if (this.baselineEquipmentCurveDataPairs && this.baselineEquipmentCurveDataPairs.length > 0) {
      let intersection = this.calculateBaselineIntersectionPoint(this.baselineEquipmentCurveDataPairs);
      if (intersection) {
        let systemCurveIntersectionData: IntersectionData = { baseline: intersection };
        this.systemCurveIntersectionData.next(systemCurveIntersectionData)
        let systemCurveData: FanSystemCurveData | PumpSystemCurveData;
        if (isFanEquipment) {
          systemCurveData = this.fanSystemCurveData.getValue();
        } else {
          systemCurveData = this.pumpSystemCurveData.getValue();
        }
        if (systemCurveData.modificationCurve) {
          if (systemCurveData.modificationCurve.modificationMeasurementOption == 0) {
            // Flow input
            modificationEquipment = this.calculateModifiedYValue(modificationEquipment, systemCurveData)
        } else {
            // Head input
            modificationEquipment = this.calculateModifiedFlow(modificationEquipment, systemCurveData)
        }
        let baselineFlow = intersection.x;
        // new speed/diameter from affinity law
        modificationEquipment.speed = equipmentInputs.baselineMeasurement * (modificationEquipment.flow / baselineFlow);
        }
      }
    }
    this.modificationEquipment.next(modificationEquipment);
  }

  isFanCurveData(curveData: FanSystemCurveData | PumpSystemCurveData): curveData is FanSystemCurveData {
    return (curveData as FanSystemCurveData).pointOnePressure !== undefined;
  }

  calculateModifiedYValue(modificationEquipment: ModificationEquipment, systemCurveData: PumpSystemCurveData | FanSystemCurveData) {
    let pointOneY: number;
    let pointTwoY: number;
    if (this.isFanCurveData(systemCurveData)) {
      pointOneY = systemCurveData.pointOnePressure;
      pointTwoY = systemCurveData.pointTwoPressure;
    } else {
      pointOneY = systemCurveData.pointOneHead;
      pointTwoY = systemCurveData.pointTwoHead;
    }
    // User input for OP 1 pressure passed in to get staticHead
    let staticHead: number = this.regressionEquationsService.calculateStaticHead(
      systemCurveData.pointOneFlowRate,
      pointOneY,
      systemCurveData.pointTwoFlowRate,
      pointTwoY,
      systemCurveData.systemLossExponent
    );
    let lossCoefficient: number = this.regressionEquationsService.calculateLossCoefficient(
      systemCurveData.pointOneFlowRate,
      pointOneY,
      systemCurveData.pointTwoFlowRate,
      pointTwoY,
      systemCurveData.systemLossExponent
    );
    let constant = lossCoefficient;
    let systemLossExponent = systemCurveData.systemLossExponent;
    
    // modificationHead = Static head + (constant * flow ^ system loss exponent)
    let modifiedYValue = staticHead + (constant * (Math.pow(systemCurveData.modificationCurve.modifiedFlow, systemLossExponent)));

    modificationEquipment.flow = systemCurveData.modificationCurve.modifiedFlow;
    if (this.isFanCurveData(systemCurveData)) {
      modificationEquipment.pressure = modifiedYValue;
    } else {
      modificationEquipment.head = modifiedYValue;
    }
    return modificationEquipment;
  }

  calculateModifiedFlow(modificationEquipment: ModificationEquipment, systemCurveData: PumpSystemCurveData | FanSystemCurveData) {
    let pointOneY: number;
    let pointTwoY: number;
    let modificationInput: number;
    if (this.isFanCurveData(systemCurveData)) {
      pointOneY = systemCurveData.pointOnePressure;
      pointTwoY = systemCurveData.pointTwoPressure;
      modificationInput = systemCurveData.modificationCurve.modifiedPressure;
    } else {
      pointOneY = systemCurveData.pointOneHead;
      pointTwoY = systemCurveData.pointTwoHead;
      modificationInput = systemCurveData.modificationCurve.modifiedHead;
    }
    let staticHead: number = this.regressionEquationsService.calculateStaticHead(
      systemCurveData.pointOneFlowRate,
      pointOneY,
      systemCurveData.pointTwoFlowRate,
      pointTwoY,
      systemCurveData.systemLossExponent
    );
    let lossCoefficient: number = this.regressionEquationsService.calculateLossCoefficient(
      systemCurveData.pointOneFlowRate,
      pointOneY,
      systemCurveData.pointTwoFlowRate,
      pointTwoY,
      systemCurveData.systemLossExponent
    );
    let constant = lossCoefficient;
    let systemLossExponent = systemCurveData.systemLossExponent;

   // modificationFlow = power((modificationHead - staticHead)/Constant, 1 / systemLossExponent) }
    let exp = 1 / systemLossExponent;
    let modifiedFlow = Math.pow((modificationInput - staticHead) / constant, exp);

    if (isNaN(modifiedFlow) || !isFinite(modifiedFlow)) {
      modifiedFlow = 0;
    }
    
    modificationEquipment.flow = modifiedFlow;
    if (this.isFanCurveData(systemCurveData)) {
      modificationEquipment.pressure = systemCurveData.modificationCurve.modifiedPressure;
    } else {
      modificationEquipment.head = systemCurveData.modificationCurve.modifiedHead;
    }
    return modificationEquipment;
  }

  calculateBaselineIntersectionPoint(equipmentCurve: Array<{ x: number, y: number }>): { x: number, y: number } {
    let systemCurve: Array<{ x: number, y: number, fluidPower: number }> = this.systemCurveRegressionData;
    let intersected: boolean = false;
    let equipmentStartGreater: boolean = false;
    let intersectPoint: number = 0;
    if (equipmentCurve[0].y > systemCurve[0].y) {
      equipmentStartGreater = true;
    }
    let iterateMax: number;
    if (systemCurve.length <= equipmentCurve.length) {
      iterateMax = systemCurve.length;
    } else {
      iterateMax = equipmentCurve.length;
    }
    if (equipmentStartGreater) {
      for (let i = 1; i < iterateMax; i++) {
        if (equipmentCurve[i].y < systemCurve[i].y) {
          intersectPoint = i;
          intersected = true;
          break;
        }
      };
    }
    else {
      for (let i = 1; i < iterateMax; i++) {
        if (equipmentCurve[i].y > systemCurve[i].y) {
          intersectPoint = i;
          intersected = true;
          break;
        }
      };
    }

    if (intersected) {
      let equipmentVal1 = equipmentCurve[intersectPoint - 1];
      let equipmentVal2 = equipmentCurve[intersectPoint];
      let systemVal1 = systemCurve[intersectPoint - 1];
      let systemVal2 = systemCurve[intersectPoint];
      
      let avgYVal = (equipmentVal1.y + equipmentVal2.y + systemVal1.y + systemVal2.y) / 4;
      let avgXVal = (equipmentVal1.x + equipmentVal2.x + systemVal1.x + systemVal2.x) / 4;
      return { x: avgXVal, y: avgYVal };      
    } else {
      return undefined;
    }
  }

}

export interface IntersectionData {
  baseline: SystemCurveDataPoint;
  modification?: SystemCurveDataPoint;
};
