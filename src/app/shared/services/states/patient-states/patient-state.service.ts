import { AppointmentService } from 'src/app/proxy/services';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PatientStateService {

  public appointmentList = new BehaviorSubject<any>([]);
  constructor(private AppointmentService : AppointmentService) { }


  sendPatientAppointmentListData(data:any[]){
    this.appointmentList.next(data);
  }
  getPatientAllAppointmentList(id:number){
    this.AppointmentService.getAppointmentListByPatientId(id).subscribe(
      (e) => {
        this.sendPatientAppointmentListData(e)
      }
    );
    return this.appointmentList.asObservable();
  }
}
