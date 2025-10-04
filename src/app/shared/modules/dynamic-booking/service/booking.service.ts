import { Injectable, signal } from '@angular/core';
import { SessionWeekDayTimeSlotPatientCountDto } from 'src/app/proxy/dto-models';
interface SelectedItemTrackProps {
  isInstant: boolean;
  isSchedule: boolean;
  isSelf: boolean;
  isOther: boolean;
  isReview: boolean;
  isCreate: boolean;
}

export const initBooking: SelectedItemTrackProps = {
  isInstant: false,
  isSchedule: false,
  isSelf: false,
  isOther: false,
  isReview: false,
  isCreate: false,
};

export const initBookingInfo = {
  doctorScheduleId: null,
  doctorProfileId: 0,
  doctorName: '',
  doctorCode: '',

  patientProfileId: 0,
  patientName: '',
  patientCode: '',
  patientMobileNo: 0,
  patientEmail: '',

  consultancyType: '',
  doctorChamberId: null,
  doctorChamberName: '',
  scheduleType: '',
  doctorScheduleDaySessionId: null,
  scheduleDayofWeek: '',
  appointmentType: '',
  appointmentDate: '',
  appointmentTime: '',
  doctorFeesSetupId: null,
  // fee
  doctorFee: 0,
  agentFee: 0,
  platformFee: 0,
  totalAppointmentFee: 0, //this.selectedFeesInfo.totalFee,
  appointmentStatus: 1,
  appointmentPaymentStatus: 2,
  appointmentCreatorId: 0,
  appointmentCreatorRole: '',
};
interface BookingInfo {
  doctorScheduleId: any;
  doctorProfileId: number;
  doctorName: string;
  doctorCode: string;

  patientProfileId: number;
  patientName: string;
  patientCode: string;
  patientMobileNo: number;
  patientEmail: string;

  consultancyType: string;
  doctorChamberId: any;
  doctorChamberName: string;
  scheduleType: string;
  doctorScheduleDaySessionId: any;
  scheduleDayofWeek: string;
  appointmentType: string;
  appointmentDate: any;
  appointmentTime: string;
  doctorFeesSetupId: any;
  // fee
  doctorFee: number;
  agentFee: number;
  platformFee: number;
  totalAppointmentFee: number; //this.selectedFeesInfo.totalFee,
  appointmentStatus: number;
  appointmentPaymentStatus: number;
  appointmentCreatorId: number;
  appointmentCreatorRole: string;
}

type SelectedSlot = {
  endTime: string;
  patientCount: number;
  scheduleId: number;
  sessionId: number;
  startTime: string;
  weekDay: string;
};
export interface PatientInfoForBooking {
  patientName: string;
  patientMobileNo: number;
  patientEmail: string;
  patientCode: string;
  patientProfileId: number;
}
const initPatientInfo = {
  patientName: '',
  patientMobileNo: 0,
  patientEmail: '',
  patientCode: '',
  patientProfileId: 0,
};
@Injectable({
  providedIn: 'root',
})
export class BookingService {
  selectedItem = signal(initBooking);
  bookingInfo = signal({});
  //available slot
  availAbleSlot = signal<SessionWeekDayTimeSlotPatientCountDto[]>([]);
  //selected slot
  selectedSlot = signal({});

  patientForBooking = signal<PatientInfoForBooking>(initPatientInfo);
}
