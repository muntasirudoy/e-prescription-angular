import { CommonModule } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/modules/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-calling',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calling.component.html',
  styleUrl: './calling.component.scss',
  host: {
    class: 'calling',
  },
})
export class CallingComponent implements OnInit, OnDestroy {
  activeDot = 1;
  url: string = '';
  onCall = false;
  dialogRef = inject(MatDialogRef<CallingComponent>);
  private intervalId: any;
  isCancelCall: boolean = false;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any | undefined) {}

  private ringtone!: HTMLAudioElement;

  ngOnInit(): void {
    this.intervalId = setInterval(() => {
      this.activeDot = this.activeDot === 3 ? 1 : this.activeDot + 1;
    }, 600);

    const title = encodeURIComponent(this.data?.appointment?.patientName || '');
    const appointCode = encodeURIComponent(
      this.data?.appointment?.appointmentCode || ''
    );

    this.url = `https://soowgood-video-consult.pages.dev/?username=${title}&aptCode=${appointCode}&c=patient`;

    // Initialize and play the ringtone
    this.ringtone = new Audio('assets/police.soowgood/ring.mp3'); // Path to your file in src/assets/
    this.ringtone.loop = true; // Optional: loop the sound
    this.ringtone.play().catch((err) => {
      console.warn('Autoplay blocked:', err);
    });

    // After 5 seconds, stop sound, close dialog, and open URL
    setTimeout(() => {
      this.ringtone.pause();
      this.ringtone.currentTime = 0;
      this.dialogRef.close();
      if (!this.isCancelCall) {
        window.open(this.url, '_blank');
      }
      return;
    }, 15000);
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }
  cancelCall() {
    this.isCancelCall = true;
    this.ringtone.pause();
    this.ringtone.currentTime = 0;
    this.dialogRef.close();
    clearInterval(this.intervalId);
  }
}
