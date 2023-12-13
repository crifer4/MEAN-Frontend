import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImagenPipe } from './imagen.pipe';



@NgModule({
  declarations: [
    ImagenPipe
  ],
  exports: [
    ImagenPipe
  ],
  imports: [

  ]
})
export class PipesModule { }
