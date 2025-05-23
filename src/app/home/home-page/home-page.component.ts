import {Component, inject, OnInit} from '@angular/core';
import {User} from '../../modele/User';
import {Router} from '@angular/router';
import {HomeService} from '../../services/homeService';

@Component({
  selector: 'app-home-page',
  standalone: false,
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent implements OnInit{
  public user:User=new User();
  public homeService:HomeService=inject(HomeService);
  public router:Router=inject(Router);
  ngOnInit(): void {
    let token=sessionStorage.getItem('authToken');
    if(token==null){
      this.router.navigate(['/login']);

    }else{
     this.homeService.getUser(token).subscribe(e=>{
       this.user=e;

     })
    }


  }


}
