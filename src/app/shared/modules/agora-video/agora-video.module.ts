import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Route, RouterModule } from '@angular/router';
import { AgoraVideoComponent } from './agora-video.component';
import { BottomNavComponent } from './components/bottom-nav/bottom-nav.component';
import { JoinModalComponent } from './video/join-modal/join-modal.component';
import { LocalStreamComponent } from './video/local-stream/local-stream.component';
import { MediaControlsComponent } from './video/media-controls/media-controls.component';
import { RemoteStreamComponent } from './video/remote-stream/remote-stream.component';
import { SideContentModalComponent } from './components/side-content-modal/side-content-modal.component';
import { PrescriptionPatientComponent } from './components/prescription-patient/prescription-patient.component';
import { PrescribeComponent } from 'src/app/features-modules/doctor/prescribe/prescribe.component';

const routes: Route[] = [
  {
    path: '',
    component: AgoraVideoComponent,
  },
];

@NgModule({
  declarations: [
    AgoraVideoComponent,
    JoinModalComponent,
    RemoteStreamComponent,
    LocalStreamComponent,
    MediaControlsComponent,
    BottomNavComponent,
    SideContentModalComponent,
    PrescriptionPatientComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    // PrescriptionSubmitModule,
    PrescribeComponent,
  ],
  exports: [AgoraVideoComponent],
})
export class AgoraVideoModule {}
