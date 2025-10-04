import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import { AgoraService } from '../../service/agora.service';
import { IAgoraRTCClient, ILocalTrack } from 'agora-rtc-sdk-ng';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-local-stream',
  templateUrl: './local-stream.component.html',
  styleUrls: ['./local-stream.component.scss'],
})
export class LocalStreamComponent implements AfterViewInit {
  @ViewChild('localVideo', { static: true })
  localVideo!: ElementRef<HTMLDivElement>;
  @Output() leaveChannel = new EventEmitter<void>();
  displayName: any;
  private client: IAgoraRTCClient;

  private localMicTrack!: ILocalTrack;
  private localVideoTrack!: ILocalTrack;
  private localScreenTracks?: ILocalTrack[];

  private channelJoined: boolean = false;
  private subscription: Subscription = new Subscription();

  private localTracksActive = {
    mic: false,
    video: false,
    screen: false,
  };

  // Mapping to simplify getting/setting track-state
  private trackNameMapping: { [key: string]: 'mic' | 'video' | 'screen' } = {
    mic: 'mic',
    video: 'video',
    screen: 'screen',
  };

  constructor(private agoraService: AgoraService) {
    this.client = this.agoraService.getClient();
  }

  async ngAfterViewInit(): Promise<void> {
    [this.localMicTrack, this.localVideoTrack] =
      await this.agoraService.setupLocalTracks();
    this.localTracksActive.mic = this.localMicTrack ? true : false;
    this.localTracksActive.video = this.localVideoTrack ? true : false;
    // play video track in localStreamComponent div
    this.localVideoTrack.play(this.localVideo.nativeElement);
    this.subscription.add(
      this.agoraService.channelJoined$.subscribe((status) => {
        this.channelJoined = status;
        if (status) {
          this.publishTracks(); // publish the tracks once we are in the channel
        }
      })
    );
  }

  async ngOnDestroy() {
    // leave the channel if the component unmounts
    this.handleLeaveChannel();
  }

  async publishTracks() {
    await this.client.publish([this.localMicTrack, this.localVideoTrack]);
  }

  async unpublishTracks() {
    await this.client.publish([this.localMicTrack, this.localVideoTrack]);
  }

  async handleLeaveChannel(): Promise<void> {
    if (this.channelJoined) {
      const tracks = [this.localMicTrack, this.localVideoTrack];
      tracks.forEach((track) => {
        track.close();
      });
      await this.client.unpublish(tracks);
      await this.agoraService.leaveChannel();
    }
    this.leaveChannel.emit();
  }

  async startScreenShare(): Promise<boolean> {
    // TODO: add start screen share
    // Listen for screen share ended event (from browser ui button)
    // this.localScreenTracks[0]?.on("track-ended", () => {
    //   this.stopScreenShare()
    // })
    return true;
  }

  async stopScreenShare(): Promise<boolean> {
    // TODO: add stop screenshare
    return false;
  }
  async muteTrack(trackName: string, enabled: boolean): Promise<boolean> {
    let track: ILocalTrack;

    if (trackName === 'mic') {
      track = this.localMicTrack;
    } else if (trackName === 'video') {
      track = this.localVideoTrack;
    } else {
      console.error(`Unknown track name: ${trackName}`);
      return false;
    }

    try {
      await track.setEnabled(enabled);
      this.setTrackState(trackName, enabled);
      console.log(`${trackName} track is now ${enabled ? 'enabled' : 'muted'}`);
      return enabled;
    } catch (error) {
      console.error(`Failed to toggle ${trackName} track: `, error);
      return false;
    }
  }

  getTrackState(trackName: string): boolean | undefined {
    const key = this.trackNameMapping[trackName];
    if (key) {
      return this.localTracksActive[key];
    }
    console.log(`Get Track State Error: Unknown trackName: ${trackName}`);
    return;
  }
  setTrackState(trackName: string, state: boolean): void {
    const key = this.trackNameMapping[trackName];
    if (key) {
      this.localTracksActive[key] = state;
    }
    console.log(`Set Track State Error: Unknown trackName: ${trackName}`);
    return;
  }
}
