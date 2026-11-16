import type { Place } from '@rumar/core';

/**
 * Lugares reais curados para o roteiro (a IA não inventa lugares). Primeira cidade:
 * Paris. Acessibilidade sem degraus fica "não verificada" (null) até conferirmos na
 * fonte oficial de cada lugar; horários não entram até termos fonte datada.
 */
const FONTE = 'Curadoria Bo Vair (a conferir antes de ir)';
const DATA = '2026-11-16';

function lugar(p: Omit<Place, 'destinationId' | 'provenance' | 'sourceName' | 'verifiedAt'>): Place {
  return { ...p, destinationId: 'paris', provenance: 'estimate', sourceName: FONTE, verifiedAt: DATA };
}

export const LUGARES_PARIS: readonly Place[] = [
  lugar({ id: 'louvre', name: 'Museu do Louvre', description: 'O maior museu de arte do mundo, com a Mona Lisa.', area: 'Centro', tags: ['museums_art', 'history_culture'], slots: ['morning', 'afternoon'], energy: 2, walking: 'high', stepFree: null, costLevel: 2 }),
  lugar({ id: 'orsay', name: "Museu d'Orsay", description: 'Impressionistas numa antiga estação de trem.', area: 'Saint-Germain', tags: ['museums_art'], slots: ['morning', 'afternoon'], energy: 1, walking: 'medium', stepFree: null, costLevel: 2 }),
  lugar({ id: 'pompidou', name: 'Centro Pompidou', description: 'Arte moderna e vista dos telhados de Paris.', area: 'Marais', tags: ['museums_art', 'photography'], slots: ['afternoon', 'evening'], energy: 2, walking: 'medium', stepFree: null, costLevel: 2 }),
  lugar({ id: 'montmartre', name: 'Montmartre e Sacré-Cœur', description: 'Colina dos artistas, escadarias e vista da cidade.', area: 'Montmartre', tags: ['history_culture', 'photography'], slots: ['morning', 'evening'], energy: 2, walking: 'high', stepFree: false, costLevel: 0 }),
  lugar({ id: 'museu-montmartre', name: 'Museu de Montmartre', description: 'A história do bairro dos pintores, com jardins.', area: 'Montmartre', tags: ['museums_art', 'history_culture'], slots: ['afternoon'], energy: 1, walking: 'medium', stepFree: null, costLevel: 1 }),
  lugar({ id: 'enfants-rouges', name: 'Mercado dos Enfants Rouges', description: 'O mercado coberto mais antigo de Paris, com comida do mundo todo.', area: 'Marais', tags: ['local_markets', 'food_drink'], slots: ['morning', 'afternoon'], energy: 2, walking: 'low', stepFree: null, costLevel: 1 }),
  lugar({ id: 'marais', name: 'Ruas do Marais', description: 'Lojas pequenas, cafés e a vida LGBTQIA+ de Paris.', area: 'Marais', tags: ['shopping', 'lgbtqia', 'meet_people', 'photography'], slots: ['afternoon', 'evening'], energy: 2, walking: 'medium', stepFree: null, costLevel: 1 }),
  lugar({ id: 'marais-noite', name: 'Bares do Marais', description: 'Noite animada e acolhedora para a comunidade LGBTQIA+.', area: 'Marais', tags: ['nightlife', 'lgbtqia', 'meet_people'], slots: ['night'], energy: 3, walking: 'low', stepFree: null, costLevel: 2 }),
  lugar({ id: 'luxembourg', name: 'Jardim de Luxemburgo', description: 'Jardim clássico com cadeiras para descansar ao sol.', area: 'Saint-Germain', tags: ['nature_outdoors', 'wellness', 'family_kids'], slots: ['morning', 'afternoon'], energy: 1, walking: 'medium', stepFree: null, costLevel: 0 }),
  lugar({ id: 'saint-germain', name: 'Cafés de Saint-Germain', description: 'Os cafés históricos dos escritores e artistas.', area: 'Saint-Germain', tags: ['food_drink', 'history_culture'], slots: ['morning', 'afternoon'], energy: 1, walking: 'low', stepFree: null, costLevel: 2 }),
  lugar({ id: 'canal', name: 'Canal Saint-Martin', description: 'Pontes de ferro, piqueniques e gente jovem no fim de tarde.', area: 'Canal', tags: ['meet_people', 'photography', 'wellness'], slots: ['afternoon', 'evening'], energy: 2, walking: 'medium', stepFree: null, costLevel: 0 }),
  lugar({ id: 'oberkampf', name: 'Rua Oberkampf', description: 'Bares e música até tarde, bom para conhecer gente.', area: 'Canal', tags: ['nightlife', 'meet_people'], slots: ['evening', 'night'], energy: 3, walking: 'low', stepFree: null, costLevel: 2 }),
  lugar({ id: 'torre', name: 'Torre Eiffel e Campo de Marte', description: 'O cartão-postal, com gramado para ver a torre acender.', area: 'Torre Eiffel', tags: ['photography', 'family_kids'], slots: ['afternoon', 'evening', 'night'], energy: 2, walking: 'medium', stepFree: null, costLevel: 0 }),
  lugar({ id: 'sena', name: 'Passeio de barco no Sena', description: 'Paris vista do rio, sentado e sem cansar.', area: 'Torre Eiffel', tags: ['photography', 'wellness'], slots: ['afternoon', 'evening'], energy: 1, walking: 'low', stepFree: null, costLevel: 2 }),
  lugar({ id: 'montorgueil', name: 'Rua Montorgueil', description: 'Rua de pedestres com padarias, queijarias e bistrôs.', area: 'Centro', tags: ['food_drink', 'local_markets'], slots: ['morning', 'afternoon', 'evening'], energy: 2, walking: 'low', stepFree: null, costLevel: 2 }),
  lugar({ id: 'lafayette', name: 'Galerias Lafayette', description: 'Grande loja de departamentos com terraço gratuito.', area: 'Ópera', tags: ['shopping', 'photography'], slots: ['afternoon'], energy: 2, walking: 'low', stepFree: null, costLevel: 3 }),
  lugar({ id: 'pere-lachaise', name: 'Cemitério Père-Lachaise', description: 'Arte e história ao ar livre, com túmulos famosos.', area: 'Canal', tags: ['history_culture', 'nature_outdoors'], slots: ['morning', 'afternoon'], energy: 1, walking: 'high', stepFree: false, costLevel: 0 }),
  lugar({ id: 'vincennes', name: 'Bosque de Vincennes', description: 'Lago, barquinhos e trilhas fora do agito.', area: 'Leste', tags: ['nature_outdoors', 'wellness', 'family_kids'], slots: ['morning', 'afternoon'], energy: 1, walking: 'medium', stepFree: null, costLevel: 0 }),
  lugar({ id: 'shakespeare', name: 'Livraria Shakespeare and Company', description: 'Livraria histórica em frente à Notre-Dame.', area: 'Saint-Germain', tags: ['history_culture'], slots: ['morning', 'afternoon'], energy: 1, walking: 'low', stepFree: false, costLevel: 0 }),
  lugar({ id: 'notre-dame', name: 'Catedral de Notre-Dame', description: 'A catedral gótica no coração da Île de la Cité.', area: 'Centro', tags: ['history_culture', 'photography'], slots: ['morning', 'afternoon'], energy: 1, walking: 'medium', stepFree: null, costLevel: 0 }),
];
