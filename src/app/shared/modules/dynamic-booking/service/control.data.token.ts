import { InjectionToken } from '@angular/core';

export type DynamicData = {
  doctorDetails?: object;
  doctorScheduleInfo: any[];
  isAuthUser?: boolean;
  isAccess?: boolean;
};

export interface ControlData {
  controlKey: string;
  config: DynamicData;
}

export const CONTROL_DATA = new InjectionToken<ControlData>('control data');
