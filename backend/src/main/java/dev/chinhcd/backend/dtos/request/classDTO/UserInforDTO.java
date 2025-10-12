package dev.chinhcd.backend.dtos.request.classDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class UserInforDTO {
    String username;
    String password;
    String email;
}
