import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule } from '@angular/google-maps';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AboutComponent } from './components/about/about.component';
import { HomeComponent } from './components/home/home.component';
import { ResponsiveComponent } from './components/responsive/responsive.component';

@NgModule({
  imports: [CommonModule, FontAwesomeModule, GoogleMapsModule],
  declarations: [HomeComponent, AboutComponent, ResponsiveComponent],
  exports: [HomeComponent, AboutComponent, ResponsiveComponent],
})
export class SharedModule {}
