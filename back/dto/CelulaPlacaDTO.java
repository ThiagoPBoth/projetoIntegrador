package br.com.pdasrs.laboratorioapi.dto;

import br.com.pdasrs.laboratorioapi.model.CelulaPlacaId;
import br.com.pdasrs.laboratorioapi.model.ConteudoCelulaPlaca;
import br.com.pdasrs.laboratorioapi.model.PlacaFormularioBancada;
import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.*;

import javax.persistence.*;

@ToString
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CelulaPlacaDTO {

    private CelulaPlacaIdDTO id;
    //private PlacaFormularioBancadaDTO placaFormularioBancada;
    private ConteudoCelulaPlacaDTO conteudo;

}
