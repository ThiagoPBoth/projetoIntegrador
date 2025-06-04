import {SteppedService} from '../../../../../../../app-core/service/stepped.service';
import {Injectable} from '@angular/core';

@Injectable({
   providedIn: 'root'
})
export class CadastrarFormularioBancadaService extends SteppedService {
   doenca: number;
   constructor() {
      super([
         {
            step: 1,
            label: 'Selecionar Doença',
            stepStat: 'pending',
         },
         {
            step: 2,
               label: 'Cadastrar Placas',
            stepStat: 'pending',
         }
         ]);
   }

   showOnSteps(steps: number[]) {
      return steps.includes(this.step.value)
         ? this.step.value
         : '';
   }

   setDoenca(doenca: number) {
      this.doenca = doenca;
   }

   getDoenca(){
      return this.doenca;
   }
}
