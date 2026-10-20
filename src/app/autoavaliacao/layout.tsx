// As páginas antigas (relatório e sobre) ainda não têm versão escura: ficam sempre no tema claro.
export default function LightOnlyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-theme="light" className="min-h-dvh bg-neutral-50 text-foreground">
      {children}
    </div>
  );
}
