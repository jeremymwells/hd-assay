import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'hd-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  private _sub = new Subscription();

  categories: any[] = [];
  constructor(private http: HttpClient) {
    this._sub.add(this.http.get('api/').subscribe((categories: any) => {
      
      this.categories = categories;
    }));
  }
  
}
