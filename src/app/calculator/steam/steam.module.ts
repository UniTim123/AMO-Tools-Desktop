import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SteamPropertiesModule } from './steam-properties/steam-properties.module';
import { SteamComponent } from "./steam.component";
import { SteamService } from "./steam.service";
import { SaturatedPropertiesModule } from "./saturated-properties/saturated-properties.module";


@NgModule({
  imports: [
    CommonModule,
    SteamPropertiesModule,
    SaturatedPropertiesModule
  ],
  declarations: [
    SteamComponent
  ],
  exports: [
    SteamComponent
  ],
  providers: [
    SteamService
  ]
})
export class SteamModule { }