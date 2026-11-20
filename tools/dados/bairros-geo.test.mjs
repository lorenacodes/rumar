import assert from 'node:assert/strict';
import { test } from 'node:test';
import { pontoNoContorno } from './bairros-geo.mjs';

const quadrado = [[0, 0], [10, 0], [10, 10], [0, 10], [0, 0]];
test('ponto dentro e fora de um contorno fechado', () => {
  assert.ok(pontoNoContorno([5, 5], [quadrado]));
  assert.equal(pontoNoContorno([15, 5], [quadrado]), false);
});
test('anel formado por várias vias abertas (como nas relações do OSM)', () => {
  const partes = [[[0, 0], [10, 0], [10, 10]], [[10, 10], [0, 10], [0, 0]]];
  assert.ok(pontoNoContorno([5, 5], partes));
  assert.equal(pontoNoContorno([-1, 5], partes), false);
});
test('anel interno vira buraco', () => {
  const buraco = [[4, 4], [6, 4], [6, 6], [4, 6], [4, 4]];
  assert.equal(pontoNoContorno([5, 5], [quadrado, buraco]), false);
  assert.ok(pontoNoContorno([2, 2], [quadrado, buraco]));
});
