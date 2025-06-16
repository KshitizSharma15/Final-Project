import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-manager-cards',
  standalone: false,
  templateUrl: './manager-cards.component.html',
  styleUrl: './manager-cards.component.scss'
})
export class ManagerCardsComponent {
  @Input({required: true}) title!: string;
  @Input({required: true}) caption!:string;
  @Input({required: true}) data!: {name: string, time: string}[]
}
