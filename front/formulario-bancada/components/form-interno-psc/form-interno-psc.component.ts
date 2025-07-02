import {Component, Input, OnInit} from '@angular/core';
import {FormularioBancada} from '../../../../../../../../app-core/model/suino/certificacao-suinos/formularioBancada';
import {
   FormularioInterno
} from '../../../../../../../../app-core/model/suino/certificacao-suinos/formulario-interno.model';
import {CadastrarFormularioBancadaService} from '../../cadastrar/cadastrar-formulario-bancada.service';
import {
   FormularioBancadaService
} from '../../../../../../../../app-core/service/laboratorio/formulario-bancada.service';
import {
   PlacaFormularioBancada
} from '../../../../../../../../app-core/model/suino/certificacao-suinos/placaFormularioBancada';
import PdsaSwal from '../../../../../../../../app-core/utils/pdsa-swal';
import {Router} from '@angular/router';
import {LaboratorioService} from '../../../../../../../../app-core/service/laboratorio.service';

@Component({
   selector: 'app-form-interno-psc',
   templateUrl: './form-interno-psc.component.html',
   styleUrls: ['./form-interno-psc.component.css']
})
export class FormInternoPscComponent implements OnInit {
   // MUITO IMORTANTE - o que recebe no input nao pode ser alterado pois quebra um component pai
   @Input() formularioBancada!: FormularioBancada;
   formTeste: FormularioBancada;
   rtsLaboratorio: any[] = [];
   exibirForm: any[] = [];

   constructor (private service: FormularioBancadaService,
                private router: Router,
                private cadastrarService: CadastrarFormularioBancadaService,
                private laboratorioService: LaboratorioService) {
   }

   ngOnInit() {
      this.formTeste = this.formularioBancada;
      this.laboratorioService.findAllRTByIdLaboratorio(this.formularioBancada.laboratorioId).subscribe(rts => {
         this.rtsLaboratorio = rts;
      });
     for (let i = 0; i < this.formTeste.placas.length; i++) {
        this.exibirForm[i] = false;
      }
   }

   // Método para alternar a expansão
   toggleExpansao(i: any) {
      this.exibirForm[i] = !this.exibirForm[i];
   }

   // vincula um formulario interno a placa
   salvar(i: number, lote: string, termometroAmbiente: string) {
      if (lote != null && lote != undefined && lote != '') {
         if (termometroAmbiente != null && termometroAmbiente != undefined && termometroAmbiente != '') {
            if (!this.formTeste.placas[i].formularioInterno) {
               this.formTeste.placas[i].formularioInterno = new FormularioInterno();
            }

            console.log("lote" + lote);
            console.log("ternoimetro" + termometroAmbiente);
            this.formTeste.placas[i].formularioInterno.lote = lote;
            this.formTeste.placas[i].formularioInterno.termometroAmbiente = termometroAmbiente;

            this.exibirForm[i] = false;

            console.log('Placa atualizada:', this.formTeste.placas);
            // Aqui você pode adicionar lógica para enviar para a API, etc.
         }
      }
   }

   // vai enviar os forms internos das placas para o backend
   salvarForms (): void {
      // primeiro necesssariamos verifiar se todas placas receberam um formulari interno
      const placaFormularioBancadas: PlacaFormularioBancada[] = this.formTeste.placas;
      let numeroPlacas: string[] = [];
      let verificarFormularioInterno: boolean = false;
      // itera pelas placas
      placaFormularioBancadas.forEach((placa) => {
         // caso uma placa nao tenha formulario interno setamos a variavel de verificacao para true e salvamos o
         // numero da placa - importante em seguida para alertar usuario
         if (!placa.formularioInterno) {
            verificarFormularioInterno = true;
            numeroPlacas.push(placa.numero);
         }
      });

      // caso a variavel de verificacao esteja false, ou seja, todas as placas tem formulario interno
      if (!verificarFormularioInterno) {
         this.service.salvarFormInternoPsc(this.formTeste).subscribe(data => {
            this.formTeste = data;
            let placas: PlacaFormularioBancada[]  = this.formTeste.placas;
            let erro: boolean = false;
            placas.forEach(placa => {
               if (placa.formularioInterno == null) {
                  erro = true;
               }
            });
            if (erro) {
               PdsaSwal.fire({
                  title: 'Erro',
                  text: 'Erro ao Tentar Salvar!',
                  icon: 'error',
                  confirmButtonText: 'Ok',
               }).then(() => {
                     this.cadastrarService.resetAll();
                     this.router.navigate(['principal/suinos/formulario-bancada/visualizar/']);
                  }
               );
            } else {
               console.log('Formulário interno PSC salvo com sucesso:', this.formTeste);
               PdsaSwal.fire({
                  title: 'Sucesso',
                  text: 'Salvo com Sucesso!',
                  icon: 'success',
                  confirmButtonText: 'Ok',
               }).then(() => {
                     this.cadastrarService.resetAll();
                     this.router.navigate(['principal/suinos/formulario-bancada/visualizar/']);
                  }
               );         }
         });
      } else {
         // caso a variavel de verificacao esteja true, ou seja, pelo menos uma placa nao tem formulario interno
         // mostra quais placas nao tem formulario interno
         PdsaSwal.fire({
            title: 'Aviso',
            text: 'Os formulários das seguintes placas não foram salvos: ' + numeroPlacas,
            icon: 'warning',
            confirmButtonText: 'Ok',
         });
      }
   }
}
