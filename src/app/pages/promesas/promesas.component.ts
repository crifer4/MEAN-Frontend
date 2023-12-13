import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-promesas',
  templateUrl: './promesas.component.html',
  styles: [
  ]
})
export class PromesasComponent implements OnInit {

  ngOnInit(): void {

    this.getUsuarios().then( usuarios => {
      console.log( usuarios )
    });

    /* const promesa = new Promise( ( resolve, reject ) => {

      if ( false ){
        resolve('Hola mundo');
      }else{
        reject('algo paso');
      }

    });

    promesa.then( ( res ) => {
      console.log( res );
    })
    .catch( ( e ) => {
      console.log( e );
    }); */

  }

  getUsuarios(){

    return new Promise( ( resolve, reject ) => {

          fetch('https://reqres.in/api/users')
          .then( ( res ) => res.json() )
          .then( ( body ) => resolve( body.data ) );

    } );

  }

}
