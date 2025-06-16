import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-schedule-cards',
  standalone: false,
  templateUrl: './schedule-cards.component.html',
  styleUrl: './schedule-cards.component.scss'
})
export class ScheduleCardsComponent {
  @Input({required: true}) title!: string;
  @Input({required: true}) caption!:string;

  @Input() UpcomingShifts?: {
    date: string;
    time: string;
  }[];

  @Input() PreviousAttendances?: {
    date: string;
    checkInTime: string | null;
    checkOutTime: string | null;
  }[];
}
