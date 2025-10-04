import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { AgoraService } from '../../service/agora.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-join-modal',
  templateUrl: './join-modal.component.html',
  styleUrls: ['./join-modal.component.scss'],
})
export class JoinModalComponent implements OnInit, AfterViewInit {
  @ViewChild('modalOverlay') modalOverlay!: ElementRef<HTMLDivElement>;
  // @ViewChild('joinChannelForm') joinChannelForm!: ElementRef<HTMLFormElement>;
  @Output() joinChannel = new EventEmitter<void>();
  private appId = '9252f7bacb35417e9effa179f879b90b';

  username: string = '';
  aptCode: string = '';
  client: string = '';
  userID: string = '';
  constructor(
    private agoraService: AgoraService,
    private route: ActivatedRoute
  ) {}
  ngOnInit() {
    // this.checkMediaAccess();
    this.route.queryParams.subscribe((params) => {
      this.username = params['username'] || '';
      this.aptCode = params['aptCode'] || '';
      this.client = params['c'] || '';
    });
    // this.onSubmit();
  }
  ngAfterViewInit() {
    // this.modalOverlay?.nativeElement.classList.add('show');
  }

  async onSubmit() {
    console.log(this.aptCode, this.username);

    await this.agoraService.joinChannel(
      this.aptCode,
      null,
      this.username ?? null
    );
    this.joinChannel.emit();
  }
  hasAccess: boolean = true;

  checkMediaAccess() {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        console.log(stream);

        this.hasAccess = true;
      })
      .catch((error) => {
        this.hasAccess = false;
      });
  }
  // requestMediaAccess() {
  //   this.checkMediaAccess();
  // }
}
