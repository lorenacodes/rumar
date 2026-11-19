import { Info } from '../../ui/info';
import { useEffect, useMemo, useState, type ReactNode } from 'react';

import { faltaNoCusto, textoFalta, type Orcamento } from '../../lib/orcamento';
import { converter, custo, dataBR, dinheiro, FONTES_CAMBIO, IOF, NOME_MOEDA, taxa } from '../../lib/moedas';
import { quemDeveAQuem } from '../../lib/divisao';
import { adicionarAporte, adicionarGastoReal, atualizarViagem, eu as euId, removerAporte, removerGastoReal, type ViagemCompleta } from '../../lib/viagens';
import { Aviso, BotaoContorno } from '../../ui/pecas';
import { botaoTexto, campo, Rotulo, Segmentos } from './comum';
import { compartilhar } from './Etapas';
import { hojeISO, type Jornada } from './jornada';

type Sub = 'resumo' | 'economia' | 'levar' | 'viagem';
const CAT: Record<string, string> = { passagem: 'Passagem', hospedagem: 'Hospedagem', alimentacao: 'Alimentação', lazer: 'Lazer e passeios', transporte: 'Transporte', compras: 'Compras', documentos: 'Documentos', outros: 'Outros' };
const FORMA: Record<string, string> = { cartao: 'Cartão', dinheiro: 'Dinheiro vivo', conta: 'Conta internacional', pix: 'Pix / débito no Brasil' };
const num = (s: string) => (s ? Math.round(Number(s.replace(/\./g, '').replace(',', '.')) * 100) : 0);
const meio = (a: number, b: number) => Math.round((a + b) / 2);
const caixa = { padding: '12px', background: 'var(--cartao-2)', marginTop: '10px', fontSize: '14px', lineHeight: '20px' } as const;
const botao = { minHeight: '44px', padding: '0 14px', border: '1px solid var(--linha)', font: "600 14px 'Open Sans'" } as const;

export function AbaDinheiro({ v, j, orc, resumo, pode, recarregar }: { v: ViagemCompleta; j: Jornada; orc: Orcamento; resumo: ReactNode; pode: boolean; recarregar: () => void }) {
  const emViagem = j.etapa === 'durante' || j.etapa === 'volta';
  const [sub, setSub] = useState<Sub>(emViagem ? 'viagem' : 'resumo');
  return (
    <section style={{ marginTop: '14px' }}>
      <Segmentos rotulo="Partes do dinheiro" valor={sub} aoMudar={setSub}
        opcoes={[{ id: 'resumo', nome: 'Custos' }, { id: 'economia', nome: 'Economia' }, { id: 'levar', nome: 'Como levar' }, { id: 'viagem', nome: 'Na viagem' }]} />
      {sub === 'resumo' ? <><TabelaMoedas j={j} orc={orc} gastos={v.gastos} />{resumo}</> : null}
      {sub === 'economia' ? <Economia v={v} j={j} pode={pode} recarregar={recarregar} semPrecos={orc.provavelBRL === 0} /> : null}
      {sub === 'levar' ? <ComoLevar v={v} j={j} orc={orc} /> : null}
      {sub === 'viagem' ? <NaViagem v={v} j={j} orc={orc} pode={pode} recarregar={recarregar} /> : null}
    </section>
  );
}

// ---------------------------------------------------------------- custos em duas moedas
function Cotacao({ de, para }: { de: string; para: string }) {
  if (de === para) return null;
  const t = taxa(de, para);
  if (!t) return <Aviso cor="var(--ambar)">Não há cotação oficial de {NOME_MOEDA[de] ?? de} no app. Valores nessa moeda ficam fora da conversão; você pode informar a taxa ao anotar um gasto.</Aviso>;
  return (
    <div style={{ fontSize: '12px', color: 'var(--texto-sec)', marginTop: '6px' }}>
      1 {de} = {dinheiro(t.valor * 100, para, 4)} · {t.fonte}, cotação de {dataBR(t.data)}. É a taxa de referência, não a do balcão.
    </div>
  );
}

function TabelaMoedas({ j, orc, gastos }: { j: Jornada; orc: Orcamento; gastos: { categoria: string }[] }) {
  const falta = textoFalta(faltaNoCusto(orc, gastos));
  const tBRL = taxa('BRL', j.moedaPlano);
  const linhas = orc.categorias.map((c) => {
    const porMoeda = new Map<string, number>();
    for (const l of c.linhas) if (!l.semPreco) porMoeda.set(l.moeda, (porMoeda.get(l.moeda) ?? 0) + meio(l.min, l.max));
    return { nome: c.nome, original: [...porMoeda.entries()].filter(([, val]) => val > 0), ref: converter(meio(c.minBRL, c.maxBRL), tBRL) };
  });
  const total = converter(orc.provavelBRL, tBRL);
  return (
    <div style={{ marginTop: '12px' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
        <caption style={{ textAlign: 'left', font: "700 12px 'Open Sans'", letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--texto-sec)', paddingBottom: '6px' }}>Custo provável em duas moedas</caption>
        <thead>
          <tr style={{ textAlign: 'left', color: 'var(--texto-sec)', fontSize: '12px' }}>
            <th scope="col" style={{ padding: '4px 0' }}>Categoria</th>
            <th scope="col" style={{ padding: '4px 0', textAlign: 'right' }}>Valor original</th>
            <th scope="col" style={{ padding: '4px 0', textAlign: 'right' }}>Em {j.moedaPlano}</th>
          </tr>
        </thead>
        <tbody>
          {linhas.map((l) => (
            <tr key={l.nome} style={{ borderTop: '1px solid var(--linha)' }}>
              <th scope="row" style={{ padding: '8px 0', textAlign: 'left', fontWeight: 500 }}>{l.nome}</th>
              <td style={{ textAlign: 'right' }}>{l.original.length ? l.original.map(([m, val]) => dinheiro(val, m)).join(' + ') : '—'}</td>
              <td style={{ textAlign: 'right', fontWeight: 600 }}>{l.ref ? dinheiro(l.ref, j.moedaPlano) : '—'}</td>
            </tr>
          ))}
          <tr style={{ borderTop: '2px solid var(--texto)' }}>
            <th scope="row" style={{ padding: '8px 0', textAlign: 'left' }}>Total</th>
            <td />
            <td style={{ textAlign: 'right', font: "600 16px 'Lexend Exa'" }}>{total ? `${dinheiro(total, j.moedaPlano)}${falta ? ' (parcial)' : ''}` : '—'}</td>
          </tr>
        </tbody>
      </table>
      {total && falta ? <div style={{ fontSize: '13px', lineHeight: '18px', color: 'var(--ambar)', fontWeight: 600, marginTop: '6px' }}>Falta: {falta}.</div> : null}
      <Cotacao de={j.moedaDestino} para={j.moedaPlano} />
      <Info rotulo="Sobre a conversão" style={{ marginTop: '4px' }}>Pela cotação de referência, sem IOF nem taxas do banco (veja "Como levar"). Cada valor tem a fonte dele abaixo.</Info>
    </div>
  );
}

// ---------------------------------------------------------------- economia
function Economia({ v, j, pode, recarregar, semPrecos }: { v: ViagemCompleta; j: Jornada; pode: boolean; recarregar: () => void; semPrecos: boolean }) {
  const [valor, setValor] = useState('');
  const [nota, setNota] = useState('');
  const [retirada, setRetirada] = useState(false);
  const [mensal, setMensal] = useState(v.viagem.capacidade_mensal_centavos ? String(v.viagem.capacidade_mensal_centavos / 100) : '');
  const [semanal, setSemanal] = useState(false);
  const m = j.moedaPlano;
  const f = (c: number) => dinheiro(c, m);
  const p = j.plano;
  const temPassagem = v.gastos.some((g) => g.categoria === 'passagem');
  if (!p) return <Aviso cor="var(--ambar)">{semPrecos ? 'Anote a passagem e a hospedagem em Custos para calcular quanto guardar.' : `Sem a cotação do Banco Central, não dá para calcular a meta em ${m} ainda.`}</Aviso>;
  return (
    <div style={{ marginTop: '12px' }}>
      <div style={{ font: "600 24px 'Lexend Exa'" }}>{p.falta ? `Faltam ${f(p.falta)}` : 'Meta atingida'}</div>
      <div aria-hidden="true" style={{ height: '8px', background: 'var(--linha)', marginTop: '8px' }}><div style={{ height: '8px', width: `${Math.round(p.progresso * 100)}%`, background: 'var(--verde)' }} /></div>
      <div style={{ fontSize: '14px', color: 'var(--texto-sec)', marginTop: '4px' }}>{f(j.guardado)} guardados de {f(p.meta)} ({Math.round(p.progresso * 100)}%)</div>

      <Rotulo>Como a meta é calculada</Rotulo>
      <table style={{ width: '100%', fontSize: '14px', borderCollapse: 'collapse' }}>
        <tbody>
          <Linha a="Custo provável da viagem" b={f(j.estimativa ?? 0)} />
          {j.documentos ? <Linha a="Taxa do passaporte (Polícia Federal)" b={f(j.documentos)} /> : null}
          <Linha a={`Reserva de emergência (${v.viagem.reserva_pct ?? 10}%)`} b={f(p.reserva)} />
          <Linha a="Meta" b={f(p.meta)} forte />
          <Linha a="Já guardado" b={`− ${f(j.guardado)}`} />
          <Linha a="Falta" b={f(p.falta)} forte />
        </tbody>
      </table>
      {!temPassagem ? <Aviso cor="var(--ambar)">A passagem ainda não está na meta: não temos preço confiável de voo. Informe o valor em Custos → Informar um gasto.</Aviso> : null}

      {p.falta ? (
        <div style={caixa}>
          {p.meses >= 1
            ? <>Até {dataBR(v.viagem.data_ida)} são <b>{p.meses} {p.meses === 1 ? 'mês' : 'meses'}</b>: guarde <b>{f(p.mensal)} por mês</b>.</>
            : <>Falta menos de um mês para a viagem: o valor que falta precisa estar guardado agora.</>}
          {semanal && p.semanas >= 1 ? <div>Por semana: <b>{f(p.semanal)}</b> ({p.semanas} semanas).</div> : null}
          {p.semanas >= 1 ? <button type="button" className="r-btn" onClick={() => setSemanal(!semanal)} style={botaoTexto}>{semanal ? 'Esconder meta semanal' : 'Ver meta por semana'}</button> : null}
          {v.viagem.data_definida === false ? <div style={{ color: 'var(--texto-sec)' }}>A data é uma previsão: ao fechar a data, o valor por mês muda.</div> : null}
        </div>
      ) : null}

      <Rotulo><label htmlFor="cap">Quanto você consegue guardar por mês ({m})</label></Rotulo>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
        <input id="cap" inputMode="decimal" className="r-input" value={mensal} disabled={!pode} onChange={(e) => setMensal(e.target.value.replace(/[^\d,]/g, ''))} style={{ ...campo, flex: 1 }} />
        {pode ? <button type="button" className="r-btn" style={botao} onClick={() => void atualizarViagem(v.viagem.id, { capacidade_mensal_centavos: mensal ? num(mensal) : null }, 'Atualizou quanto consegue guardar por mês.').then(recarregar)}>Salvar</button> : null}
      </div>
      {p.compativel === true ? <div style={{ ...caixa, background: 'var(--cartao-2)' }}>Cabe: guardando {f(v.viagem.capacidade_mensal_centavos ?? 0)} por mês, você chega à meta até a data.</div> : null}
      {p.compativel === false ? (
        <div style={{ ...caixa, background: 'var(--cartao-1)' }}>
          <b>Não cabe até a data.</b> Alternativas:
          <ul style={{ margin: '6px 0 0', paddingLeft: '18px' }}>{p.alternativas.map((a) => <li key={a.tipo}>{a.texto}</li>)}</ul>
          <div style={{ fontSize: '12px', color: 'var(--texto-sec)', marginTop: '6px' }}>Contas com o custo estimado de hoje; preços e câmbio mudam.</div>
        </div>
      ) : null}

      <Rotulo>Depósitos</Rotulo>
      {v.aportes.length ? v.aportes.map((a) => (
        <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed var(--linha)', padding: '6px 0', fontSize: '14px' }}>
          <span>{dataBR(a.data)}{a.nota ? ` · ${a.nota}` : ''}</span>
          <span style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <b style={{ color: a.valor_centavos < 0 ? 'var(--vermelho)' : 'var(--texto)' }}>{a.valor_centavos < 0 ? '− ' : '+ '}{f(Math.abs(a.valor_centavos))}</b>
            {pode ? <button type="button" className="r-btn" aria-label="Remover registro" onClick={() => void removerAporte(v.viagem.id, a.id).then(recarregar)} style={{ width: '40px', height: '40px', color: 'var(--vermelho)' }}>×</button> : null}
          </span>
        </div>
      )) : <div style={{ fontSize: '14px', color: 'var(--texto-sec)' }}>Nenhum depósito registrado{v.viagem.guardado_centavos ? ` (além dos ${f(v.viagem.guardado_centavos)} que você já tinha)` : ''}.</div>}
      {pode ? (
        <div style={{ display: 'grid', gap: '8px', marginTop: '8px' }}>
          <Segmentos rotulo="Tipo de registro" valor={retirada ? 'r' : 'd'} aoMudar={(x) => setRetirada(x === 'r')} opcoes={[{ id: 'd', nome: 'Guardei' }, { id: 'r', nome: 'Tirei' }]} />
          <input inputMode="decimal" className="r-input" placeholder={`Valor (${m})`} value={valor} onChange={(e) => setValor(e.target.value.replace(/[^\d,]/g, ''))} aria-label={`Valor em ${m}`} style={campo} />
          <input className="r-input" placeholder="Nota (opcional)" value={nota} onChange={(e) => setNota(e.target.value.slice(0, 80))} aria-label="Nota" style={campo} />
          <BotaoContorno onClick={() => { const c = num(valor); if (c > 0) void adicionarAporte(v.viagem.id, retirada ? -c : c, nota.trim() || null).then(() => (setValor(''), setNota(''), recarregar())); }}>Registrar</BotaoContorno>
        </div>
      ) : null}
    </div>
  );
}

const Linha = ({ a, b, forte }: { a: string; b: string; forte?: boolean }) => (
  <tr style={{ borderTop: '1px solid var(--linha)' }}>
    <td style={{ padding: '6px 0', fontWeight: forte ? 700 : 400 }}>{a}</td>
    <td style={{ textAlign: 'right', fontWeight: forte ? 700 : 500 }}>{b}</td>
  </tr>
);

// ---------------------------------------------------------------- como levar o dinheiro + simulador
const MEIOS: { titulo: string; como: string; custos: string; cuidados: string }[] = [
  { titulo: 'Dinheiro vivo (espécie)', como: 'Você compra a moeda antes (casa de câmbio ou banco) ou saca no destino.', custos: 'IOF de 3,5% na compra de moeda + o spread da casa de câmbio. Saque no exterior costuma ter tarifa do banco e da rede de caixas.', cuidados: 'Risco de perda ou roubo. Vale levar uma parte para lugares que não aceitam cartão e para emergências.' },
  { titulo: 'Cartão de crédito internacional', como: 'Compras em moeda estrangeira viram reais na fatura.', custos: 'IOF de 3,5% + o spread do emissor. A taxa usada pode ser a do dia da compra ou a do pagamento, conforme o contrato: confirme com o seu banco.', cuidados: 'A taxa só fica conhecida depois. Tenha um segundo cartão de reserva.' },
  { titulo: 'Conta internacional / cartão de débito em moeda estrangeira', como: 'Você converte reais em moeda antes e gasta do saldo.', custos: 'IOF de 3,5% na conversão + spread da instituição. Você sabe a taxa na hora de converter. Compare pelo VET.', cuidados: 'Confira se a instituição é autorizada pelo Banco Central e as tarifas de saque.' },
  { titulo: 'Cartão pré-pago de viagem', como: 'Carregado com moeda estrangeira antes da viagem.', custos: 'IOF de 3,5% na carga + spread; algumas cobram tarifa de recarga ou saque.', cuidados: 'Veja as tarifas antes de carregar e o que acontece com o saldo que sobrar.' },
];

function ComoLevar({ v, j, orc }: { v: ViagemCompleta; j: Jornada; orc: Orcamento }) {
  const md = j.moedaDestino;
  const ref = j.moedaPlano;
  // Gasto previsto NO destino: alimentação, lazer e transporte na moeda local (hospedagem costuma ser paga antes).
  const previstoLocal = useMemo(() => orc.categorias.filter((c) => c.id !== 'hospedagem' && c.id !== 'outros').flatMap((c) => c.linhas).filter((l) => !l.semPreco && l.moeda === md).reduce((s, l) => s + meio(l.min, l.max), 0), [orc, md]);
  const [gasto, setGasto] = useState(String(Math.round(previstoLocal / 100)));
  const [especie, setEspecie] = useState('0');
  const [reserva, setReserva] = useState(String(Math.round((previstoLocal * (v.viagem.reserva_pct ?? 10)) / 100 / 100)));
  const [vet, setVet] = useState('');
  const g = num(gasto);
  const e = Math.min(num(especie), g);
  const r = num(reserva);
  const total = g + r;
  const vetN = vet ? Number(vet.replace(',', '.')) : null;
  const c = custo(total, md, ref, vetN);
  const ce = custo(e, md, ref);
  const falta = c.estimativa !== null ? Math.max(0, c.estimativa - j.guardado) : null;
  const fRef = (x: number | null) => (x === null ? '—' : dinheiro(x, ref));

  if (md === ref) return <div style={caixa}>Viagem em {NOME_MOEDA[md] ?? md}: não precisa trocar dinheiro.</div>;
  return (
    <div style={{ marginTop: '12px' }}>
      <Cotacao de={md} para={ref} />
      <Rotulo>Três valores diferentes</Rotulo>
      <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '14px', lineHeight: '20px' }}>
        <li><b>Cotação de referência</b>: a PTAX do Banco Central. Serve para comparar; ninguém compra a esse preço.</li>
        <li><b>Estimativa de conversão</b>: a referência + {IOF.texto.toLowerCase()} ({IOF.fonte}). <b>Não inclui o spread</b> (a margem de cada instituição), que varia e não temos como saber.</li>
        <li><b>Custo efetivo</b>: o VET que a instituição informa antes de fechar o câmbio. Inclui taxa, tarifas e tributos. É o número para comparar ofertas.</li>
      </ul>
      <div style={{ fontSize: '13px', marginTop: '6px' }}>
        <a href={FONTES_CAMBIO.vet.url} target="_blank" rel="noreferrer" style={{ color: 'var(--azul)' }}>{FONTES_CAMBIO.vet.nome}</a><br />
        <a href={FONTES_CAMBIO.cartilha.url} target="_blank" rel="noreferrer" style={{ color: 'var(--azul)' }}>{FONTES_CAMBIO.cartilha.nome}</a><br />
        <a href={IOF.url} target="_blank" rel="noreferrer" style={{ color: 'var(--azul)' }}>{IOF.fonte} (IOF 3,5%)</a> <span style={{ color: 'var(--texto-sec)' }}>· conferido em {dataBR(IOF.consultadoEm)}. Alguns bancos absorvem o IOF: confira o seu.</span>
      </div>

      <Rotulo>Como levar seu dinheiro</Rotulo>
      <p style={{ fontSize: '14px', lineHeight: '20px', margin: '0 0 6px' }}>Não existe divisão certa. Ela depende de quanto os lugares do seu roteiro aceitam cartão, das tarifas da sua instituição e de quanto você quer de reserva. Combinar dois meios é mais seguro do que depender de um só.</p>
      {MEIOS.map((m) => (
        <details key={m.titulo} style={{ borderTop: '1px solid var(--linha)', padding: '6px 0' }}>
          <summary style={{ minHeight: '40px', display: 'flex', alignItems: 'center', fontWeight: 600, cursor: 'pointer' }}>{m.titulo}</summary>
          <div style={{ fontSize: '14px', lineHeight: '20px' }}>
            <div>{m.como}</div>
            <div style={{ marginTop: '4px' }}><b>Custos:</b> {m.custos}</div>
            <div style={{ marginTop: '4px' }}><b>Cuidados:</b> {m.cuidados}</div>
          </div>
        </details>
      ))}

      <Rotulo>Simulador</Rotulo>
      <div style={{ display: 'grid', gap: '6px' }}>
        <label style={{ fontSize: '13px', color: 'var(--texto-sec)' }}>Quanto pretende gastar no destino ({md})<input inputMode="decimal" className="r-input" value={gasto} onChange={(x) => setGasto(x.target.value.replace(/[^\d,]/g, ''))} style={campo} /></label>
        <div style={{ fontSize: '12px', color: 'var(--texto-sec)' }}>Começa com a alimentação, os passeios e o transporte do roteiro ({dinheiro(previstoLocal, md)}). Mude à vontade.</div>
        <label style={{ fontSize: '13px', color: 'var(--texto-sec)' }}>Quanto levar em dinheiro vivo ({md})<input inputMode="decimal" className="r-input" value={especie} onChange={(x) => setEspecie(x.target.value.replace(/[^\d,]/g, ''))} style={campo} /></label>
        <label style={{ fontSize: '13px', color: 'var(--texto-sec)' }}>Reserva de emergência ({md})<input inputMode="decimal" className="r-input" value={reserva} onChange={(x) => setReserva(x.target.value.replace(/[^\d,]/g, ''))} style={campo} /></label>
        {ref === 'BRL' ? <label style={{ fontSize: '13px', color: 'var(--texto-sec)' }}>VET informado pela sua instituição (R$ por 1 {md}, opcional)<input inputMode="decimal" className="r-input" placeholder="Ex.: 6,85" value={vet} onChange={(x) => setVet(x.target.value.replace(/[^\d,]/g, ''))} style={campo} /></label> : null}
      </div>
      <table style={{ width: '100%', fontSize: '14px', borderCollapse: 'collapse', marginTop: '10px' }}>
        <tbody>
          <Linha a="Em dinheiro vivo" b={`${dinheiro(e, md)} · ${fRef(ce.estimativa)}`} />
          <Linha a="No cartão ou conta" b={dinheiro(g - e, md)} />
          <Linha a="Reserva de emergência" b={dinheiro(r, md)} />
          <Linha a="Total a converter" b={dinheiro(total, md)} forte />
          <Linha a="Pela cotação de referência" b={fRef(c.referencia)} />
          <Linha a={ref === 'BRL' ? 'Estimativa com IOF (sem spread)' : 'Estimativa'} b={fRef(c.estimativa)} forte />
          {c.efetivo !== null ? <Linha a="Pelo VET que você informou" b={fRef(c.efetivo)} forte /> : null}
          <Linha a="Já guardado para a viagem" b={fRef(j.guardado)} />
          <Linha a="Falta guardar para isso" b={fRef(falta)} forte />
        </tbody>
      </table>
      <div style={{ fontSize: '12px', lineHeight: '17px', color: 'var(--texto-sec)', marginTop: '6px' }}>
        Simulação, não garantia: a aceitação de cartão muda de lugar para lugar e o valor final depende da instituição, da data de liquidação e do câmbio do dia. "Falta guardar" aqui considera só o dinheiro para gastar no destino; a meta completa está em Economia.
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- durante a viagem: gastos reais
function NaViagem({ v, j, orc, pode, recarregar }: { v: ViagemCompleta; j: Jornada; orc: Orcamento; pode: boolean; recarregar: () => void }) {
  const [valor, setValor] = useState('');
  const [moeda, setMoeda] = useState(j.moedaDestino);
  const [categoria, setCategoria] = useState('alimentacao');
  const [forma, setForma] = useState('cartao');
  const [descricao, setDescricao] = useState('');
  const [data, setData] = useState(hojeISO());
  const [taxaPaga, setTaxaPaga] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const ref = j.moedaPlano;
  const moedas = [...new Set([j.moedaDestino, ref, 'BRL'])];
  // Divisão do grupo (D-065): só aparece com 2 ou mais participantes.
  const ativos = v.membros.filter((m) => m.status === 'ativo');
  const grupo = ativos.length >= 2;
  const [eu, setEu] = useState<string | null>(null);
  useEffect(() => void euId().then(setEu), []);
  const [pagoPor, setPagoPor] = useState<string>('');
  const [entre, setEntre] = useState<string[]>([]);
  const pagador = pagoPor || eu || '';
  const divididoEntre = entre.length ? entre : ativos.map((m) => m.user_id);

  const salvar = async () => {
    const c = num(valor);
    if (!c || !descricao.trim()) return setErro('Informe o valor e uma descrição.');
    const informada = taxaPaga ? Number(taxaPaga.replace(',', '.')) : null;
    const t = informada ? { valor: informada, fonte: 'Taxa informada por você', data } : (() => { const x = taxa(moeda, ref); return x ? { valor: x.valor, fonte: `${x.fonte}${x.data ? `, ${dataBR(x.data)}` : ''}`, data: x.data } : null; })();
    const ok = await adicionarGastoReal(v.viagem.id, {
      data, categoria, descricao: descricao.trim(), valor_centavos: c, moeda, forma,
      taxa: t ? Number(t.valor.toFixed(6)) : null, taxa_fonte: t?.fonte.slice(0, 120) ?? null,
      valor_ref_centavos: t ? Math.round(c * t.valor) : null, moeda_ref: ref,
      ...(grupo ? { pago_por: pagador || null, dividido_entre: divididoEntre.length === ativos.length ? null : divididoEntre } : {}),
    });
    if (!ok) return setErro('Não deu para salvar. Confira a internet.');
    setValor(''); setDescricao(''); setTaxaPaga(''); setErro(null); setEntre([]); setPagoPor('');
    recarregar();
  };

  return (
    <div style={{ marginTop: '12px' }}>
      <PlanejadoReal v={v} j={j} orc={orc} />
      {pode ? (
        <>
          <Rotulo>Anotar um gasto</Rotulo>
          <div style={{ display: 'grid', gap: '8px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input inputMode="decimal" className="r-input" placeholder="Valor" value={valor} onChange={(e) => setValor(e.target.value.replace(/[^\d,]/g, ''))} aria-label="Valor do gasto" style={{ ...campo, flex: 1 }} />
              <select value={moeda} onChange={(e) => setMoeda(e.target.value)} aria-label="Moeda" style={{ ...campo, width: '96px', font: "500 16px 'Open Sans'" }}>{moedas.map((m) => <option key={m} value={m}>{m}</option>)}</select>
            </div>
            <input className="r-input" placeholder="O que foi (ex.: almoço)" value={descricao} onChange={(e) => setDescricao(e.target.value.slice(0, 80))} aria-label="Descrição" style={campo} />
            <select value={categoria} onChange={(e) => setCategoria(e.target.value)} aria-label="Categoria" style={{ ...campo, font: "500 16px 'Open Sans'" }}>{Object.entries(CAT).map(([id, n]) => <option key={id} value={id}>{n}</option>)}</select>
            <select value={forma} onChange={(e) => setForma(e.target.value)} aria-label="Como pagou" style={{ ...campo, font: "500 16px 'Open Sans'" }}>{Object.entries(FORMA).map(([id, n]) => <option key={id} value={id}>{n}</option>)}</select>
            <input type="date" className="r-input" value={data} onChange={(e) => setData(e.target.value)} aria-label="Data do gasto" style={campo} />
            {moeda !== ref ? <input inputMode="decimal" className="r-input" placeholder={`Taxa que você pagou: ${ref} por 1 ${moeda} (opcional)`} value={taxaPaga} onChange={(e) => setTaxaPaga(e.target.value.replace(/[^\d,]/g, ''))} aria-label="Taxa paga (opcional)" style={campo} /> : null}
            {moeda !== ref ? <div style={{ fontSize: '12px', color: 'var(--texto-sec)' }}>Sem taxa informada, convertemos pela cotação de referência do Banco Central. O valor original fica guardado.</div> : null}
            {grupo ? (
              <>
                <label style={{ fontSize: '13px', color: 'var(--texto-sec)' }}>Quem pagou
                  <select value={pagador} onChange={(e) => setPagoPor(e.target.value)} style={{ ...campo, font: "500 16px 'Open Sans'" }}>
                    {ativos.map((m) => <option key={m.user_id} value={m.user_id}>{m.user_id === eu ? 'Eu' : m.nome}</option>)}
                  </select>
                </label>
                <div role="group" aria-label="Dividir entre">
                  <div style={{ fontSize: '13px', color: 'var(--texto-sec)' }}>Dividir entre</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                    {ativos.map((m) => {
                      const dentro = divididoEntre.includes(m.user_id);
                      return (
                        <button key={m.user_id} type="button" className="r-btn" aria-pressed={dentro}
                          onClick={() => { const atual = divididoEntre; const novo = dentro ? atual.filter((x) => x !== m.user_id) : [...atual, m.user_id]; if (novo.length) setEntre(novo); }}
                          style={{ minHeight: '40px', padding: '0 12px', borderRadius: '20px', font: "600 14px 'Open Sans'", ...(dentro ? { background: 'var(--fundo-escuro)', color: '#fff' } : { background: 'var(--cartao-2)' }) }}>{m.user_id === eu ? 'Eu' : m.nome.split(' ')[0]}</button>
                      );
                    })}
                  </div>
                </div>
              </>
            ) : null}
            {erro ? <Aviso>{erro}</Aviso> : null}
            <BotaoContorno onClick={() => void salvar()}>Anotar gasto</BotaoContorno>
          </div>
        </>
      ) : null}
      {grupo ? <QuemDeve v={v} refMoeda={ref} eu={eu} /> : null}
      <Rotulo>Gastos anotados</Rotulo>
      {v.gastosReais.length ? [...v.gastosReais].reverse().map((g) => (
        <div key={g.id} style={{ borderTop: '1px dashed var(--linha)', padding: '6px 0', fontSize: '14px', lineHeight: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
            <span>{g.descricao}</span>
            <b>{dinheiro(g.valor_centavos, g.moeda)}</b>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--texto-sec)' }}>
            <span>{dataBR(g.data)} · {CAT[g.categoria]} · {FORMA[g.forma]}{grupo && (g.pago_por ?? g.criado_por) ? ` · pago por ${nomeDe(v, g.pago_por ?? g.criado_por, eu)}` : ''}</span>
            <span>{g.moeda !== g.moeda_ref && g.valor_ref_centavos !== null ? `≈ ${dinheiro(g.valor_ref_centavos, g.moeda_ref ?? ref)}` : g.moeda !== g.moeda_ref ? 'sem conversão' : ''}</span>
          </div>
          {g.taxa_fonte && g.moeda !== g.moeda_ref ? <div style={{ fontSize: '12px', color: 'var(--texto-sec)' }}>Taxa {String(g.taxa).replace('.', ',')} · {g.taxa_fonte}</div> : null}
          {pode ? <button type="button" className="r-btn" onClick={() => void removerGastoReal(v.viagem.id, g.id).then(recarregar)} style={{ color: 'var(--vermelho)', fontSize: '13px', minHeight: '36px' }}>Remover</button> : null}
        </div>
      )) : <div style={{ fontSize: '14px', color: 'var(--texto-sec)' }}>Nenhum gasto anotado ainda.</div>}
    </div>
  );
}

/** Planejado × real por categoria, na moeda de planejamento. */
const nomeDe = (v: ViagemCompleta, id: string | null | undefined, eu: string | null) => (id === eu ? 'você' : v.membros.find((m) => m.user_id === id)?.nome.split(' ')[0] ?? 'alguém');

/** Quem deve a quem (D-065), na moeda de referência da viagem. */
function QuemDeve({ v, refMoeda, eu }: { v: ViagemCompleta; refMoeda: string; eu: string | null }) {
  const ativos = v.membros.filter((m) => m.status === 'ativo').map((m) => m.user_id);
  const semConversao = v.gastosReais.filter((g) => g.moeda !== refMoeda && g.valor_ref_centavos === null).length;
  const gastos = v.gastosReais
    .map((g) => ({ valor: g.moeda === refMoeda ? g.valor_centavos : g.valor_ref_centavos ?? 0, pagoPor: g.pago_por ?? g.criado_por ?? '', entre: g.dividido_entre?.length ? g.dividido_entre : ativos }))
    .filter((g) => g.valor > 0 && g.pagoPor);
  const t = quemDeveAQuem(gastos, ativos);
  if (!gastos.length) return null;
  return (
    <section aria-label="Quem deve a quem" style={{ marginTop: '14px', padding: '12px', borderRadius: '12px', background: 'var(--cartao-2)' }}>
      <div style={{ font: "600 16px 'Lexend Exa'" }}>Quem deve a quem</div>
      {t.length ? t.map((x) => (
        <div key={`${x.de}-${x.para}`} style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', fontSize: '15px', padding: '6px 0', borderTop: '1px solid var(--linha)' }}>
          <span><b>{nomeDe(v, x.de, eu).replace(/^você$/, 'Você')}</b> paga para <b>{nomeDe(v, x.para, eu)}</b></span>
          <b>{dinheiro(x.valor, refMoeda)}</b>
        </div>
      )) : <div style={{ fontSize: '14px', color: 'var(--verde)', fontWeight: 600, marginTop: '4px' }}>Tudo certo: ninguém deve nada.</div>}
      {semConversao ? <div style={{ fontSize: '12px', color: 'var(--texto-sec)', marginTop: '4px' }}>{semConversao === 1 ? '1 gasto sem conversão ficou fora da conta.' : `${semConversao} gastos sem conversão ficaram fora da conta.`}</div> : null}
    </section>
  );
}

export function planejadoReal(v: ViagemCompleta, j: Jornada, orc: Orcamento) {
  const t = taxa('BRL', j.moedaPlano);
  const plan = new Map<string, number>();
  for (const c of orc.categorias) {
    const val = converter(meio(c.minBRL, c.maxBRL), t) ?? 0;
    if (c.id === 'outros') for (const g of v.gastos) { const k = g.categoria === 'passagem' ? 'passagem' : 'outros'; plan.set(k, (plan.get(k) ?? 0) + (converter(g.valor_centavos, taxa(g.moeda, j.moedaPlano)) ?? 0)); }
    else plan.set(c.id, (plan.get(c.id) ?? 0) + val);
  }
  const real = new Map<string, number>();
  let semConversao = 0;
  for (const g of v.gastosReais) {
    const k = g.categoria === 'compras' || g.categoria === 'documentos' ? 'outros' : g.categoria;
    const valor = g.moeda_ref === j.moedaPlano ? g.valor_ref_centavos : converter(g.valor_centavos, taxa(g.moeda, j.moedaPlano));
    if (valor === null) semConversao++;
    else real.set(k, (real.get(k) ?? 0) + valor);
  }
  const ids = ['passagem', 'hospedagem', 'alimentacao', 'lazer', 'transporte', 'outros'];
  const linhas = ids.map((id) => ({ id, nome: CAT[id]!, plan: plan.get(id) ?? 0, real: real.get(id) ?? 0 })).filter((l) => l.plan || l.real);
  return { linhas, plan: linhas.reduce((s, l) => s + l.plan, 0), real: linhas.reduce((s, l) => s + l.real, 0), semConversao };
}

export function PlanejadoReal({ v, j, orc, comCompartilhar }: { v: ViagemCompleta; j: Jornada; orc: Orcamento; comCompartilhar?: boolean }) {
  const r = planejadoReal(v, j, orc);
  const f = (c: number) => dinheiro(c, j.moedaPlano);
  const texto = `Minha viagem para ${v.viagem.destino} (${v.viagem.noites + 1} dias): ${r.plan ? `planejei ${f(r.plan)} e ` : ''}gastei ${f(r.real)}${v.viagem.avaliacao ? `. Nota do planejamento: ${v.viagem.avaliacao}/5` : ''}. Planejada no Bo Vair.`;
  return (
    <div style={{ marginTop: '6px' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
        <caption style={{ textAlign: 'left', font: "700 12px 'Open Sans'", letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--texto-sec)', paddingBottom: '6px' }}>Planejado × real ({j.moedaPlano})</caption>
        <thead><tr style={{ fontSize: '12px', color: 'var(--texto-sec)' }}><th scope="col" style={{ textAlign: 'left' }}>Categoria</th><th scope="col" style={{ textAlign: 'right' }}>Planejado</th><th scope="col" style={{ textAlign: 'right' }}>Real</th></tr></thead>
        <tbody>
          {r.linhas.map((l) => (
            <tr key={l.id} style={{ borderTop: '1px solid var(--linha)' }}>
              <th scope="row" style={{ textAlign: 'left', fontWeight: 500, padding: '6px 0' }}>{l.nome}</th>
              <td style={{ textAlign: 'right' }}>{l.plan ? f(l.plan) : '—'}</td>
              <td style={{ textAlign: 'right', fontWeight: 600, color: l.plan && l.real > l.plan ? 'var(--vermelho)' : 'var(--texto)' }}>{l.real ? f(l.real) : '—'}</td>
            </tr>
          ))}
          <tr style={{ borderTop: '2px solid var(--texto)' }}>
            <th scope="row" style={{ textAlign: 'left', padding: '6px 0' }}>Total</th>
            <td style={{ textAlign: 'right', fontWeight: 700 }}>{r.plan ? f(r.plan) : '—'}</td>
            <td style={{ textAlign: 'right', fontWeight: 700, color: !r.plan ? 'var(--texto)' : r.real > r.plan ? 'var(--vermelho)' : 'var(--verde)' }}>{r.real ? f(r.real) : '—'}</td>
          </tr>
        </tbody>
      </table>
      <Info rotulo="Como calculamos" style={{ marginTop: '4px' }}>Planejado = estimativa + o que você informou. Real = gastos anotados, na taxa de cada um.{r.semConversao ? ` ${r.semConversao} gasto(s) sem conversão ficaram fora.` : ''}</Info>
      {comCompartilhar && v.viagem.encerrada_em ? <BotaoContorno onClick={() => compartilhar(texto)} style={{ marginTop: '8px' }}>Compartilhar resumo</BotaoContorno> : null}
    </div>
  );
}
