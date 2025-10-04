import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LocalStreamComponent } from '../local-stream/local-stream.component';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-media-controls',
  templateUrl: './media-controls.component.html',
  styleUrls: ['./media-controls.component.scss'],
})
export class MediaControlsComponent implements OnInit {
  @ViewChild('micButton', { static: true })
  micButton!: ElementRef<HTMLButtonElement>;
  @ViewChild('videoButton', { static: true })
  videoButton!: ElementRef<HTMLButtonElement>;
  @ViewChild('screenShareButton', { static: true })
  screenShareButton!: ElementRef<HTMLButtonElement>;
  @ViewChild('leaveButton', { static: true })
  leaveButton!: ElementRef<HTMLButtonElement>;
  useType!: any;
  aptCode!: any;
  isMicMuted = false;
  isVideoMuted = false;
  constructor(
    private localStream: LocalStreamComponent,
    private AuthService: AuthService,
    private HttpClient: HttpClient,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.useType = this.AuthService.authInfo()?.userType;
    this.route.queryParams.subscribe((params) => {
      this.aptCode = params['aptId'];
    });
  }
  handleMicToggle(e: Event): void {
    const isActive = this.localStream.getTrackState('mic'); // get active state
    this.localStream.muteTrack('mic', !isActive).then((newState) => {
      this.isMicMuted = !newState; // If mic is not active, it's muted
      console.log(this.isMicMuted);

      this.toggleButtonActiveState(e.target as HTMLDivElement);
    });
  }

  handleVideoToggle(e: Event): void {
    const isActive = this.localStream.getTrackState('video') ?? false;
    this.localStream.muteTrack('video', !isActive).then((newState) => {
      this.isVideoMuted = !newState; // If video is not active, it's muted
      this.toggleButtonActiveState(e.target as HTMLDivElement);
    });
  }

  toggleButtonActiveState(button: HTMLDivElement): void {
    button.classList.toggle('media-active'); // Add/Remove active class
    button.classList.toggle('muted'); // Add/Remove muted class
  }

  handleScreenShare(e: Event): void {
    const isActive = this.localStream.getTrackState('screen'); // get active state
    if (isActive) {
      this.localStream.startScreenShare();
    } else {
      this.localStream.stopScreenShare();
    }
    this.toggleButtonActiveState(e.target as HTMLDivElement);
  }

  handleLeaveChannel(): void {
    this.localStream.handleLeaveChannel();
  }
  // handleCompleteCall(aptCode: string) {
  //   console.log('call');

  //   const aptUrl = `https://apisoowgoodbeta.com/api/app/appointment/call-consultation-appointment?appCode=${aptCode}`;

  //   try {
  //     console.log('call');
  //     this.HttpClient.put(aptUrl, {}).subscribe((res) => {
  //       this.handleLeaveChannel();
  //     });
  //   } catch (error) {}
  // }
}
