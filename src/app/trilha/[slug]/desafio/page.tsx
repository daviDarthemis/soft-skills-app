"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { notFound, useParams, useRouter } from "next/navigation";
import { Volume2, VolumeX, X } from "lucide-react";
import { ProgressBar } from "@/components/game/shell";
import { BoltIcon, FlameIcon, MedalIcon, SoundIcon } from "@/components/game/icons";
import { getTrail } from "@/game/trails";
import { answeredCount, BADGES, useGame } from "@/game/store";
import { useSpeech } from "@/game/use-speech";
import { cn } from "@/lib/utils";

const CHEERS = ["Boa escolha!", "Resposta registrada!", "Mandou bem!", "Anotado!", "Isso aí!"];

export default function ChallengePage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const trail = getTrail(slug);
  const { ready, progressOf, answer, state, toggleVoice } = useGame();
  const { supported, speaking, speak, stop } = useSpeech();

  const [index, setIndex] = useState<number | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ xp: number; cheer: string; finished: boolean; badges: string[] } | null>(null);

  if (!trail) notFound();
  const total = trail.questions.length;

  // Retoma de onde parou.
  useEffect(() => {
    if (!ready || index !== null) return;
    const p = progressOf(trail.slug);
    if (p.completed) {
      router.replace(`/trilha/${trail.slug}/resultado`);
      return;
    }
    const first = p.answers.findIndex((a) => a === null);
    setIndex(first < 0 ? 0 : first);
  }, [ready, index, progressOf, trail.slug, router]);

  const question = index !== null ? trail.questions[index] : null;
  const narration = question ? [question.prompt, question.statement].filter(Boolean).join(" ") : "";

  // Leitura automática da pergunta quando a voz está ligada.
  useEffect(() => {
    if (question && state.voice) speak(narration, "q");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question?.id, state.voice]);

  if (!question || index === null) {
    return <div className="grid min-h-dvh place-items-center bg-canvas font-bold text-pop">Carregando…</div>;
  }

  const selectedOption = question.options.find((o) => o.key === selected) ?? null;
  const done = answeredCount(progressOf(trail.slug));

  function choose(key: string) {
    if (feedback) return;
    setSelected(key);
    const opt = question!.options.find((o) => o.key === key)!;
    if (state.voice) speak(opt.text, key);
  }

  function confirm() {
    if (!selectedOption) return;
    stop();
    const r = answer(trail!.slug, index!, selectedOption.value);
    setFeedback({ xp: r.xpGained, cheer: CHEERS[index! % CHEERS.length], finished: r.finished, badges: r.newBadges });
  }

  function next() {
    if (feedback?.finished) {
      router.push(`/trilha/${trail!.slug}/resultado?celebrar=1`);
      return;
    }
    const p = progressOf(trail!.slug);
    const nextIndex = p.answers.findIndex((a) => a === null);
    setFeedback(null);
    setSelected(null);
    setIndex(nextIndex < 0 ? Math.min(index! + 1, total - 1) : nextIndex);
  }

  return (
    <div className="flex min-h-dvh flex-col bg-canvas text-ink">
      {/* Cabeçalho: sair (o progresso fica salvo), barra de progresso, sequência e voz */}
      <header className="mx-auto flex h-16 w-full max-w-xl items-center gap-3 px-4 sm:px-6">
        <Link
          href={`/trilha/${trail.slug}/caminho`}
          aria-label="Sair (seu progresso fica salvo)"
          className="grid size-9 shrink-0 place-items-center rounded-full text-soft transition-colors hover:bg-panel hover:text-ink"
          onClick={stop}
        >
          <X className="size-6" />
        </Link>
        <ProgressBar value={done} max={total} />
        <span className="flex h-9 shrink-0 items-center gap-1.5 font-display text-base font-semibold leading-none tabular-nums text-coral-600 dark:text-coral" aria-label={`Sequência de ${state.streak.count} dias`}>
          <FlameIcon className="size-6" />
          {state.streak.count}
        </span>
        <button
          type="button"
          onClick={() => {
            if (state.voice) stop();
            toggleVoice();
          }}
          aria-pressed={state.voice}
          aria-label={state.voice ? "Desligar leitura automática por voz" : "Ligar leitura automática por voz"}
          className={cn(
            "grid size-9 shrink-0 place-items-center rounded-full border-2 transition-colors",
            state.voice ? "border-sea bg-sea text-night" : "border-rule text-soft",
          )}
          disabled={!supported}
        >
          {state.voice ? <Volume2 className="size-5" /> : <VolumeX className="size-5" />}
        </button>
      </header>

      {/* Cada pergunta entra deslizando da direita */}
      <main key={question.id} className="mx-auto w-full max-w-xl flex-1 animate-slide-in px-4 pb-40 sm:px-6">
        <p className="mb-2 mt-3 text-xs font-black uppercase tracking-wider text-pop">
          Situação {index + 1} de {total}
        </p>
        <h1 className="font-display text-2xl font-semibold leading-tight">{question.prompt}</h1>

        <section className="relative mt-4 flex items-start gap-3 rounded-2xl border-2 border-rule bg-panel p-4" aria-live="polite">
          <button
            type="button"
            onClick={() => speak(narration, "q")}
            aria-label="Ouvir a pergunta"
            className={cn("shrink-0 transition-transform hover:scale-110", speaking === "q" && "speaking")}
          >
            <SoundIcon className="size-9" />
          </button>
          <p className="pt-1 font-bold leading-snug">
            {question.statement ? `“${question.statement}”` : "Escolha a resposta que mais combina com você. Não existe resposta errada."}
          </p>
        </section>

        <section role="radiogroup" aria-label="Respostas" className="mt-6 space-y-3">
          {question.options.map((opt, i) => {
            const isSel = opt.key === selected;
            return (
              <button
                key={opt.key}
                type="button"
                role="radio"
                aria-checked={isSel}
                onClick={() => choose(opt.key)}
                className="answer-card flex min-h-[68px] animate-fade-up items-center gap-3"
                style={{ animationDelay: `${80 + i * 50}ms` }}
              >
                <span
                  className={cn(
                    "grid size-8 shrink-0 place-items-center rounded-lg border-2 font-display text-sm font-semibold transition-colors",
                    isSel ? "border-sea-700 bg-sea text-night" : "border-rule text-soft",
                  )}
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
                <span className="leading-snug">{opt.text}</span>
              </button>
            );
          })}
        </section>
      </main>

      {/* Rodapé: confirmar, depois o painel de feedback sobe */}
      <footer className="fixed inset-x-0 bottom-0 z-30 pb-[env(safe-area-inset-bottom)]">
        {feedback ? (
          <div className="animate-slide-up border-t-2 border-brand/30 bg-brand-100 text-brand-700 dark:bg-[#2A2348] dark:text-[#C9BEFF]">
            <div className="mx-auto max-w-xl px-4 pb-6 pt-4 sm:px-6">
              <div className="mb-4 flex items-center gap-3">
                <span className="fire grid size-14 shrink-0 place-items-center">
                  <BoltIcon className="size-12" />
                </span>
                <div>
                  <p className="font-display text-2xl font-semibold">{feedback.cheer}</p>
                  <p className="text-sm font-extrabold">
                    {feedback.xp > 0 ? `+${feedback.xp} XP` : "Não existe resposta certa ou errada"}
                  </p>
                  {feedback.badges.map((b) => {
                    const badge = BADGES.find((x) => x.id === b);
                    return badge ? (
                      <p key={b} className="flex animate-pop items-center gap-1 text-sm font-extrabold">
                        <MedalIcon className="size-5" /> Nova insígnia: {badge.title}
                      </p>
                    ) : null;
                  })}
                </div>
              </div>
              <button autoFocus onClick={next} className="btn-3d sun w-full">
                {feedback.finished ? "Ver meu perfil" : "Continuar"}
              </button>
            </div>
          </div>
        ) : (
          <div className="border-t-2 border-rule bg-canvas">
            <div className="mx-auto max-w-xl px-4 pb-6 pt-4 sm:px-6">
              <button onClick={confirm} disabled={!selectedOption} className="btn-3d w-full">
                {selectedOption ? "Confirmar" : "Escolha uma resposta"}
              </button>
            </div>
          </div>
        )}
      </footer>
    </div>
  );
}
