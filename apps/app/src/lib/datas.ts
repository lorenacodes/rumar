/**
 * Datas no fuso de quem usa o app (D-085). `new Date().toISOString().slice(0, 10)` dá a data em UTC: no Brasil
 * (UTC-3), das 21h à meia-noite isso já é "amanhã". Use sempre hojeLocal() para "hoje".
 */
export function hojeLocal(dias = 0): string {
  const d = new Date();
  if (dias) d.setDate(d.getDate() + dias);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
