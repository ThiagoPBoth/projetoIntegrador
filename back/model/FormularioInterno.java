package br.com.pdasrs.laboratorioapi.model;

import lombok.*;

import javax.persistence.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Entity
@Table(name = "formulario_interno", schema = "laboratorio")
public class FormularioInterno {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String lote;

    @Column(nullable = false)
    private String termometroAmbiente;

}
