import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environments';
import { Medico } from '../models/medico.model';
import { Observable, map } from 'rxjs';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  constructor( private http: HttpClient) {

   }

   get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers(): any  {
    return {
        'x-token': this.token
    };
  }

  cargarMedicos( ): Observable<Medico[]> {

    const url = `${ base_url }/medicos`;
    return this.http.get<{ ok: boolean, medicos: Medico[] }>(url, { headers: this.headers } )
            .pipe(
              map( (resp: { ok: boolean, medicos: Medico[] } ) => resp.medicos )
            );

  }

  obtenerMedicoPorId( id: string ){

    const url = `${ base_url }/medicos/${ id }`;
    return this.http.get<{ ok: boolean, medico: Medico }>(url, { headers: this.headers } )
            .pipe(
              map( (resp: { ok: boolean, medico: Medico } ) => resp.medico )
            );

  }

  crearMedicos( medico: { nombre: string, hospital: string } ){

    const url = `${ base_url }/medicos`;
    return this.http.post<{ ok: boolean, medicos: Medico[] }>(url, medico , { headers: this.headers } );

  }

  actualizarMedicos( medico: Medico ){

    const url = `${ base_url }/medicos/${ medico._id }`;
    return this.http.post<{ ok: boolean, medicos: Medico[] }>(url, medico, { headers: this.headers } );

  }

  borrarMedicos( _id: string){

    const url = `${ base_url }/medicos/${ _id }`;
    return this.http.delete<{ ok: boolean, medicos: Medico[] }>(url , { headers: this.headers } );

  }
}
