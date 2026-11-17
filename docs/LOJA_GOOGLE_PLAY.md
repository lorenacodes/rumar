# Ficha na Google Play — rascunho pronto para colar

> Preparado em 17/11/2026 com base no que o app faz **hoje**. Se uma função mudar (ex.: notificações,
> anúncios, login com Google), estas respostas precisam mudar junto. Revisar com o advogado(a) junto
> com o Aviso de privacidade.

## Dados básicos
- **Nome do app:** Bo Vair
- **Categoria:** Viagens e local
- **Classificação indicativa:** Livre (questionário IARC: sem violência, sexo, drogas, jogos de azar;
  há interação entre usuários → marcar "usuários podem interagir" e "compartilham informações").
  O app exige 18+ no cadastro por decisão do produto; na loja, o público-alvo é **18 anos ou mais**.
- **Contém anúncios:** Não
- **Compras no app:** Não

## Descrição curta (até 80 caracteres)
Planeje viagens com preços de fonte conhecida, roteiro do seu jeito e amigos.

## Descrição completa
Bo Vair ajuda você a sair da ideia e chegar à viagem.

• Descubra qualquer cidade do Brasil e destinos no exterior: restaurantes, praias, museus, bares,
  parques e mais, no mapa e por categoria.
• Monte o roteiro do seu jeito: o app sugere os dias a partir do que você gosta, e você troca,
  reordena e marca o que já fez.
• Planeje o dinheiro sem ilusão: custos com fonte e data, conversão de moeda pelo Banco Central,
  quanto guardar por mês até a data e o que já foi gasto na viagem.
• Siga a linha do tempo da viagem: documentos, reservas, antes de partir, durante e a volta, com
  prazos e links das fontes oficiais.
• Viaje com amigos: encontre pessoas pelo @, convide para a viagem e planejem juntos.
• Aprenda o básico do idioma com aulas curtas por tema.

Transparência: preço só aparece com fonte; o que é estimativa aparece como estimativa; e cada cidade
mostra o que já está mapeado e o que ainda falta.

Seus dados ficam no Brasil. Sem anúncios e sem venda de dados. Você pode baixar seus dados e excluir
sua conta pelo próprio app.

## Segurança dos dados (Data safety) — respostas sugeridas
**O app coleta ou compartilha dados do usuário?** Sim, coleta. **Compartilha com terceiros?** Não.
**Os dados são criptografados em trânsito?** Sim. **O usuário pode pedir a exclusão?** Sim (no app e
pela página web abaixo).

| Tipo de dado (categoria do Google) | Coletado | Obrigatório? | Para quê |
|---|---|---|---|
| Informações pessoais → Nome | Sim | Obrigatório | Funcionalidade do app, gerenciamento da conta |
| Informações pessoais → Endereço de e-mail | Sim | Obrigatório | Gerenciamento da conta, comunicações (código de confirmação) |
| Informações pessoais → IDs de usuário (nome de usuário @) | Sim | Opcional | Funcionalidade do app (encontrar amigos) |
| Fotos e vídeos → Fotos (foto de perfil) | Sim | Opcional | Funcionalidade do app |
| Informações financeiras → Outras informações financeiras (orçamento, gastos e economia que a pessoa digita) | Sim | Opcional | Funcionalidade do app |
| Atividade no app → Outro conteúdo gerado pelo usuário (viagens, roteiros, tarefas, lugares salvos) | Sim | Opcional | Funcionalidade do app |

**Não coletamos:** localização do aparelho, contatos, mensagens, histórico de navegação, dados de
saúde, identificadores de publicidade, dados de uso para análise (não há ferramenta de analytics).
A cidade de onde a pessoa sai é digitada por ela (não usamos o GPS).

Observação técnica: para buscar hotéis (quando ligado), o servidor envia à LiteAPI só coordenadas da
cidade, datas e número de pessoas, sem nome ou e-mail; mapas, fotos e vídeos são carregados direto
pelo aparelho nos serviços deles. Isso não é "compartilhamento de dados do usuário" na definição do
Google, mas está descrito no Aviso de privacidade.

## Links que a loja exige (precisam de endereço público)
- **Política de privacidade:** publicar `docs/web/privacidade.html`.
- **Exclusão de conta (obrigatório para apps com conta):** publicar `docs/web/excluir-conta.html`.

Onde publicar de graça (precisa de uma conta sua): Cloudflare Pages ou Netlify (arrastar a pasta
`docs/web`). GitHub Pages também serve, mas para repositório privado exige plano pago.

## Antes de enviar
- [ ] E-mail de contato de privacidade definido (trocar nos dois HTML e em `VITE_CONTATO_PRIVACIDADE`).
- [ ] Revisão jurídica do Aviso de privacidade e dos Termos.
- [ ] Capturas de tela (posso gerar a partir do app em tamanho de celular).
- [ ] Ícone 512×512 e imagem de destaque 1024×500.
