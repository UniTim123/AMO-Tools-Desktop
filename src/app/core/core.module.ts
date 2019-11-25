import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxElectronModule } from 'ngx-electron';
import { AssessmentModule } from '../assessment/assessment.module';
import { PhastModule } from '../phast/phast.module';
import { PsatModule } from '../psat/psat.module';
import { CalculatorModule } from '../calculator/calculator.module';
import { ModalModule } from 'ngx-bootstrap';

import { CoreComponent } from './core.component';
import { AssessmentService } from '../assessment/assessment.service';
import { SettingsModule } from '../settings/settings.module';

import { ImportExportModule } from '../shared/import-export/import-export.module';
import { SuiteDbModule } from '../suiteDb/suiteDb.module';
import { AboutPageComponent } from '../about-page/about-page.component';
import { ContactPageComponent } from '../contact-page/contact-page.component';
import { ReportRollupModule } from '../report-rollup/report-rollup.module';
import { FsatModule } from '../fsat/fsat.module';
import { AcknowledgmentsPageComponent } from "../acknowledgments-page/acknowledgments-page.component";
import { PreAssessmentModule } from '../calculator/utilities/pre-assessment/pre-assessment.module';
import { MeasurComponent } from '../landing-screen/measur/measur.component';
import { WindowRefService } from '../indexedDb/window-ref.service';
import { IndexedDbService } from '../indexedDb/indexed-db.service';
import { AssessmentDbService } from '../indexedDb/assessment-db.service';
import { DirectoryDbService } from '../indexedDb/directory-db.service';
import { SettingsDbService } from '../indexedDb/settings-db.service';
import { CalculatorDbService } from '../indexedDb/calculator-db.service';
import { DeleteDataService } from '../indexedDb/delete-data.service';
import { CoreService } from './core.service';
import { SsmtModule } from '../ssmt/ssmt.module';
import { TreasureHuntModule } from '../treasure-hunt/treasure-hunt.module';
import { UpdateToastComponent } from '../update-toast/update-toast.component';
import { HelperServicesModule } from '../shared/helper-services/helper-services.module';
import { ToastModule } from '../shared/toast/toast.module';
import { TutorialsModule } from '../tutorials/tutorials.module';
import { DirectoryDashboardModule } from '../directory-dashboard/directory-dashboard.module';
import { DashboardModule } from '../dashboard/dashboard.module';

@NgModule({
  declarations: [
    CoreComponent,
    AboutPageComponent,
    ContactPageComponent,
    AcknowledgmentsPageComponent,
    UpdateToastComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    AssessmentModule,
    PsatModule,
    PhastModule,
    CalculatorModule,
    ModalModule,
    NgxElectronModule,
    FormsModule,
    ReactiveFormsModule,
    SettingsModule,
    SuiteDbModule,
    ImportExportModule,
    ReportRollupModule,
    FsatModule,
    PreAssessmentModule,
    SsmtModule,
    TreasureHuntModule,
    HelperServicesModule,
    ToastModule,
    TutorialsModule,
    DirectoryDashboardModule,
    DashboardModule
  ],
  providers: [
    AssessmentService,
    CoreService,
    WindowRefService,
    IndexedDbService,
    AssessmentDbService,
    DirectoryDbService,
    SettingsDbService,
    CalculatorDbService,
    DeleteDataService
  ]
})

export class CoreModule { };
