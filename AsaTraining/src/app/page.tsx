import Link from "next/link";

export default function Home() {
  return (
    <main style={{ padding: 40 }}>
      <h1>Gimnasio</h1>
      <p>Consultá o administrá rutinas de entrenamiento.</p>
      <Link href="/sign-in">Iniciar sesión</Link>
    </main>
  );
}
