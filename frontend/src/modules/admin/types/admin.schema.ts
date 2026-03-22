import { z } from 'zod';

export const adminCategoriaSchema = z.enum(['usuarios', 'perfis', 'permissoes', 'parametros', 'logs', 'integracoes']);
export const adminStatusSchema = z.enum(['ativo', 'inativo', 'pendente', 'erro', 'sincronizado']);
export const adminNivelPermissaoSchema = z.enum(['visualizar', 'editar', 'aprovar', 'administrar']);

export type AdminCategoria = z.infer<typeof adminCategoriaSchema>;
export type AdminStatus = z.infer<typeof adminStatusSchema>;
export type AdminNivelPermissao = z.infer<typeof adminNivelPermissaoSchema>;
