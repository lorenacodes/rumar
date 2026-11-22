import assert from 'node:assert/strict';
import { test } from 'node:test';
import { avaliarEndereco, campos, candidato, duplicado, nomeBonito } from './cnpj-regras.mjs';

const linha = (o = {}) => {
  const f = Array(30).fill('');
  Object.assign(f, { 0: '12345678', 1: '0001', 2: '90', 3: '1', 4: 'BAR DO ZE', 5: '02', 11: '5611204', 13: 'RUA', 14: 'DA AURORA', 15: '72', 17: 'BOA VISTA', 18: '50050000', 19: 'PE', 20: '2531', 21: '81', 22: '32221111' }, o);
  return f;
};
const RECIFE = new Map([['2531', { destino: 'br-2611606', uf: 'PE' }]]);

test('lê a linha da Receita com aspas e ponto e vírgula', () => {
  assert.deepEqual(campos('"123";"BAR ""DO"" ZE";"02"'), ['123', 'BAR "DO" ZE', '02']);
});
test('candidato: ativo, município, CNAE de comida e com nome fantasia', () => {
  const c = candidato(linha(), RECIFE);
  assert.equal(c.cnpj, '12345678000190'); assert.equal(c.categoria, 'bares'); assert.equal(c.nome, 'Bar do Ze');
  assert.equal(c.rua, 'Rua da Aurora'); assert.equal(c.numero, '72');
  assert.equal(candidato(linha({ 5: '08' }), RECIFE), null); // baixada
  assert.equal(candidato(linha({ 20: '9999' }), RECIFE), null); // outra cidade
  assert.equal(candidato(linha({ 19: 'RS' }), RECIFE), null); // mesmo código, outro estado
  assert.equal(c.destino, 'br-2611606');
  assert.equal(candidato(linha({ 11: '4711302' }), RECIFE), null); // supermercado
  assert.equal(candidato(linha({ 4: '' }), RECIFE), null); // sem nome fantasia
  assert.equal(candidato(linha({ 15: 'SN' }), RECIFE).numero, null);
});
test('nome sem sufixo societário', () => {
  assert.equal(nomeBonito('RESTAURANTE SABOR DA TERRA LTDA'), 'Restaurante Sabor da Terra');
  assert.equal(nomeBonito('PADARIA SAO JOSE EIRELI - ME'), 'Padaria São José');
});
test('endereço: rua precisa bater; número certo = preciso', () => {
  const c = { rua: 'Rua da Aurora', numero: '72' };
  assert.deepEqual(avaliarEndereco(c, { lat: '-8.05', lon: '-34.88', address: { road: 'Rua da Aurora', house_number: '72' } }), { lat: -8.05, lon: -34.88, preciso: true });
  assert.equal(avaliarEndereco(c, { lat: '-8', lon: '-34', address: { road: 'Rua da Aurora' } }).preciso, false);
  assert.equal(avaliarEndereco(c, { lat: '-8', lon: '-34', address: { road: 'Rua do Sol' } }), null);
});
test('duplicado: mesmo nome a menos de 250 m', () => {
  const pos = { lat: -8.05, lon: -34.88 };
  assert.ok(duplicado({ nome: 'Bar do Ze Madalena' }, pos, [{ nome: 'Ze Madalena', lat: -8.0505, lon: -34.8802 }]));
  assert.equal(duplicado({ nome: 'Bar do Ze Madalena' }, pos, [{ nome: 'Ze Madalena', lat: -8.06, lon: -34.88 }]), false);
  assert.equal(duplicado({ nome: 'Bar do Ze Madalena' }, pos, [{ nome: 'Tom Marrom', lat: -8.05, lon: -34.88 }]), false);
});

test('nome: devolve acentos das palavras comuns', async () => {
  const { nomeBonito } = await import('./cnpj-regras.mjs');
  assert.equal(nomeBonito('CAFE DO JOAO LTDA'), 'Café do João');
  assert.equal(nomeBonito('GARD COZINHA CONTEMPORNEA'), 'Gard Cozinha Contemporânea');
  assert.equal(nomeBonito('ACAI DA PRACA'), 'Açaí da Praca');
});
