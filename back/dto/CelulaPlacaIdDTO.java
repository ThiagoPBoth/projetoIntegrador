package br.com.pdasrs.laboratorioapi.dto;

import br.com.pdasrs.laboratorioapi.model.CelulaPlacaId;
import lombok.*;

import java.util.Objects;


@ToString
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CelulaPlacaIdDTO {

    private static final long serialVersionUID = 1L;
    private Long placaId;
    private Integer linha;
    private Integer coluna;
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CelulaPlacaIdDTO that = (CelulaPlacaIdDTO) o;
        return Objects.equals(placaId, that.placaId) &&
                Objects.equals(linha, that.linha) &&
                Objects.equals(coluna, that.coluna);
    }
    @Override
    public int hashCode() {
        return Objects.hash(placaId, linha, coluna);
    }

}
