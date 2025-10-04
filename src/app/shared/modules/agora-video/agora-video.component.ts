import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AppointmentDto, PatientProfileDto } from 'src/app/proxy/dto-models';
import {
  AppointmentService,
  DocumentsAttachmentService,
  PatientProfileService,
} from 'src/app/proxy/services';
import { AuthService } from 'src/app/shared/services/auth.service';
import { environment } from 'src/environments/environment';
import { RemoteStreamComponent } from './video/remote-stream/remote-stream.component';
import {
  PrescriptionPdf,
  PrescriptionService,
} from '../../services/prescription/prescription.service';

@Component({
  selector: 'app-agora-video',

  templateUrl: './agora-video.component.html',
  styleUrl: './agora-video.component.scss',
})
export class AgoraVideoComponent implements OnInit {
  userType: any;
  aptCode = '';
  appointmentInfo!: AppointmentDto;
  patientInfo!: PatientProfileDto;
  title = '';
  isCallingByDr!: boolean;
  docFile: string = '';
  docFileUrl: any[] = [];
  showBackBtn!: boolean;
  public picUrl = `${environment.apis.default.url}/`;
  newPrescriptionDetails!: PrescriptionPdf[];
  constructor(
    private route: ActivatedRoute,
    private AuthService: AuthService,
    private AppointmentService: AppointmentService,
    private PatientProfileService: PatientProfileService,
    private router: Router,
    public dialog: MatDialog,
    private DocumentsAttachmentService: DocumentsAttachmentService,
    private PrescriptionService: PrescriptionService
  ) {}
  params: any;
  streamLink: any;
  ngOnInit(): void {
    this.userType = this.AuthService.authInfo()?.userType;
    this.route.queryParams.subscribe((params) => {
      let aptId = params['aptId'];
      console.log(aptId);

      this.AppointmentService.get(aptId).subscribe({
        next: (data) => {
          this.appointmentInfo = data;

          this.getDocuments(data.patientProfileId);
          this.PatientProfileService.get(
            Number(data.patientProfileId)
          ).subscribe((patient) => {
            this.patientInfo = patient;
            this.getPatientPrescriptions();
          });
        },
        error: (err) => {
          console.log(err);
        },
      });
    });
  }

  @ViewChild('remoteStreamsContainer')
  remoteStreamsComponent!: RemoteStreamComponent;

  isJoinModalVisible = true;
  isLocalStreamVisible = false;

  async handleJoinChannel() {
    this.isJoinModalVisible = false;
    this.isLocalStreamVisible = true;
  }

  handleLeaveChannel() {
    this.remoteStreamsComponent.clearRemoteUsers();
    this.isLocalStreamVisible = false;
    this.isJoinModalVisible = true;
    window.location.reload();
  }

  takeFirstLetter() {
    let text =
      (this.userType !== 'doctor'
        ? this.appointmentInfo.doctorName
        : this.appointmentInfo.patientName) ?? 'none';
    return text.match(/\b\w/g)?.slice(0, 2).join('');
  }
  getDocuments(id: any) {
    this.DocumentsAttachmentService.getAttachmentInfoByEntityTypeAndEntityIdAndAttachmentType(
      'Patient',
      id,
      'PatientPreviousDocuments'
    ).subscribe((at) => {
      // let urls=[]
      if (at) {
        at.map((e) => {
          let prePaths: string = '';
          var re = /wwwroot/gi;
          prePaths = e.path ? e.path : '';
          this.docFile = prePaths.replace(re, '');
          // console.log(at);
          this.docFileUrl.push(this.picUrl + this.docFile);

          // this.isLoading = false;
          // urls.push()
        });
      }
    });
  }

  // showPreviousDocuments(id: any) {
  //   const dialogRef = this.dialog.open(PreviousDocumentsDialogComponent, {
  //     width: '60vw',
  //     data: this.docFileUrl,
  //     height: '100vh',
  //   });

  //   dialogRef.afterClosed().subscribe(() => {});
  // }
  goBack() {
    this.router.navigate([`${this.userType}/appointments`]).then(() => {
      this.handleLeaveChannel();
    });
  }

  getPatientPrescriptions() {
    if (!this.patientInfo.id) return;
    this.PrescriptionService.getPrescriptionByPatientId(
      this.patientInfo.id
    ).subscribe({
      next: (res) => {
        this.newPrescriptionDetails = res.results;
      },
    });
  }
}
