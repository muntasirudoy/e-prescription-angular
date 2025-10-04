import { Component, Inject, OnInit, effect } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BookingService } from './service/booking.service';
import { ControlResolverService } from './service/resolver/control-resolver.service';

@Component({
  selector: 'app-dynamic-booking',
  templateUrl: './dynamic-booking.component.html', // Fix here (was "please fix")
  styleUrls: ['./dynamic-booking.component.scss'], // Fix here (styleUrls was not correctly named)
})
export class DynamicBookingComponent implements OnInit {
  bookingType!: string;
  dynamicComponent: string = '';

  constructor(
    public dialogRef: MatDialogRef<DynamicBookingComponent>,
    @Inject(MAT_DIALOG_DATA) public doctorData: any | undefined,
    public BookingService: BookingService,
    protected controlResolver: ControlResolverService
  ) {
    effect(() => {
      const selectedItem = this.BookingService.selectedItem();
      console.log(selectedItem);

      // Handle instant booking
      if (selectedItem.isInstant) {
        if (selectedItem.isSelf) {
          this.dynamicComponent = 'review';
        } else if (selectedItem.isOther) {
          if (selectedItem.isCreate) {
            this.dynamicComponent = 'review';
          } else {
            this.dynamicComponent = 'createSomeone';
          }
        } else {
          this.dynamicComponent = 'bookFor';
        }
      }

      // Handle scheduled booking
      else if (selectedItem.isSchedule) {
        if (selectedItem.isSelf) {
          this.dynamicComponent = 'schedule';
        } else if (selectedItem.isOther) {
          if (selectedItem.isCreate && !selectedItem.isReview) {
            this.dynamicComponent = 'schedule';
          } else if (selectedItem.isReview) {
            this.dynamicComponent = 'review';
          } else {
            this.dynamicComponent = 'createSomeone';
          }
        } else if (selectedItem.isInstant && selectedItem.isSchedule) {
          this.dynamicComponent = 'bookingType';
        } else {
          this.dynamicComponent = 'bookFor';
        }
      }

      // Handle non-instant and non-scheduled scenarios
      if (!selectedItem.isInstant && selectedItem.isSelf) {
        console.log('call');

        if (!selectedItem.isReview && selectedItem.isSchedule) {
          this.dynamicComponent = 'schedule';
        } else {
          this.dynamicComponent = 'review';
        }
      } else if (!selectedItem.isInstant && selectedItem.isOther) {
        if (selectedItem.isCreate && !selectedItem.isReview) {
          console.log('fake 2');
          this.dynamicComponent = 'schedule';
        } else if (selectedItem.isReview) {
          this.dynamicComponent = 'review';
        } else {
          this.dynamicComponent = 'createSomeone';
        }
      }
    });
  }

  ngOnInit(): void {
    // Default unauthorized if the user is not authenticated
    console.log(this.doctorData?.isInstant, this.doctorData?.isSchedule);

    if (!this.doctorData?.isAuthUser) {
      this.dynamicComponent = 'unauthorized';
    } else {
      if (
        !this.doctorData?.isInstant &&
        this.doctorData?.isSchedule &&
        this.doctorData?.isDoctorSideAppointment
      ) {
        this.BookingService.selectedItem.update((pre) => ({
          ...pre,
          isSchedule: this.doctorData?.isSchedule,
          isInstant: this.doctorData?.isInstant,
          isOther: true,
        }));
        this.dynamicComponent = 'schedule';
      }
      if (this.doctorData?.isInstant && this.doctorData?.isSchedule) {
        this.dynamicComponent = 'bookingType';
      } else {
        this.BookingService.selectedItem.update((pre) => ({
          ...pre,
          isSchedule: this.doctorData?.isSchedule,
          isInstant: this.doctorData?.isInstant,
        }));
        this.dynamicComponent = 'bookFor';
      }
    }
  }
}

// else {
//   this.dynamicComponent = 'bookFor';
//   this.BookingService.selectedItem.update((v) => ({
//     ...v,
//     isInstant: false,
//   }));
