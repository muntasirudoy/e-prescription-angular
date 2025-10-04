import {
  Component,
  ComponentRef,
  OnInit,
  OnDestroy,
  ViewChild,
  ViewContainerRef,
  AfterViewInit,
} from '@angular/core';
import { IAgoraRTCClient, IAgoraRTCRemoteUser } from 'agora-rtc-sdk-ng';
import { AgoraService } from '../../service/agora.service';
import { RemoteUserComponent } from '../remote-user/remote-user.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-remote-stream',
  templateUrl: './remote-stream.component.html',
  styleUrls: ['./remote-stream.component.scss'],
})
export class RemoteStreamComponent implements OnInit, OnDestroy {
  client: IAgoraRTCClient;
  remoteUserComponentRefs: Map<string, ComponentRef<RemoteUserComponent>>;
  displayName: any;
  @ViewChild('remoteVideoContainer', { read: ViewContainerRef })
  remoteVideoContainer!: ViewContainerRef;
  userType: any;

  constructor(
    private agoraService: AgoraService,
    private route: Router,
    private AuthService: AuthService
  ) {
    this.client = this.agoraService.getClient();
    this.remoteUserComponentRefs = new Map();
  }

  ngOnInit(): void {
    // add listeners when component mounts
    this.client.on('user-published', this.handleRemoteUserPublished);
    this.client.on('user-unpublished', this.handleRemoteUserUnpublished);
    this.userType = this.AuthService.authInfo()?.userType;
  }

  ngOnDestroy(): void {
    // remove listeners when component is removed
    this.client.off('user-published', this.handleRemoteUserPublished);
    this.client.off('user-unpublished', this.handleRemoteUserUnpublished);
  }

  private handleRemoteUserPublished = async (
    user: IAgoraRTCRemoteUser,
    mediaType: 'audio' | 'video' | 'datachannel'
  ) => {
    await this.client.subscribe(user, mediaType);
    if (mediaType === 'audio') {
      console.log(mediaType);

      user.audioTrack?.play();
    } else if (mediaType === 'video') {
      const uid = user.uid;
      this.displayName = user.uid ?? '';
      // create a remote user component for each new remote user and add to DOM
      const remoteUserComponentRef: ComponentRef<RemoteUserComponent> =
        this.remoteVideoContainer.createComponent(RemoteUserComponent);
      remoteUserComponentRef.instance.uid = uid;
      remoteUserComponentRef.instance.onReady = (remoteUserDiv: any) => {
        user.videoTrack?.play(remoteUserDiv);
      };
      this.remoteUserComponentRefs.set(uid.toString(), remoteUserComponentRef);
    }
  };

  private handleRemoteUserUnpublished = async (
    user: IAgoraRTCRemoteUser,
    mediaType: 'audio' | 'video' | 'datachannel'
  ) => {
    if (mediaType === 'video') {
      const remoteUserUid = user.uid.toString();
      // retrieve the div from remoteUserComponentRefs and remove it from DOM
      const componentRef = this.remoteUserComponentRefs.get(remoteUserUid);
      if (componentRef) {
        const viewIndex = this.remoteVideoContainer.indexOf(
          componentRef?.hostView
        );
        this.remoteVideoContainer.remove(viewIndex);
        // remove entry from remoteUserComponentRefs
        this.remoteUserComponentRefs.delete(remoteUserUid);
      } else {
        console.log(`Unable to find remoteUser with UID: ${user.uid}`);
      }
    }
  };

  clearRemoteUsers(): void {
    this.remoteVideoContainer.clear();
    this.remoteUserComponentRefs.clear();
    this.route.navigate([this.userType + '/' + 'appointments']);
  }
}
