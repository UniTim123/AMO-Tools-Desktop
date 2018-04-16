import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DirectoryDbRef, Directory } from '../shared/models/directory';
import { IndexedDbService } from '../indexedDb/indexed-db.service';
import { ModalDirective } from 'ngx-bootstrap';
import * as _ from 'lodash';
import { Settings } from '../shared/models/settings';
import { AssessmentService } from '../assessment/assessment.service';
import { JsonToCsvService } from '../shared/json-to-csv/json-to-csv.service';
import { Assessment } from '../shared/models/assessment';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';
import { SuiteDbService } from '../suiteDb/suite-db.service';
import { WindowRefService } from '../indexedDb/window-ref.service';
import { ImportExportService } from '../shared/import-export/import-export.service';
import { WallLossesSurface, GasLoadChargeMaterial, LiquidLoadChargeMaterial, SolidLoadChargeMaterial, AtmosphereSpecificHeat, FlueGasMaterial, SolidLiquidFlueGasMaterial } from '../shared/models/materials';
import { ReportRollupService } from '../report-rollup/report-rollup.service';
import { SettingsService } from '../settings/settings.service';
import { Calculator } from '../shared/models/calculators';
import { DashboardService } from './dashboard.service';
import { Subscription } from 'rxjs';
declare const packageJson;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  allDirectories: Directory;
  workingDirectory: Directory;
  selectedCalculator: string;
  isFirstChange: boolean = true;
  rootDirectoryRef: DirectoryDbRef;
  view: string;

  showLandingScreen: boolean;

  newDirEventToggle: boolean = false;
  dashboardView: string = 'landing-screen';
  goCalcHome: boolean = false;
  @ViewChild('deleteModal') public deleteModal: ModalDirective;
  @ViewChild('deleteItemsModal') public deleteItemsModal: ModalDirective;
  @ViewChild('exportModal') public exportModal: ModalDirective;
  @ViewChild('importModal') public importModal: ModalDirective;
  @ViewChild('preAssessmentModal') public preAssessmentModal: ModalDirective;

  importInProgress: boolean = false;
  isExportView: boolean = false;
  isImportView: boolean = false;
  importing: any;
  // reportAssessments: Array<any>;
  selectedItems: Array<any>;
  showImportExport: boolean;
  deleting: boolean;
  suiteDbInit: boolean = false;
  isModalOpen: boolean = false;
  createAssessment: boolean = false;
  showPreAssessment: boolean = false;
  workingDirectorySettings: Settings;
  workingDirectoryCalculator: Calculator;
  calcDataExists: boolean = false;
  dontShowSub: Subscription;
  tutorialShown: boolean = false;
  createAssessmentSub: Subscription;
  constructor(private indexedDbService: IndexedDbService, private formBuilder: FormBuilder, private assessmentService: AssessmentService, private toastyService: ToastyService,
    private toastyConfig: ToastyConfig, private jsonToCsvService: JsonToCsvService, private suiteDbService: SuiteDbService, private importExportService: ImportExportService,
    private reportRollupService: ReportRollupService, private settingsService: SettingsService, private dashboardService: DashboardService) {
    this.toastyConfig.theme = 'bootstrap';
    this.toastyConfig.position = 'bottom-right';
    this.toastyConfig.limit = 1;
  }

  ngOnInit() {
    // this.importExportService.test();
    //start toolts suite database if it has not started
    this.initData();

    this.createAssessmentSub = this.assessmentService.createAssessment.subscribe(val => {
      this.createAssessment = val;
    })
    if (this.settingsService.globalSettings) {
      if (!this.settingsService.globalSettings.disableTutorial) {
        this.dontShowSub = this.settingsService.setDontShow.subscribe(val => {
          if (this.settingsService.globalSettings) {
            this.settingsService.globalSettings.disableTutorial = val;
            this.indexedDbService.putSettings(this.settingsService.globalSettings);
          }
        })
      }
    } else {
      this.dontShowSub = this.settingsService.setDontShow.subscribe(val => {
        if (this.settingsService.globalSettings) {
          this.settingsService.globalSettings.disableTutorial = val;
          this.indexedDbService.putSettings(this.settingsService.globalSettings);
        }
      })
    }
  }

  ngOnDestroy() {
    this.assessmentService.createAssessment.next(false);
    this.createAssessmentSub.unsubscribe();
    if (this.dontShowSub) this.dontShowSub.unsubscribe();
  }

  ngAfterViewInit() {
  }

  initData() {
    if (this.suiteDbService.hasStarted == false) {
      this.suiteDbService.startup();
    }
    this.selectedItems = new Array();
    this.showLandingScreen = this.assessmentService.getLandingScreen();
    //open DB and get directories
    if (this.indexedDbService.db == undefined) {
      this.indexedDbService.db = this.indexedDbService.initDb().then(
        results => {
          this.getData();
          if (this.suiteDbService.hasStarted == true && this.indexedDbService.initCustomObjects == true) {
            this.initCustomDbMaterials();
          }
        }
      )
    } else {
      this.getData();
    }
  }

  initCustomDbMaterials() {
    //this.suiteDbService.test();
    this.indexedDbService.getAllGasLoadChargeMaterial().then(results => {
      let customGasLoadChargeMaterials: GasLoadChargeMaterial[] = results;
      customGasLoadChargeMaterials.forEach(material => {
        let suiteResult = this.suiteDbService.insertGasLoadChargeMaterial(material);
      })
    })
    this.indexedDbService.getAllLiquidLoadChargeMaterial().then(results => {
      let customLiquidLoadChargeMaterials: LiquidLoadChargeMaterial[] = results;
      customLiquidLoadChargeMaterials.forEach(material => {
        let suiteResult = this.suiteDbService.insertLiquidLoadChargeMaterial(material);
      })
    })
    this.indexedDbService.getAllSolidLoadChargeMaterial().then(results => {
      let customLiquidLoadChargeMaterials: SolidLoadChargeMaterial[] = results;
      customLiquidLoadChargeMaterials.forEach(material => {
        let suiteResult = this.suiteDbService.insertSolidLoadChargeMaterial(material);
      })
    })
    this.indexedDbService.getAtmosphereSpecificHeat().then(results => {
      let customAtmosphereSpecificHeatMaterials: AtmosphereSpecificHeat[] = results;
      customAtmosphereSpecificHeatMaterials.forEach(material => {
        let suiteResult = this.suiteDbService.insertAtmosphereSpecificHeat(material);
      })
    })
    this.indexedDbService.getWallLossesSurface().then(results => {
      let customWallLossesSurfaces: WallLossesSurface[] = results;
      customWallLossesSurfaces.forEach(material => {
        let suiteResult = this.suiteDbService.insertWallLossesSurface(material);
      })
    })
    this.indexedDbService.getFlueGasMaterials().then(results => {
      let customFluesGasses: FlueGasMaterial[] = results;
      customFluesGasses.forEach(material => {
        let suiteResult = this.suiteDbService.insertGasFlueGasMaterial(material);
      })
    })
    this.indexedDbService.getSolidLiquidFlueGasMaterials().then(results => {
      let customSolidLiquidFlueGasses: SolidLiquidFlueGasMaterial[] = results;
      customSolidLiquidFlueGasses.forEach(material => {
        let suiteResult = this.suiteDbService.insertSolidLiquidFlueGasMaterial(material);
      })
    })
  }

  getWorkingDirectoryData() {
    this.indexedDbService.getDirectorySettings(this.workingDirectory.id).then(results => {
      if (results.length != 0) {
        this.workingDirectorySettings = results[0];
      }
    })

    this.indexedDbService.getDirectoryCalculator(this.workingDirectory.id).then(results => {
      if (results.length != 0) {
        this.workingDirectoryCalculator = results[0];
        this.calcDataExists = true;
      } else {
        this.workingDirectoryCalculator = {
          directoryId: this.workingDirectory.id
        }
        this.calcDataExists = false;
      }
    })
  }

  addCalculatorData(calcualtorData: Calculator) {
    if (this.calcDataExists) {
      this.indexedDbService.putCalculator(calcualtorData).then(() => {
        this.hidePreAssessmentModal();
        this.getWorkingDirectoryData();
      });
    } else {
      calcualtorData.directoryId = this.workingDirectory.id;
      calcualtorData.name = this.workingDirectory.name + ' Pre-Assessment';
      this.indexedDbService.addCalculator(calcualtorData).then(() => {
        this.hidePreAssessmentModal();
        this.getWorkingDirectoryData();
      });;
    }
  }

  getData() {
    this.indexedDbService.getDirectory(1).then(
      results => {
        if (results) {
          this.rootDirectoryRef = results;
          this.allDirectories = this.populateDirectories(results);
          this.workingDirectory = this.allDirectories
          this.getWorkingDirectoryData();
        } else {
          this.dashboardService.createExamples();
          this.createDirectory();
        }
      })
    this.indexedDbService.getDirectorySettings(1).then(
      results => {
        if (results.length == 0) {
          this.dashboardService.createDirectorySettings();
          if (!this.tutorialShown) {
            this.assessmentService.openingTutorial.next(true);
            this.tutorialShown = true;
          }
        } else {
          this.settingsService.globalSettings = results[0];
          if (!this.tutorialShown) {
            if (!this.settingsService.globalSettings.disableTutorial) {
              this.assessmentService.openingTutorial.next(true);
              this.tutorialShown = true;
            }
          }
        }
      }
    );
  }
  openModal($event) {
    this.isModalOpen = $event;
  }

  hideScreen() {
    this.dashboardView = 'assessment-dashboard';
  }

  showPreAssessmentModal() {
    this.showPreAssessment = true;
    this.preAssessmentModal.show();
  }

  hidePreAssessmentModal() {
    this.showPreAssessment = false;
    this.preAssessmentModal.hide();
  }

  getAllDirectories() {
    return this.allDirectories;
  }

  getWorkingDirectory() {
    return this.workingDirectory;
  }

  goHome() {
    this.selectedCalculator = '';
    this.dashboardView = 'landing-screen';
  }

  showAbout() {
    this.selectedCalculator = '';
    this.dashboardView = 'about-page';
  }

  showAcknowledgments() {
    this.selectedCalculator = '';
    this.dashboardView = 'acknowledgments-page';
  }

  showTutorials() {
    this.selectedCalculator = '';
    this.dashboardView = 'tutorials';
  }

  showSettings() {
    this.selectedCalculator = '';
    this.dashboardView = 'settings';
  }

  showContact() {
    this.selectedCalculator = '';
    this.dashboardView = 'contact';
  }

  populateDirectories(directoryRef: DirectoryDbRef): Directory {
    let tmpDirectory: Directory = {
      name: directoryRef.name,
      createdDate: directoryRef.createdDate,
      modifiedDate: directoryRef.modifiedDate,
      id: directoryRef.id,
      collapsed: false,
      parentDirectoryId: directoryRef.parentDirectoryId
    }
    this.indexedDbService.getDirectoryAssessments(directoryRef.id).then(
      results => {
        tmpDirectory.assessments = results;
      }
    );

    this.indexedDbService.getChildrenDirectories(directoryRef.id).then(
      results => {
        tmpDirectory.subDirectory = results;
      }
    )
    return tmpDirectory;
  }

  changeWorkingDirectory(directory: Directory) {
    this.dashboardView = 'assessment-dashboard';
    this.indexedDbService.getDirectory(directory.id).then(
      results => {
        if (results) {
          this.workingDirectory = this.populateDirectories(results);
          this.getWorkingDirectoryData();
        }
      })
  }

  viewCalculator(str: string) {
    this.goCalcHome = !this.goCalcHome;
    this.dashboardView = 'calculator';
    this.selectedCalculator = str;
  }

  createDirectory() {
    let tmpDirectory: DirectoryDbRef = {
      name: 'All Assessments',
      createdDate: new Date(),
      modifiedDate: new Date(),
      parentDirectoryId: null,
    }
    this.indexedDbService.addDirectory(tmpDirectory).then(
      results => {
        tmpDirectory.parentDirectoryId = results;
        tmpDirectory.name = 'Examples';
        this.indexedDbService.addDirectory(tmpDirectory);
        this.indexedDbService.getDirectory(results).then(result => {
          this.rootDirectoryRef = results;
          this.allDirectories = this.populateDirectories(result);
          this.workingDirectory = this.allDirectories;
        })
      }
    )
  }

  newDir() {
    this.allDirectories = this.populateDirectories(this.rootDirectoryRef);
    this.workingDirectory = this.populateDirectories(this.workingDirectory);
    this.newDirEventToggle = !this.newDirEventToggle;
  }

  showDeleteModal() {
    this.deleting = false;
    this.deleteModal.show();
  }

  hideDeleteModal() {
    this.deleteModal.hide();
    this.deleteModal.onHidden.subscribe(() => {
      this.deleting = false;
    })
  }

  showDeleteItemsModal() {
    if (this.checkSelected()) {
      this.deleteItemsModal.show();
    } else {
      this.addToast('No items have been selected');
    }
  }

  hideDeleteItemsModal() {
    this.deleteItemsModal.hide();
  }

  showExportModal() {
    this.isExportView = true;
    this.isImportView = false;
    this.showImportExport = true;
    this.exportModal.show();
  }

  hideExportModal() {
    this.exportModal.hide();
    this.showImportExport = false;
    this.isExportView = false;
    this.isImportView = false;
  }

  showImportModal() {
    this.isImportView = true;
    this.isExportView = false;
    this.showImportExport = true;
    this.importModal.show();
  }

  hideImportModal() {
    this.importModal.hide();
    this.showImportExport = false;
    this.isExportView = false;
    this.isImportView = false;
  }

  deleteData() {
    this.deleting = true;
    this.indexedDbService.deleteDb().then(
      results => {
        this.suiteDbService.startup();
        this.assessmentService.tutorialShown = false;
        this.tutorialShown = false;
        this.initData();
        this.hideDeleteModal()
      }
    )
  }

  checkSelected() {
    let tmpArray = new Array();
    let tmpArray2 = new Array();
    if (this.workingDirectory.assessments) {
      tmpArray = this.workingDirectory.assessments.filter(
        assessment => {
          if (assessment.selected) {
            return assessment;
          }
        }
      )
    }
    if (this.workingDirectory.subDirectory) {
      tmpArray2 = this.workingDirectory.subDirectory.filter(
        subDir => {
          if (subDir.selected) {
            return subDir;
          }
        }
      )
    }
    if (tmpArray.length != 0 || tmpArray2.length != 0 || this.workingDirectoryCalculator.selected) {
      return true;
    } else {
      return false;
    }

  }

  deleteSelected(dir: Directory) {
    this.hideDeleteItemsModal();
    if (dir.subDirectory) {
      dir.subDirectory.forEach(subDir => {
        if (subDir.selected || subDir.parentDirectoryId != 1) {
          this.indexedDbService.getChildrenDirectories(subDir.id).then(results => {
            if (results) {
              subDir.subDirectory = results;
              this.deleteSelected(subDir);
            }
          })
        }
      });
    }
    if (dir != this.workingDirectory) {
      if (dir.parentDirectoryId != this.workingDirectory.id || dir.selected) {
        this.indexedDbService.getDirectoryAssessments(dir.id).then(results => {
          let childDirAssessments = results;
          childDirAssessments.forEach(assessment => {
            this.indexedDbService.deleteAssessment(assessment.id).then(results => {
              this.allDirectories = this.populateDirectories(this.rootDirectoryRef);
              this.workingDirectory = this.populateDirectories(this.workingDirectory);
            });
            this.indexedDbService.getAssessmentSettings(assessment.id).then(
              results => {
                if (results.length != 0) {
                  this.indexedDbService.deleteSettings(results[0].id).then(
                    results => { console.log('assessment setting deleted'); }
                  )
                }
              }
            )
          })
        })
        this.indexedDbService.deleteDirectory(dir.id).then(results => {
          this.allDirectories = this.populateDirectories(this.rootDirectoryRef);
          this.workingDirectory = this.populateDirectories(this.workingDirectory);
        })

        this.indexedDbService.getDirectoryCalculator(dir.id).then(results => {
          if (results.length != 0) {
            this.indexedDbService.deleteCalculator(results[0].id).then(() => { console.log('delete dir calculator') });
          }
        })

        this.indexedDbService.getDirectorySettings(dir.id).then(results => {
          if (results.length != 0) {
            this.indexedDbService.deleteSettings(results[0].id).then(
              results => { console.log('dir setting deleted'); }
            )
          }
        })
      }
    }
    if (dir == this.workingDirectory) {
      let checkedAssessments = _.filter(this.workingDirectory.assessments, { 'selected': true });
      checkedAssessments.forEach(assessment => {
        this.indexedDbService.deleteAssessment(assessment.id).then(results => {
          this.allDirectories = this.populateDirectories(this.rootDirectoryRef);
          this.workingDirectory = this.populateDirectories(this.workingDirectory);
        });
        this.indexedDbService.getAssessmentSettings(assessment.id).then(
          results => {
            if (results.length != 0) {
              this.indexedDbService.deleteSettings(results[0].id).then(
                results => { console.log('assessment setting deleted'); }
              )
            }
          }
        )
      })
    }

    if (this.workingDirectoryCalculator) {
      if (this.workingDirectoryCalculator.selected) {
        this.indexedDbService.deleteCalculator(this.workingDirectoryCalculator.id).then(val => {
          this.getWorkingDirectoryData();
        })
      }
    }
  }

  generateReport() {
    if (this.checkSelected()) {
      this.selectedItems = new Array();
      if (this.workingDirectoryCalculator) {
        if (this.workingDirectoryCalculator.selected) {
          this.reportRollupService.calcsArray.push(this.workingDirectoryCalculator);
          this.reportRollupService.selectedCalcs.next(this.reportRollupService.calcsArray);
        }
      }
      this.reportRollupService.getReportData(this.workingDirectory);
      //this.getSelected(this.workingDirectory);
      this.dashboardView = 'detailed-report';
    } else {
      this.addToast('No items have been selected');
    }
  }

  exportSelected() {
    if (this.checkSelected()) {
      this.selectedItems = new Array();
      this.getSelected(this.workingDirectory);
      this.showExportModal();
    } else {
      this.addToast('No items have been selected');
    }
  }

  returnSelected() {
    return this.selectedItems;
  }

  closeReport() {
    this.selectedItems = new Array();
    this.workingDirectoryCalculator.selected = false;
    this.workingDirectory.assessments.forEach(
      assessment => {
        assessment.selected = false;
      }
    )
    //prevents unneccessary pre assessments in report rollup
    this.workingDirectory.subDirectory.forEach(dir => {
      dir.selected = false;
    });
    this.dashboardView = 'assessment-dashboard';
  }


  getSelected(dir: Directory) {
    //add selected and children dir assessments
    if (dir.assessments) {
      dir.assessments.forEach(
        assessment => {
          let assessmentDir;
          if (dir.id != this.workingDirectory.id) {
            assessmentDir = dir;
          }
          if (assessment.selected) {
            this.selectedItems.push({ assessment: assessment, directory: assessmentDir });
          } else if (dir.id != this.workingDirectory.id) {
            this.selectedItems.push({ assessment: assessment, directory: assessmentDir });
          }
        }
      )
    } else {
      //get assessments of directory if non passed in
      this.indexedDbService.getDirectoryAssessments(dir.id).then(
        resultAssessments => {
          if (resultAssessments.length != 0) {
            resultAssessments.forEach(assessment => { this.selectedItems.push({ assessment: assessment, directory: dir }) })
          }
        }
      )
    }

    //process selected sub directories of working directory
    if (dir.id == this.workingDirectory.id) {
      if (dir.subDirectory) {
        dir.subDirectory.forEach(
          subDir => {
            if (subDir.selected) {
              this.getSelected(subDir);
            }
          }
        )
      }
    }
    //get subdirectories of selected non working directories
    else {
      this.indexedDbService.getChildrenDirectories(dir.id).then(
        resultDir => {
          if (resultDir.length != 0) {
            resultDir.forEach(dir => this.getSelected(dir));
          }
        }
      )
    }
  }

  checkImportData(data: any) {
    if (data[data.length - 1].origin == "AMO-TOOLS-DESKTOP") {
      data.pop();
      this.importInProgress = true;
      this.runImport(data);

    }
    else {
      this.addToast('INVALID FILE');
    }
  }

  runImport(data: ImportDataObjects[]) {
    if (this.importing) {
      clearTimeout(this.importing)
    }
    this.importing = setTimeout(() => {
      this.hideImportModal();
      this.importInProgress = false;
      this.allDirectories = this.populateDirectories(this.rootDirectoryRef);
      this.workingDirectory = this.populateDirectories(this.workingDirectory);
    }, 2500)

    let uniqDirs = _.uniqBy(data, 'directory.id');
    let dirIdPairs = new Array();
    uniqDirs.forEach(dir => {
      if (dir.directory) {
        let tmpDirDbRef: DirectoryDbRef = {
          name: dir.directory.name,
          parentDirectoryId: this.workingDirectory.id
        }
        let checkParentArr = dirIdPairs.filter(pair => { return dir.directory.parentDirectoryId == pair.oldId })
        if (checkParentArr.length != 0) {
          tmpDirDbRef.parentDirectoryId = checkParentArr[0].newId;
        }
        this.indexedDbService.addDirectory(tmpDirDbRef).then(results => {
          if (dir.calculator) {
            dir.calculator.directoryId = results;
            delete dir.calculator.id;
            this.indexedDbService.addCalculator(dir.calculator);
          }
          dir.directorySettings.directoryId = results;
          delete dir.directorySettings.id;
          this.indexedDbService.addSettings(dir.directorySettings);
          dirIdPairs.push({ oldId: dir.directory.id, newId: results });
        });
      }
    })
    setTimeout(() => {
      data.forEach(dataObj => {
        let tmpDirectoryIdArr = dirIdPairs.filter(pair => { return pair.oldId == dataObj.assessment.directoryId });
        let tmpDirectoryId = this.workingDirectory.id;
        if (tmpDirectoryIdArr.length != 0) {
          tmpDirectoryId = tmpDirectoryIdArr[0].newId;
        }
        let tmpAssessment: Assessment = {
          type: dataObj.assessment.type,
          name: dataObj.assessment.name,
          psat: dataObj.assessment.psat,
          phast: dataObj.assessment.phast,
          directoryId: tmpDirectoryId
        }
        this.indexedDbService.addAssessment(tmpAssessment).then(
          results => {
            if (dataObj.calculator) {
              dataObj.calculator.assessmentId = results;
              delete dataObj.calculator.id;
              this.indexedDbService.addCalculator(dataObj.calculator);
            }
            //check for psat until phast has settings
            let tmpSettings: Settings = this.settingsService.getNewSettingFromSetting(dataObj.settings);
            tmpSettings.assessmentId = results;
            this.indexedDbService.addSettings(tmpSettings).then(
              results => { }
            )
          }
        )
      })
    }, 1000);
  }

  addToast(msg: string) {
    let toastOptions: ToastOptions = {
      title: msg,
      timeout: 2000,
      showClose: true,
      theme: 'default'
    }
    this.toastyService.warning(toastOptions);
  }
}

export interface ImportDataObjects {
  settings: Settings,
  directory: Directory,
  assessment: Assessment,
  directorySettings: Settings,
  calculator?: Calculator
}
