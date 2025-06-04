package br.com.pdasrs.laboratorioapi.model;

import lombok.*;

import javax.persistence.*;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Entity
@Table(name = "conteudo_celula_placa", schema = "laboratorio")
public class ConteudoCelulaPlaca {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String identificacaoAnimal;
    @Column(nullable = false)
    private String identificacaoFrascoLaminaArmazenamento;
    @Column(nullable = false)
    private String protocolo;
}
