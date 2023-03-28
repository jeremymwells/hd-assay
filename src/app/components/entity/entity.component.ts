import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { akarIcon, akarArrowLeft } from '@ng-icons/akar-icons';
import { FilmComponent } from '../film/film.component';
import { PersonComponent } from '../person/person.component';
import { PlanetComponent } from '../planet/planet.component';
import { SpeciesComponent } from '../species/species.component';
import { StarshipComponent } from '../starship/starship.component';
import { VehicleComponent } from '../vehicle/vehicle.component';

@Component({
  selector: 'hd-entity',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NgIconComponent,
    FilmComponent,
    PersonComponent,
    PlanetComponent,
    SpeciesComponent,
    StarshipComponent,
    VehicleComponent,
  ],
  providers: [provideIcons({ akarIcon, akarArrowLeft })],
  templateUrl: './entity.component.html',
  styleUrls: ['./entity.component.scss']
})
export class EntityComponent {
  private _sub = new Subscription();
  category = '';
  entity = {} as any;
  imageUrl = [] as any
  constructor(
    private activeRoute: ActivatedRoute,
    private http: HttpClient
  ) {
    this.category = this.activeRoute.snapshot.params['category'];
    this.entity = this.activeRoute.snapshot.params['entity'];
    this._sub.add(this.http.get(`api/${this.category}/${this.entity}`).subscribe((entity: any) => {
      console.log('THE RESULT', entity);
      this.imageUrl = ['/', ...entity.url.split('/')];
      this.entity = entity;
    }));
  }
}
