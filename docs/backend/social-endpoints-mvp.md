# Social / Redes Sociais — Endpoints REST (MVP)

## Permissões
- `social.visualizar`
- `social.configurar`
- `social.sincronizar`
- `social.exportar_relatorios`
- `social.gerenciar_alertas`

## Endpoints
- `GET /social/contas` — listar contas conectadas.
- `POST /social/contas` — criar conta conectada.
- `PUT /social/contas/:id` — atualizar conta conectada.
- `DELETE /social/contas/:id` — remover conta conectada.
- `POST /social/contas/:id/sincronizar` — sincronização manual (MVP com provider mock).
- `GET /social/dashboard` — dashboard consolidado Instagram x LinkedIn.
- `GET /social/snapshots?contaId=&dataInicio=&dataFim=` — snapshots por período.
- `GET /social/posts?plataforma=&tipoPost=&campanhaId=&dataInicio=&dataFim=` — posts com filtros.
- `GET /social/alertas` — alertas operacionais.
- `POST /social/relatorios/exportar` — exportação de relatório social.

## Service layer (preparação API externa)
- `SocialProvider` define contrato para integração de terceiros.
- `SocialMockProvider` implementa MVP sem dependência real de API externa.
- Próximo passo sugerido: `InstagramBusinessProvider` e `LinkedInPageProvider` implementando o mesmo contrato.

## Agendamento futuro
- Rotina prevista: `social_sync_daily_job` (cron diário por conta ativa).
- Fluxo esperado:
  1. validar token/refresh;
  2. consumir APIs externas;
  3. persistir em `social_metricas_snapshot` e `social_posts`;
  4. gerar registros em `social_alertas` quando regras forem violadas.
