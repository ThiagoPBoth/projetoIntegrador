package br.com.pdasrs.laboratorioapi.dto;

import br.com.pdasrs.laboratorioapi.model.CelulaPlaca;
import br.com.pdasrs.laboratorioapi.model.FormularioBancada;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.*;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@ToString
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PlacaFormularioBancadaDTO {

    private Long id;
    private String numero;
    //private FormularioBancadaDTO formularioBancada;
    private Set<CelulaPlacaDTO> celulas = new HashSet<>();
    public void adicionarCelula(CelulaPlacaDTO celula) {
        celulas.add(celula);
    }

}
