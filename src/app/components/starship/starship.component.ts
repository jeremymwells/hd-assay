import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'hd-starship',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './starship.component.html',
  styleUrls: ['./starship.component.scss']
})
export class StarshipComponent {
  @Input() starship = undefined as any;
}
