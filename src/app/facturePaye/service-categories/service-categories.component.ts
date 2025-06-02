import {Component, EventEmitter, NgIterable, Output} from '@angular/core';

@Component({
  selector: 'app-service-categories',
  standalone: false,
  templateUrl: './service-categories.component.html',
  styleUrl: './service-categories.component.css'
})
export class ServiceCategoriesComponent {
  @Output() categorySelected = new EventEmitter<string>();
  categories: (NgIterable<unknown> & NgIterable<any>) | undefined | null;
  private _id: any;

  selectCategory(id: any) {
    this._id = id;

  }
}
