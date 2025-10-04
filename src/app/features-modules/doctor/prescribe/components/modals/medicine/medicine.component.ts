import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  Input,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { FormArray, FormControl } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  startWith,
  switchMap,
} from 'rxjs';
import { MatSelectModule } from '@angular/material/select';
import { MedicineService } from '../../../services/medicine.service';
import { PrescriptionService } from '../../../services/prescription.service';
import { Medicine } from '../../../services/model/model';
import { BinComponent } from '../../shared/dynamic-modal/icons/bin/bin.component';
import { SkeltonComponent } from '../../others/skelton/skelton.component';
import { TosterService } from 'src/app/shared/services/toster.service';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-medicine',
  templateUrl: './medicine.component.html',
  imports: [
    CommonModule,
    MatDialogModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatOptionModule,
    FormsModule,
    MatSelectModule,
    BinComponent,
    SkeltonComponent,
  ],
  standalone: true,
})
export class MedicineComponent {
  @Input() data: any;
  private MedicineService = inject(MedicineService);
  private PrescriptionService = inject(PrescriptionService);
  private TosterService = inject(TosterService);
  private NormalAuth = inject(AuthService);
  mealCombinations = ['1+1+0', '1+0+1', '0+1+1'];
  searchControl = new FormControl('');
  selectedMedicines: Medicine[] = [];
  mealTimes = ['Before Meal', 'After Meal'];
  durationOptions = [
    { value: 'days', label: 'Days' },
    { value: 'weeks', label: 'Weeks' },
    { value: 'months', label: 'Months' },
  ];
  bookmarked: {
    label: string;
    value: number;
  }[] = [];
  loading = {
    isSpinner: false,
    isSkelton: false,
    noDataFound: false,
  };
  filteredMedicines$!: Observable<
    {
      label: string;
      value: number;
    }[]
  >;

  constructor(public dialogRef: MatDialogRef<MedicineComponent>) {}
  ngOnInit(): void {
    let id = this.NormalAuth.authInfo()?.id;
    if (id) {
      this.getBookmarked(id);
    }

    this.MedicineService.getAllMedicines().subscribe((res) => {
      console.log(res);
    });
    this.filteredMedicines$ = this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((value) => {
        return this.filter(value || '');
      })
    );

    this.selectedMedicines = JSON.parse(JSON.stringify(this.data));
  }
  @ViewChildren('durationInput') durationInput!: QueryList<ElementRef>;
  onselect(diagnosis: MatAutocompleteSelectedEvent) {
    setTimeout(() => {
      const lastInput = this.durationInput.last;
      lastInput?.nativeElement.focus();
    }, 0);
    if (diagnosis.option.value.label.length > 3) {
      this.addMedicine(diagnosis.option.value);
      this.displayWith(diagnosis.option.value);
    }
  }
  private filter(value: string): Observable<
    {
      label: string;
      value: number;
    }[]
  > {
    console.log(value);
    const filterValue = value;
    return this.MedicineService.searchMedicine(filterValue).pipe(
      map((res) => {
        return res.results && res.results.length > 0
          ? res.results.map((item: any) => {
              return {
                label: item.medicationName,
                value: item.medicationId,
              };
            })
          : [];
      })
    );
  }

  toggleMedicine(event: any, medicine: any): void {
    setTimeout(() => {
      const lastInput = this.durationInput.last;
      lastInput?.nativeElement.focus();
    }, 0);
    if (event.isUserInput) {
      const index = this.selectedMedicines.findIndex(
        (c) => c.name === medicine.label
      );
      if (index === -1) {
        this.selectedMedicines.push({
          name: medicine.label,
          duration: '',
          timming: '',
          notes: '',
          mealTime: '',
          id: medicine.value,
        });
      } else {
        this.selectedMedicines.splice(index, 1);
      }
    }
  }

  addMedicine(medicine: any): void {
    if (
      !this.selectedMedicines.find((c) => c.name === medicine.label) &&
      medicine.value
    ) {
      this.selectedMedicines.push({
        name: medicine.label,
        duration: '',
        timming: '',
        notes: '',
        mealTime: '',
        id: medicine.value,
      });
      setTimeout(() => {
        const lastInput = this.durationInput.last;
        lastInput?.nativeElement.focus();
      }, 0);
    }
    if (!medicine.value) {
      this.MedicineService.createMedicine(medicine.label).subscribe((res) => {
        this.selectedMedicines.push({
          name: medicine.label,
          duration: ' ',
          timming: ' ',
          notes: ' ',
          mealTime: ' ',
          id: res.results,
        });
        this.bookmarked.push({
          label: medicine.label,
          value: res.results || 0,
        });
        setTimeout(() => {
          const lastInput = this.durationInput.last;
          lastInput?.nativeElement.focus();
        }, 0);
        this.TosterService.customToast(res.message, 'success');
      });
    }
  }

  removeMedicine(medicine: Medicine): void {
    this.selectedMedicines = this.selectedMedicines.filter(
      (c) => c !== medicine
    );
  }

  save() {
    const medicationForm = this.PrescriptionService.prescribeForm().get(
      'medications'
    ) as FormArray;
    medicationForm.clear();

    this.selectedMedicines.forEach((item) =>
      this.PrescriptionService.addMedicine(item)
    );
    this.dialogRef.close();
  }

  isMedicineSelected(medicine: string): boolean {
    return this.selectedMedicines.some((c) => c.name === medicine);
  }
  getBookmarked(id: number) {
    this.loading.isSkelton = true;
    this.MedicineService.getBookmarkedMedicines(id).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          let bookmark = res.results.map(
            (res: { medicationName: string; medicationId: number }) => {
              return {
                label: res.medicationName,
                value: res.medicationId,
              };
            }
          );
          this.bookmarked = bookmark;
          this.loading.isSkelton = false;
        } else {
          this.loading.isSkelton = false;
          this.loading.noDataFound = true;
        }
      },
    });
  }
  displayWith(c: { label: string; value: number }): string {
    return c.label;
  }
  closeDialog(): void {
    this.dialogRef.close();
  }

  showAutocomplete = false;
}
