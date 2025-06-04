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

interface ConteudoCelulaPlaca {
   identificacaoAnimal?: string;
   identificacaoFrascoLaminaArmazenamento?: string;
   protocolo?: string;
}

interface CelulaPlaca {
   id: {
      linha: number;
      coluna: number;
   };
   conteudo?: ConteudoCelulaPlaca;
}

interface PlacaFormularioBancada {
   numero: string;
   celulas: CelulaPlaca[];
}

interface FormularioBancada {
   laboratorioId: number;
   identificador: string;
   placas: PlacaFormularioBancada[];
}

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
   dadosPlacas: any[] = [];

   // Placas processadas para exibição no grid
   placasProcessadas: any[];

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
      console.log('Tipo de Análise selecionado:', this.tipoAnalise);
   }

   // busca as ordens de servicos que ja passaram de analise critica e possuem o tipo da analise = tipoAnalise
   getOrdensServicos() {
      this.ordemServicoService.getIdOrdemServicoAmostrasValidas(this.laboratorio.id, this.tipoAnalise)
          .subscribe(ordens => {
             // armazena as ordens de servico - vem protocolo e id
             this.ordemServicos = ordens;
             this.loading = false;
             console.log(this.ordemServicos);
          });
   }

   // Método para buscar amostras com base nas ordens de serviço selecionadas no select
   buscarAmostras() {
      if (this.selectedOrdens.length > 0) {
         console.log(this.selectedOrdens);
         // o que esta em selectedOrdens jah sao as ordens filtradas por protocolo e doenca
         this.formularioBancadaService.findAllByIdOrdemServicosAndTipoAnalise(this.selectedOrdens, this.laboratorio.id)
            .subscribe({
               next: (data) => {
                  // dados retornados do endponit com as placas jah organizadas - lista de matrizes
                  this.dadosPlacas = data;
                  // jah processas os dados para apresentar no grid
                  this.processarDados();
               },
               error: (error) => {
                  console.error('Erro ao buscar amostras:', error);
               }
            });
      } else {
         PdsaSwal.fire({
            title: 'Atenção',
            text: 'Selecione ao menos um Protocolo!',
            icon: 'info',
            confirmButtonText: 'Ok',
         });
      }
   }
   processarDados(): void {
      // Converte o retorno do endpoint para o formato adequado para o grid
      // lista de placas, cada placa possui lista de linhas e cada linha possui lista de celulas
      this.placasProcessadas = this.dadosPlacas; /*converterRetornoParaGrid(this.dadosPlacas);*/
      console.log('Placas processadas:', this.placasProcessadas);
      // Limpa o mapeamento de cores ao processar novos dados
      this.protocoloParaCor.clear();
      this.proximaCorIndex = 0;

      // Gera a lista de protocolos únicos para a legenda
      // this.gerarListaProtocolosUnicos();
   }

   onClear(): void {
      this.placasProcessadas = [];
      this.protocolosUnicos = [];
   }

   // Método para gerar auma lista de protocolos únicos - util para a legenda da placa
   gerarListaProtocolosUnicos(): void {
      // Limpa a lista atual - aqui vao os protocolos unicos
      this.protocolosUnicos = [];

      // protocolos já processados - usado nas verificacoes internas
      const protocolosProcessados = new Set<string>();

      // Percorre todas as placas
      for (const placa of this.placasProcessadas) {
         // Percorre todas as linhas da placa
         for (const linha of placa) {
            // Percorre todas as celulas da linha
            for (const celula of linha) {
               // Verifica se a célula tem dados e protocolo
               if (this.temDados(celula) && celula.protocolo) {
                  // verifica se o protocolo da celula atual nao esta na lista de protocolos processados
                  if (!protocolosProcessados.has(celula.protocolo)) {
                     // se nao tiver na lista quer dizer que eh um novo protoclo
                     // entao adiciona o protocolo na lista de protocolos unicos
                     const cor = this.getCorParaProtocolo(celula.protocolo);
                     this.protocolosUnicos.push({
                        protocolo: celula.protocolo,
                        cor: cor
                     });

                     // Marca o protocolo como processado
                     protocolosProcessados.add(celula.protocolo);
                  }
               }
            }
         }
      }

      // Ordena a lista de protocolos para melhor visualização
      this.protocolosUnicos.sort((a, b) => a.protocolo.localeCompare(b.protocolo));
   }

   // Método para navegar para a próxima placa
   proximaPlaca(): void {
      if (this.placaAtual < this.placasProcessadas.length - 1) {
         this.placaAtual++;
      }
   }

   // Método para navegar para a placa anterior
   placaAnterior(): void {
      if (this.placaAtual > 0) {
         this.placaAtual--;
      }
   }

   // Método para verificar se uma célula tem dados
   temDados(celula: any): boolean {
      return celula !== null && celula !== undefined;
   }

   // Método para obter a classe CSS com base no conteúdo da célula
   getClasseCelula(celula: any): string {
      if (!this.temDados(celula)) {
         return 'celula-vazia';
      }
      // Adicione lógica para classes específicas com base nos dados
      return 'celula-com-dados';
   }

   // Método para obter a cor de fundo com base no protocolo
   getCorParaProtocolo(protocolo: string): string {
      if (!protocolo) { return '#f9f9f9'; } // cor padrão para células sem protocolo

      // Se já temos uma cor para este protocolo, retorne-a
      if (this.protocoloParaCor.has(protocolo)) {
         return this.protocoloParaCor.get(protocolo)!;
      }

      // Caso contrário, atribua uma nova cor
      const novaCor = this.coresDisponiveis[this.proximaCorIndex % this.coresDisponiveis.length];
      this.proximaCorIndex++;
      this.protocoloParaCor.set(protocolo, novaCor);
      return novaCor;
   }

   salvarPlaca(): void {
      this.formularioBancadaService.salvarPlacas(this.placasProcessadas).subscribe();
      PdsaSwal.fire({
         title: 'Sucesso',
         text: 'Salvo com Sucesso!',
         icon: 'success',
         confirmButtonText: 'Ok',
      }).then(() => {
         const path = './principal/suinos/formulario-bancada/visualizar/';
         this.router.navigate([path]);
         }
      );
   }
}
