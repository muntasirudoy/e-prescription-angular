import { CoreModule } from '@abp/ng.core';
import { registerLocale } from '@abp/ng.core/locale';
import { AbpOAuthModule } from '@abp/ng.oauth';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HotToastModule } from '@ngneat/hot-toast';
import { NgOtpInputModule } from 'ng-otp-input';
import { environment } from 'src/environments/environment';
import { AppComponent } from './app.component';
import { AppRouting } from './app.routing';
import { EmptyPageComponent } from './features-modules/public/empty-page/empty-page.component';
import { PaymentCancelComponent } from './features-modules/public/payment-cancel/payment-cancel.component';
import { PaymentFaildComponent } from './features-modules/public/payment-faild/payment-faild.component';
import { PaymentSuccessComponent } from './features-modules/public/payment-success/payment-success.component';
// import { SplashComponent } from './shared/components/splash/splash.component';
import { LoaderModule } from './shared/modules/loader/loader.module';
import { MaterialModulesModule } from './shared/modules/material-modules/material-modules.module';
import { AuthInterceptor } from './helper/auth.interceptor';
import { RouterModule } from '@angular/router';
import {
  FullscreenOverlayContainer,
  OverlayContainer,
} from '@angular/cdk/overlay';
import { PoliceSoowgoodComponent } from './police.soowgood/police.soowgood.component';

// const routerConfig: ExtraOptions = {
//   scrollPositionRestoration: 'enabled',
//   preloadingStrategy: PreloadAllModules,
// };

@NgModule({
  declarations: [
    AppComponent,
    EmptyPageComponent,
    PaymentSuccessComponent,
    PaymentFaildComponent,
    PaymentCancelComponent,
    // SplashComponent,
  ],
  imports: [
    BrowserModule,
    MatNativeDateModule,
    HttpClientModule,
    NgOtpInputModule,
    MatNativeDateModule,
    CoreModule.forRoot({
      environment,
      registerLocaleFn: registerLocale(),
    }),
    BrowserAnimationsModule,
    MaterialModulesModule,

    AppRouting,

    HotToastModule.forRoot({
      position: 'bottom-right',
    }),
    LoaderModule,
    MatSidenavModule,
    ReactiveFormsModule,
    FormsModule,

    AbpOAuthModule.forRoot(),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    { provide: OverlayContainer, useClass: FullscreenOverlayContainer }, // Override default OverlayContainer
  ],
  bootstrap: [AppComponent],
  exports: [
    MatDialogModule,
    ReactiveFormsModule,
    FormsModule,
    //, PaginatorComponent
  ],
})
export class AppModule {}
