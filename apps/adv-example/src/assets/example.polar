role(actor: String, "employee") if
    actor = "alice" or
    actor = "bhavik" or
    actor = "cora";

role(actor: String, "accountant") if
    actor = "deirdre" or
    actor = "ebrahim" or
    actor = "frantz";

role(actor: String, "admin") if
    actor = "greta" or
    actor = "han" or
    actor = "iqbal";

allow(actor: String, "GET", perms: Permission) if
    perms.userId = actor and
    perms.canRead = true;
