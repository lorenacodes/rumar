/**
 * Rota de cada tela do design. Telas feitas à mão têm rota própria; as geradas abrem em
 * /tela/<id>. Assim um toque pode apontar só para o id do design ("2.2").
 */
const ROTAS: Record<string, string> = {
  '1.1': '/',
  '1.2': '/menor-de-18',
  '1.3': '/boas-vindas',
  '1.4': '/seu-plano',
  '1.5': '/avisos',
  '3.1': '/sonho',
  '5.1': '/entrar',
  '5.3': '/conta/criar',
  '5.4': '/conta/ja-existe',
  '5.5': '/conta/codigo',
  '5.7': '/conta/plano-deste-aparelho',
  '5.8': '/conta/esqueci',
  '5.9': '/conta/confira-email',
  '5.10': '/conta/senha-nova',
  '5.11': '/conta/senha-trocada',
  '5.12': '/conta/link-vencido',
  '5.13': '/perfil',
  '5.14': '/perfil/nome',
  '5.15': '/perfil/email',
  '5.16': '/perfil/senha',
  '5.17': '/perfil/sair',
  '5.18': '/conta/saiu',
  '28.7': '/sessao-terminou',
  // 15.1 e 16.1 viraram uma tela só (D-017).
  '15.1': '/minha-viagem',
  '16.1': '/minha-viagem',
};

export function rotaDaTela(destino: string): string {
  if (destino.startsWith('/')) return destino;
  return ROTAS[destino] ?? `/tela/${destino}`;
}
