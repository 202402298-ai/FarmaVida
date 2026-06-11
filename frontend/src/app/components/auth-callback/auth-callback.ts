import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth-callback',
  standalone: true,
  template: `<div class="text-center mt-5"><div class="spinner-border text-primary"></div><p class="mt-3">Iniciando sesión con Google...</p></div>`
})
export class AuthCallbackComponent implements OnInit {
  constructor(private route: ActivatedRoute, private router: Router, private auth: AuthService) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['token'] && params['usuario']) {
        this.auth.loginConGoogle(params['token'], JSON.parse(decodeURIComponent(params['usuario'])));
        this.router.navigate(['/dashboard']);
      } else {
        this.router.navigate(['/login']);
      }
    });
  }
}