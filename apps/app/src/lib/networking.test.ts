import { describe, expect, it } from 'vitest';

import { linksDeEventos } from './networking';

describe('eventos da área (D-046)', () => {
  it('no Brasil: busca em português e inclui a Sympla', () => {
    const l = linksDeEventos('São Paulo', 'br', 'tecnologia');
    expect(l.map((x) => x.nome)).toEqual(['Meetup', 'Eventbrite', 'Sympla']);
    expect(l[0]!.url).toContain('keywords=tecnologia');
    expect(l[1]!.url).toBe('https://www.eventbrite.com/d/brazil--sao-paulo/tecnologia/');
    expect(l[2]!.url).toContain('sympla.com.br/eventos/sao-paulo');
  });
  it('fora do Brasil: busca em inglês, sem Sympla', () => {
    const l = linksDeEventos('Lisboa', 'pt', 'engenharia');
    expect(l.map((x) => x.nome)).toEqual(['Meetup', 'Eventbrite']);
    expect(l[0]!.url).toContain('keywords=engineering');
  });
  it('sem área escolhida, usa tecnologia', () => {
    expect(linksDeEventos('Recife', 'br', null)[0]!.url).toContain('keywords=tecnologia');
  });
});
