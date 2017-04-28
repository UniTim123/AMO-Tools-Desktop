import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DirectoryDbRef, Directory } from '../shared/models/directory';
import { MockDirectory } from '../shared/mocks/mock-directory';
import { IndexedDbService } from '../indexedDb/indexed-db.service';
import { ModalDirective } from 'ng2-bootstrap';
import * as _ from 'lodash';
import { Settings } from '../shared/models/settings';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  allDirectories: Directory;
  workingDirectory: Directory;
  showCalculators: boolean = false;
  selectedCalculator: string;
  // showSettings: boolean = false;
  isFirstChange: boolean = true;
  rootDirectoryRef: DirectoryDbRef;
  view: string;

  @ViewChild('deleteModal') public deleteModal: ModalDirective;
  @ViewChild('deleteItemsModal') public deleteItemsModal: ModalDirective;
  constructor(private indexedDbService: IndexedDbService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    //open DB and get directories
    this.indexedDbService.initDb().then(
      results => {
        this.indexedDbService.getDirectory(1).then(
          results => {
            if (results) {
              this.rootDirectoryRef = results;
              this.allDirectories = this.populateDirectories(results);
              this.workingDirectory = this.allDirectories
            } else {
              this.createExampleAssessments();
              this.createDirectory();
            }
          })
        this.indexedDbService.getDirectorySettings(1).then(
          results => {
            if (results.length == 0) {
              this.createDirectorySettings();
            }
          }
        );
      }
    )
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
    this.showCalculators = false;
    this.indexedDbService.getDirectory(directory.id).then(
      results => {
        if (results) {
          this.workingDirectory = this.populateDirectories(results);
        }
      })
  }

  viewCalculator(str: string) {
    //this.showSettings = false;
    this.showCalculators = true;
    this.selectedCalculator = str;
  }

  // viewSettings(bool: boolean) {
  //   this.view = 'settings';
  //   this.showSettings = true;
  //   this.showCalculators = false;
  //   this.selectedCalculator = '';
  // }

  createExampleAssessments() {
    let tmpAssessment = MockDirectory.assessments[0];
    tmpAssessment.directoryId = 1;
    this.indexedDbService.addAssessment(tmpAssessment).then(assessmentId => {

    })

    tmpAssessment = MockDirectory.assessments[1];
    tmpAssessment.directoryId = 1;
    this.indexedDbService.addAssessment(tmpAssessment).then(assessmentId => {

    })
  }

  createDirectorySettings() {
    let tmpSettings: Settings = {
      language: 'English',
      currency: 'US Dollar',
      unitsOfMeasure: 'Imperial',
      directoryId: 1,
      createdDate: new Date(),
      modifiedDate: new Date()
    }
    this.indexedDbService.addSettings(tmpSettings).then(
      results => {
        console.log('root directory settings added');
        console.log(results);
      }
    )
  }


  createDirectory() {
    let tmpDirectory: DirectoryDbRef = {
      name: 'Root',
      createdDate: new Date(),
      modifiedDate: new Date(),
      assessmentIds: null,
      parentDirectoryId: null,
      subDirectoryIds: null
    }
    this.indexedDbService.addDirectory(tmpDirectory).then(
      results => {
        this.indexedDbService.getDirectory(results).then(result => {
          this.rootDirectoryRef = results;
          this.allDirectories = this.populateDirectories(result);
          this.workingDirectory = this.allDirectories;
        })
      }
    )

  }

  showDeleteModal() {
    this.deleteModal.show();
  }

  hideDeleteModal() {
    this.deleteModal.hide();
  }

  showDeleteItemsModal() {
    this.deleteItemsModal.show();
  }

  hideDeleteItemsModal() {
    this.deleteItemsModal.hide();
  }

  deleteData() {
    this.indexedDbService.deleteDb().then(
      results => {
        this.ngOnInit();
        this.hideDeleteModal()
      }
    )
  }

  deleteSelected(dir: Directory) {
    console.log('delete dir ' + dir.id);
    this.hideDeleteItemsModal();
    if (dir.subDirectory) {
      console.log('if subDir ' + dir.id);
      dir.subDirectory.forEach(subDir => {
        if (subDir.delete || subDir.parentDirectoryId != 1) {
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
      console.log('if != working ' + dir.id);
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
                  results => { console.log('assessment setting deleter'); }
                )
              }
            }
          )
        })
      })
      if (dir.delete) {
        this.indexedDbService.deleteDirectory(dir.id).then(results => {
          this.allDirectories = this.populateDirectories(this.rootDirectoryRef);
          this.workingDirectory = this.populateDirectories(this.workingDirectory);
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
      let checkedAssessments = _.filter(this.workingDirectory.assessments, { 'delete': true });
      checkedAssessments.forEach(assessment => {
        this.indexedDbService.deleteAssessment(assessment.id).then(results => {
          this.allDirectories = this.populateDirectories(this.rootDirectoryRef);
          this.workingDirectory = this.populateDirectories(this.workingDirectory);
        });
        this.indexedDbService.getAssessmentSettings(assessment.id).then(
          results => {
            if (results.length != 0) {
              this.indexedDbService.deleteSettings(results[0].id).then(
                results => { console.log('assessment setting deleter'); }
              )
            }
          }
        )
      })
    }
  }

}
