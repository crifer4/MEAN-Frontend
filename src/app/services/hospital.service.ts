import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environments';
import { Hospital } from '../models/hospital.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  constructor( private http: HttpClient
              ) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers(): any  {
    return {
        'x-token': this.token
    };
  }

  cargarHospitales( ): Observable<Hospital[]> {

    const url = `${ base_url }/hospitales`;
    return this.http.get<{ ok: boolean, hospitales: Hospital[] }>(url, { headers: this.headers } )
            .pipe(
              map( (resp: { ok: boolean, hospitales: Hospital[] } ) => resp.hospitales )
            );

  }

  crearHospitales( nombre: string ){

    const url = `${ base_url }/hospitales`;
    return this.http.post<{ ok: boolean, hospitales: Hospital[] }>(url, { nombre } , { headers: this.headers } );

  }

  actualizarHospitales( _id: string, nombre: string ){

    const url = `${ base_url }/hospitales/${ _id }`;
    return this.http.post<{ ok: boolean, hospitales: Hospital[] }>(url, { nombre } , { headers: this.headers } );

  }

  borrarHospitales( _id: string){

    const url = `${ base_url }/hospitales/${ _id }`;
    return this.http.delete<{ ok: boolean, hospitales: Hospital[] }>(url , { headers: this.headers } );

  }


}
