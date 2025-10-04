import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  OnInit,
  AfterViewInit,
} from '@angular/core';
import { UID } from 'agora-rtc-sdk-ng';

@Component({
  selector: 'app-remote-user',
  templateUrl: './remote-user.component.html',
  styleUrls: ['./remote-user.component.scss'],
})
export class RemoteUserComponent implements OnInit, AfterViewInit {
  @Input() uid!: UID; // The UID input for the remote user
  @Input() onReady?: (element: HTMLElement) => void; // Optional callback to handle element ready
  @ViewChild('remoteVideo', { static: false })
  remoteVideo!: ElementRef<HTMLElement>;

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    // Called once the component is initialized
    console.log(`Remote user component initialized for UID: ${this.uid}`);
  }

  ngAfterViewInit(): void {
    // Ensuring the view is fully initialized and `remoteVideo` is available
    if (this.remoteVideo && this.remoteVideo.nativeElement) {
      if (this.onReady) {
        this.onReady(this.remoteVideo.nativeElement); // Trigger the callback if provided
      }
    } else {
      console.error('Remote video element not found');
    }
  }

  // Getter for native element
  get nativeElement(): HTMLElement {
    return this.elementRef.nativeElement;
  }

  // Getter for the remote video div ID
  get remoteVideoDivId(): string {
    return this.remoteVideo?.nativeElement?.id || '';
  }
}
