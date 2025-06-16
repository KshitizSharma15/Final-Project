import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tabs-employee',
  standalone: false,
  templateUrl: './tabs-employee.component.html',
  styleUrl: './tabs-employee.component.scss'
})
export class TabsEmployeeComponent {
  @Input() tabs: { label: string, content: string | any }[] = [];
  activeIndex = 0;
  setActive(index: number) {
    this.activeIndex = index;
  }
}
