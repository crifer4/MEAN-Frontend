import { Component, OnDestroy } from '@angular/core';
import { Observable, Subscription, filter, interval, map, retry, take } from 'rxjs';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: [
  ]
})
export class RxjsComponent implements OnDestroy {

  public intervalSubs: Subscription;

  ngOnDestroy(): void {
    this.intervalSubs.unsubscribe();
  }

  constructor() {

    /* this.retornaObservable().pipe(
      retry()
    ).subscribe(
      valor => console.log('Subs: ', valor),
      error => console.log('Error: ', error),
      () => console.log('Obs terminado'),
    ); */

    this.intervalSubs = this.retornaIntervalo()
        .subscribe(
          ( valor ) => console.log( valor ),
          //o dejar solo console.log dentro del subscribe
        )
  }


  retornaIntervalo(): Observable<number> {

    return interval(500)
          .pipe(
            map( valor => {
              return valor + 1;
            }),
            filter( valor => ( valor % 2 === 0 ) ? true : false ),
            //take(10),
          );

  }

  retornaObservable(): Observable<number>{
    let i = -1;

    //const obs$ = new Observable...
    return new Observable<number>( observer => {

      const intervalo = setInterval( () => {

        i++;

        observer.next( i );

        if ( i  === 4 ){
          clearInterval( intervalo );
          observer.complete();
        }

        if ( i === 2 ){
          observer.error( 'i llego a 2' );
        }

      },1000);
    });


  }

}
