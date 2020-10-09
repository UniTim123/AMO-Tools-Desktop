import { Component, OnInit, Input, ViewChild, ElementRef, SimpleChanges, Renderer2, ChangeDetectorRef } from '@angular/core';
import { Settings } from '../models/settings';
import { FSAT } from '../models/fans';
import { ConvertUnitsService } from '../convert-units/convert-units.service';
import { FsatService } from '../../fsat/fsat.service';
import * as Plotly from "plotly.js";
import { FsatSankeyNode } from '../fsat/sankey.model';
import { DecimalPipe } from '@angular/common';


@Component({
  selector: 'app-fsat-sankey',
  templateUrl: './fsat-sankey.component.html',
  styleUrls: ['./fsat-sankey.component.css']
})
export class FsatSankeyComponent implements OnInit {
  @Input()
  settings: Settings;
  @Input()
  fsat: FSAT;
  @Input()
  isBaseline: boolean;
  @Input()
  appBackground: boolean;

  @ViewChild('ngChart', { static: false }) ngChart: ElementRef;
  energyInput: number;
  motorLosses: number;
  driveLosses: number;
  fanLosses: number;
  usefulOutput: number;

  gradientStartColor: string = 'rgba(214, 185, 0, 1)'; 
  gradientEndColor: string = 'rgba(232, 217, 82, 1)';
  nodeStartColor: string = 'rgba(214, 185, 0, .9)';
  nodeArrowColor: string = 'rgba(232, 217, 82, .9)';
  connectingNodes: Array<number> = [];
  validLosses: boolean;
  connectingLinkPaths: Array<number> = [];

  constructor(private convertUnitsService: ConvertUnitsService, 
              private fsatService: FsatService,
              private _dom: ElementRef,
              private decimalPipe: DecimalPipe,
              private renderer: Renderer2) { }

  ngOnInit() {
    this.getResults();
  }

  ngAfterViewInit() {
    if (this.fsat.valid.isValid) {
      this.sankey();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.fsat) {
      if (!changes.fsat.firstChange) {
        this.getResults();
        if (this.fsat.valid.isValid) {
          this.sankey();
        }
      }
    }
  }

  getResults() {
    this.fsat.valid = this.fsatService.checkValid(this.fsat, this.isBaseline, this.settings);
    let energyInput: number, motorLoss: number, driveLoss: number, fanLoss: number, usefulOutput: number;
    let motorShaftPower: number, fanShaftPower: number;
    let tmpOutput = this.fsatService.getResults(this.fsat, this.isBaseline, this.settings);

    if (this.settings.fanPowerMeasurement === 'hp') {
      motorShaftPower = this.convertUnitsService.value(tmpOutput.motorShaftPower).from('hp').to('kW');
      fanShaftPower = this.convertUnitsService.value(tmpOutput.fanShaftPower).from('hp').to('kW');
      energyInput = tmpOutput.motorPower;
      motorLoss = energyInput - motorShaftPower;
      driveLoss = this.convertUnitsService.value(tmpOutput.motorShaftPower - tmpOutput.fanShaftPower).from('hp').to('kW');
      fanLoss = fanShaftPower * (1 - (tmpOutput.fanEfficiency / 100));
      usefulOutput = fanShaftPower * (tmpOutput.fanEfficiency / 100);
    }
    else {
      motorShaftPower = tmpOutput.motorShaftPower;
      fanShaftPower = tmpOutput.fanShaftPower;
      energyInput = tmpOutput.motorPower;
      motorLoss = tmpOutput.motorPower - tmpOutput.motorShaftPower;
      driveLoss = tmpOutput.motorShaftPower - tmpOutput.fanShaftPower;
      fanLoss = tmpOutput.fanShaftPower * (1 - (tmpOutput.fanEfficiency / 100));
      usefulOutput = tmpOutput.fanShaftPower * (tmpOutput.fanEfficiency / 100);
    }

    this.energyInput = energyInput;
    this.fanLosses = fanLoss;
    this.driveLosses = driveLoss;
    this.motorLosses = motorLoss;
    this.usefulOutput = usefulOutput;

    let invalidLosses = [this.energyInput, this.fanLosses, this.motorLosses].filter(loss => loss <= 0);
    this.validLosses = invalidLosses.length > 0? false : true;
  }
  
  sankey() {
    Plotly.purge(this.ngChart.nativeElement);

    const links: Array<{source: number, target: number}> = [];
    let nodes: Array<FsatSankeyNode> = [];

    nodes = this.buildNodes();
    this.buildLinks(nodes, links);

    const sankeyLink = {
      value: nodes.map(node => node.value),
      source: links.map(link => link.source),
      target: links.map(link => link.target),
      hoverinfo: 'none',
      line: {
        color: this.nodeStartColor,
        width: 0
      },
    };

    const sankeyData = {
      type: "sankey",
      orientation: "h",
      valuesuffix: "%",
      ids: nodes.map(node => node.id),
      textfont: {
        color: 'rgb(0, 0, 0)',
        size: 14
      },
      arrangement: 'freeform',
      node: {
        pad: 50,
        line: {
          color: this.nodeStartColor,
          width: 0
        },
        label: nodes.map(node => node.name),
        x: nodes.map(node => node.x),
        y: nodes.map(node => node.y),
        color: nodes.map(node => node.nodeColor),
        customdata: nodes.map(node => `${this.decimalPipe.transform(node.loss, '1.0-0')} kW`),
        hovertemplate: '%{customdata}',
        hoverlabel: {
          font: {
            size: 14,
            color: 'rgba(255, 255, 255)'
          },
          align: 'auto',
        }
      },
      link: sankeyLink
    };

    const layout = {
      title: "",
      autosize: true,
      font: {
        color: '#ffffff',
        size: 14,
      },
      yaxis: {
        automargin: true,
      },
      xaxis: {
        automargin: true,
      },
      paper_bgcolor: undefined,
      plot_bgcolor: undefined,
      margin: {
        l: 50,
        t: 100,
        pad: 300,
      }
    };

    if (this.appBackground) {
      layout.paper_bgcolor = 'ececec';
      layout.plot_bgcolor = 'ececec';
    }

    const config = {
      modeBarButtonsToRemove: ['select2d', 'lasso2d', 'hoverClosestCartesian', 'hoverCompareCartesian' ],
      responsive: true
    };

    Plotly.newPlot(this.ngChart.nativeElement, [sankeyData], layout, config);
    this.addGradientElement();
    this.buildSvgArrows();

  }

  buildLinks(nodes, links) {
    this.connectingLinkPaths.push(0);
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].isConnector) {
        this.connectingNodes.push(i);
        if (i !== 0 && i - 1 !== 0) {
          this.connectingLinkPaths.push(i - 1);
        }
      }
      for (let j = 0; j < nodes[i].target.length; j++) {
        links.push(
          {
            source: nodes[i].source,
            target: nodes[i].target[j]
          }
        )
      }
    }
  }

  buildNodes(): Array<FsatSankeyNode> {
    let nodes: Array<FsatSankeyNode> = [];
    let motorConnectorValue = this.energyInput - this.motorLosses;
    let driveConnectorValue: number = 0;
    let usefulOutput: number = 0;

    if (this.driveLosses > 0 ) {
      driveConnectorValue = motorConnectorValue - this.driveLosses;
      usefulOutput = driveConnectorValue - this.fanLosses;
    } else {
      usefulOutput = motorConnectorValue - this.fanLosses;
    }
    
    nodes.push(
      {
        name: 'Energy Input ' + this.decimalPipe.transform(this.energyInput, '1.0-0') + ' kW',
        value: 100,
        loss: this.energyInput,
        x: .1,
        y: .6,
        source: 0,
        target: [1, 2], 
        nodeColor: this.nodeStartColor,
        id: 'OriginConnector',
        isConnector: true,
      },
      {
        name: ``,
        value: 0,
        loss: this.energyInput,
        x: .4,
        y: .6, 
        source: 1,
        target: [2, 3], 
        isConnector: true,
        nodeColor: this.nodeStartColor,
        id: 'InputConnector'
      },
      {
        name: ``,
        value: (motorConnectorValue / this.energyInput) * 100,
        loss: motorConnectorValue,
        x: .5,
        y: .6, 
        source: 2,
        target: [4, 5], 
        isConnector: true,
        nodeColor: this.nodeStartColor,
        id: 'motorConnector'
      },
      {
        name: 'Motor Losses ' + this.decimalPipe.transform(this.motorLosses, '1.0-0') + ' kW',
        value: (this.motorLosses / this.energyInput) * 100,
        loss: this.motorLosses,
        x: .5,
        y: .10, 
        source: 3,
        target: [], 
        isConnector: false,
        nodeColor: this.nodeArrowColor,
        id: 'motorLosses'
      },
    );
    if (this.driveLosses > 0) {
      nodes.push(
        {
          name: 'Drive Losses ' + this.decimalPipe.transform(this.driveLosses, '1.0-0') + ' kW',
          value: (this.driveLosses / this.energyInput) * 100,
          loss: this.driveLosses,
          x: .6,
          y: .25,
          source: 4,
          target: [], 
          isConnector: false,
          nodeColor: this.nodeArrowColor,
          id: 'driveLosses'
        },
        {
          name: "",
          value: (driveConnectorValue / this.energyInput) * 100,
          loss: driveConnectorValue,
          x: .7,
          y: .6, 
          source: 5,
          target: [6, 7], 
          isConnector: true,
          nodeColor: this.nodeStartColor,
          id: 'driveConnector'
        },
      );
    }
    nodes.push(
      {
        name: 'Fan Losses ' + this.decimalPipe.transform(this.fanLosses, '1.0-0') + ' kW',
        value: (this.fanLosses / this.energyInput) * 100,
        loss: this.fanLosses,
        x: .8,
        y: .15, 
        nodeColor: this.nodeArrowColor,
        isConnector: false,
        source: this.driveLosses > 0 ? 6 : 4,
        target: [],
        id: 'fanLosses'
      },
      {
        name: 'Useful Output ' + this.decimalPipe.transform(usefulOutput, '1.0-0') + ' kW',
        value: (usefulOutput / this.energyInput) * 100,
        loss: usefulOutput,
        x: .85,
        y: .65, 
        source: this.driveLosses > 0 ? 7 : 5,
        target: [],
        isConnector: false,
        nodeColor: this.nodeArrowColor,
        id: 'usefulOutput'
      }
    );
    
    return nodes;
  }

  buildSvgArrows() {
    const rects = this._dom.nativeElement.querySelectorAll('.node-rect');
    const arrowOpacity = '1';
    const arrowShape = 'polygon(100% 50%, 0 0, 0 100%)'

    for (let i = 0; i < rects.length; i++) {  
       if (!this.connectingNodes.includes(i)) {
         const height = rects[i].getAttribute('height');
         const defaultY = rects[i].getAttribute('y');

         rects[i].setAttribute('y', `${defaultY - (height / 2.75)}`);
         rects[i].setAttribute('style', `width: ${height}px; height: ${height * 1.75}px; clip-path:  ${arrowShape}; 
         stroke-width: 0.5; stroke: rgb(255, 255, 255); stroke-opacity: 0.5; fill: ${this.gradientEndColor}; fill-opacity: ${arrowOpacity};`);
        }
    }
  }

  addGradientElement() {
    const mainSVG = this._dom.nativeElement.querySelector('.main-svg')
    const svgDefs = this._dom.nativeElement.querySelector('defs')

    svgDefs.innerHTML = `
    <linearGradient id="fsatLinkGradient">
      <stop offset="10%" stop-color="${this.gradientStartColor}" />
      <stop offset="100%" stop-color="${this.gradientEndColor}" />
    </linearGradient>
    `
    // Insert our gradient Def
    this.renderer.appendChild(mainSVG, svgDefs);
  }

}