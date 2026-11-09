----TABELAS -----------------
CREATE TABLE USUARIO (
    id                  INT IDENTITY(1,1)  NOT NULL,
    cpf                 CHAR(11)           NOT NULL,
    nome_completo       VARCHAR(150)       NOT NULL,
    data_aniversario    DATE               NOT NULL,
    celular             VARCHAR(15)        NOT NULL,
    email               VARCHAR(150)       NOT NULL,
    login               VARCHAR(50)        NOT NULL,
    senha_hash          VARCHAR(255)       NOT NULL,
    data_cadastro       DATETIME2(0)       NOT NULL CONSTRAINT DF_USUARIO_cadastro DEFAULT SYSDATETIME(),
    data_ultimo_acesso  DATETIME2(0)       NULL,
    CONSTRAINT PK_USUARIO PRIMARY KEY (id),
    CONSTRAINT UQ_USUARIO_cpf   UNIQUE (cpf),
    CONSTRAINT UQ_USUARIO_email UNIQUE (email),
    CONSTRAINT UQ_USUARIO_login UNIQUE (login)
);
GO
 
/* ---------------------------------------------------------------------
   ACESSO: registra todo acesso (login) ao sistema
--------------------------------------------------------------------- */
CREATE TABLE ACESSO (
    id                INT IDENTITY(1,1) NOT NULL,
    id_usuario        INT               NOT NULL,
    data_hora_acesso  DATETIME2(0)      NOT NULL CONSTRAINT DF_ACESSO_data DEFAULT SYSDATETIME(),
    CONSTRAINT PK_ACESSO PRIMARY KEY (id),
    CONSTRAINT FK_ACESSO_USUARIO FOREIGN KEY (id_usuario) REFERENCES USUARIO (id)
);
GO
 
CREATE INDEX IX_ACESSO_usuario ON ACESSO (id_usuario, data_hora_acesso);
GO
 
/* ---------------------------------------------------------------------
   RECURSO: laboratórios e salas (diferenciados pelo campo tipo)
--------------------------------------------------------------------- */
CREATE TABLE RECURSO (
    id           INT IDENTITY(1,1) NOT NULL,
    codigo       VARCHAR(20)       NOT NULL,
    nome         VARCHAR(100)      NOT NULL,
    capacidade   INT               NOT NULL,
    localizacao  VARCHAR(100)      NOT NULL,
    tipo         VARCHAR(12)       NOT NULL,
    CONSTRAINT PK_RECURSO PRIMARY KEY (id),
    CONSTRAINT UQ_RECURSO_codigo UNIQUE (codigo),
    CONSTRAINT CK_RECURSO_tipo CHECK (tipo IN ('LABORATORIO', 'SALA')),
    CONSTRAINT CK_RECURSO_capacidade CHECK (capacidade > 0)
);
GO
 

CREATE TABLE STATUS (
    id    INT IDENTITY(1,1) NOT NULL,
    nome  VARCHAR(30)       NOT NULL,
    CONSTRAINT PK_STATUS PRIMARY KEY (id),
    CONSTRAINT UQ_STATUS_nome UNIQUE (nome)
);
GO
 
INSERT INTO STATUS (nome) VALUES
    ('Livre'),
    ('Ocupado'),
    ('Bloqueado'),
    ('Reservado');
GO
 
/* ---------------------------------------------------------------------
   RESERVA: reserva de um recurso por um usuário em um período
--------------------------------------------------------------------- */
CREATE TABLE RESERVA (
    id            INT IDENTITY(1,1) NOT NULL,
    id_usuario    INT               NOT NULL,
    id_recurso    INT               NOT NULL,
    id_status     INT               NOT NULL,
    data_inicial  DATE              NOT NULL,
    data_final    DATE              NOT NULL,
    hora_inicial  TIME(0)           NOT NULL,
    hora_final    TIME(0)           NOT NULL,
    CONSTRAINT PK_RESERVA PRIMARY KEY (id),
    CONSTRAINT FK_RESERVA_USUARIO FOREIGN KEY (id_usuario) REFERENCES USUARIO (id),
    CONSTRAINT FK_RESERVA_RECURSO FOREIGN KEY (id_recurso) REFERENCES RECURSO (id),
    CONSTRAINT FK_RESERVA_STATUS  FOREIGN KEY (id_status)  REFERENCES STATUS (id),
    CONSTRAINT CK_RESERVA_periodo CHECK (
        data_final > data_inicial
        OR (data_final = data_inicial AND hora_final > hora_inicial)
    )
);
GO
 
CREATE INDEX IX_RESERVA_recurso_periodo ON RESERVA (id_recurso, data_inicial, data_final);
CREATE INDEX IX_RESERVA_usuario ON RESERVA (id_usuario);
CREATE INDEX IX_RESERVA_status  ON RESERVA (id_status);
GO
 

/* ---------------------------------------------------------------------
   Função: devolve o status ATUAL de um recurso.
   Se existe reserva cobrindo o momento atual, devolve o status dela
   (Reservado, Ocupado, Bloqueado). Se não existe, devolve 'Livre'.
--------------------------------------------------------------------- */
CREATE FUNCTION dbo.fn_status_recurso (@id_recurso INT)
RETURNS VARCHAR(30)
AS
BEGIN
    DECLARE @status VARCHAR(30);

    SELECT TOP 1 @status = s.nome
    FROM RESERVA rv
    JOIN STATUS s ON s.id = rv.id_status
    WHERE rv.id_recurso = @id_recurso
      AND GETDATE() >= CAST(rv.data_inicial AS DATETIME) + CAST(rv.hora_inicial AS DATETIME)
      AND GETDATE() <  CAST(rv.data_final   AS DATETIME) + CAST(rv.hora_final   AS DATETIME)
    ORDER BY rv.id DESC;

    RETURN COALESCE(@status, 'Livre');
END;
GO

/* ---------------------------------------------------------------------
   Coluna calculada em RECURSO: aparece em qualquer SELECT * FROM RECURSO
--------------------------------------------------------------------- */
ALTER TABLE RECURSO ADD status AS dbo.fn_status_recurso(id);
GO















select*from USUARIO

 SELECT* from STATUS


 SELECT * FROM RECURSO;   -- Ver Status das reservas





-- cria uma reserva que cobre o dia de hoje (ajuste os ids para valores que existam)
INSERT INTO RESERVA (id_usuario, id_recurso, id_status, data_inicial, data_final, hora_inicial, hora_final)
VALUES (1, 1, 2, CAST(GETDATE() AS DATE), CAST(GETDATE() AS DATE), '00:00', '23:59');

SELECT * FROM RECURSO;   -- o recurso 1 deve vir como 'Ocupado'

-- apague a reserva de teste depois
DELETE FROM RESERVA WHERE id_recurso = 1 AND id_status = 2 AND data_inicial = CAST(GETDATE() AS DATE);





-- remove a coluna calculada e a função (nessa ordem)
ALTER TABLE RECURSO DROP COLUMN status;
GO
DROP FUNCTION dbo.fn_status_recurso;
GO

-- coluna real: todos os recursos existentes ficam como 'Livre'
ALTER TABLE RECURSO ADD status VARCHAR(30) NOT NULL
    CONSTRAINT DF_RECURSO_status DEFAULT 'Livre';
GO

-- o banco só aceita nomes que existem na tabela STATUS
ALTER TABLE RECURSO ADD CONSTRAINT FK_RECURSO_STATUS
    FOREIGN KEY (status) REFERENCES STATUS (nome);
GO
