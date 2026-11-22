# Skills do projeto

Instaladas em 22/11/2026, copiadas dos repositórios oficiais (commit entre parênteses).

| Skill | Origem | Licença |
|---|---|---|
| `frontend-design` | anthropics/skills (e4bb5d9) | ver LICENSE.txt |
| `web-design-guidelines` | vercel-labs/agent-skills (5a37a63) | ver README do repositório |
| `impeccable` | pbakaus/impeccable (b49177d) | Apache 2.0 |
| `taste-skill` (`design-taste-frontend`) | Leonxlnx/taste-skill (f6b7657) | MIT |
| `image-to-code` | Leonxlnx/imagegen-skills (beb16b0) | MIT |
| `awesome-design-md` | VoltAgent/awesome-design-md (fcc7028), com SKILL.md próprio | MIT |
| `find-skills` | vercel-labs/skills (57217cf) | MIT |

Observações:
- **impeccable:** os ganchos automáticos do repositório original (`.claude/settings.json`, que rodam o detector a cada edição) **não** foram instalados. Ao usar a skill, o launcher `scripts/impeccable` baixa um binário próprio na primeira execução; se falhar, a skill segue lendo DESIGN.md direto.
- **web-design-guidelines:** busca as regras atualizadas em `raw.githubusercontent.com` a cada uso.
- **find-skills:** a skill sugere instalar com `npx skills add ... -g` (global). Nas sessões em nuvem o global some quando o container é reciclado; para manter, instale no projeto (sem `-g`, em `.claude/skills/`) e commite.
- Para atualizar, repita a cópia a partir do repositório de origem e troque o commit nesta tabela.
