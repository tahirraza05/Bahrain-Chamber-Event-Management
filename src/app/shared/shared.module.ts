import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MainNavComponent } from './components/navigation/main-nav.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { DateFormatPipe } from './pipes/date-format.pipe';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    MainNavComponent,
    LoadingSpinnerComponent,
    ClickOutsideDirective,
    DateFormatPipe
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule
  ],
  exports: [
    MainNavComponent,
    LoadingSpinnerComponent,
    ClickOutsideDirective,
    DateFormatPipe
  ]
})
export class SharedModule { }
