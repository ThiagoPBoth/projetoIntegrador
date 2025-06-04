import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';

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
   selector: 'app-placa-psc-auj',
   templateUrl: './placa-psc-auj.component.html',
   styleUrls: ['./placa-psc-auj.css']
})
export class PlacaPscAujComponent implements OnInit {

   // recebe os dados certinhos do formulário bancada para mostrar as placas
   @Input() formulario!: FormularioBancada;

   placaAtual: PlacaFormularioBancada | null = null;
   placaIndex = 0;

   // Matriz para representar a placa visualmente (8 linhas x 12 colunas)
   matrizPlaca: Array<Array<CelulaPlaca | null>> = [];

   // Letras para as linhas (A-H)
   letrasLinhas = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

   // Números para as colunas (1-12)
   numerosColuna = Array.from({ length: 12 }, (_, i) => i + 1);

   // Mapeamento de protocolos para cores
   mapaCoresProtocolos: Map<string, string> = new Map();

   // Lista de cores predefinidas para protocolos
   coresPredefinidas: string[] = [
      '#d4edda', // Verde claro
      '#f8d7da', // Vermelho claro
      '#d1ecf1', // Azul claro
      '#fff3cd', // Amarelo claro
      '#e2e3e5', // Cinza claro
      '#d8e2f3', // Azul lavanda
      '#f2dede', // Rosa claro
      '#e8f5e9', // Verde menta
      '#ede7f6', // Roxo claro
      '#ffebee', // Rosa salmão
      '#e0f7fa', // Ciano claro
      '#fff8e1', // Âmbar claro
      '#f3e5f5', // Roxo lavanda
      '#e8eaf6', // Índigo claro
      '#fce4ec'  // Rosa pálido
   ];

   // Lista de legendas para exibição
   legendasProtocolos: ProtocoloLegenda[] = [];

   ngOnInit(): void {
      this.inicializarComponente();
   }

   // Detecta mudanças no Input formulario
   ngOnChanges(changes: SimpleChanges): void {
      if (changes['formulario'] && changes['formulario'].currentValue) {
         // Reinicializa o componente quando o formulário mudar
         this.inicializarComponente();
      }
   }

   inicializarComponente(): void {
      if (this.formulario && this.formulario.placas && this.formulario.placas.length > 0) {
         // Força a reconstrução da matriz no carregamento inicial
         this.placaIndex = 0;
         this.placaAtual = this.formulario.placas[0];

         // Gera um mapa de cores para protocolos - cada protocolo terá uma cor única
         this.gerarMapaCoresProtocolos();

         // Constrói a matriz
         this.construirMatrizPlaca();

         // Log para debug
         console.log('Componente inicializado com', this.formulario.placas.length, 'placas');
         console.log('Placa atual:', this.placaAtual);
         console.log('Legendas de protocolos:', this.legendasProtocolos);
      }
   }

   // Gera um mapa de cores para cada protocolo único encontrado
   gerarMapaCoresProtocolos(): void {

      // Limpa o mapa e legendas anteriores
      this.mapaCoresProtocolos.clear();
      this.legendasProtocolos = [];

      // Conjunto para armazenar protocolos únicos
      const protocolosUnicos = new Set<string>();

      // Coleta todos os protocolos únicos de todas as placas
      if (this.formulario && this.formulario.placas) {
         this.formulario.placas.forEach(placa => {
            if (placa.celulas) {
               placa.celulas.forEach(celula => {
                  if (celula.conteudo && celula.conteudo.protocolo) {
                     protocolosUnicos.add(celula.conteudo.protocolo);
                  }
               });
            }
         });
      }

      // Atribui uma cor para cada protocolo único
      let indice = 0;
      protocolosUnicos.forEach(protocolo => {
         // Usa cores predefinidas em ciclo
         const cor = this.coresPredefinidas[indice % this.coresPredefinidas.length];
         this.mapaCoresProtocolos.set(protocolo, cor);

         // Adiciona à lista de legendas
         this.legendasProtocolos.push({
            protocolo: protocolo,
            cor: cor
         });

         indice++;
      });
   }

   mostrarPlaca(index: number): void {
      if (this.formulario && this.formulario.placas && index >= 0 && index < this.formulario.placas.length) {
         this.placaIndex = index;
         this.placaAtual = this.formulario.placas[index];
         this.construirMatrizPlaca();

         // Log para debug
         console.log('Mostrando placa', index, this.placaAtual);
      }
   }

   construirMatrizPlaca(): void {
      // Inicializa a matriz vazia 8x12
      this.matrizPlaca = Array(8).fill(null).map(() => Array(12).fill(null));

      // Preenche a matriz com as células existentes
      if (this.placaAtual && this.placaAtual.celulas) {
         this.placaAtual.celulas.forEach(celula => {
            const linha = celula.id.linha;
            const coluna = celula.id.coluna;

            // Verifica se os índices estão dentro dos limites da matriz
            if (linha >= 0 && linha < 8 && coluna >= 0 && coluna < 12) {
               this.matrizPlaca[linha][coluna] = celula;
            }
         });

         // Log para debug
         console.log('Matriz construída com', this.placaAtual.celulas.length, 'células');
      }
   }

   proximaPlaca(): void {
      if (this.placaIndex < this.formulario.placas.length - 1) {
         this.mostrarPlaca(this.placaIndex + 1);
      }
   }

   placaAnterior(): void {
      if (this.placaIndex > 0) {
         this.mostrarPlaca(this.placaIndex - 1);
      }
   }

   // Método para obter a classe CSS baseada no conteúdo da célula
   getClasseCelula(celula: CelulaPlaca | null): string {
      if (!celula || !celula.conteudo) {
         return 'celula-vazia';
      }
      return 'celula-preenchida';
   }

   // Método para obter o estilo da célula baseado no protocolo
   getEstiloCelula(celula: CelulaPlaca | null): any {
      if (!celula || !celula.conteudo || !celula.conteudo.protocolo) {
         return {}; // Sem estilo específico para células vazias
      }

      const protocolo = celula.conteudo.protocolo;
      const cor = this.mapaCoresProtocolos.get(protocolo) || '#f8f9fa'; // Cor padrão se não encontrar

      return {
         'background-color': cor,
         'border': '1px solid ' + this.ajustarTomCor(cor, -20) // Borda um pouco mais escura
      };
   }

   // Ajusta o tom de uma cor (clareia ou escurece)
   ajustarTomCor(cor: string, porcentagem: number): string {
      // Função simplificada para ajustar o tom - em produção, use uma biblioteca de cores
      if (!cor.startsWith('#')) return cor;

      // Converte hex para RGB
      const r = parseInt(cor.substr(1, 2), 16);
      const g = parseInt(cor.substr(3, 2), 16);
      const b = parseInt(cor.substr(5, 2), 16);

      // Ajusta os valores
      const ajuste = porcentagem / 100;
      const novoR = Math.max(0, Math.min(255, Math.round(r + (r * ajuste))));
      const novoG = Math.max(0, Math.min(255, Math.round(g + (g * ajuste))));
      const novoB = Math.max(0, Math.min(255, Math.round(b + (b * ajuste))));

      // Converte de volta para hex
      return '#' +
         novoR.toString(16).padStart(2, '0') +
         novoG.toString(16).padStart(2, '0') +
         novoB.toString(16).padStart(2, '0');
   }

   // Método para obter o texto a ser exibido na célula
   getTextoCelula(celula: CelulaPlaca | null): string {
      if (!celula || !celula.conteudo) {
         return '';
      }
      const animal = celula.conteudo.identificacaoAnimal ?? '';
      const frasco = celula.conteudo.identificacaoFrascoLaminaArmazenamento ?? '';

      return `
    Id. Animal:<br>${animal}<br>
    Frasco:<br> ${frasco}
  `;
   }

   // Método para obter o tooltip da célula com informações detalhadas
   getTooltipCelula(celula: CelulaPlaca | null): string {
      if (!celula || !celula.conteudo) {
         return 'Célula vazia';
      }

      const animal = celula.conteudo.identificacaoAnimal || 'N/A';
      const frasco = celula.conteudo.identificacaoFrascoLaminaArmazenamento || 'N/A';
      const protocolo = celula.conteudo.protocolo || 'N/A';

      return `Animal: ${animal}\nFrasco/Lâmina: ${frasco}\nProtocolo: ${protocolo}`;
   }

   // Trunca texto longo para exibição na legenda
   truncarTexto(texto: string, tamanhoMaximo: number = 20): string {
      if (!texto) return '';
      return texto.length > tamanhoMaximo ? texto.substring(0, tamanhoMaximo) + '...' : texto;
   }
}
