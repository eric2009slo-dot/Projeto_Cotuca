import { Mail, Lock } from "lucide-react";
import Link from "next/link";
export default function Login() {
  return (
    <main>
      <div className="login-card">
        <h1>ENTRAR</h1>

       <label>
        <Mail size={18} />
        E-mail
        </label>
        <input type="email" />


        <label>
            <Lock size={18} />
            Senha
        </label>
        <input type="password" />



        <button>ENTRAR</button>

        <p className="esqueci-senha">
            Esqueceu sua senha?
        </p>

        <p className="cadastro-link">
            Ainda não possui uma conta?{" "}
            <Link href="/cadastro">Cadastre-se</Link>
        </p>
      </div>
    </main>
  );
}