package br.com.pdasrs.laboratorioapi.dto;

import br.com.pdasrs.laboratorioapi.model.PlacaFormularioBancada;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

/*
public interface FormularioBancadaDTO {

    Long getFormulario_id();
    String[] getProtocolos();
}
*/
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class FormularioBancadaDTO {

    private Long id;
    private Long laboratorioId;
    private String identificador;
    private List<PlacaFormularioBancadaDTO> placas = new ArrayList<>();

    public void adicionarPlaca(PlacaFormularioBancadaDTO placa) {
        placas.add(placa);
    }
}
