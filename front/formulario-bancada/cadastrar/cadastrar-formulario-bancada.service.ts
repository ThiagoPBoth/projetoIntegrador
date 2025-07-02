import {SteppedService} from '../../../../../../../app-core/service/stepped.service';
import {Injectable} from '@angular/core';
import {FormularioBancada} from '../../../../../../../app-core/model/suino/certificacao-suinos/formularioBancada';

@Injectable({
   providedIn: 'root'
})
export class CadastrarFormularioBancadaService extends SteppedService {
   doenca: number;
   formularioBancada: FormularioBancada;

   constructor() {
      super([
         { step: 1, label: 'Selecionar Doença',         stepStat: 'pending' },
         { step: 2, label: 'Cadastrar Placas',          stepStat: 'pending' },
         { step: 3, label: 'Cadastrar Formulário Interno', stepStat: 'pending' }
      ]);
   }

   showOnSteps(steps: number[]) {
      return steps.includes(this.step.value)
         ? this.step.value
         : '';
   }

    // Limpa todos os dados e reseta os steps
   resetAll(): void {
      this.doenca = null;
      this.formularioBancada = null;

      // marca todas as etapas como "pending"
      this.steps.forEach(s => s.stepStat = 'pending');

      // volta para a etapa 1
      this.step.next(1);
   }

   setDoenca(doenca: number) {
      this.doenca = doenca;
   }

   getDoenca(): number {
      return this.doenca;
   }

   setFormularioBancada(formularioBancada: FormularioBancada) {
      this.formularioBancada = formularioBancada;
   }

   getFormularioBancada(): FormularioBancada {
      return this.formularioBancada;
   }
}
