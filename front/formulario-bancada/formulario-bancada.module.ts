import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router'; // <== IMPORTANTE
import { FormularioBancadaRoutingModule } from './formulario-bancada-routing.module'; // <== IMPORTANTE

import { CadastrarFormularioBancadaComponent } from './cadastrar/cadastrar-formulario-bancada';
import { PlacaStepComponent } from './cadastrar/steps/2-placa-step/placa-step.component';
import { PaginatorModule } from 'primeng/paginator';
import {FormModule} from '../../../../../../modulo-admin/components/principal/planilhas/forms/form.module';
import { NgSelectModule } from '@ng-select/ng-select';
import {PlacaPscAujComponent} from './components/placa-psc-auj.component';
import {DoencaStepComponent} from './cadastrar/steps/1-doenca-step/doenca-step.component';
import {FormularioBancadaComponent} from './formulario-bancada.component';
import {
   PdsaWizardFormularioBancadaComponent
} from '../../../../../../app-core/utils/components/pdsa-wizard/pdsa-wizard-formulario-bancada/pdsa-wizard-formulario-bancada.component';
import {VisualizarFormularioBancadaComponent} from './visualizar/visualizar-formulario-bancada.component';
import {DetalhesFormularioBancadaComponent} from './detalhes/detalhes-formulario-bancada.component';
import {PdsaCardModule} from '../../../../../../app-core/utils/components/pdsa-card/pdsa-card.module';
import {FormInternoStepComponent} from './cadastrar/steps/3-form-interno-step/form-interno-step-component';
import {FormInternoPscComponent} from './components/form-interno-psc/form-interno-psc.component';
import {
   VisualizarFormInternoPscComponent
} from './components/visualizar-form-interno-psc/visualizar-form-interno-psc.component';

@NgModule({
   declarations: [
      CadastrarFormularioBancadaComponent,
      FormularioBancadaComponent,
      VisualizarFormularioBancadaComponent,
      DoencaStepComponent,
      PlacaStepComponent,
      PlacaPscAujComponent,
      PdsaWizardFormularioBancadaComponent,
      DetalhesFormularioBancadaComponent,
      FormInternoStepComponent,
      FormInternoPscComponent,
      VisualizarFormInternoPscComponent
   ],
   imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      RouterModule,
      FormularioBancadaRoutingModule,
      PaginatorModule,
      FormModule,
      NgSelectModule,
      PdsaCardModule,
   ],
})
export class FormularioBancadaModule { }
