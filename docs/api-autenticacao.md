# 1. API de Autenticação

A autenticação deve ser feita **antes de qualquer requisição à API de preenchimento**. Ela retorna um `apiToken`, que deve ser enviado nas chamadas seguintes.

## 1.1 Endpoints

| Ambiente         | Método | URL                                                         |
| ---------------- | ------ | ----------------------------------------------------------- |
| QAS (Homologação) | `POST` | `https://suporte-dev.telemedicinaeinstein.com.br/api/session` |
| Produção          | `POST` | `https://sde.einstein.br/api/session`                         |

## 1.2 Requisição

**Content-Type:** `multipart/form-data`

| Campo      | Tipo   | Obrigatório | Descrição           |
| ---------- | ------ | ----------- | ------------------- |
| `username` | string | Sim         | Usuário de acesso.  |
| `password` | string | Sim         | Senha de acesso.    |

### Exemplo cURL (QAS)

```bash
curl --request POST \
  --url https://suporte-dev.telemedicinaeinstein.com.br/api/session \
  --header 'Content-Type: multipart/form-data' \
  --form username=<usuario> \
  --form password=<senha>
```

> Para Produção, troque a URL por `https://sde.einstein.br/api/session`.

## 1.3 Resposta esperada

**Status:** `200 OK`

```json
{
  "apiToken": "383:1760026662:454442607d0c0f2189751eb34a46548409598e107b",
  "expires": 1760113062
}
```

## 1.4 Campos da resposta

| Campo      | Tipo    | Descrição                                                                                                  |
| ---------- | ------- | ---------------------------------------------------------------------------------------------------------- |
| `apiToken` | string  | Token a ser usado na autenticação das próximas chamadas.                                                    |
| `expires`  | integer | Data/hora de expiração do token, em timestamp Unix (segundos).                                               |

### Estrutura do `apiToken`

O token é composto por três partes separadas por `:`:

```
383 : 1760026662 : 454442607d0c0f2189751eb34a46548409598e107b
 │        │                        │
 │        │                        └─ assinatura/hash do token
 │        └─ timestamp Unix de emissão (inferido)
 └─ Id do usuário no SDE
```

| Parte        | Exemplo                                      | Significado                                    |
| ------------ | -------------------------------------------- | ---------------------------------------------- |
| 1ª           | `383`                                        | Id do usuário no SDE.                          |
| 2ª           | `1760026662`                                 | Timestamp de emissão *(inferido, ver nota)*.   |
| 3ª           | `454442607d0c0f2189751eb34a46548409598e107b` | Hash/assinatura *(inferido, ver nota)*.        |

> **Nota:** a documentação original só define a 1ª parte. As demais foram inferidas pelo exemplo: `1760026662` = 09/10/2025 16:17:42 UTC e `expires` = `1760113062` = 10/10/2025 16:17:42 UTC — exatamente 86.400 s depois, o que sugere **validade de 24 horas**. Confirmar com o fornecedor.

## 1.5 Pendências a confirmar com o fornecedor

- [ ] Como o `apiToken` deve ser enviado nas chamadas seguintes (header `Authorization: Bearer`, header próprio, query string?).
- [ ] Validade oficial do token (o exemplo indica 24 h) e se existe endpoint de renovação.
- [ ] Respostas de erro (credenciais inválidas, usuário bloqueado etc.): status HTTP e formato do corpo.
