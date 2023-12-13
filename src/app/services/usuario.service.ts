import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { RegisterForm } from '../interfaces/registerForm.interface';
import { environment } from 'src/environments/environments';
import { LoginForm } from '../interfaces/login-form.interface';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';
import { CargarUsuario } from '../interfaces/cargar-usuarios.interface';
import Swal from 'sweetalert2';

declare const google: any;
declare const gapi: any;

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public auth2: any;
  public usuario!: Usuario;

  constructor( private http: HttpClient,
                private router: Router,
                private ngZone: NgZone,
                private usuarioService: UsuarioService
              ) {
    this.googleInit();
  }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get role(): 'ADMIN_ROLE' | 'USER_ROLE' {
    return this.usuario.role!;
  }

  get uid():string {
    return this.usuario!.uid || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

  guardarLocalStorage( token: string, menu: any ){
    localStorage.setItem('token', token);
    localStorage.setItem('menu', JSON.stringify(menu) );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('menu');

    this.auth2.signOut().then(() => {
      this.ngZone.run(() => {
        this.router.navigateByUrl('/login');
      })
    });
  }

  tokenValidation(): Observable<boolean> {

    return this.http.get(`${ base_url }/login/renew`, {
      headers: {
        'x-token': this.token
      }
    }).pipe(
      map( (resp: any) => {
        const { email, google, nombre, role, img = '', uid } = resp.usuario;
        this.usuario = new Usuario( nombre, email, '', img, google, role, uid );

        this.guardarLocalStorage( resp.token, resp.menu);

        return true;
      }),
      catchError( error => of(false) )
    );
  }

  crearUsuario( formData: RegisterForm) {

    return this.http.post(`${ base_url }}/usuarios`, formData)
                    .pipe(
                      tap( (resp: any) => {
                        this.guardarLocalStorage( resp.token, resp.menu);
                      })
                    );

  }

  actualizarPerfil( data: { email: string, nombre: string, role: string } ) {

    data = {
      ...data,
      role: this.usuario.role!
    }

    return this.http.put(`${ base_url }/usuarios/${ this.uid }`, data, this.headers );

  }

  login( formData: LoginForm) {

    return this.http.post(`${ base_url }}/login`, formData)
                    .pipe(
                      tap( (resp: any) => {
                        this.guardarLocalStorage( resp.token, resp.menu);
                      })
                    );


  }

  loginGoogle( token: string) {
    return this.http.post(`${ base_url }}/login/google`, { token })
                    .pipe(
                      tap( (resp: any) => {
                        this.guardarLocalStorage( resp.token, resp.menu);
                      })
                    );
  }

  googleInit() {

    return new Promise<void>( resolve => {
      gapi.load('auth2', () => {
        this.auth2 = gapi.auth2.init({
          client_id: '1042980711249-en1spiipjjkd7a0um2a7nvn3qa86ts15.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
        });

        resolve();
      });
    })

  }

  cargarUsuarios( desde: number = 0 ) {

    const url = `${ base_url }/usuarios?desde=${ desde }`;
    return this.http.get<CargarUsuario>( url, this.headers )
                    .pipe(
                      map( resp => {
                        const usuarios = resp.usuarios.map(
                          user => new Usuario(user.nombre, user.email, '',
                                                user.img, user.google, user.role, user.uid)
                        );
                        return {
                          total: resp.total,
                          usuarios
                        }
                      })
                    )
  }

  eliminarUsuario( usuario: Usuario ) {

    // /usuarios/655e1b65496c19a1ca218b0d
    const url = `${ base_url }/usuarios/${ usuario.uid }`;
    return this.http.delete( url, this.headers );

  }

  guardarUsuario( usuario: Usuario ) {

    return this.http.put(`${ base_url }/usuarios/${ usuario.uid }`, usuario, this.headers );

  }

}
