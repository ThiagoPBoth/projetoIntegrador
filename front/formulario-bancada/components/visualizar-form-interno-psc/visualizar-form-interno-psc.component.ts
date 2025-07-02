import {Component, Input} from '@angular/core';
import {FormularioBancada} from '../../../../../../../../app-core/model/suino/certificacao-suinos/formularioBancada';

@Component({
   selector: 'app-visualizar-form-interno-psc',
   templateUrl: './visualizar-form-interno-psc.component.html',
   styleUrls: ['./visualizar-form-interno-psc.component.css']
})

export class VisualizarFormInternoPscComponent {
   @Input() formulario!: FormularioBancada;
   ngOnInit (): void {
      console.log("upa");
   }
}
