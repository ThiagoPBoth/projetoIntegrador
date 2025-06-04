package br.com.pdasrs.laboratorioapi.model;

import lombok.*;

import javax.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Embeddable
public class CelulaPlacaId implements Serializable {
    private static final long serialVersionUID = 1L;
    private Long placaId;
    private Integer linha;
    private Integer coluna;
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CelulaPlacaId that = (CelulaPlacaId) o;
        return Objects.equals(placaId, that.placaId) &&
                Objects.equals(linha, that.linha) &&
                Objects.equals(coluna, that.coluna);
    }
    @Override
    public int hashCode() {
        return Objects.hash(placaId, linha, coluna);
    }
}
