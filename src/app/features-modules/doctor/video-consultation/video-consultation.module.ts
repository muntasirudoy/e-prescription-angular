import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { AgoraVideoComponent } from '../../../shared/modules/agora-video/agora-video.component';
import { VideoConsultationComponent } from './video-consultation.component';
import { AgoraVideoModule } from 'src/app/shared/modules/agora-video/agora-video.module';

const route: Route[] = [
  {
    path: '',
    component: VideoConsultationComponent,
  },
  {
    path: 'join-call',
    component: AgoraVideoComponent,
  },
];

@NgModule({
  declarations: [VideoConsultationComponent],
  imports: [CommonModule, RouterModule.forChild(route), AgoraVideoModule],
  exports: [VideoConsultationComponent],
})
export class VideoConsultationModule {}
