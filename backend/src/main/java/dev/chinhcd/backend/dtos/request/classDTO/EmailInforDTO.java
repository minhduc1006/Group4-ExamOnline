package dev.chinhcd.backend.dtos.request.classDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EmailInforDTO {
    private String to;
    private String subject;
    private String content;
    private String token;
    private String urlPathFrontEnd;
    private Long id;
}
