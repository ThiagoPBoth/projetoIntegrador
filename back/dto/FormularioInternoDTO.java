package br.com.pdasrs.laboratorioapi.dto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class FormularioInternoDTO {

    Long id;
    String lote;
    String termometroAmbiente;

}
