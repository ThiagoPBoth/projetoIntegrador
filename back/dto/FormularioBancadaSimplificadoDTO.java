package br.com.pdasrs.laboratorioapi.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


public interface FormularioBancadaSimplificadoDTO {

    Long getId();
    String getIdentificador();
    String[] getProtocolos();

}
