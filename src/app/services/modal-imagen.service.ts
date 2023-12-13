import { EventEmitter, Injectable } from '@angular/core';
import { environment } from 'src/environments/environments';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class ModalImagenService {

  public tipo!: 'usuarios'| 'medicos'| 'hospitales';
  public id!: string;
  public img?: string;

  public nuevaImagen: EventEmitter<string> = new EventEmitter<string>();

  private _ocultarModal: boolean = true;

  get ocultarModal(){
    return this._ocultarModal;
  }

  abrirModal(
    tipo: 'usuarios'| 'medicos'| 'hospitales',
    id: string,
    img: string = 'no-image'
    ){
    this._ocultarModal = false;
    this.tipo = tipo;
    this.id = id;
    this.img = img;
    //localhost:3000/api/uploads/medicos/72accf9c-d3e0-4765-8dd4-ab8b8e4c8f2c.jpeg
    if ( img.includes('https') ) {
      this.img = img;
    } else {
      this.img = `${ base_url }/upload/${ tipo }/${ img }`;
    }
  }

  cerrarModal(){
    this._ocultarModal = true;
  }

  constructor() { }
}
