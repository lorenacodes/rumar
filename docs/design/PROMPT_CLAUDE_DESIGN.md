# Prompt para continuar o design do Rumar no Claude Design

Cole o texto abaixo no Claude Design. Se puder, anexe junto as capturas de tela atuais
do app (onboarding, Descobrir, destino, Minha Viagem com o cartão de embarque, roteiro).

---

Quero continuar o design do **Rumar**, um app Android (depois iOS) de planejamento
de viagens internacionais para brasileiros. Já existe uma versão funcionando; quero
evoluir o visual mantendo o que já foi aprovado.

## O produto em uma frase
"Da vontade ao embarque": a pessoa diz quanto consegue guardar por mês e o Rumar
mostra para onde e quando dá para ir (com o custo total real da viagem), cria uma
meta e acompanha tudo até o embarque, sem guardar o dinheiro de ninguém. Público
principal: brasileiros que nunca viajaram para fora e acham que "não é para eles".
O app precisa **despertar desejo de viajar** e transmitir **confiança**.

## O que NÃO pode mudar
1. **Tipografia (obrigatório manter):**
   - **Lexend Exa** (Google Fonts), pesos 500 e 600, só nos títulos grandes, nomes de
     cidades, códigos de aeroporto e números de destaque. Espaçamento entre letras
     levemente negativo nos títulos grandes.
   - **Open Sans**, pesos 400, 500 e 600, para todo o resto: texto, rótulos, botões e opções.
2. **O cartão de embarque** da tela "Minha viagem" é o elemento que eu mais gosto e
   deve virar a assinatura do app. Hoje ele tem:
   - fundo preto, faixa colorida no topo com a cor do destino;
   - "Seu cartão de embarque" em laranja e "rumar" discreto à direita;
   - códigos dos aeroportos gigantes (GRU ✈ AAA) com os nomes das cidades embaixo;
   - campos Embarque (ex.: "jun de 2027"), Faltam ("209 dias") e Pronta ("13%", em laranja);
   - picote tracejado com dois recortes semicirculares nas laterais;
   - um "canhoto" com três barras de progresso: Dinheiro guardado (laranja),
     Documentos (amarelo-sol) e Reservas e preparativos (creme).
   Quero que você **refine e valorize** esse cartão (e pode explorar variações dele,
   como um cartão compartilhável para redes sociais ou um "carimbo" quando a meta é
   atingida), sem descaracterizar.
3. **Paleta:** fundo creme papel #FFFCEB; preto tinta #0E0F0B; **laranja de pôr do
   sol #FF5A1F** como cor de personalidade (#B8400C quando for texto sobre o creme,
   para manter contraste AA); apoio: amarelo-sol #FFC845, areia #F4EBD6, linhas
   #D9CDB3, texto secundário #6E6A5E. **Não usar verde** (já testamos e ficou solto).
4. **Cantos retos** (sem arredondado) em cartões, botões e campos. Botão principal
   preto com texto creme e seta ↗ no fim; botão secundário com contorno preto.
5. **Tom humano e editorial, como uma revista de viagem, e não tecnológico:** nada
   de códigos tipo "//01", nada de texto todo em maiúsculas com letras espaçadas,
   nada de visual de painel/dashboard. Rótulos em frase normal ("Seu próximo passo",
   "Quando dá pra ir", "Saindo de GRU").
6. Modo claro e modo escuro (no escuro: fundo #0E0F0B, texto creme, laranja #FF8A5C
   para textos de destaque).

## Telas que já existem (para você refinar)
- **Onboarding (3 perguntas, sem cadastro):** topo com gradiente de pôr do sol
  (laranja → amarelo) e o título "Seu próximo carimbo no passaporte começa aqui.";
  campos grandes de valor em reais com linha de base ("Consigo guardar por mês",
  "Já tenho guardado"); depois aeroporto de saída, quantas pessoas, mês e passaporte.
- **Descobrir:** título do tipo "2 viagens cabem no seu plano."; um **quadro de
  partidas** preto com laranja (destino, mês a partir do qual dá para ir, custo
  total); opções de estilo (econômica, intermediária, confortável) e de noites;
  **cartões-postais** dos destinos com gradiente quente próprio, nome grande da
  cidade, rota "GRU → AAA", um carimbo inclinado com o código do país e uma frase de clima.
- **Destino:** cartão-postal grande no topo; calendário de meses em quadrados com
  estado (Dá pra ir / Quase lá / Ainda não / Sem tempo para documentos); custo da
  viagem em formato de **recibo** numerado (passagem, hospedagem, comida, transporte,
  seguro, IOF e câmbio, reserva para imprevistos) e o total; botão "Quero ir em junho de 2027 ↗".
- **Minha viagem:** o cartão de embarque; "Registrar quanto guardei"; cartão laranja
  "Seu próximo passo" com prazo; lista "O que falta fazer" com prazos e caixas de seleção.
- **Seu jeito de viajar:** a pessoa escolhe interesses (história, museus, comida,
  natureza, praia, vida noturna, conhecer gente, cena LGBTQIA+, aventura, compras,
  bem-estar, com crianças…), ritmo (tranquilo, equilibrado, intenso) e necessidades
  (pouca caminhada, acesso sem degraus, lugares mais calmos).
- **Seu roteiro:** dias em blocos (cabeçalho preto "Dia 1 · chegada · bairro"), cada
  horário com o lugar, descrição e etiquetas de "por que sugerimos".

## O que eu quero de você agora
1. Um **sistema visual refinado** (cores, tipografia em escala, espaçamentos,
   componentes) mantendo as regras acima.
2. **Redesenho das telas principais** com mais desejo de viajar e mais calor humano,
   em tamanho de celular (390 × 844), nos modos claro e escuro.
3. **Explorações do cartão de embarque** (pelo menos 3 variações) e do cartão-postal.
4. Proposta de **logo e ícone do app** do Rumar, na linha preto + laranja, usando a
   Lexend Exa como base do logotipo.
5. Sugestão de como usar **fotos de destinos** sem perder a identidade (ex.: foto com
   tratamento quente, recortada dentro do cartão-postal).

## Regras de conteúdo (importante)
- Use **dados de exemplo claramente fictícios** (ex.: "Cidade Simulada A",
  aeroporto "AAA"). Não invente preços, regras de visto ou estatísticas de destinos
  reais apresentados como verdadeiros.
- Todo valor em dinheiro no app vem com um selo de procedência: "Cotado agora",
  "Referência de dd/mm/aaaa", "Estimativa" ou "Simulado". Mantenha esse selo no
  design (pequeno, com ícone + texto, sem depender só da cor).
- Acessibilidade: contraste AA, áreas de toque de pelo menos 48 px, texto que
  aguente fonte grande do sistema.
- Interface em **português do Brasil**.
