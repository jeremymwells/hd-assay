import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { akarIcon, akarArrowLeft } from '@ng-icons/akar-icons';

@Component({
  selector: 'hd-film',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NgIconComponent
  ],
  providers: [provideIcons({ akarIcon, akarArrowLeft })],
  templateUrl: './film.component.html',
  styleUrls: ['./film.component.scss']
})
export class FilmComponent {
  @Input() film = undefined as any;


  src(entity: any, event: any = {}) {
    const defaultSrc = 'assets/img/placeholder.jpg';

    if (!entity?.url) {
      return defaultSrc;
    } else if (event?.target?.src) {
      return (event.target.src = defaultSrc);
    } else {
      return `assets/img/${entity.url}.jpg`
    }
  }

  url(theUrl: string) {
    return `/${theUrl}`;
  }
}
