import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { akarIcon, akarArrowLeft } from '@ng-icons/akar-icons';

@Component({
  selector: 'hd-category',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NgIconComponent
  ],
  providers: [provideIcons({ akarIcon, akarArrowLeft })],
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent {
  private _sub = new Subscription();
  defaultImage = '/assets/img/placeholder.jpg';
  category = '';
  entities: any[] = [];
  constructor(
    private activeRoute: ActivatedRoute,
    private http: HttpClient
  ) {
    this.category = this.activeRoute.snapshot.params['category'];
    this._sub.add(this.http.get(`api/${this.category}`).subscribe((entities: any) => {
      this.entities = entities;
    }))
  }

  src(entity: any, event: any = {}) {
    const defaultSrc = 'placeholder';
    if (!Object.keys(entity).length || !entity.url) {
      console.log('SHOULD BE DEFAULT');
      event.target.src = `assets/img/${defaultSrc}.jpg`;
    }
    return `assets/img/${entity.url ? entity.url : defaultSrc}.jpg`;
  }

  url(theUrl: string) {
    return `/${theUrl}`;
  }
}
