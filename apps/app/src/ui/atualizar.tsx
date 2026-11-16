import { App as CapApp } from '@capacitor/app';
import { Capacitor, CapacitorHttp } from '@capacitor/core';
import { useEffect, useState } from 'react';

/** Arquivo publicado junto com cada APK de teste (CI): número da versão e link. */
const URL_VERSAO = 'https://github.com/lorenacodes/rumar/releases/download/apk-teste-fase-0-base/versao.json';

interface Versao {
  versionCode: number;
  apk: string;
}

/**
 * Avisa quando há um APK mais novo e leva ao download (instala por cima, sem perder
 * nada). Só no celular; uma vez por abertura do app.
 */
export function AvisoAtualizar() {
  const [nova, setNova] = useState<Versao | null>(null);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;
    let vivo = true;
    void (async () => {
      try {
        const [info, r] = await Promise.all([CapApp.getInfo(), CapacitorHttp.get({ url: URL_VERSAO, responseType: 'json' })]);
        const v = (typeof r.data === 'string' ? JSON.parse(r.data) : r.data) as Versao;
        if (vivo && r.status === 200 && Number(v.versionCode) > Number(info.build)) setNova(v);
      } catch {
        // Sem internet ou sem arquivo: tenta de novo na próxima abertura.
      }
    })();
    return () => {
      vivo = false;
    };
  }, []);

  if (!nova) return null;
  return (
    <div role="status" style={{ position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 50, background: 'var(--fundo-escuro)', color: '#fff', padding: '12px 16px 16px', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 -6px 16px rgba(11,31,75,0.2)' }}>
      <span style={{ flex: 1, font: "600 15px/20px 'Open Sans'" }}>Nova versão do Bo Vair disponível.</span>
      <button type="button" className="r-btn" onClick={() => setNova(null)} style={{ height: '48px', padding: '0 12px', font: "600 15px 'Open Sans'", color: '#fff' }}>
        Depois
      </button>
      <button type="button" className="r-btn" onClick={() => (window.location.href = nova.apk)} style={{ height: '48px', padding: '0 16px', background: 'var(--amarelo)', color: 'var(--botao-principal-texto)', font: "600 15px 'Open Sans'" }}>
        Atualizar ↗
      </button>
    </div>
  );
}
