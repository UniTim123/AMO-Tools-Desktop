import { Injectable } from '@angular/core';
import { VisualizeService } from '../visualize.service';
import { GraphObj, LogToolField, AnnotationData } from '../../log-tool-models';
import { LogToolDataService } from '../../log-tool-data.service';
import { graphColors } from '../../../phast/phast-report/report-graphs/graphColors';
import * as _ from 'lodash';
@Injectable()
export class VisualizeMenuService {

  constructor(private visualizeService: VisualizeService, private logToolDataService: LogToolDataService) { }

  save(selectedGraphObj: GraphObj) {
    this.visualizeService.selectedGraphObj.next(selectedGraphObj);
  }

  setGraphType(selectedGraphObj: GraphObj) {
    if (selectedGraphObj.data[0].type == 'scattergl') {
      this.setScatterPlotType(selectedGraphObj);
    } else if (selectedGraphObj.data[0].type == 'bar') {
      this.setBarChartType(selectedGraphObj);
    }
  }

  setScatterPlotType(selectedGraphObj: GraphObj) {
    this.setXAxisDataOptions(selectedGraphObj);
    if (selectedGraphObj.selectedXAxisDataOption && selectedGraphObj.selectedXAxisDataOption.dataField) {
      //check still exists after updating x axis options
      let testOptionExists = selectedGraphObj.xAxisDataOptions.find(option => { return selectedGraphObj.selectedXAxisDataOption.dataField.fieldName == option.dataField.fieldName });
      if (testOptionExists) {
        selectedGraphObj.selectedXAxisDataOption = testOptionExists;
      } else {
        selectedGraphObj.selectedXAxisDataOption = selectedGraphObj.xAxisDataOptions[0];
      }
    } else {
      selectedGraphObj.selectedXAxisDataOption = selectedGraphObj.xAxisDataOptions[0];
    }
    this.setXAxisDataOption(selectedGraphObj);
    this.setYAxisDataOptions(selectedGraphObj);
    let tmpSelectedYAxisDataOptions = new Array();
    selectedGraphObj.selectedYAxisDataOptions.forEach(option => {
      if (option.dataOption) {
        //check still exists after updating y axis options
        let testOptionExists = selectedGraphObj.yAxisDataOptions.find(yAxisOption => { return yAxisOption.dataField.fieldName == option.dataOption.dataField.fieldName });
        if (testOptionExists) {
          //set to current option value for data binding
          option.dataOption = testOptionExists;
          tmpSelectedYAxisDataOptions.push(option);
        }
      }
    });
    if (tmpSelectedYAxisDataOptions.length != 0) {
      selectedGraphObj.selectedYAxisDataOptions = tmpSelectedYAxisDataOptions;
    } else {
      this.setDefaultYAxisDataOptions(selectedGraphObj);
    }
    this.setYAxisData(selectedGraphObj);
  }

  setDefaultYAxisDataOptions(selectedGraphObj: GraphObj) {
    selectedGraphObj.selectedYAxisDataOptions = [{ index: 0, dataOption: selectedGraphObj.yAxisDataOptions[0], seriesColor: graphColors[0], seriesName: 'Series 1', yaxis: 'y', linesOrMarkers: 'markers' }];
  }

  setTimeSeriesData(selectedGraphObj: GraphObj) {
    let index: number = 0;
    selectedGraphObj.selectedYAxisDataOptions.forEach(option => {
      let timeData: Array<string | number> = this.visualizeService.getVisualizeDateData(option.dataOption.dataField);
      //if found set time data
      if (timeData) {
        selectedGraphObj.data[index].x = timeData;
      } else {
        //delete if no time data
        selectedGraphObj.data.splice(index, 1);
        selectedGraphObj.selectedYAxisDataOptions.splice(index, 1);
      }
      index++;
    });
    this.save(selectedGraphObj);
  }


  setXAxisDataOptions(selectedGraphObj: GraphObj) {
    let dataFields: Array<LogToolField> = this.logToolDataService.getDataFieldOptions();
    let testTimeSeries = dataFields.find(dataField => { return dataField.isDateField });
    if (selectedGraphObj.data[0].type == 'scattergl' && testTimeSeries != undefined) {
      dataFields.push({
        fieldName: 'Time Series',
        alias: 'Time Series',
        useField: true,
        isDateField: true,
        unit: 'time',
        invalidField: false,
        csvId: undefined
      })
    }
    selectedGraphObj.xAxisDataOptions = new Array();
    dataFields.forEach(field => {
      let data = this.visualizeService.getVisualizeData(field.fieldName);
      selectedGraphObj.xAxisDataOptions.push({
        data: data,
        dataField: field
      })
    });
  }


  setXAxisDataOption(selectedGraphObj: GraphObj) {
    selectedGraphObj.layout.annotations = [];
    if (selectedGraphObj.selectedXAxisDataOption.dataField.fieldName == 'Time Series') {
      selectedGraphObj.layout.xaxis.type = 'date';
      this.setYAxisDataOptions(selectedGraphObj);
      this.setTimeSeriesData(selectedGraphObj);
    } else if (selectedGraphObj.data[0].type == 'bar') {
      selectedGraphObj.layout.xaxis.type = 'category';
      this.setYAxisDataOptions(selectedGraphObj);
      this.setBarHistogramData(selectedGraphObj);
    } else {
      selectedGraphObj.layout.xaxis.type = 'linear';
      selectedGraphObj.data[0].x = selectedGraphObj.selectedXAxisDataOption.data;
      this.setYAxisDataOptions(selectedGraphObj);
      this.setYAxisData(selectedGraphObj);
    }
  }

  setBarChartType(selectedGraphObj: GraphObj) {
    selectedGraphObj.layout.xaxis.type = 'category';
    this.setXAxisDataOptions(selectedGraphObj);
    if (selectedGraphObj.selectedXAxisDataOption && selectedGraphObj.selectedXAxisDataOption.dataField) {
      //check still exists
      let testExists = selectedGraphObj.xAxisDataOptions.find(option => { return selectedGraphObj.selectedXAxisDataOption.dataField.fieldName == option.dataField.fieldName });
      if (testExists) {
        selectedGraphObj.selectedXAxisDataOption = testExists;
      } else {
        selectedGraphObj.selectedXAxisDataOption = selectedGraphObj.xAxisDataOptions[0];
      }
    } else {
      selectedGraphObj.selectedXAxisDataOption = selectedGraphObj.xAxisDataOptions[0];
    }
    this.setBarHistogramData(selectedGraphObj);
  }

  setBarHistogramData(selectedGraphObj: GraphObj) {
    if (selectedGraphObj.useStandardDeviation == true) {
      //get std deviation
      let stdDeviationBarData = this.visualizeService.getStandardDevBarChartData(selectedGraphObj.selectedXAxisDataOption.dataField);
      //set data
      selectedGraphObj.data[0].x = stdDeviationBarData.xLabels;
      selectedGraphObj.data[0].y = stdDeviationBarData.yValues;
    } else {
      //get num bins data
      let binsData = this.visualizeService.getNumberOfBinsBarChartData(selectedGraphObj.selectedXAxisDataOption.dataField, selectedGraphObj.numberOfBins);
      selectedGraphObj.data[0].x = binsData.xLabels;
      selectedGraphObj.data[0].y = binsData.yValues;
    }
    //set to first value for bar charts
    selectedGraphObj.data = [selectedGraphObj.data[0]];
    selectedGraphObj.selectedYAxisDataOptions = [selectedGraphObj.selectedYAxisDataOptions[0]];
    this.save(selectedGraphObj);
  }

  setYAxisDataOptions(selectedGraphObj: GraphObj) {
    let dataFields: Array<LogToolField> = this.logToolDataService.getDataFieldOptions();
    selectedGraphObj.yAxisDataOptions = new Array();
    dataFields.forEach(field => {
      //check can add
      //bar doesn't matter
      //time series, only with time data
      if (selectedGraphObj.selectedXAxisDataOption.dataField.fieldName == 'Time Series') {
        //if time data exists add
        let timeData: Array<string | number> = this.visualizeService.getVisualizeDateData(field);
        if (timeData) {
          let data = this.visualizeService.getVisualizeData(field.fieldName);
          selectedGraphObj.yAxisDataOptions.push({
            data: data,
            dataField: field
          });
        }
      }
      //scatter add with corresponding csv options
      else if (selectedGraphObj.data[0].type == 'scattergl' && selectedGraphObj.selectedXAxisDataOption.dataField.csvId == field.csvId) {
        let data = this.visualizeService.getVisualizeData(field.fieldName);
        selectedGraphObj.yAxisDataOptions.push({
          data: data,
          dataField: field
        });
      }
    });
  }

  setYAxisData(selectedGraphObj: GraphObj) {
    let index: number = 0;
    selectedGraphObj.selectedYAxisDataOptions.forEach(selectedDataOption => {
      if (selectedGraphObj.selectedXAxisDataOption.dataField.fieldName == 'Time Series') {
        let timeData: Array<string | number> = this.visualizeService.getVisualizeDateData(selectedDataOption.dataOption.dataField);
        if (timeData) {
          selectedGraphObj.data[index].x = timeData;
        }
      } else if (selectedDataOption.dataOption.dataField.csvId != selectedGraphObj.selectedXAxisDataOption.dataField.csvId) {
        selectedDataOption.dataOption = selectedGraphObj.yAxisDataOptions[0]
        selectedDataOption.seriesName = 'Series ' + (index + 1);
      }
      selectedGraphObj.data[index].y = selectedDataOption.dataOption.data;
      selectedGraphObj.data[index].name = selectedDataOption.seriesName;
      selectedGraphObj.data[index].marker.color = selectedDataOption.seriesColor;
      selectedGraphObj.data[index].line.color = selectedDataOption.seriesColor;
      selectedGraphObj.data[index].yaxis = selectedDataOption.yaxis;
      selectedGraphObj.data[index].mode = selectedDataOption.linesOrMarkers;
      index++;
    })
    this.save(selectedGraphObj);
  }

  addAxis(selectedGraphObj: GraphObj) {
    selectedGraphObj.hasSecondYAxis = true;
    this.save(selectedGraphObj);
  }

  removeAxis(selectedGraphObj: GraphObj) {
    selectedGraphObj.hasSecondYAxis = false;
    selectedGraphObj.selectedYAxisDataOptions.forEach(option => {
      option.yaxis = 'y';
    });
    this.setYAxisData(selectedGraphObj);
  }

  addData(selectedGraphObj: GraphObj) {
    let dataOption = selectedGraphObj.yAxisDataOptions.find(dataOption => { return dataOption.dataField.fieldName == selectedGraphObj.selectedYAxisDataOptions[0].dataOption.dataField.fieldName });
    selectedGraphObj.selectedYAxisDataOptions.push({
      index: selectedGraphObj.selectedYAxisDataOptions.length,
      dataOption: dataOption,
      seriesName: 'Series ' + (selectedGraphObj.selectedYAxisDataOptions.length + 1),
      seriesColor: graphColors[selectedGraphObj.selectedYAxisDataOptions.length],
      yaxis: 'y',
      linesOrMarkers: selectedGraphObj.data[0].mode
    });
    selectedGraphObj.data.push(JSON.parse(JSON.stringify(selectedGraphObj.data[0])));
    this.setYAxisData(selectedGraphObj);
  }

  removeYAxisData(index: number, selectedGraphObj: GraphObj) {
    selectedGraphObj.selectedYAxisDataOptions.splice(index, 1);
    selectedGraphObj.data.splice(index, 1);
    if (selectedGraphObj.data.length == 1 && selectedGraphObj.hasSecondYAxis == true) {
      this.removeAxis(selectedGraphObj);
    } else {
      this.setYAxisData(selectedGraphObj);
    }
  }

  setAnnotation(annotateDataPoint: AnnotationData, selectedGraphObj: GraphObj) {
    if (!selectedGraphObj.layout.annotations && annotateDataPoint.text) {
      selectedGraphObj.layout.annotations = [annotateDataPoint];
    } else {
      let testExistIndex: number = selectedGraphObj.layout.annotations.findIndex(annotation => { return annotation.annotationId == annotateDataPoint.annotationId });
      if (testExistIndex != -1) {
        if (annotateDataPoint.text) {
          selectedGraphObj.layout.annotations[testExistIndex] = annotateDataPoint;
        } else {
          this.deleteAnnotation(annotateDataPoint, selectedGraphObj);
        }
      } else if (annotateDataPoint.text) {
        selectedGraphObj.layout.annotations.push(annotateDataPoint);
      }
    }
    this.save(selectedGraphObj);
  }

  deleteAnnotation(annotation: AnnotationData, selectedGraphObj: GraphObj) {
    _.remove(selectedGraphObj.layout.annotations, (currentAnnotation) => { return currentAnnotation.annotationId == annotation.annotationId });
    this.save(selectedGraphObj);
  }
}
