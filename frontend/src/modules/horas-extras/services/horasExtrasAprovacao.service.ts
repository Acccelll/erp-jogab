import { getHorasExtrasAprovacaoData } from '../data/horas-extras-aprovacao.mock';

function delay(ms = 180): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchHorasExtrasAprovacao(competencia?: string) {
  await delay();
  return getHorasExtrasAprovacaoData(competencia);
}
