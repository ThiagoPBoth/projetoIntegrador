package br.com.pdasrs.laboratorioapi.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.*;

import javax.persistence.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Entity
@Table(name = "celula_placa", schema = "laboratorio")
public class CelulaPlaca {
    @EmbeddedId
    private CelulaPlacaId id;


    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("placaId") // Isso mapeia automaticamente o ID da placa para o campo placaId do ID composto
    @JoinColumn(name = "placa_formulario_bancada_id")
    private PlacaFormularioBancada placa;

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL, optional = false, orphanRemoval = true)
    @JoinColumn(name = "conteudo_celula_placa_id", referencedColumnName = "id", unique = true) // Cria a FK em celula_placa
    private ConteudoCelulaPlaca conteudo;
}
