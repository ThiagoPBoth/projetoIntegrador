import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CadastrarFormularioBancadaComponent} from './cadastrar/cadastrar-formulario-bancada';
import {VisualizarFormularioBancadaComponent} from './visualizar/visualizar-formulario-bancada.component';
import {DetalhesFormularioBancadaComponent} from './detalhes/detalhes-formulario-bancada.component';

const routes: Routes = [
   {
      path: 'cadastrar',
      component: CadastrarFormularioBancadaComponent,
   },
   {
      path: 'visualizar',
      component: VisualizarFormularioBancadaComponent,
   },
   {
      path: 'detalhes/:formularioBancadaId',
      component: DetalhesFormularioBancadaComponent,
   }
];

@NgModule({
   imports: [RouterModule.forChild(routes)],
   exports: [RouterModule]
})
export class FormularioBancadaRoutingModule { }
