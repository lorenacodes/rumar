import assert from 'node:assert/strict';
import { test } from 'node:test';
import { aceitarResultado } from './descobertas-regras.mjs';

test('endereço com número: aceita só rua e número certos', () => {
  const d = { nome: 'Casa Lontra', endereco: 'Rua Bispo Cardoso Ayres, 72', bairro: 'Boa Vista' };
  assert.ok(aceitarResultado(d, { display_name: '72, Rua Bispo Cardoso Ayres, Boa Vista, Recife', type: 'house', address: { road: 'Rua Bispo Cardoso Ayres', house_number: '72' } }));
  assert.equal(aceitarResultado(d, { display_name: 'Rua Bispo Cardoso Ayres, Boa Vista, Recife', type: 'road', address: { road: 'Rua Bispo Cardoso Ayres' } }), false);
  assert.equal(aceitarResultado(d, { display_name: '72, Rua da Aurora, Boa Vista, Recife', type: 'house', address: { road: 'Rua da Aurora', house_number: '72' } }), false);
});
test('sem endereço: nome inteiro e bairro precisam aparecer; rua ou bairro sozinhos não servem', () => {
  const d = { nome: 'Praça Encanta Moça', bairro: 'Pina' };
  assert.ok(aceitarResultado(d, { display_name: 'Praça Encanta Moça, Pina, Recife', type: 'park', address: {} }));
  assert.equal(aceitarResultado(d, { display_name: 'Praça Encanta Moça, Boa Viagem, Recife', type: 'park', address: {} }), false);
  assert.equal(aceitarResultado({ nome: 'Pina' }, { display_name: 'Pina, Recife', type: 'suburb', address: {} }), false);
});
