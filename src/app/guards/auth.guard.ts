import { inject } from '@angular/core';
import { CanActivateFn, CanMatchFn, Router } from '@angular/router';
import { tap } from 'rxjs';
import { UsuarioService } from '../services/usuario.service';

export const canMatch: CanMatchFn = () => {
  const router = inject(Router);
  return inject(UsuarioService).tokenValidation()
    .pipe(
      tap( isAuthenticated => {
        if ( !isAuthenticated ) router.navigateByUrl('/login');
      })
    )
}

export const AuthGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);

  return inject(UsuarioService).tokenValidation()
    .pipe(
      tap( isAuthenticated => {
        if ( !isAuthenticated ) router.navigateByUrl('/login');
      })
    )
};
