import assert from 'node:assert/strict';
import { test } from 'node:test';
import { cita } from './fotos-regras.mjs';

test('aceita quando o arquivo é do lugar', () => {
  assert.ok(cita('File:Passeio na área verde do Sítio Trindade.jpg', 'Sítio da Trindade'));
  assert.ok(cita('File:Arriegua Recife.jpg', 'Arriégua'));
  assert.ok(cita('File:Banho de mar no Buraco da Velha em Brasília Teimosa.jpg', 'Praia do Buraco da Velha'));
  assert.ok(cita('File:Ponte do imperador aracaju - panoramio.jpg', 'Ponte do Imperador'));
  assert.ok(cita('File:Pinacoteca do Ceará 12.jpg', 'Pinacoteca do Ceará'));
  assert.ok(cita('File:Feira do Alecrim – Natal (RN).jpg', 'Feira do Alecrim'));
  assert.ok(cita('File:Praia da Malhada 2026.jpg', 'Praia da Malhada'));
  assert.ok(cita('File:Casa dos Sete Candeeiros Salvador 2018-1333.jpg', 'Casa dos Sete Candeeiros'));
  assert.ok(cita('File:Cinesercla Shopping Premio 2.jpg', 'Cinesercla Shopping Prêmio'));
});
test('recusa os erros vistos na 1ª rodada', () => {
  assert.equal(cita('File:DJ Cabeção no Carnaval de Salvador-Bahia. .jpg', 'Museu do Bahia'), false);
  assert.equal(cita('File:Sede do Ministério Público do Estado da Bahia.jpg', 'Tribunal De Justiça Do Estado Da Bahia'), false);
  assert.equal(cita('File:Avenida Anita Garibaldi, Salvador.jpg', 'Praça da garibaldi'), false);
  assert.equal(cita('File:Estação Calçada Salvador 2017-10107.jpg', 'Largo da Calçada'), false);
  assert.equal(cita('File:Kerodon rupestris 166325292.jpg', 'Praia do Bode'), false);
  assert.equal(cita('File:Apr2024. Recife City Museum aka Museu da Cidade do Recife - Forte das Cinco Pontas 20.jpg', 'Praça Frei Caneca'), false);
  assert.equal(cita('File:São Miguel Palace - Fernando de Noronha - Pernambuco - Brazil.jpg', 'Praça São Miguel'), false);
  assert.equal(cita('File:Ideal Clube 08.jpg', 'Ideal Praia Hotel'), false);
  assert.equal(cita('File:Seminário Santo Antônio.jpg', 'Largo de Santo Antônio'), false);
  assert.equal(cita('File:Oficina de Museu Portátil no Arquivo Público Municipal de Cachoeira (51993).jpg', 'Centro de Cultura'), false);
});

test('hospedagem: recusa foto de coisa vizinha (rodada de 20/11)', () => {
  assert.equal(cita('File:Paraíso metro station (Linha 1-Azul, Linha 2-Verde), SP, 2025-06-16 (44).jpg', 'Hotel Estação Paraíso', 'hospedagem'), false);
  assert.equal(cita('File:Escadaria-Selarón 06 42 01 136000.jpeg', 'Casa da Escada', 'hospedagem'), false);
  assert.equal(cita('File:Ubatuba trip (Jul 2023) 274.jpg', 'Ubatuba Palace Hotel', 'hospedagem'), false);
  assert.ok(cita('File:Hotel Copacabana Palace 2019.jpg', 'Copacabana Palace', 'hospedagem'));
  assert.ok(cita('File:Pousada Maravilha Noronha.jpg', 'Pousada Maravilha', 'hospedagem'));
});
