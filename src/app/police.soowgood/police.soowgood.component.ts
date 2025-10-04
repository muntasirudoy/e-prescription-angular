import { AppointmentService } from 'src/app/proxy/services';
import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { CallingComponent } from './calling/calling.component';
import {
  AppointmentDto,
  DataFilterModel,
  FilterModel,
} from '../proxy/dto-models';

@Component({
  selector: 'app-police',
  standalone: true,
  imports: [],
  templateUrl: './police.soowgood.component.html',
  styleUrl: './police.soowgood.component.scss',
})
export class PoliceSoowgoodComponent implements OnInit {
  authInfo = inject(AuthService);
  matDialog = inject(MatDialog);
  currentFilter!: {
    consultancy: any;
    name: any;
    startDate: any;
    endDate: any;
    appointmentType: any;
    scheduleId: any;
    day: any;
  };
  filterModel: FilterModel = {
    offset: 0,
    limit: 0,
    pageNo: 0,
    pageSize: 15,
    sortBy: 'name',
    sortOrder: 'asc',
    isDesc: false,
  };

  doctorFilterDto: DataFilterModel = {} as DataFilterModel;
  AppointmentService = inject(AppointmentService);
  AppointmentList: AppointmentDto[] = [];
  ngOnInit(): void {
    let user = this.authInfo?.authInfo();
    if (user.id) {
      this.getAppointmentList(user);
    }

    console.log(this.AppointmentList);
  }
  currentIndex = 0;
  onClickCallNow() {
    if (this.AppointmentList.length === 0) {
      alert('No appointments available.');
      return;
    }

    if (this.currentIndex >= this.AppointmentList.length) {
      this.currentIndex = 0;
    }

    const currentAppointment = this.AppointmentList[this.currentIndex];
    console.log(currentAppointment);

    if (currentAppointment) {
      const dialog = this.matDialog.open(CallingComponent, {
        disableClose: true,
        autoFocus: false,
        data: {
          appointment: currentAppointment,
        },
      });
      dialog.afterClosed().subscribe(() => {
        this.currentIndex++;
      });
    }
  }

  getAppointmentList(user: any) {
    this.AppointmentService.getAppointmentListForPatientWithSearchFilter(
      user.id,
      'patient',
      this.doctorFilterDto,
      this.filterModel
    ).subscribe({
      next: (res) => {
        console.log(res.result);

        this.AppointmentList = res.result;
      },
    });
  }
}
