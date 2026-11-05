import { useState } from 'react';

import { ANA } from '../../dev/demo';
import { Tela5_2 } from './Tela5_1';

/** 5.2 no modo demonstração (no app, ela é um estado da 5.1). */
export function Tela5_2Demo() {
  const [email, setEmail] = useState<string>(ANA.email);
  const [senha, setSenha] = useState('123456');
  return <Tela5_2 email={email} setEmail={setEmail} senha={senha} setSenha={setSenha} erro="senha" enviar={() => undefined} enviando={false} />;
}
