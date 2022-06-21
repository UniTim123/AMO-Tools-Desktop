import { Injectable } from '@angular/core';
import { Settings } from '../../shared/models/settings';
import { TreasureHuntResults, OpportunitiesPaybackDetails, OpportunitySummary, OpportunitySheet, OpportunityCost, TreasureHuntCo2EmissionsResults, EnergyUsage, TreasureHunt } from '../../shared/models/treasure-hunt';
import { TreasureHuntReportService } from './treasure-hunt-report.service';
import { OpportunityCardData } from '../treasure-chest/opportunity-cards/opportunity-cards.service';
import pptxgen from 'pptxgenjs';
import * as _ from 'lodash';
import * as betterPlantsPPTimg from './better-plants-ppt-img.js';
import * as moment from 'moment';

@Injectable()
export class TreasureHuntPptService {

  constructor(private treasureHuntReportService: TreasureHuntReportService) { }


  getSlideTitleProperties(): pptxgen.TextPropsOptions {
    let slideTitleProps: pptxgen.TextPropsOptions = {
      x: 0,
      y: 0,
      w: '100%',
      h: 1.2,
      align: 'center',
      bold: true,
      color: 'FFFFFF',
      fontSize: 32,
      fontFace: 'Arial (Headings)',
      valign: 'middle',
      isTextBox: true,
      autoFit: true
    };
    return slideTitleProps;
  }

  getCostSummaryData(treasureHuntResults: TreasureHuntResults): PptxgenjsChartData[] {
    let labels = new Array<string>();
    let projectedCosts = new Array<number>();
    let costSavings = new Array<number>();
    if (treasureHuntResults.electricity.costSavings > 0) {
      labels.push('Electricity');
      projectedCosts.push(treasureHuntResults.electricity.modifiedEnergyCost);
      costSavings.push(treasureHuntResults.electricity.costSavings);
    }
    if (treasureHuntResults.naturalGas.costSavings > 0) {
      labels.push('Natural Gas');
      projectedCosts.push(treasureHuntResults.naturalGas.modifiedEnergyCost);
      costSavings.push(treasureHuntResults.naturalGas.costSavings);
    }
    if (treasureHuntResults.otherFuel.costSavings > 0) {
      labels.push('Other Fuel');
      projectedCosts.push(treasureHuntResults.otherFuel.modifiedEnergyCost);
      costSavings.push(treasureHuntResults.otherFuel.costSavings);
    }
    if (treasureHuntResults.water.costSavings > 0) {
      labels.push('Water');
      projectedCosts.push(treasureHuntResults.water.modifiedEnergyCost);
      costSavings.push(treasureHuntResults.water.costSavings);
    }
    if (treasureHuntResults.wasteWater.costSavings > 0) {
      labels.push('Wastewater');
      projectedCosts.push(treasureHuntResults.wasteWater.modifiedEnergyCost);
      costSavings.push(treasureHuntResults.wasteWater.costSavings);
    }
    if (treasureHuntResults.steam.costSavings > 0) {
      labels.push('Steam');
      projectedCosts.push(treasureHuntResults.steam.modifiedEnergyCost);
      costSavings.push(treasureHuntResults.steam.costSavings);
    }
    if (treasureHuntResults.compressedAir.costSavings > 0) {
      labels.push('Comp. Air');
      projectedCosts.push(treasureHuntResults.compressedAir.modifiedEnergyCost);
      costSavings.push(treasureHuntResults.compressedAir.costSavings);
    }
    let costSumBarData: PptxgenjsChartData[] = [
      { name: "Modification Costs", labels: labels, values: projectedCosts },
      { name: "Savings From Baseline", labels: labels, values: costSavings }
    ];
    return costSumBarData;
  }

  getPaybackData(opportunitiesPaybackDetails: OpportunitiesPaybackDetails, settings: Settings): PptxgenjsChartData[] {
    let values: Array<number> = new Array();
    let labels: Array<string> = new Array();
    values = [
      opportunitiesPaybackDetails.lessThanOneYear.totalSavings,
      opportunitiesPaybackDetails.oneToTwoYears.totalSavings,
      opportunitiesPaybackDetails.twoToThreeYears.totalSavings,
      opportunitiesPaybackDetails.moreThanThreeYears.totalSavings
    ];
    labels = [
      "Less than 1 Year (" + settings.currency + ")",
      "1 to 2 Years (" + settings.currency + ")",
      "2 to 3 Years (" + settings.currency + ")",
      "More than 3 Years (" + settings.currency + ")"
    ];
    let data: PptxgenjsChartData[] = [{
      name: "Opportunity Payback Details",
      labels: labels,
      values: values
    }];
    return data;
  }

  getTeamSummaryData(opportunityCardsData: Array<OpportunityCardData>): PptxgenjsChartData[] {
    let teamData = this.treasureHuntReportService.getTeamData(opportunityCardsData);
    teamData = _.orderBy(teamData, 'costSavings', 'desc');
    let values: Array<number> = new Array();
    let labels: Array<string> = new Array();
    teamData.forEach(team => {
      values.push(team.costSavings);
      labels.push(team.team);
    });
    let data: PptxgenjsChartData[] = [{
      name: "Team Summary",
      labels: labels,
      values: values
    }];
    return data;
  }

  getPieChartProperties() {
    let pieChartOptions: pptxgen.IChartOpts = {
      x: 1.6,
      y: 1.2,
      w: '76%',
      h: '76%',
      showPercent: false,
      showValue: true,
      dataLabelFormatCode: '$#,##0',
      chartColors: ['1E7640', '2ABDDA', '84B641', 'BC8FDD', '#E1CD00', '#306DBE', '#A03123', '#7FD7E9', '#DE762D', '#948A54', '#A9D58B', '#FFE166', '#DD7164', '#3f4a7d'],
      dataLabelPosition: 'bestFit',
      dataLabelFontSize: 18,
      dataLabelColor: '000000',
      dataLabelFontBold: true,
      showLegend: true,
      legendFontSize: 16,
      legendColor: '2E4053',
      firstSliceAng: 90
    };
    return pieChartOptions;
  }

  getBarChartProperties() {
    let barChartOptions: pptxgen.IChartOpts = {
      x: 1.6,
      y: 1.2,
      w: '76%',
      h: '76%',
      showLegend: true,
      showValue: true,
      barDir: 'col',
      barGrouping: 'clustered',
      dataLabelFormatCode: '$#,##0',
      dataLabelPosition: 'bestFit',
      chartColors: ['1E7640', '2ABDDA', '84B641', 'BC8FDD', '#E1CD00', '#306DBE', '#A03123', '#7FD7E9', '#DE762D', '#948A54', '#A9D58B', '#FFE166', '#DD7164', '#3f4a7d'],
      legendFontSize: 16,
      legendColor: '2E4053',
      dataLabelColor: '000000',
      dataLabelFontBold: false,
      catAxisLabelColor: '2E4053',
      valAxisLabelColor: '2E4053',
      dataLabelFontSize: 12,
      catAxisLabelFontSize: 16
    };
    return barChartOptions;
  }

  getCostBarChartProperties() {
    let barChartOptions: pptxgen.IChartOpts = {
      x: 1.6,
      y: 1.2,
      w: '76%',
      h: '76%',
      showLegend: true,
      showValue: true,
      barDir: 'col',
      barGrouping: 'stacked',
      dataLabelFormatCode: '$#,##0',
      dataLabelPosition: 'bestFit',
      chartColors: ['2ABDDA', '1E7640'],
      legendFontSize: 16,
      legendColor: '2E4053',
      dataLabelColor: '000000',
      dataLabelFontBold: false,
      catAxisLabelColor: '2E4053',
      valAxisLabelColor: '2E4053',
      dataLabelFontSize: 12,
      catAxisLabelFontSize: 16
    };
    return barChartOptions;
  }

  getOpportunitySlideText(opportunityData: OpportunitySheet): { text: pptxgen.TextProps[], options: pptxgen.TextPropsOptions } {
    let equipmentName: string = this.getEquipmentName(opportunityData.equipment);
    let slideText: pptxgen.TextProps[] = [
      { text: "Process / Equipment: " + equipmentName, options: { bullet: { code: '25A0' }, color: "1D428A", breakLine: true, autoFit: true } },
      { text: "Team: " + opportunityData.owner, options: { bullet: { code: '25A0' }, color: "1D428A", breakLine: true, autoFit: true } },
      { text: "Owner/Lead: " + opportunityData.businessUnits, options: { bullet: { code: '25A0' }, color: "1D428A", breakLine: true, autoFit: true } },
      { text: "Description: " + opportunityData.description, options: { bullet: { code: '25A0' }, color: "1D428A", breakLine: true, autoFit: true } },
    ];
    let slideTextProps = this.getOppSlideProperties();
    return { text: slideText, options: slideTextProps };
  }

  getEquipmentName(oppEquipment: string): string {
    let equipmentName: string = " ";
    if (oppEquipment == 'motor') {
      equipmentName = 'Motor';
    } else if (oppEquipment == 'pump') {
      equipmentName = 'Pump';
    } else if (oppEquipment == 'fan') {
      equipmentName = 'Fan';
    } else if (oppEquipment == 'compressedAir') {
      equipmentName = 'Compressed Air';
    } else if (oppEquipment == 'lights') {
      equipmentName = 'Lights';
    } else if (oppEquipment == 'processHeating') {
      equipmentName = 'Process Heating';
    } else if (oppEquipment == 'processCooling') {
      equipmentName = 'Process Cooling';
    } else if (oppEquipment == 'steam') {
      equipmentName = 'Steam';
    } else if (oppEquipment == 'other') {
      equipmentName = 'Other';
    } else if (oppEquipment == 'hvac') {
      equipmentName = 'HVAC System';
    }
    return equipmentName;
  }

  getOppSlideProperties(): pptxgen.TextPropsOptions {
    let textProps: pptxgen.TextPropsOptions = {
      x: 0,
      y: 1.2,
      w: 8,
      h: 4,
      align: 'left',
      color: '1D428A',
      fontSize: 28,
      fontFace: 'Arial (Body)',
      valign: 'top',
      isTextBox: true,
      autoFit: true
    };
    return textProps;

  }

  getpptTitle(settings: Settings): string {
    if (settings.facilityInfo && settings.facilityInfo.facilityName) {
      return settings.facilityInfo.facilityName + " Treasure Hunt Report";
    } else {
      return "Treasure Hunt Report";
    }
  }

  getCurrentDate(): string {
    const date: Date = new Date();
    let formatedDate: string = moment(date).format("MMM D, YYYY").toString();
    return formatedDate;
  }


  createPPT(settings: Settings, treasureHunt: TreasureHunt, treasureHuntResults: TreasureHuntResults, opportunityCardsData: Array<OpportunityCardData>,
    opportunitiesPaybackDetails: OpportunitiesPaybackDetails): pptxgen {
    let pptx = new pptxgen();

    let pptTitle = this.getpptTitle(settings);
    let date: string = this.getCurrentDate();

    pptx.layout = "LAYOUT_WIDE";
    pptx.defineSlideMaster({
      title: "MASTER_SLIDE",
      background: { data: betterPlantsPPTimg.betterPlantsSlide },
      margin: 0.0
    });

    let slideTitleProperties: pptxgen.TextPropsOptions = this.getSlideTitleProperties();
    let costBarChartOptions: pptxgen.IChartOpts = this.getCostBarChartProperties();
    let barChartOptions: pptxgen.IChartOpts = this.getBarChartProperties();
    let pieChartOptions: pptxgen.IChartOpts = this.getPieChartProperties();
    let costSumBarData: PptxgenjsChartData[] = this.getCostSummaryData(treasureHuntResults);
    let teamSummaryData: PptxgenjsChartData[] = this.getTeamSummaryData(opportunityCardsData);
    let paybackBarData: PptxgenjsChartData[] = this.getPaybackData(opportunitiesPaybackDetails, settings);

    let slide0 = pptx.addSlide();
    slide0.background = { data: betterPlantsPPTimg.betterPlantsTitleSlide };
    slide0.addText(pptTitle, { x: 0.3, y: 2.1, w: 5.73, h: 1.21, align: 'center', bold: true, color: '1D428A', fontSize: 26, fontFace: 'Arial (Headings)', valign: 'middle', isTextBox: true, autoFit: true });
    slide0.addText(date, { x: 0.3, y: 4.19, w: 4.34, h: 0.74, align: 'left', color: '8B93B1', fontSize: 20, fontFace: 'Arial (Body)', valign: 'top', isTextBox: true, autoFit: true });

    let slide1 = pptx.addSlide({ masterName: "MASTER_SLIDE" });
    slide1.addText('Energy Utility Usage & Cost', slideTitleProperties);
    if (treasureHunt.currentEnergyUsage) {
      slide1 = this.getEnergyUtilityTable(slide1, treasureHunt.currentEnergyUsage, settings);
    }

    let slide2 = pptx.addSlide({ masterName: "MASTER_SLIDE" });
    slide2.addText('Cost Summary', slideTitleProperties);
    slide2 = this.getCostSummaryTable(slide2, treasureHuntResults);

    let slide3 = pptx.addSlide({ masterName: "MASTER_SLIDE" });
    slide3.addChart("bar", costSumBarData, costBarChartOptions);
    slide3.addText('Cost Summary', slideTitleProperties);

    let slide4 = pptx.addSlide({ masterName: "MASTER_SLIDE" });
    slide4.addText('Detailed Summary', slideTitleProperties);
    slide4 = this.getDetailedSummaryTable(slide4, treasureHuntResults, settings);

    let slide5 = pptx.addSlide({ masterName: "MASTER_SLIDE" });
    slide5.addText('Carbon Emission Results', slideTitleProperties);
    slide5 = this.getCarbonSummaryTable(slide5, treasureHuntResults.co2EmissionsResults);

    if (this.treasureHuntReportService.getTeamData(opportunityCardsData).length > 0) {
      let slide6 = pptx.addSlide({ masterName: "MASTER_SLIDE" });
      slide6.addText('Team Summary', slideTitleProperties);
      slide6 = this.getTeamSummaryTable(slide6, opportunityCardsData);
    }

    let slide7 = pptx.addSlide({ masterName: "MASTER_SLIDE" });
    slide7.addChart("pie", teamSummaryData, pieChartOptions);
    slide7.addText('Team Summary', slideTitleProperties);

    let slide8 = pptx.addSlide({ masterName: "MASTER_SLIDE" });
    slide8.addText('Opportunity Payback Details', slideTitleProperties);
    slide8 = this.getOppPaybackTable(slide8, opportunitiesPaybackDetails);

    let slide9 = pptx.addSlide({ masterName: "MASTER_SLIDE" });
    slide9.addChart("bar", paybackBarData, barChartOptions);
    slide9.addText('Payback Details', slideTitleProperties);

    let slide10 = pptx.addSlide({ masterName: "MASTER_SLIDE" });
    slide10.addChart("pie", paybackBarData, pieChartOptions);
    slide10.addText('Payback Details', slideTitleProperties);

    let slide11 = pptx.addSlide();
    slide11.background = { data: betterPlantsPPTimg.betterPlantsSectionSlide };
    slide11.addText('Opportunity Summaries', { w: '100%', h: '100%', align: 'center', bold: true, color: 'FFFFFF', fontSize: 68, fontFace: 'Arial (Headings)', valign: 'middle', isTextBox: true, autoFit: true });

    let counter: number = 0;
    opportunityCardsData.forEach(opp => {
      let newSlide = pptx.addSlide({ masterName: "MASTER_SLIDE" });
      newSlide.addText('Opportunity: ' + opp.name, slideTitleProperties);
      let slideText: { text: pptxgen.TextProps[], options: pptxgen.TextPropsOptions } = this.getOpportunitySlideText(opp.opportunitySheet);
      newSlide.addText(slideText.text, slideText.options);
      newSlide.addText('Placeholder for picture', { x: 8.45, y: 1.2, w: 4.43, h: 2.81, align: 'center', fill: { color: 'BDEEFF' }, color: 'BFBFBF', fontSize: 18, fontFace: 'Arial (Body)', valign: 'middle', isTextBox: true, autoFit: true });
      let rows = [];
      rows.push([
        { text: "Utility", options: { color: "FFFFFF", bold: true, fill: { color: '1D428A' } } },
        { text: "Energy Savings", options: { color: "FFFFFF", bold: true, fill: { color: '1D428A' } } },
        { text: "Unit", options: { color: "FFFFFF", bold: true, fill: { color: '1D428A' } } },
        { text: "Cost Saving", options: { color: "FFFFFF", bold: true, fill: { color: '1D428A' } } },
        { text: "Material Cost", options: { color: "FFFFFF", bold: true, fill: { color: '1D428A' } } },
        { text: "Labor Cost", options: { color: "FFFFFF", bold: true, fill: { color: '1D428A' } } },
        { text: "Other Cost", options: { color: "FFFFFF", bold: true, fill: { color: '1D428A' } } },
        { text: "Total Cost", options: { color: "FFFFFF", bold: true, fill: { color: '1D428A' } } },
        { text: "Payback (Years)", options: { color: "FFFFFF", bold: true, fill: { color: '1D428A' } } }
      ]);
      let x: OpportunitySummary = treasureHuntResults.opportunitySummaries[counter];
      let utilityUnit: string;
      if (x.mixedIndividualResults) {
        x.mixedIndividualResults.forEach(x => {
          utilityUnit = this.getUtilityUnit(x.utilityType, settings);
          rows.push([x.utilityType, this.roundValToFormatString(x.totalEnergySavings), utilityUnit, this.roundValToCurrency(x.costSavings), this.roundValToCurrency(x.opportunityCost.material), this.roundValToCurrency(x.opportunityCost.labor), this.getOtherCost(x.opportunityCost), this.roundValToCurrency(x.totalCost), this.roundValToFormatString(x.payback)]);
        });
      } else {
        utilityUnit = this.getUtilityUnit(x.utilityType, settings);
        rows.push([x.utilityType, this.roundValToFormatString(x.totalEnergySavings), utilityUnit, this.roundValToCurrency(x.costSavings), this.roundValToCurrency(x.opportunityCost.material), this.roundValToCurrency(x.opportunityCost.labor), this.getOtherCost(x.opportunityCost), this.roundValToCurrency(x.totalCost), this.roundValToFormatString(x.payback)]);
      }

      newSlide.addTable(rows, { x: 1.14, y: 5.2, w: 11.05, colW: [1.5, 1.5, 0.8, 1.25, 1.25, 1.25, 1.25, 1.25, 1], color: "1D428A", fontSize: 12, fontFace: 'Arial (Body)', border: { type: "solid", color: '1D428A' }, fill: { color: 'BDEEFF' }, align: 'left', valign: 'middle' });
      counter++;
    });

    return pptx;
  }

  roundValToFormatString(num: number): string {
    if (!num) {
      return "-";
    } else {
      return Number(num.toFixed(2)).toLocaleString('en-US');
    }
  }

  returnValAsString(num: number): string {
    if (!num) {
      return "-";
    } else {
      return num.toString();
    }
  }

  roundValToCurrency(num: number): string {
    if (!num) {
      return "-";
    } else {
      let number = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);
      return number;
    }
  }

  getOtherCost(oppCost: OpportunityCost): string {
    let total: number = 0;
    if (oppCost && oppCost.otherCosts && oppCost.otherCosts.length != 0) {
      oppCost.otherCosts.forEach(oCost => {
        total = total + oCost.cost;
      });
    }
    if (oppCost && oppCost.additionalSavings) {
      total = total - oppCost.additionalSavings.cost
    }
    return this.roundValToCurrency(total);
  }

  getUtilityUnit(utilityType: string, settings: Settings): string {
    let utilityUnit: string;
    if (utilityType == 'Electricity') {
      utilityUnit = 'kWh';
    } else if (utilityType == 'Compressed Air') {
      if (settings.unitsOfMeasure == 'Imperial') {
        utilityUnit = 'kSCF';
      } else {
        utilityUnit = 'Nm<sup>3</sup>';
      }
    } else if (utilityType == 'Water' || utilityType == 'Waste Water') {
      if (settings.unitsOfMeasure == 'Imperial') {
        utilityUnit = 'kgal';
      } else {
        utilityUnit = 'm<sup>3</sup>';
      }
    } else if (utilityType == 'Steam') {
      if (settings.unitsOfMeasure == 'Imperial') {
        utilityUnit = 'klb';
      } else {
        utilityUnit = 'tonne';
      }
    } else if (utilityType == 'Natural Gas' || utilityType == 'Other Fuel') {
      if (settings.unitsOfMeasure == 'Imperial') {
        utilityUnit = 'MMBtu';
      } else {
        utilityUnit = 'GJ';
      }
    }
    return utilityUnit;
  }

  getDetailedSummaryTable(slide: pptxgen.Slide, treasureHuntResults: TreasureHuntResults, settings: Settings): pptxgen.Slide {
    let rows = [];
    rows.push([
      { text: "Utility", options: { color: "FFFFFF", bold: true, fill: { color: '1D428A' } } },
      { text: "Unit", options: { color: "FFFFFF", bold: true, fill: { color: '1D428A' } } },
      { text: "Current Use", options: { color: "FFFFFF", bold: true, fill: { color: '1D428A' } } },
      { text: "Projected Use", options: { color: "FFFFFF", bold: true, fill: { color: '1D428A' } } },
      { text: "Utility Savings", options: { color: "FFFFFF", bold: true, fill: { color: '1D428A' } } },
      { text: "Current Cost", options: { color: "FFFFFF", bold: true, fill: { color: '1D428A' } } },
      { text: "Projected Cost", options: { color: "FFFFFF", bold: true, fill: { color: '1D428A' } } },
      { text: "Cost Savings", options: { color: "FFFFFF", bold: true, fill: { color: '1D428A' } } },
      { text: "Implementation Cost", options: { color: "FFFFFF", bold: true, fill: { color: '1D428A' } } },
      { text: "Payback (Years)", options: { color: "FFFFFF", bold: true, fill: { color: '1D428A' } } }
    ]);
    if (treasureHuntResults.electricity.baselineEnergyUsage != 0) {
      let electricity = treasureHuntResults.electricity;
      let fillColor: string = "BDEEFF";
      if (treasureHuntResults.hasMixed && electricity.hasMixed) {
        fillColor = "D0FCBA";
      }
      rows.push([
        { text: "Electricity", options: { bold: true, fill: { color: fillColor } } },
        { text: "kWh", options: { fill: { color: fillColor } } },
        { text: this.roundValToFormatString(electricity.baselineEnergyUsage), options: { fill: { color: fillColor } } },
        { text: this.roundValToFormatString(electricity.modifiedEnergyUsage), options: { fill: { color: fillColor } } },
        { text: this.roundValToFormatString(electricity.energySavings), options: { fill: { color: fillColor } } },
        { text: this.roundValToCurrency(electricity.baselineEnergyCost), options: { fill: { color: fillColor } } },
        { text: this.roundValToCurrency(electricity.modifiedEnergyCost), options: { fill: { color: fillColor } } },
        { text: this.roundValToCurrency(electricity.costSavings), options: { fill: { color: fillColor } } },
        { text: this.roundValToCurrency(electricity.implementationCost), options: { fill: { color: fillColor } } },
        { text: this.roundValToFormatString(electricity.paybackPeriod), options: { fill: { color: fillColor } } }
      ]);
    }
    if (treasureHuntResults.naturalGas.baselineEnergyUsage != 0) {
      let naturalGas = treasureHuntResults.naturalGas;
      let fillColor: string = "BDEEFF";
      if (treasureHuntResults.hasMixed && naturalGas.hasMixed) {
        fillColor = "D0FCBA";
      }
      let utilityUnit: string = this.getUtilityUnit("Natural Gas", settings);
      rows.push([
        { text: "Natural Gas", options: { bold: true, fill: { color: fillColor } } },
        { text: utilityUnit, options: { fill: { color: fillColor } } },
        { text: this.roundValToFormatString(naturalGas.baselineEnergyUsage), options: { fill: { color: fillColor } } },
        { text: this.roundValToFormatString(naturalGas.modifiedEnergyUsage), options: { fill: { color: fillColor } } },
        { text: this.roundValToFormatString(naturalGas.energySavings), options: { fill: { color: fillColor } } },
        { text: this.roundValToCurrency(naturalGas.baselineEnergyCost), options: { fill: { color: fillColor } } },
        { text: this.roundValToCurrency(naturalGas.modifiedEnergyCost), options: { fill: { color: fillColor } } },
        { text: this.roundValToCurrency(naturalGas.costSavings), options: { fill: { color: fillColor } } },
        { text: this.roundValToCurrency(naturalGas.implementationCost), options: { fill: { color: fillColor } } },
        { text: this.roundValToFormatString(naturalGas.paybackPeriod), options: { fill: { color: fillColor } } }
      ]);
    }
    if (treasureHuntResults.water.baselineEnergyUsage != 0) {
      let water = treasureHuntResults.water;
      let fillColor: string = "BDEEFF";
      if (treasureHuntResults.hasMixed && water.hasMixed) {
        fillColor = "D0FCBA";
      }
      let utilityUnit: string = this.getUtilityUnit("Water", settings);
      rows.push([
        { text: "Water", options: { bold: true, fill: { color: fillColor } } },
        { text: utilityUnit, options: { fill: { color: fillColor } } },
        { text: this.roundValToFormatString(water.baselineEnergyUsage), options: { fill: { color: fillColor } } },
        { text: this.roundValToFormatString(water.modifiedEnergyUsage), options: { fill: { color: fillColor } } },
        { text: this.roundValToFormatString(water.energySavings), options: { fill: { color: fillColor } } },
        { text: this.roundValToCurrency(water.baselineEnergyCost), options: { fill: { color: fillColor } } },
        { text: this.roundValToCurrency(water.modifiedEnergyCost), options: { fill: { color: fillColor } } },
        { text: this.roundValToCurrency(water.costSavings), options: { fill: { color: fillColor } } },
        { text: this.roundValToCurrency(water.implementationCost), options: { fill: { color: fillColor } } },
        { text: this.roundValToFormatString(water.paybackPeriod), options: { fill: { color: fillColor } } }
      ]);
    }
    if (treasureHuntResults.wasteWater.baselineEnergyUsage != 0) {
      let wasteWater = treasureHuntResults.wasteWater;
      let fillColor: string = "BDEEFF";
      if (treasureHuntResults.hasMixed && wasteWater.hasMixed) {
        fillColor = "D0FCBA";
      }
      let utilityUnit: string = this.getUtilityUnit("Waste Water", settings);
      rows.push([
        { text: "Wastewater", options: { bold: true, fill: { color: fillColor } } },
        { text: utilityUnit, options: { fill: { color: fillColor } } },
        { text: this.roundValToFormatString(wasteWater.baselineEnergyUsage), options: { fill: { color: fillColor } } },
        { text: this.roundValToFormatString(wasteWater.modifiedEnergyUsage), options: { fill: { color: fillColor } } },
        { text: this.roundValToFormatString(wasteWater.energySavings), options: { fill: { color: fillColor } } },
        { text: this.roundValToCurrency(wasteWater.baselineEnergyCost), options: { fill: { color: fillColor } } },
        { text: this.roundValToCurrency(wasteWater.modifiedEnergyCost), options: { fill: { color: fillColor } } },
        { text: this.roundValToCurrency(wasteWater.costSavings), options: { fill: { color: fillColor } } },
        { text: this.roundValToCurrency(wasteWater.implementationCost), options: { fill: { color: fillColor } } },
        { text: this.roundValToFormatString(wasteWater.paybackPeriod), options: { fill: { color: fillColor } } }
      ]);
    }
    if (treasureHuntResults.otherFuel.baselineEnergyUsage != 0) {
      let otherFuel = treasureHuntResults.otherFuel;
      let fillColor: string = "BDEEFF";
      if (treasureHuntResults.hasMixed && otherFuel.hasMixed) {
        fillColor = "D0FCBA";
      }
      let utilityUnit: string = this.getUtilityUnit("Other Fuel", settings);
      rows.push([
        { text: "Other Fuel", options: { bold: true, fill: { color: fillColor } } },
        { text: utilityUnit, options: { fill: { color: fillColor } } },
        { text: this.roundValToFormatString(otherFuel.baselineEnergyUsage), options: { fill: { color: fillColor } } },
        { text: this.roundValToFormatString(otherFuel.modifiedEnergyUsage), options: { fill: { color: fillColor } } },
        { text: this.roundValToFormatString(otherFuel.energySavings), options: { fill: { color: fillColor } } },
        { text: this.roundValToCurrency(otherFuel.baselineEnergyCost), options: { fill: { color: fillColor } } },
        { text: this.roundValToCurrency(otherFuel.modifiedEnergyCost), options: { fill: { color: fillColor } } },
        { text: this.roundValToCurrency(otherFuel.costSavings), options: { fill: { color: fillColor } } },
        { text: this.roundValToCurrency(otherFuel.implementationCost), options: { fill: { color: fillColor } } },
        { text: this.roundValToFormatString(otherFuel.paybackPeriod), options: { fill: { color: fillColor } } }
      ]);
    }
    if (treasureHuntResults.compressedAir.baselineEnergyUsage != 0) {
      let compressedAir = treasureHuntResults.compressedAir;
      let fillColor: string = "BDEEFF";
      if (treasureHuntResults.hasMixed && compressedAir.hasMixed) {
        fillColor = "D0FCBA";
      }
      let utilityUnit: string = this.getUtilityUnit("Compressed Air", settings);
      rows.push([
        { text: "Compressed Air", options: { bold: true, fill: { color: fillColor } } },
        { text: utilityUnit, options: { fill: { color: fillColor } } },
        { text: this.roundValToFormatString(compressedAir.baselineEnergyUsage), options: { fill: { color: fillColor } } },
        { text: this.roundValToFormatString(compressedAir.modifiedEnergyUsage), options: { fill: { color: fillColor } } },
        { text: this.roundValToFormatString(compressedAir.energySavings), options: { fill: { color: fillColor } } },
        { text: this.roundValToCurrency(compressedAir.baselineEnergyCost), options: { fill: { color: fillColor } } },
        { text: this.roundValToCurrency(compressedAir.modifiedEnergyCost), options: { fill: { color: fillColor } } },
        { text: this.roundValToCurrency(compressedAir.costSavings), options: { fill: { color: fillColor } } },
        { text: this.roundValToCurrency(compressedAir.implementationCost), options: { fill: { color: fillColor } } },
        { text: this.roundValToFormatString(compressedAir.paybackPeriod), options: { fill: { color: fillColor } } }
      ]);
    }
    if (treasureHuntResults.steam.baselineEnergyUsage != 0) {
      let steam = treasureHuntResults.steam;
      let fillColor: string = "BDEEFF";
      if (treasureHuntResults.hasMixed && steam.hasMixed) {
        fillColor = "D0FCBA";
      }
      let utilityUnit: string = this.getUtilityUnit("Steam", settings);
      rows.push([
        { text: "Steam", options: { bold: true, fill: { color: fillColor } } },
        { text: utilityUnit, options: { fill: { color: fillColor } } },
        { text: this.roundValToFormatString(steam.baselineEnergyUsage), options: { fill: { color: fillColor } } },
        { text: this.roundValToFormatString(steam.modifiedEnergyUsage), options: { fill: { color: fillColor } } },
        { text: this.roundValToFormatString(steam.energySavings), options: { fill: { color: fillColor } } },
        { text: this.roundValToCurrency(steam.baselineEnergyCost), options: { fill: { color: fillColor } } },
        { text: this.roundValToCurrency(steam.modifiedEnergyCost), options: { fill: { color: fillColor } } },
        { text: this.roundValToCurrency(steam.costSavings), options: { fill: { color: fillColor } } },
        { text: this.roundValToCurrency(steam.implementationCost), options: { fill: { color: fillColor } } },
        { text: this.roundValToFormatString(steam.paybackPeriod), options: { fill: { color: fillColor } } }
      ]);
    }
    if (treasureHuntResults.other.implementationCost != 0) {
      let other = treasureHuntResults.other;
      let fillColor: string = "BDEEFF";
      if (treasureHuntResults.hasMixed) {
        fillColor = "D0FCBA";
      }
      rows.push([
        { text: "Mixed", options: { bold: true, fill: { color: fillColor } } },
        { text: "", options: { fill: { color: fillColor } } },
        { text: "", options: { fill: { color: fillColor } } },
        { text: "", options: { fill: { color: fillColor } } },
        { text: "", options: { fill: { color: fillColor } } },
        { text: "", options: { fill: { color: fillColor } } },
        { text: "", options: { fill: { color: fillColor } } },
        { text: "", options: { fill: { color: fillColor } } },
        { text: this.roundValToCurrency(other.implementationCost), options: { fill: { color: fillColor } } },
        { text: this.roundValToFormatString(other.paybackPeriod), options: { fill: { color: fillColor } } }
      ]);
    }
    if (treasureHuntResults.totalAdditionalSavings != 0) {
      rows.push([
        { text: "Other", options: { bold: true } },
        "",
        "",
        "",
        "",
        "",
        "",
        this.roundValToCurrency(treasureHuntResults.totalAdditionalSavings),
        "",
        ""
      ]);
    }
    rows.push([
      { text: "Total", options: { bold: true } },
      "",
      "",
      "",
      "",
      this.roundValToCurrency(treasureHuntResults.totalBaselineCost),
      this.roundValToCurrency(treasureHuntResults.totalModificationCost),
      this.roundValToCurrency(treasureHuntResults.totalSavings),
      this.roundValToCurrency(treasureHuntResults.totalImplementationCost),
      this.roundValToFormatString(treasureHuntResults.paybackPeriod)
    ]);

    slide.addTable(rows, { x: 0.12, y: 1.6, w: 13.1, colW: [1.5, 0.8, 1.4, 1.4, 1.4, 1.4, 1.4, 1.4, 1.5, 0.9], color: "1D428A", fontSize: 12, fontFace: 'Arial (Body)', border: { type: "solid", color: '1D428A' }, fill: { color: 'BDEEFF' }, valign: 'middle', align: 'left' });
    if (treasureHuntResults.hasMixed) {
      slide.addText('* * * Savings for opportunities with mixed utilities are under their respective utilities; implementation costs and payback are under "Mixed“ * * *', { x: 1.26, y: 6.58, w: 10.82, h: 0.3, align: 'center', fill: { color: 'D0FCBA' }, color: '1D428A', fontSize: 12, fontFace: 'Arial (Body)', valign: 'middle', isTextBox: true, autoFit: true });
    }
    return slide;
  }

  getCostSummaryTable(slide: pptxgen.Slide, treasureHuntResults: TreasureHuntResults): pptxgen.Slide {
    let rows = [];
    rows.push([
      { text: "Utility", options: { color: "FFFFFF", bold: true, fill: { color: '1D428A' } } },
      { text: "Cost Savings", options: { color: "FFFFFF", bold: true, fill: { color: '1D428A' } } },
      { text: "Implementation Cost", options: { color: "FFFFFF", bold: true, fill: { color: '1D428A' } } },
      { text: "Payback (Years)", options: { color: "FFFFFF", bold: true, fill: { color: '1D428A' } } }
    ]);
    if (treasureHuntResults.electricity.baselineEnergyUsage != 0) {
      let electricity = treasureHuntResults.electricity;
      let fillColor: string = "BDEEFF";
      if (treasureHuntResults.hasMixed && electricity.hasMixed) {
        fillColor = "D0FCBA";
      }
      rows.push([
        { text: "Electricity", options: { bold: true, fill: { color: fillColor } } },
        { text: this.roundValToCurrency(electricity.costSavings), options: { fill: { color: fillColor } } },
        { text: this.roundValToCurrency(electricity.implementationCost), options: { fill: { color: fillColor } } },
        { text: this.roundValToFormatString(electricity.paybackPeriod), options: { fill: { color: fillColor } } }
      ]);
    }
    if (treasureHuntResults.naturalGas.baselineEnergyUsage != 0) {
      let naturalGas = treasureHuntResults.naturalGas;
      let fillColor: string = "BDEEFF";
      if (treasureHuntResults.hasMixed && naturalGas.hasMixed) {
        fillColor = "D0FCBA";
      }
      rows.push([
        { text: "Natural Gas", options: { bold: true, fill: { color: fillColor } } },
        { text: this.roundValToCurrency(naturalGas.costSavings), options: { fill: { color: fillColor } } },
        { text: this.roundValToCurrency(naturalGas.implementationCost), options: { fill: { color: fillColor } } },
        { text: this.roundValToFormatString(naturalGas.paybackPeriod), options: { fill: { color: fillColor } } }
      ]);
    }
    if (treasureHuntResults.water.baselineEnergyUsage != 0) {
      let water = treasureHuntResults.water;
      let fillColor: string = "BDEEFF";
      if (treasureHuntResults.hasMixed && water.hasMixed) {
        fillColor = "D0FCBA";
      }
      rows.push([
        { text: "Water", options: { bold: true, fill: { color: fillColor } } },
        { text: this.roundValToCurrency(water.costSavings), options: { fill: { color: fillColor } } },
        { text: this.roundValToCurrency(water.implementationCost), options: { fill: { color: fillColor } } },
        { text: this.roundValToFormatString(water.paybackPeriod), options: { fill: { color: fillColor } } }
      ]);
    }
    if (treasureHuntResults.wasteWater.baselineEnergyUsage != 0) {
      let wasteWater = treasureHuntResults.wasteWater;
      let fillColor: string = "BDEEFF";
      if (treasureHuntResults.hasMixed && wasteWater.hasMixed) {
        fillColor = "D0FCBA";
      }
      rows.push([
        { text: "Wastewater", options: { bold: true, fill: { color: fillColor } } },
        { text: this.roundValToCurrency(wasteWater.costSavings), options: { fill: { color: fillColor } } },
        { text: this.roundValToCurrency(wasteWater.implementationCost), options: { fill: { color: fillColor } } },
        { text: this.roundValToFormatString(wasteWater.paybackPeriod), options: { fill: { color: fillColor } } }
      ]);
    }
    if (treasureHuntResults.otherFuel.baselineEnergyUsage != 0) {
      let otherFuel = treasureHuntResults.otherFuel;
      let fillColor: string = "BDEEFF";
      if (treasureHuntResults.hasMixed && otherFuel.hasMixed) {
        fillColor = "D0FCBA";
      }
      rows.push([
        { text: "Other Fuel", options: { bold: true, fill: { color: fillColor } } },
        { text: this.roundValToCurrency(otherFuel.costSavings), options: { fill: { color: fillColor } } },
        { text: this.roundValToCurrency(otherFuel.implementationCost), options: { fill: { color: fillColor } } },
        { text: this.roundValToFormatString(otherFuel.paybackPeriod), options: { fill: { color: fillColor } } }
      ]);
    }
    if (treasureHuntResults.compressedAir.baselineEnergyUsage != 0) {
      let compressedAir = treasureHuntResults.compressedAir;
      let fillColor: string = "BDEEFF";
      if (treasureHuntResults.hasMixed && compressedAir.hasMixed) {
        fillColor = "D0FCBA";
      }
      rows.push([
        { text: "Compressed Air", options: { bold: true, fill: { color: fillColor } } },
        { text: this.roundValToCurrency(compressedAir.costSavings), options: { fill: { color: fillColor } } },
        { text: this.roundValToCurrency(compressedAir.implementationCost), options: { fill: { color: fillColor } } },
        { text: this.roundValToFormatString(compressedAir.paybackPeriod), options: { fill: { color: fillColor } } }
      ]);
    }
    if (treasureHuntResults.steam.baselineEnergyUsage != 0) {
      let steam = treasureHuntResults.steam;
      let fillColor: string = "BDEEFF";
      if (treasureHuntResults.hasMixed && steam.hasMixed) {
        fillColor = "D0FCBA";
      }
      rows.push([
        { text: "Steam", options: { bold: true, fill: { color: fillColor } } },
        { text: this.roundValToCurrency(steam.costSavings), options: { fill: { color: fillColor } } },
        { text: this.roundValToCurrency(steam.implementationCost), options: { fill: { color: fillColor } } },
        { text: this.roundValToFormatString(steam.paybackPeriod), options: { fill: { color: fillColor } } }
      ]);
    }
    if (treasureHuntResults.other.implementationCost != 0) {
      let other = treasureHuntResults.other;
      let fillColor: string = "BDEEFF";
      if (treasureHuntResults.hasMixed) {
        fillColor = "D0FCBA";
      }
      rows.push([
        { text: "Mixed", options: { bold: true, fill: { color: fillColor } } },
        { text: "", options: { fill: { color: fillColor } } },
        { text: this.roundValToCurrency(other.implementationCost), options: { fill: { color: fillColor } } },
        { text: this.roundValToFormatString(other.paybackPeriod), options: { fill: { color: fillColor } } }
      ]);
    }
    if (treasureHuntResults.totalAdditionalSavings != 0) {
      rows.push([
        { text: "Other", options: { bold: true } },
        this.roundValToCurrency(treasureHuntResults.totalAdditionalSavings),
        "",
        "",
        ""
      ]);
    }
    rows.push([
      { text: "Total", options: { bold: true } },
      this.roundValToCurrency(treasureHuntResults.totalSavings),
      this.roundValToCurrency(treasureHuntResults.totalImplementationCost),
      this.roundValToFormatString(treasureHuntResults.paybackPeriod),
      ""
    ]);


    slide.addTable(rows, { x: 3.42, y: 1.6, w: 6.5, colW: [1.5, 1.5, 2, 1.5], color: "1D428A", fontSize: 12, fontFace: 'Arial (Body)', border: { type: "solid", color: '1D428A' }, fill: { color: 'BDEEFF' }, align: 'left', valign: "middle" });
    if (treasureHuntResults.hasMixed) {
      slide.addText('* * * Savings for opportunities with mixed utilities are under their respective utilities; implementation costs and payback are under "Mixed“ * * *', { x: 1.26, y: 6.58, w: 10.82, h: 0.3, align: 'center', fill: { color: 'D0FCBA' }, color: '1D428A', fontSize: 12, fontFace: 'Arial (Body)', valign: 'middle', isTextBox: true, autoFit: true });
    }
    return slide;
  }

  getCarbonSummaryTable(slide: pptxgen.Slide, carbonResults: TreasureHuntCo2EmissionsResults): pptxgen.Slide {
    let rows = [];
    rows.push([
      { text: "Utility", options: { color: "FFFFFF", bold: true, fill: { color: '1D428A' } } },
      { text: "Current CO2 Emissions (tonne CO2)", options: { color: "FFFFFF", bold: true, fill: { color: '1D428A' } } },
      { text: "Projected CO2 Emissions (tonne CO2)", options: { color: "FFFFFF", bold: true, fill: { color: '1D428A' } } },
      { text: "CO2 Emission Savings (tonne CO2)", options: { color: "FFFFFF", bold: true, fill: { color: '1D428A' } } }
    ]);
    if (carbonResults.electricityCO2CurrentUse != 0) {
      rows.push([
        { text: "Electricity", options: { bold: true } },
        this.roundValToFormatString(carbonResults.electricityCO2CurrentUse),
        this.roundValToFormatString(carbonResults.electricityCO2ProjectedUse),
        this.roundValToFormatString(carbonResults.electricityCO2Savings)
      ]);
    }
    if (carbonResults.naturalGasCO2CurrentUse != 0) {
      rows.push([
        { text: "Natural Gas", options: { bold: true } },
        this.roundValToFormatString(carbonResults.naturalGasCO2CurrentUse),
        this.roundValToFormatString(carbonResults.naturalGasCO2ProjectedUse),
        this.roundValToFormatString(carbonResults.naturalGasCO2Savings)
      ]);
    }
    if (carbonResults.waterCO2CurrentUse != 0) {
      rows.push([
        { text: "Water", options: { bold: true } },
        this.roundValToFormatString(carbonResults.waterCO2CurrentUse),
        this.roundValToFormatString(carbonResults.waterCO2ProjectedUse),
        this.roundValToFormatString(carbonResults.waterCO2Savings)
      ]);
    }
    if (carbonResults.wasteWaterCO2CurrentUse != 0) {
      rows.push([
        { text: "Wastewater", options: { bold: true } },
        this.roundValToFormatString(carbonResults.wasteWaterCO2CurrentUse),
        this.roundValToFormatString(carbonResults.wasteWaterCO2ProjectedUse),
        this.roundValToFormatString(carbonResults.wasteWaterCO2Savings)
      ]);
    }
    if (carbonResults.otherFuelCO2CurrentUse != 0) {
      rows.push([
        { text: "Other Fuel", options: { bold: true } },
        this.roundValToFormatString(carbonResults.otherFuelCO2CurrentUse),
        this.roundValToFormatString(carbonResults.otherFuelCO2ProjectedUse),
        this.roundValToFormatString(carbonResults.otherFuelCO2Savings)
      ]);
    }
    if (carbonResults.compressedAirCO2CurrentUse != 0) {
      rows.push([
        { text: "Compressed Air", options: { bold: true } },
        this.roundValToFormatString(carbonResults.compressedAirCO2CurrentUse),
        this.roundValToFormatString(carbonResults.compressedAirCO2ProjectedUse),
        this.roundValToFormatString(carbonResults.compressedAirCO2Savings)
      ]);
    }
    if (carbonResults.steamCO2CurrentUse != 0) {
      rows.push([
        { text: "Steam", options: { bold: true } },
        this.roundValToFormatString(carbonResults.steamCO2CurrentUse),
        this.roundValToFormatString(carbonResults.steamCO2ProjectedUse),
        this.roundValToFormatString(carbonResults.steamCO2Savings)
      ]);
    }
    rows.push([
      { text: "Total", options: { bold: true } },
      this.roundValToFormatString(carbonResults.totalCO2CurrentUse),
      this.roundValToFormatString(carbonResults.totalCO2ProjectedUse),
      this.roundValToFormatString(carbonResults.totalCO2Savings)
    ]);

    slide.addTable(rows, { x: 0.97, y: 1.6, w: 11.39, colW: [1.5, 3.27, 3.42, 3.2], color: "1D428A", fontSize: 12, fontFace: 'Arial (Body)', border: { type: "solid", color: '1D428A' }, fill: { color: 'BDEEFF' }, align: "left", valign: "middle" });

    return slide;
  }

  getTeamSummaryTable(slide: pptxgen.Slide, opportunityCardsData: Array<OpportunityCardData>): pptxgen.Slide {
    let teamData = this.treasureHuntReportService.getTeamData(opportunityCardsData);
    let rows = [];
    rows.push([
      { text: "Team", options: { color: "FFFFFF", bold: true, fill: { color: '1D428A' } } },
      { text: "Cost Savings", options: { color: "FFFFFF", bold: true, fill: { color: '1D428A' } } },
      { text: "Implementation Cost", options: { color: "FFFFFF", bold: true, fill: { color: '1D428A' } } },
      { text: "Payback (Years)", options: { color: "FFFFFF", bold: true, fill: { color: '1D428A' } } }
    ]);
    teamData.forEach(data => {
      rows.push([
        data.team,
        this.roundValToCurrency(data.costSavings),
        this.roundValToCurrency(data.implementationCost),
        this.roundValToFormatString(data.paybackPeriod)
      ]);
    });

    slide.addTable(rows, { x: 3.42, y: 1.6, w: 6.5, colW: [1.5, 1.5, 2, 1.5], color: "1D428A", fontSize: 12, fontFace: 'Arial (Body)', border: { type: "solid", color: '1D428A' }, fill: { color: 'BDEEFF' }, align: 'left', valign: 'middle' });

    return slide;
  }

  getOppPaybackTable(slide: pptxgen.Slide, opportunitiesPaybackDetails: OpportunitiesPaybackDetails): pptxgen.Slide {
    let rows = [];
    rows.push([
      { text: "Payback Length", options: { color: "FFFFFF", bold: true, fill: { color: '1D428A' } } },
      { text: "Number of Opportunities", options: { color: "FFFFFF", bold: true, fill: { color: '1D428A' } } },
      { text: "Total Savings", options: { color: "FFFFFF", bold: true, fill: { color: '1D428A' } } }
    ]);
    rows.push([
      "Less than 1 year",
      this.roundValToFormatString(opportunitiesPaybackDetails.lessThanOneYear.numOpportunities),
      this.roundValToCurrency(opportunitiesPaybackDetails.lessThanOneYear.totalSavings)
    ]);
    rows.push([
      "2 to 3 years",
      this.roundValToFormatString(opportunitiesPaybackDetails.twoToThreeYears.numOpportunities),
      this.roundValToCurrency(opportunitiesPaybackDetails.twoToThreeYears.totalSavings)
    ]);
    rows.push([
      "More than 3 years",
      this.roundValToFormatString(opportunitiesPaybackDetails.moreThanThreeYears.numOpportunities),
      this.roundValToCurrency(opportunitiesPaybackDetails.moreThanThreeYears.totalSavings)
    ]);
    rows.push([
      "Total",
      this.roundValToFormatString(opportunitiesPaybackDetails.totals.numOpportunities),
      this.roundValToCurrency(opportunitiesPaybackDetails.totals.totalSavings)
    ]);

    slide.addTable(rows, { x: 3.96, y: 1.6, w: 5.42, colW: [1.6, 2.22, 1.6], color: "1D428A", fontSize: 12, fontFace: 'Arial (Body)', border: { type: "solid", color: '1D428A' }, fill: { color: 'BDEEFF' }, align: 'left', valign: 'middle' });

    return slide;
  }

  getEnergyUtilityTable(slide: pptxgen.Slide, currentEnergyUsage: EnergyUsage, settings: Settings): pptxgen.Slide {
    let rows = [];
    rows.push([
      { text: "Utility", options: { color: "FFFFFF", bold: true, fill: { color: '1D428A' } } },
      { text: "Unit Cost", options: { color: "FFFFFF", bold: true, fill: { color: '1D428A' } } },
      { text: "Annual Consumption", options: { color: "FFFFFF", bold: true, fill: { color: '1D428A' } } },
      { text: "Annual Costs", options: { color: "FFFFFF", bold: true, fill: { color: '1D428A' } } },
      { text: "Total Carbon Emission Output Rate", options: { color: "FFFFFF", bold: true, fill: { color: '1D428A' } } }
    ]);
    if (currentEnergyUsage.electricityUsage) {
      let utilityUnit: string = this.getUtilityUnit("Electricity", settings);
      rows.push([
        "Electricity",
        this.returnValAsString(settings.electricityCost) + " $/" + utilityUnit,
        this.roundValToFormatString(currentEnergyUsage.electricityUsage) + " " + utilityUnit,
        this.roundValToCurrency(currentEnergyUsage.electricityCosts),
        this.roundValToFormatString(currentEnergyUsage.electricityCO2SavingsData.totalEmissionOutputRate) + " kg CO2/" + utilityUnit
      ]);
    }
    if (currentEnergyUsage.naturalGasUsed) {
      let utilityUnit: string = this.getUtilityUnit("Natural Gas", settings);
      rows.push([
        "Natural Gas",
        this.returnValAsString(settings.fuelCost) + " $/" + utilityUnit,
        this.roundValToFormatString(currentEnergyUsage.naturalGasUsage) + " " + utilityUnit,
        this.roundValToCurrency(currentEnergyUsage.naturalGasCosts),
        this.roundValToFormatString(currentEnergyUsage.naturalGasCO2SavingsData.totalEmissionOutputRate) + " kg CO2/" + utilityUnit
      ]);
    }
    if (currentEnergyUsage.otherFuelUsed) {
      let utilityUnit: string = this.getUtilityUnit("Other Fuel", settings);
      rows.push([
        "Other Fuel",
        this.returnValAsString(settings.otherFuelCost) + " $/" + utilityUnit,
        this.roundValToFormatString(currentEnergyUsage.otherFuelUsage) + " " + utilityUnit,
        this.roundValToCurrency(currentEnergyUsage.otherFuelCosts),
        this.roundValToFormatString(currentEnergyUsage.otherFuelCO2SavingsData.totalEmissionOutputRate) + " kg CO2/" + utilityUnit
      ]);
    }
    if (currentEnergyUsage.waterUsed || currentEnergyUsage.wasteWaterUsed) {
      let waterUtilityUnit: string;
      let waterUtilityCostUnit: string;
      if (settings.unitsOfMeasure == 'Imperial') {
        waterUtilityUnit = 'kgal';
        waterUtilityCostUnit = 'gal';
      } else {
        waterUtilityUnit = 'L';
        waterUtilityCostUnit = 'L';
      }
      if (currentEnergyUsage.waterUsed) {
        rows.push([
          "Water",
          this.returnValAsString(settings.waterCost) + " $/" + waterUtilityCostUnit,
          this.roundValToFormatString(currentEnergyUsage.waterUsage) + " " + waterUtilityUnit,
          this.roundValToCurrency(currentEnergyUsage.waterCosts),
          this.roundValToFormatString(currentEnergyUsage.waterCO2OutputRate) + " kg CO2/" + waterUtilityCostUnit
        ]);
      }
      if (currentEnergyUsage.wasteWaterUsed) {
        rows.push([
          "Wastewater",
          this.returnValAsString(settings.waterWasteCost) + " $/" + waterUtilityCostUnit,
          this.roundValToFormatString(currentEnergyUsage.wasteWaterUsage) + " " + waterUtilityUnit,
          this.roundValToCurrency(currentEnergyUsage.wasteWaterCosts),
          this.roundValToFormatString(currentEnergyUsage.wasteWaterCO2OutputRate) + " kg CO2/" + waterUtilityCostUnit
        ]);
      }
    }

    if (currentEnergyUsage.compressedAirUsed) {
      let utilityUnit: string;
      let utilityCostUnit: string;
      if (settings.unitsOfMeasure == 'Imperial') {
        utilityUnit = 'kSCF';
        utilityCostUnit = 'SCF';
      } else {
        utilityUnit = 'm<sup>3</sup>';
        utilityCostUnit = 'm<sup>3</sup>';
      }
      rows.push([
        "Compressed Air",
        this.returnValAsString(settings.compressedAirCost) + " $/" + utilityCostUnit,
        this.roundValToFormatString(currentEnergyUsage.compressedAirUsage) + " " + utilityUnit,
        this.roundValToCurrency(currentEnergyUsage.compressedAirCosts),
        this.roundValToFormatString(currentEnergyUsage.compressedAirCO2OutputRate) + " kg CO2/" + utilityCostUnit
      ]);
    }
    if (currentEnergyUsage.steamUsed) {
      let utilityUnit: string = this.getUtilityUnit("Steam", settings);
      rows.push([
        "Steam",
        this.returnValAsString(settings.steamCost) + " $/" + utilityUnit,
        this.roundValToFormatString(currentEnergyUsage.steamUsage) + " " + utilityUnit,
        this.roundValToCurrency(currentEnergyUsage.steamCosts),
        this.roundValToFormatString(currentEnergyUsage.steamCO2OutputRate) + " kg CO2/" + utilityUnit
      ]);
    }

    slide.addTable(rows, { x: 1.84, y: 1.6, w: 9.95, colW: [1.5, 1.3, 2, 1.75, 3.1], color: "1D428A", fontSize: 12, fontFace: 'Arial (Body)', border: { type: "solid", color: '1D428A' }, fill: { color: 'BDEEFF' }, align: "left", valign: "middle" });

    return slide;
  }

}

export interface PptxgenjsChartData {
  name: string,
  labels: Array<string>,
  values: Array<number>
}