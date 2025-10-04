import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  Observable,
  Subject,
  from,
  interval,
  map,
  mergeMap,
  of,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import {
  DynamicFormConfig,
  DynamicControl,
  DynamicOptions,
} from './utils/dynamic-forms.models';
import { FormControl, FormGroup } from '@angular/forms';
import { gender } from 'src/assets/gender';
const arr = [
  {
    name: 'abul',
  },
  {
    name: 'mofiz',
  },
  {
    name: 'korim',
  },
  {
    name: 'rohim',
  },
  {
    name: 'korim',
  },
];
@Component({
  selector: 'app-complete-profile',
  templateUrl: './complete-profile.component.html',
  styleUrls: ['./complete-profile.component.scss'],
})
export class CompleteProfileComponent implements OnInit {
  constructor(private NormalAuth: AuthService, private http: HttpClient) {}
  formLoadButton = new Subject<'user' | 'company'>();
  formConfig$!: Observable<DynamicFormConfig>;
  form!: FormGroup;

  ngOnInit(): void {
    this.formConfig$ = this.http
      .get<any>('/assets/doctor-personal-info-form.json')
      .pipe(
        tap(({ controls }) => {
          controls['gender'].options = gender;
          this.buildForm(controls);
        }),
        tap((res) => console.log(res))
      );

    this.formConfig$.subscribe();
  }

  buildForm(controls: DynamicFormConfig['controls']) {
    this.form = new FormGroup({});
    Object.keys(controls).forEach((c) => {
      this.form.addControl(c, new FormControl(controls[c].value));
    });
    console.log(this.form.value);
  }
}
