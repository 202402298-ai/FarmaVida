import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html'
})
export class NavbarComponent implements OnInit {
  usuario: any = null;

  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.auth.getUsuario().subscribe(u => this.usuario = u);
  }

  logout() {
    this.auth.logout();
  }
}