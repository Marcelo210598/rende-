import { redirect } from "next/navigation";

export default function Home() {
  // Redireciona para a landing page
  // A landing page checa sessão e redireciona para dashboard se logado
  redirect("/welcome");
}
