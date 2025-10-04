// import { Injectable, Injector, Pipe, PipeTransform } from '@angular/core';
// import { CONTROL_DATA, DynamicData } from '../control.data.token';
// @Injectable()
// @Pipe({
//   name: 'controlInjector',
//   standalone: true,
// })
// export class ControlInjector implements PipeTransform {
//   transform(key: string, config: DynamicData) {
//     return Injector.create({
//       providers: [
//         {
//           provide: CONTROL_DATA,
//           useValue: {
//             controlKey: key,
//             config,
//           },
//         },
//       ],
//     });
//   }
// }
import { Injectable, Injector, Pipe, PipeTransform } from '@angular/core';
import { CONTROL_DATA, DynamicData } from '../control.data.token';
import { MatDialogRef } from '@angular/material/dialog'; // Import MatDialogRef

@Injectable()
@Pipe({
  name: 'controlInjector',
  standalone: true,
})
export class ControlInjector implements PipeTransform {
  constructor(
    private dialogRef: MatDialogRef<any>,
    private injector: Injector
  ) {} // Inject MatDialogRef

  transform(key: string, config: DynamicData) {
    // Provide MatDialogRef along with other dependencies
    return Injector.create({
      providers: [
        {
          provide: CONTROL_DATA,
          useValue: {
            controlKey: key,
            config,
          },
        },
        {
          provide: MatDialogRef,
          useValue: this.dialogRef,
        },
      ],
      parent: this.injector,
    });
  }
}
