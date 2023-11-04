import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PHAST, Modification } from '../../shared/models/phast/phast';
import { PhastService } from '../phast.service';
import { Subscription } from 'rxjs';
import { SavingsOpportunity } from '../../shared/models/explore-opps';
import { HelperFunctionsService } from '../../shared/helper-services/helper-functions.service';

@Component({
  selector: 'app-add-modification',
  templateUrl: './add-modification.component.html',
  styleUrls: ['./add-modification.component.css']
})
export class AddModificationComponent implements OnInit {
  @Input()
  phast: PHAST;
  @Input()
  modifications: Array<Modification>;
  @Output('save')
  save = new EventEmitter<Modification>();
  @Input()
  modificationExists: boolean;



  newModificationName: string;
  currentTab: string;
  tabSubscription: Subscription;
  constructor(private phastService: PhastService, private helperFunctions: HelperFunctionsService) { }

  ngOnInit() {
    if (this.modifications) {
      this.newModificationName = 'Scenario ' + (this.modifications.length + 1);
    } else {
      this.newModificationName = 'Scenario 1';
    }
    this.tabSubscription = this.phastService.assessmentTab.subscribe(val => {
      this.currentTab = val;
    });
  }

  ngOnDestroy() {
    this.tabSubscription.unsubscribe();
  }

  addModification() {
    let exploreOppsDefault: SavingsOpportunity = { hasOpportunity: false, display: '' };
    let tmpModification: Modification = {
      phast: {
        losses: {},
        name: this.newModificationName,
      },
      id: this.helperFunctions.getNewIdString(),
      notes: {
        chargeNotes: '',
        wallNotes: '',
        atmosphereNotes: '',
        fixtureNotes: '',
        openingNotes: '',
        coolingNotes: '',
        flueGasNotes: '',
        otherNotes: '',
        leakageNotes: '',
        extendedNotes: '',
        slagNotes: '',
        auxiliaryPowerNotes: '',
        exhaustGasNotes: '',
        energyInputExhaustGasNotes: '',
        operationsNotes: ''
      },

      exploreOppsShowFlueGas: exploreOppsDefault,
      exploreOppsShowAirTemp: exploreOppsDefault,
      exploreOppsShowMaterial: exploreOppsDefault,
      exploreOppsShowAllTimeOpen: exploreOppsDefault,
      exploreOppsShowOpening: exploreOppsDefault,
      exploreOppsShowAllEmissivity: exploreOppsDefault,
      exploreOppsShowCooling: exploreOppsDefault,
      exploreOppsShowAtmosphere: exploreOppsDefault,
      exploreOppsShowOperations: exploreOppsDefault,
      exploreOppsShowLeakage: exploreOppsDefault,
      exploreOppsShowSlag: exploreOppsDefault,
      exploreOppsShowEfficiencyData: exploreOppsDefault,
      exploreOppsShowWall: exploreOppsDefault,
      exploreOppsShowAllTemp: exploreOppsDefault,
      exploreOppsShowFixtures: exploreOppsDefault,
    };
    if (this.currentTab === 'explore-opportunities') {
      tmpModification.exploreOpportunities = true;
    }
    if (this.phast.co2SavingsData) {
      tmpModification.phast.co2SavingsData = (JSON.parse(JSON.stringify(this.phast.co2SavingsData)));
    } 
    tmpModification.phast.losses = (JSON.parse(JSON.stringify(this.phast.losses)));
    tmpModification.phast.operatingCosts = (JSON.parse(JSON.stringify(this.phast.operatingCosts)));
    tmpModification.phast.operatingHours = (JSON.parse(JSON.stringify(this.phast.operatingHours)));
    tmpModification.phast.systemEfficiency = (JSON.parse(JSON.stringify(this.phast.systemEfficiency)));
    this.save.emit(tmpModification);
  }
}
