import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, delay } from 'rxjs';
import { Medico } from 'src/app/models/medico.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { MedicoService } from 'src/app/services/medico.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [
  ]
})
export class MedicosComponent implements OnInit, OnDestroy {

  public cargando: boolean = true;
  public medicos: Medico[] = [];
  private imgSubs!: Subscription;

  constructor( private medicoService: MedicoService,
              private modalImagenService: ModalImagenService,
              private busquedasService: BusquedasService
              ){

  }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarMedicos();

    this.imgSubs = this.modalImagenService.nuevaImagen
        .pipe(
          delay(100)
        )
        .subscribe( img => {
          this.cargarMedicos()
    });
  }

  cargarMedicos(){
    this.cargando = true;
    this.medicoService.cargarMedicos()
        .subscribe( medicos => {
          this.cargando = false;
          this.medicos = medicos;
        });
  }

  buscar( termino: string) {

    if( termino.length == 0){
      return this.cargarMedicos();
    }

    this.busquedasService.buscar( 'medicos', termino )
                        .subscribe( resp => {
                          this.medicos = resp!;
                        })
  }

  abrirModal( medico: Medico ){
    this.modalImagenService.abrirModal( 'hospitales', medico._id! , medico.img );
  }

  borrarMedico( medico: Medico ){

    Swal.fire({
      title: "Borrar Medico?",
      text: `Esta a punto de borrar a ${ medico.nombre }`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Si, borrarlo"
    }).then((result) => {
      if (result.isConfirmed) {

        this.medicoService.borrarMedicos( medico._id! )
            .subscribe( resp => {

              this.cargarMedicos()

              Swal.fire(
                'Medico borrado',
                `${ medico.nombre } fue eliminado correctamente`,
                'success'
              );

            });
      }
    });

  }


}
