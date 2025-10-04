import { Component } from '@angular/core';
import { MatChipListboxChange, MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-filter-options',
  standalone: true,
  imports: [MatChipsModule],
  templateUrl: './filter-options.component.html',
})
export class FilterOptionsComponent {
  availableColors = [
    { name: 'Emergency', color: undefined },
    { name: 'Online Schedule', color: 'primary' },
    { name: 'Chamber', color: 'accent' },
  ];
  onSelectChip(value: string) {
    console.log(value);
  }
  onSelectionChange(event: any) {
    console.log('Selected Value:', event.value);
  }
}
