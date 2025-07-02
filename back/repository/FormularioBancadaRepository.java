package br.com.pdasrs.laboratorioapi.repository;

import br.com.pdasrs.laboratorioapi.dto.ConteudoCelulaPlacaDTO;
import br.com.pdasrs.laboratorioapi.dto.FormularioBancadaDTO;
import br.com.pdasrs.laboratorioapi.dto.FormularioBancadaSimplificadoDTO;
import br.com.pdasrs.laboratorioapi.model.FormularioBancada;
import br.com.pdasrs.laboratorioapi.model.PlacaFormularioBancada;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FormularioBancadaRepository extends JpaRepository<FormularioBancada, Long> {


    /**
     * Recupera uma lista de amostras resumidas com base nos IDs das ordens de serviço
     *
     * A consulta retorna os seguintes campos:
     * - `identificacaoAnimal`: Identificação do animal.
     * - `identificacaoFrascoLaminaArmazenamento`: Identificação do frasco ou lâmina de armazenamento.
     * - `protocolo`: Protocolo associado à ordem de serviço.
     * - `ordemServicoId`: ID da ordem de serviço.
     *
     * A consulta utiliza uma junção entre as tabelas `laboratorio.amostra` e `laboratorio.ordem_servico`.
     *
     * @param idOrdemServicos Lista de IDs das ordens de serviço a serem filtradas
     * @return Lista de objetos `AmostraPlacaDTO` contendo os dados resumidos das amostras.
     */
    @Query("SELECT NEW br.com.pdasrs.laboratorioapi.dto.ConteudoCelulaPlacaDTO(" +
            "a.identificacao_animal, " +
            "a.identificacao_frasco_lamina_armazenamento, " +
            "os.protocolo) " +
            "FROM Amostra a " +
            "JOIN OrdemServico os ON os.id = a.ordemServicoId " +
            "WHERE os.id IN :idOrdemServicos")
    List<ConteudoCelulaPlacaDTO> getAmostrasByOrdemServicoTipoAmostra(
            @Param("idOrdemServicos") List<Long> idOrdemServicos
    );

    @Query(value = """
    SELECT 
        fb.id as id, fb.identificador AS identificador,
        ARRAY_AGG(DISTINCT ccp.protocolo) AS protocolos
    FROM laboratorio.formulario_bancada fb
    INNER JOIN laboratorio.placa_formulario_bancada pfb 
        ON fb.id = pfb.formulario_bancada_id
    INNER JOIN laboratorio.celula_placa cp 
        ON pfb.id = cp.placa_formulario_bancada_id
    INNER JOIN laboratorio.conteudo_celula_placa ccp 
        ON cp.conteudo_celula_placa_id = ccp.id
    WHERE fb.laboratorio_id = :laboratorioId
    GROUP BY fb.id
    """, nativeQuery = true)
    List<FormularioBancadaSimplificadoDTO> findAllByIdLab(@Param("laboratorioId") Long laboratorioId);


    @Query(value = """
       SELECT COUNT(*) FROM laboratorio.formulario_bancada
    """, nativeQuery = true)
    int buscarQuantidadeFormularios();


    /**
     * Busca um FormularioBancada pelo ID com todos os seus relacionamentos carregados
     * (placas, células e conteúdos)
     *
     * @param id ID do formulário
     * @return FormularioBancada com todos os relacionamentos carregados
     */
    @Query("SELECT f FROM FormularioBancada f " +
            "LEFT JOIN FETCH f.placas p " +
            "LEFT JOIN FETCH p.celulas c " +
            "LEFT JOIN FETCH c.conteudo " +
            "WHERE f.id = :id")
    FormularioBancada findByIdWithAllRelationships(@Param("id") Long id);

    /**
     * Busca um FormularioBancada pelo ID usando EntityGraph para carregar todos os relacionamentos
     *
     * @param id ID do formulário
     * @return FormularioBancada com todos os relacionamentos carregados
     */
    @EntityGraph(attributePaths = {
            "placas",
            "placas.celulas",
            "placas.celulas.conteudo"
    })
    @Query("SELECT f FROM FormularioBancada f WHERE f.id = :id")
    Optional<FormularioBancada> findByIdWithEntityGraph(@Param("id") Long id);

}
