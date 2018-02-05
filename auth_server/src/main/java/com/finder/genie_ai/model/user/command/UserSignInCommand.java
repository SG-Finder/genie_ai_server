package com.finder.genie_ai.model.user.command;

import lombok.Data;
import lombok.ToString;

import javax.validation.constraints.NotNull;
import java.util.Objects;

@Data
@ToString
public class UserSignInCommand {

    @NotNull
    private String userId;
    @NotNull
    private String passwd;

}
