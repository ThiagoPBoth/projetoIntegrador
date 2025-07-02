import {Component, OnInit} from '@angular/core';
import {CadastrarFormularioBancadaService} from '../../cadastrar-formulario-bancada.service';
import {FormularioBancada} from '../../../../../../../../../app-core/model/suino/certificacao-suinos/formularioBancada';
import {
   FormularioInterno
} from '../../../../../../../../../app-core/model/suino/certificacao-suinos/formulario-interno.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
   selector: 'app-form-interno-step',
   templateUrl: './form-interno-step-component.html',
   styleUrls: ['./form-interno-step-component.css']
})

export class FormInternoStepComponent implements OnInit {

   form: FormGroup;
   formularioBancada: FormularioBancada;

   constructor(private service: CadastrarFormularioBancadaService) {

   }

   ngOnInit(): void {
      this.formularioBancada = this.service.getFormularioBancada();
   }
}
