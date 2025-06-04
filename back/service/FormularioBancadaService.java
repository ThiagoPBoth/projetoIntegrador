package br.com.pdasrs.laboratorioapi.service;

import br.com.pdasrs.laboratorioapi.dto.*;
import br.com.pdasrs.laboratorioapi.model.*;
import br.com.pdasrs.laboratorioapi.repository.FormularioBancadaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FormularioBancadaService {

    private final FormularioBancadaRepository formularioBancadaRepository;

    public FormularioBancadaDTO findAllByIdOrdemServicosAndTipoAmostra(List<Long> idOrdemServicos, Long idLab) {
        // buscar amostras
        List<ConteudoCelulaPlacaDTO> amostras = this.formularioBancadaRepository.getAmostrasByOrdemServicoTipoAmostra(idOrdemServicos);
        System.out.println(amostras.toString());
        FormularioBancadaDTO f = montarFormularioBancada(amostras, idLab);
        return f;
        // ja criar toda estrutura de um formulario de bancada

    }

    public FormularioBancadaDTO montarFormularioBancada(List<ConteudoCelulaPlacaDTO> conteudos, Long laboratorioId) {
        final int TAMANHO_PLACA = 96;
        final int NUM_LINHAS = 8;
        final int NUM_COLUNAS = 12;

        FormularioBancadaDTO formulario = new FormularioBancadaDTO();
        LocalDate hoje = LocalDate.now();
        int ano = hoje.getYear();
        int mes = hoje.getMonthValue(); // 1 = Janeiro, 12 = Dezembro

        System.out.println("Ano: " + ano);
        System.out.println("Mês: " + mes);
        int quantidade = this.formularioBancadaRepository.buscarQuantidadeFormularios();
        String identificador = quantidade + "-" + mes + "/" + ano;

        formulario.setIdentificador(identificador);
        formulario.setLaboratorioId(laboratorioId);
        formulario.setPlacas(new ArrayList<>());

        if (conteudos == null || conteudos.isEmpty()) {
            return formulario;
        }

        int numeroPlacaAtual = 1;
        PlacaFormularioBancadaDTO placaAtual = null;

        for (int i = 0; i < conteudos.size(); i++) {
            int indiceNaPlaca = i % TAMANHO_PLACA;

            // Cria nova placa se necessário
            if (indiceNaPlaca == 0) {
                placaAtual = new PlacaFormularioBancadaDTO();
                placaAtual.setNumero("placa " + numeroPlacaAtual);
                placaAtual.setCelulas(new HashSet<>());
                formulario.adicionarPlaca(placaAtual);
                numeroPlacaAtual++;
            }

            // *** ALTERAÇÃO AQUI: Cálculo por colunas ***
            int coluna = indiceNaPlaca / NUM_LINHAS;  // Divisão inteira
            int linha = indiceNaPlaca % NUM_LINHAS;   // Resto da divisão

            CelulaPlacaIdDTO celulaId = new CelulaPlacaIdDTO();
            celulaId.setLinha(linha);
            celulaId.setColuna(coluna);

            CelulaPlacaDTO celula = new CelulaPlacaDTO();
            celula.setId(celulaId);
            celula.setConteudo(conteudos.get(i));

            if (placaAtual != null) {
                placaAtual.adicionarCelula(celula);
            }
        }
        return formulario;
    }

    // Método para buscar todos os formulários bancários simplificados por ID do laboratório
    public List<FormularioBancadaSimplificadoDTO> findAllByIdLab(Long laboratorioId) {
        // Busca o formulário bancário pelo ID do laboratório;
        return formularioBancadaRepository.findAllByIdLab(laboratorioId);
    }

    // Método para criar um novo formulário bancário
    public void criarFormularioBancada(FormularioBancadaDTO form) {
        // primeiro converte o que vem do front para a entidade model
        FormularioBancada formularioBancada = converterFormularioBancada(form);
        // salva o formulario de bancada e com cascade as placas e células tambem
        formularioBancadaRepository.save(formularioBancada);

    }

    // recebe o dto do front e converte para a entidade model
    private FormularioBancada converterFormularioBancada(FormularioBancadaDTO dto) {

        if (dto == null) {
            return null;
        }

        // Formulario de n=bancada de fato
        FormularioBancada entidade = new FormularioBancada();

        // Copia os atributos simples
        // Não copia o ID para permitir que o banco gere um novo automaicamenet
        entidade.setLaboratorioId(dto.getLaboratorioId());


        entidade.setIdentificador(dto.getIdentificador());

        // Converte a lista de placas recursivamente
        // verifica se nao eeh nula e se tem pelo menos uma placa
        if (dto.getPlacas() != null && !dto.getPlacas().isEmpty()) {
            // placa do model instanciada
            List<PlacaFormularioBancada> placasEntidade = new ArrayList<>();

            // para cada placa chama a funcao que converte de dto para entidade model
            for (PlacaFormularioBancadaDTO placaDto : dto.getPlacas()) {
                PlacaFormularioBancada placaEntidade = converterPlacaFormularioBancada(placaDto);
                if (placaEntidade != null) {
                    // vai adiocionando na lista de placas
                    placasEntidade.add(placaEntidade);
                }
            }

            // adiciona na entidade FormularioBancada as placas
            entidade.setPlacas(placasEntidade);
        }

        return entidade;
    }

    /**
     * Converte um PlacaFormularioBancadaDTO para uma entidade PlacaFormularioBancada
     * @param dto O objeto DTO a ser convertido
     * @return A entidade PlacaFormularioBancada correspondente
     */
    public static PlacaFormularioBancada converterPlacaFormularioBancada(PlacaFormularioBancadaDTO dto) {
        if (dto == null) {
            return null;
        }

        // Cria a entidade MODEL PlacaFormularioBancada
        PlacaFormularioBancada entidade = new PlacaFormularioBancada();
        // seta o unico atributo simples
        entidade.setNumero(dto.getNumero());

        // Primeiro salva a placa sem células
        // placa passa a ter uma coleção de células inicializada, pronta para receber elementos
        Set<CelulaPlaca> celulasEntidade = new HashSet<>();
        entidade.setCelulas(celulasEntidade);

        // Depois adiciona as células com referência à placa
        if (dto.getCelulas() != null) {
            // para cada celula da placa chama o conversor
            for (CelulaPlacaDTO celulaDto : dto.getCelulas()) {
                CelulaPlaca celulaEntidade = converterCelulaPlaca(celulaDto, entidade);
                if (celulaEntidade != null) {
                    celulasEntidade.add(celulaEntidade);
                }
            }
        }

        return entidade;
    }

    /**
     * Converte um CelulaPlacaDTO para uma entidade CelulaPlaca
     * @param dto O objeto DTO a ser convertido
     * @return A entidade CelulaPlaca correspondente
     */
    public static CelulaPlaca converterCelulaPlaca(CelulaPlacaDTO dto, PlacaFormularioBancada placa) {
        if (dto == null) {
            return null;
        }

        CelulaPlaca entidade = new CelulaPlaca();

        // Converte o ID composto
        CelulaPlacaId id = converterCelulaPlacaId(dto.getId());
        entidade.setId(id);

        // Define a referência para a placa - o @MapsId cuidará de preencher o placaId no ID composto
        entidade.setPlaca(placa);

        // Converte o conteúdo
        if (dto.getConteudo() != null) {
            entidade.setConteudo(converterConteudoCelulaPlaca(dto.getConteudo()));
        }

        return entidade;
    }

    /**
     * Converte um CelulaPlacaIdDTO para uma entidade CelulaPlacaId
     * @param dto O objeto DTO a ser convertido
     * @return A entidade CelulaPlacaId correspondente
     */
    public static CelulaPlacaId converterCelulaPlacaId(CelulaPlacaIdDTO dto) {
        if (dto == null) {
            return null;
        }

        CelulaPlacaId entidade = new CelulaPlacaId();

        // Copia apenas linha e coluna
        // O placaId será definido após a persistência da placa
        entidade.setLinha(dto.getLinha());
        entidade.setColuna(dto.getColuna());

        return entidade;
    }

    /**
     * Converte um ConteudoCelulaPlacaDTO para uma entidade ConteudoCelulaPlaca
     * @param dto O objeto DTO a ser convertido
     * @return A entidade ConteudoCelulaPlaca correspondente
     */
    public static ConteudoCelulaPlaca converterConteudoCelulaPlaca(ConteudoCelulaPlacaDTO dto) {
        if (dto == null) {
            return null;
        }

        ConteudoCelulaPlaca entidade = new ConteudoCelulaPlaca();

        // Copia os atributos simples
        // Não copiamos o ID para permitir que o banco gere um novo
        // entidade.setId(dto.getId());
        entidade.setIdentificacaoAnimal(dto.getIdentificacaoAnimal());
        entidade.setIdentificacaoFrascoLaminaArmazenamento(dto.getIdentificacaoFrascoLaminaArmazenamento());
        entidade.setProtocolo(dto.getProtocolo());

        return entidade;
    }

    /**
     * Busca um formulário completo pelo ID e converte para DTO
     * Usa abordagem segura que não modifica a coleção gerenciada pelo Hibernate
     *
     * @param formularioId ID do formulário
     * @return FormularioBancadaDTO ou null se não encontrado
     */
    @Transactional(readOnly = true)
    public FormularioBancadaDTO findFormularioCompletoById(Long formularioId) {
        // dividido em duas partes:
        // 1. Busca o formulário com todos os relacionamentos
        Optional<FormularioBancada> formularioOpt = formularioBancadaRepository.findByIdWithEntityGraph(formularioId);

        if (!formularioOpt.isPresent()) {
            return null;
        }


        PlateReaderParser parser = new PlateReaderParser();
        try {


            PlateReaderResult result = parser.parse(new File("PSC01280525_20250530140207.csv"));
            parser.printAbsorbance(result);

        } catch (IOException e) {
            e.printStackTrace();
        }


        // 2. Converte para DTO, removendo duplicatas durante a conversão
        // Importante: Não modificamos a entidade original, apenas criamos um DTO limpo
        return converterFormularioParaDTOSemDuplicatas(formularioOpt.get());
    }

    /**
     * Método auxiliar para converter um formulário para DTO removendo duplicatas
     * sem modificar a coleção original gerenciada pelo Hibernate
     */
    private FormularioBancadaDTO converterFormularioParaDTOSemDuplicatas(FormularioBancada formulario) {
        FormularioBancadaDTO dto = new FormularioBancadaDTO();

        // Copia os atributos simples
        dto.setId(formulario.getId());
        dto.setLaboratorioId(formulario.getLaboratorioId());
        dto.setIdentificador(formulario.getIdentificador());

        // Inicializa a lista de placas no DTO
        dto.setPlacas(new ArrayList<>());

        // Processa as placas removendo duplicatas durante a conversão para DTO
        if (formulario.getPlacas() != null && !formulario.getPlacas().isEmpty()) {
            // Usa um Set para detectar placas já processadas pelo ID
            Set<Long> placasProcessadas = new HashSet<>();

            for (PlacaFormularioBancada placa : formulario.getPlacas()) {
                // Só processa cada placa uma vez
                if (placa.getId() != null && !placasProcessadas.contains(placa.getId())) {
                    placasProcessadas.add(placa.getId());

                    // Converte a placa para DTO e adiciona à lista
                    PlacaFormularioBancadaDTO placaDTO = converterPlacaParaDTO(placa);
                    dto.adicionarPlaca(placaDTO);
                }
            }
        }

        return dto;
    }

    /**
     * Método auxiliar para converter uma placa para DTO
     */
    private PlacaFormularioBancadaDTO converterPlacaParaDTO(PlacaFormularioBancada placa) {
        PlacaFormularioBancadaDTO dto = new PlacaFormularioBancadaDTO();

        // Copia os atributos simples
        dto.setId(placa.getId());
        dto.setNumero(placa.getNumero());

        // Converte as células
        if (placa.getCelulas() != null && !placa.getCelulas().isEmpty()) {
            for (CelulaPlaca celula : placa.getCelulas()) {
                CelulaPlacaDTO celulaDTO = converterCelulaParaDTO(celula);
                dto.adicionarCelula(celulaDTO);
            }
        }

        return dto;
    }

    /**
     * Método auxiliar para converter uma célula para DTO
     */
    private CelulaPlacaDTO converterCelulaParaDTO(CelulaPlaca celula) {
        if (celula == null) {
            return null;
        }

        CelulaPlacaDTO dto = new CelulaPlacaDTO();

        // Converte o ID composto
        if (celula.getId() != null) {
            CelulaPlacaIdDTO idDTO = new CelulaPlacaIdDTO();
            idDTO.setPlacaId(celula.getId().getPlacaId());
            idDTO.setLinha(celula.getId().getLinha());
            idDTO.setColuna(celula.getId().getColuna());
            dto.setId(idDTO);
        }

        // Converte o conteúdo
        if (celula.getConteudo() != null) {
            ConteudoCelulaPlacaDTO conteudoDTO = new ConteudoCelulaPlacaDTO();
            conteudoDTO.setId(celula.getConteudo().getId());
            conteudoDTO.setIdentificacaoAnimal(celula.getConteudo().getIdentificacaoAnimal());
            conteudoDTO.setIdentificacaoFrascoLaminaArmazenamento(celula.getConteudo().getIdentificacaoFrascoLaminaArmazenamento());
            conteudoDTO.setProtocolo(celula.getConteudo().getProtocolo());
            dto.setConteudo(conteudoDTO);
        }

        return dto;
    }

    // ______________________________________________________________________
    // sobre resultado de placa

    public class PlateReaderResult {
        // Seção: Informações Básicas
        public Map<String, String> basicInfo = new HashMap<>();

        // Seção: Layout
        public List<String> layoutColumnHeaders = new ArrayList<>();
        public List<LayoutRow> layoutRows = new ArrayList<>();

        // Seção: Dados de Absorbância
        public String filter;
        public int readings;
        public List<String> absorbanceColumnHeaders = new ArrayList<>();
        public List<AbsorbanceRow> absorbanceRows = new ArrayList<>();

        // Classes auxiliares
        public static class LayoutRow {
            public String rowId;
            public List<String> values = new ArrayList<>();
        }

        public static class AbsorbanceRow {
            public String rowId;
            public List<Float> values = new ArrayList<>();
        }
    }



    public class PlateReaderParser {  // Renomeamos para refletir melhor a função
        private String currentSection;
        private PlateReaderResult result;

        public PlateReaderResult parse(File file) throws IOException {
            this.result = new PlateReaderResult();
            this.currentSection = null;

            try (BufferedReader br = new BufferedReader(new FileReader(file))) {
                String line;
                while ((line = br.readLine()) != null) {
                    processLine(line.trim());
                }
            }
            return result;
        }

        private void processLine(String line) {
            if (line.isEmpty()) {
                if ("basic".equals(currentSection)) currentSection = null;
                return;
            }

            // Identificação de seções
           if (line.equals("Dados de Absorbancia:")) {
                currentSection = "absorbance";
                result.absorbanceColumnHeaders = new ArrayList<>();
                result.absorbanceRows = new ArrayList<>();
            }
            // Processamento específico por seção
            else if (currentSection != null) {
                switch (currentSection) {
                    case "absorbance" -> parseAbsorbance(line);
                }
            }
        }



        private void parseAbsorbance(String line) {
            // Linha de configuração do filtro
            if (line.startsWith("Filtro ")) {
                result.filter = line.split(":", 2)[1].trim();
            }
            // Linha de número de leituras
            else if (line.startsWith("Leituras:")) {
                try {
                    result.readings = Integer.parseInt(line.split(":")[1].trim());
                } catch (Exception e) {
                    result.readings = -1;
                }
            }
            // Linha de cabeçalho de colunas
            else if (result.absorbanceColumnHeaders.isEmpty()) {
                String[] tokens = line.split("\\s*,\\s*");
                for (int i = 1; i < tokens.length; i++) {
                    if (!tokens[i].isEmpty()) {
                        result.absorbanceColumnHeaders.add(tokens[i]);
                    }
                }
            }
            // Linhas de dados
            else {
                String[] tokens = line.split("\\s*,\\s*");
                if (tokens.length > 0 && tokens[0].length() == 1) {
                    PlateReaderResult.AbsorbanceRow row = new PlateReaderResult.AbsorbanceRow();
                    row.rowId = tokens[0];

                    for (int i = 1; i < tokens.length; i++) {
                        try {
                            row.values.add(Float.parseFloat(tokens[i]));
                        } catch (NumberFormatException e) {
                            row.values.add(Float.NaN);
                        }
                    }
                    result.absorbanceRows.add(row);

                    // Finaliza seção após 8 linhas
                    if (result.absorbanceRows.size() == 8) {
                        currentSection = null;
                    }
                }
            }
        }

        private static void printAbsorbance(PlateReaderResult result) {
            System.out.println("\n==== ABSORBÂNCIA ====");
            System.out.println("Filtro: " + result.filter);
            System.out.println("Leituras: " + result.readings);

            System.out.print("    ");
            for (int col = 1; col <= 12; col++) {
                System.out.printf("%-8s", col);
            }
            System.out.println();

            for (PlateReaderResult.AbsorbanceRow row : result.absorbanceRows) {
                System.out.printf("%-3s ", row.rowId);
                for (Float value : row.values) {
                    System.out.printf("%-8.3f", value);
                }
                System.out.println();
            }
        }


    }
}
