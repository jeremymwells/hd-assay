import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './components/home/home.component';

@Component({
  standalone: true,
  selector: 'hd-root',
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    HomeComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'hd-assay';
}
