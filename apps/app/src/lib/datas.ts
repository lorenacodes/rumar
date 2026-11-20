/**
 * Datas no fuso de quem usa o app (D-085). `new Date().toISOString().slice(0, 10)` dá a data em UTC: no Brasil
 * (UTC-3), das 21h à meia-noite isso já é "amanhã". Use sempre hojeLocal() para "hoje".
 */
export function hojeLocal(dias = 0): string {
  const d = new Date();
  if (dias) d.setDate(d.getDate() + dias);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** "agora", "há 5 min", "há 3 h", "ontem", "há 4 dias", "12 nov" (sem ano se for este ano). */
export function tempoRelativo(iso: string, agora: Date = new Date()): string {
  const d = new Date(iso);
  const s = Math.max(0, (agora.getTime() - d.getTime()) / 1000);
  if (s < 60) return 'agora';
  if (s < 3600) return `há ${Math.floor(s / 60)} min`;
  if (s < 86400) return `há ${Math.floor(s / 3600)} h`;
  const dias = Math.floor(s / 86400);
  if (dias === 1) return 'ontem';
  if (dias < 7) return `há ${dias} dias`;
  const mes = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'][d.getMonth()];
  return d.getFullYear() === agora.getFullYear() ? `${d.getDate()} ${mes}` : `${d.getDate()} ${mes} ${d.getFullYear()}`;
}
