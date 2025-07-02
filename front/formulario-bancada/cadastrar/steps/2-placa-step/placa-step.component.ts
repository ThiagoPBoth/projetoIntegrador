import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FilterDTO, OrdemServicoDTO} from '../../../../../../../../../app-core/dto/ordem-servico-dto';
import {Laboratorio} from '../../../../../../../../../app-core/model/laboratorio.model';
import {LaboratorioService} from '../../../../../../../../../app-core/service/laboratorio.service';
import {Usuario} from '../../../../../../../../../app-core/model/usuario.model';
import {LoginService} from '../../../../../../../../../app-core/service/login.service';
import {AmostraService} from '../../../../../../../../../app-core/service/laboratorio/amostra.service';
import {Observable} from 'rxjs';
import {
   OrdemServicoService
} from '../../../../../../../../../app-core/service/suinos/certificacao-suinos/ordem-servico.service';
import {ActivatedRoute, Route, Router} from '@angular/router';
import {CadastrarFormularioBancadaService} from '../../cadastrar-formulario-bancada.service';
import {
   FormularioBancadaService
} from '../../../../../../../../../app-core/service/laboratorio/formulario-bancada.service';
import Swal from 'sweetalert2';
import PdsaSwal from '../../../../../../../../../app-core/utils/pdsa-swal';
import {FormularioBancada} from '../../../../../../../../../app-core/model/suino/certificacao-suinos/formularioBancada';

interface ProtocoloLegenda {
   protocolo: string;
   cor: string;
}

@Component({
   selector: 'app-placa-step',
   templateUrl: './placa-step.component.html',
   styleUrls: ['./placa-step.component.css']
})

export class PlacaStepComponent implements OnInit {
   usuarioLogado: Usuario;

   // lab do usuario logado
   laboratorio: Laboratorio;

   // ordens de servicos que ja passaram de analise critica e sao de PSC
   ordemServicos: any[];

   // aqui vamos armazenar os ids das ordens de servico selecionados no select
   selectedOrdens: number[] = [];

   loading: boolean;

   // deve especificar qual tipo da analise - DOENCA
   // futuramente pegar do banco conforme o usuario escolher
   tipoAnalise = this.service.getDoenca();
   result: Observable<any>;

   // Dados das placas que virão do endpoint
   formularioBancada: FormularioBancada;

   // Controle de navegação entre placas
   placaAtual = 0;

   // Array para representar as letras das linhas do grid (A-H)
   letrasLinhas = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

   // Array para representar os números das colunas do grid (1-12)
   numerosColunas = Array.from({ length: 12 }, (_, i) => i + 1);

   // Lista de protocolos únicos para a legenda
   protocolosUnicos: {protocolo: string, cor: string}[] = [];

   // Mapeamento de cor por protocolo - cada protocolo vai ter uma cor
   protocoloParaCor: Map<string, string> = new Map();

   // Cores disponíveis para atribuir aos protocolos
   coresDisponiveis: string[] = [
      '#e3f2fd', '#64b5f6',
      '#e8f5e9', '#81c784',
      '#fff8e1', '#ffd54f',
      '#f3e5f5',  '#ba68c8'
   ];

   // Índice da próxima cor a ser atribuída
   proximaCorIndex = 0;

   constructor(private formularioBancadaService: FormularioBancadaService,
               private service: CadastrarFormularioBancadaService, private route: ActivatedRoute,
               private router: Router,
               private ordemServicoService: OrdemServicoService,
               private laboratorioService: LaboratorioService, private loginService: LoginService) {
      this.laboratorio = new Laboratorio();
      // pegando usuario logado
      this.usuarioLogado = this.loginService.getUsuarioLogado();
      // buscando o laboratorio do usuario logado
      this.laboratorioService.buscaLaboratorioPorUsuario(this.usuarioLogado).subscribe(data => {
         this.laboratorio = data;
         // jah busca as ordens de servicos
         if (this.laboratorio.id) {
            this.getOrdensServicos();
         }
      });
   }
   ngOnInit(): void {
   }

   // busca as ordens de servicos que ja passaram de analise critica e possuem o tipo da analise = tipoAnalise
   getOrdensServicos() {
      this.ordemServicoService.getIdOrdemServicoAmostrasValidas(this.laboratorio.id, this.tipoAnalise)
          .subscribe(ordens => {
             // armazena as ordens de servico - vem protocolo e id
             this.ordemServicos = ordens;
             this.loading = false;
          });
   }

   // Método para buscar amostras com base nas ordens de serviço selecionadas no select
   // jah vem do backend um formulario de bancada com as placas organizadas
   buscarAmostras() {
      if (this.selectedOrdens.length > 0) {
         // o que esta em selectedOrdens jah sao as ordens filtradas por protocolo e doenca
         this.formularioBancadaService.findAllByIdOrdemServicosAndTipoAnalise(this.selectedOrdens, this.laboratorio.id)
            .subscribe({
               next: (data) => {
                  // dados retornados do endponit com as placas jah organizadas - lista de matrizes
                  this.formularioBancada = data;
                  this.protocoloParaCor.clear();
                  this.proximaCorIndex = 0;
               },
            });
      } else {
         PdsaSwal.fire({
            title: 'Atenção',
            text: 'Selecione ao menos um Protocolo!',
            icon: 'info',
            confirmButtonText: 'Ok',
         }).then(() => {
            this.formularioBancada = null;
         });
      }
   }

   onClear(): void {
      this.formularioBancada = null;
   }

   salvarPlaca(): void {
      if (this.selectedOrdens.length > 0) {
         // melhoria futura verificar se os protocolos selecionado sao os mesmos do que os que estao nas placas
         // pode ocorrer so usuario selecionar protoclos e puxar as amostras, depois mudar os protocolos sem puxar
         // as amostras novamente e tentar salvar
         let pl: any = this.formularioBancada;
         this.formularioBancadaService.salvarPlacas(pl).subscribe( data => {
            let form: FormularioBancada = data;
            this.service.setFormularioBancada(form);
            PdsaSwal.fire({
               title: 'Sucesso',
               text: 'Salvo com Sucesso!',
               icon: 'success',
               confirmButtonText: 'Ok',
            }).then(() => {
                   this.service.nextStep();
                }
            );
         });
      } else {
         PdsaSwal.fire({
            title: 'Atenção',
            text: 'Selecione ao menos um Protocolo!',
            icon: 'info',
            confirmButtonText: 'Ok',
         }).then(() => {
            this.formularioBancada = null;
         });
      }
   }
}
