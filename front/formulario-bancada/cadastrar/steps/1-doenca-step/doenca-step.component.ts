import {Component, OnInit} from '@angular/core';
import {Usuario} from '../../../../../../../../../app-core/model/usuario.model';
import {Laboratorio} from '../../../../../../../../../app-core/model/laboratorio.model';
import {Observable} from 'rxjs';
import {LoginService} from '../../../../../../../../../app-core/service/login.service';
import {LaboratorioService} from '../../../../../../../../../app-core/service/laboratorio.service';
import {TipoAnaliseService} from '../../../../../../../../../app-core/service/laboratorio/tipo-analise.service';
import {CadastrarFormularioBancadaService} from '../../cadastrar-formulario-bancada.service';
import pdsaSwal from '../../../../../../../../../app-core/utils/pdsa-swal';
import Swal from 'sweetalert2';
import PdsaSwal from '../../../../../../../../../app-core/utils/pdsa-swal';

@Component({
   selector: 'app-doenca-step',
   templateUrl: './doenca-step.component.html',
   styleUrls: ['./doenca-step.component.css']
})

export class DoencaStepComponent implements OnInit {
   private usuarioLogado: Usuario;
   private laboratorio: Laboratorio;
   // ids das doemncas selecionados no select
   selectedDoenca: number = null;
   doencas: Observable<any>;
   constructor(private cadastrarFormularioBancadaService: CadastrarFormularioBancadaService,
               private loginService: LoginService,
               private laboratorioService: LaboratorioService,
               private tipoAnaliseService: TipoAnaliseService) {
      this.laboratorio = new Laboratorio();
      // pegando usuario logado
      this.usuarioLogado = this.loginService.getUsuarioLogado();
      // buscando o laboratorio do usuario logado
      this.laboratorioService.buscaLaboratorioPorUsuario(this.usuarioLogado).subscribe(data => {
         this.laboratorio = data;
         // jah busca as ordens de servicos
         if (this.laboratorio.id) {
            this.buscarDoencas();
         }
      });
   }
   ngOnInit(): void {
   }

   buscarDoencas(): void {
      this.tipoAnaliseService.findAllByLab(this.laboratorio.id)
         .subscribe(tipoAnalises => {
            // armazena as ordens de servico - vem protocolo e id
            this.doencas = tipoAnalises;
         });
   }

   onClear(): void {
      this.selectedDoenca = null;
   }

   criarFormularioBancada(): void {
      if (this.selectedDoenca !== null) {
         this.cadastrarFormularioBancadaService.setDoenca(this.selectedDoenca);
         this.cadastrarFormularioBancadaService.nextStep();
      } else {
         PdsaSwal.fire({
            title: 'Atenção',
            text: 'Selecione uma Doença!',
            icon: 'info',
            confirmButtonText: 'Ok',
         });
      }
   }
}
