package br.com.pdasrs.laboratorioapi.dto;


import br.com.pdasrs.laboratorioapi.model.Amostra;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ConteudoCelulaPlacaDTO {

    Long id;
    String identificacaoAnimal;
    String identificacaoFrascoLaminaArmazenamento;
    String protocolo;
    String teste;

    public ConteudoCelulaPlacaDTO(String identificacaoAnimal, String identificacaoFrascoLaminaArmazenamento,
                                  String protocolo) {
        this.identificacaoAnimal = identificacaoAnimal;
        this.identificacaoFrascoLaminaArmazenamento = identificacaoFrascoLaminaArmazenamento;
        this.protocolo = protocolo;
    }
}
