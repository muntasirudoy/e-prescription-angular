import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { SearchInputComponent } from './components/search-input/search-input.component';
import { FilterOptionsComponent } from './components/filter-options/filter-options.component';
import { DoctorListComponent } from './components/doctor-list/doctor-list.component';
@Component({
  selector: 'app-search-filter',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    SearchInputComponent,
    FilterOptionsComponent,
    DoctorListComponent,
  ],
  templateUrl: './search-filter.component.html',
  styleUrl: './search-filter.component.scss',
})
export class SearchFilterComponent {}
