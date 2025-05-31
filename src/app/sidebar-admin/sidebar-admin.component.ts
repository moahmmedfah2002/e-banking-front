import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { User } from '../modele/User';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar-admin',
  standalone: false,
  templateUrl: './sidebar-admin.component.html',
  styleUrl: './sidebar-admin.component.css'
})
export class SidebarAdminComponent {
  @Input()
  public user:User=new User();
  constructor(public router: Router) {
  }
}
