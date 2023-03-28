import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'hd-planet',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './planet.component.html',
  styleUrls: ['./planet.component.scss']
})
export class PlanetComponent {
  @Input() planet = undefined as any;
}
