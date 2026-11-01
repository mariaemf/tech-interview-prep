"use client";

import type { CatalogQuestion } from "@/lib/types";

type QuestionCardProps = {
  question: CatalogQuestion;
  sectionTitle: string;
  text: string;
  submittedText?: string;
  status?: "correct" | "incorrect";
  answer?: string;
  hint?: string;
  pending: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
};

export function QuestionCard({
  question,
  sectionTitle,
  text,
  submittedText,
  status,
  answer,
  hint,
  pending,
  onChange,
  onSubmit,
}: QuestionCardProps) {
  const edited = Boolean(status && text.trim() !== (submittedText ?? "").trim());
  const number = String(question.id).padStart(2, "0");

  return (
    <article
      id={`pergunta-${question.id}`}
      className={`scroll-mt-28 rounded-3xl border bg-surface p-5 shadow-[0_1px_0_rgba(26,24,20,0.04)] sm:p-7 ${
        question.starred ? "border-line border-l-[3px] border-l-star" : "border-line"
      }`}
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-10">
        <header>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-serif text-[2rem] leading-none tracking-[-0.04em] text-accent">
              {number}
            </span>
            {question.starred ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-star-soft px-2.5 py-1 text-[13px] font-medium text-star">
                <StarIcon />
                Prioritária
              </span>
            ) : null}
          </div>
          <p className="mt-3 text-[13px] font-medium tracking-[0.04em] text-muted">{sectionTitle}</p>
          <h3 className="mt-2 font-serif text-[1.65rem] leading-snug tracking-[-0.03em] text-pretty text-foreground">
            {question.prompt}
          </h3>
        </header>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
          }}
        >
          <label htmlFor={`resposta-${question.id}`} className="text-sm font-semibold text-foreground">
            Sua resposta
          </label>
          <textarea
            id={`resposta-${question.id}`}
            value={text}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
                event.preventDefault();
                onSubmit();
              }
            }}
            rows={6}
            maxLength={4000}
            spellCheck
            autoComplete="off"
            placeholder="Escreva com suas palavras."
            aria-describedby={status ? `resultado-${question.id}` : undefined}
            className="mt-2 min-h-36 w-full resize-y rounded-2xl border border-line bg-white px-4 py-3 text-[15px] leading-relaxed text-foreground outline-none transition placeholder:text-[#9a9186] focus:border-accent focus:ring-4 focus:ring-accent/10"
          />
          <div className="mt-3 flex items-center justify-between gap-3">
            <button
              type="submit"
              disabled={pending}
              className="inline-flex cursor-pointer items-center justify-center rounded-full bg-terra px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#7a3b1b] disabled:cursor-wait disabled:opacity-70"
            >
              {pending ? "Conferindo…" : "Conferir resposta"}
            </button>
            <span className="hidden text-xs text-muted sm:inline">⌘/Ctrl + Enter</span>
          </div>
          {hint ? <p className="mt-3 text-sm text-terra">{hint}</p> : null}
        </form>
      </div>

      {status ? (
        <div id={`resultado-${question.id}`} className="feedback-in mt-6" role="status" aria-live="polite">
          {edited ? (
            <p className="mb-3 text-sm text-muted">
              Você alterou o texto. Confira de novo para atualizar o resultado.
            </p>
          ) : null}
          {status === "correct" ? (
            <div className={`rounded-2xl border border-[#c9e4d2] bg-correct-bg px-4 py-4 sm:px-5 ${edited ? "opacity-75" : ""}`}>
              <p className="flex items-center gap-2 text-sm font-semibold text-correct">
                <StatusIcon correct />
                Certo
              </p>
              <p className="mt-1 text-sm leading-relaxed text-[#1d6a3a]">
                Sua resposta cobre os pontos principais.
              </p>
              {answer ? (
                <details className="mt-3">
                  <summary className="cursor-pointer text-sm font-medium text-correct">
                    Comparar com a resposta correta
                  </summary>
                  <AnswerBody answer={answer} />
                </details>
              ) : null}
            </div>
          ) : (
            <div className={`rounded-2xl border border-[#f0d2cb] bg-wrong-bg px-4 py-4 sm:px-5 ${edited ? "opacity-75" : ""}`}>
              <p className="flex items-center gap-2 text-sm font-semibold text-wrong">
                <StatusIcon />
                Errado
              </p>
              <p className="mt-1 text-sm leading-relaxed text-[#8c3b32]">
                Faltaram pontos principais. Esta é a resposta correta:
              </p>
              {answer ? (
                <AnswerBody answer={answer} />
              ) : (
                <p className="mt-3 text-sm text-foreground">Confira de novo para ver a resposta correta.</p>
              )}
            </div>
          )}
        </div>
      ) : null}
    </article>
  );
}

function AnswerBody({ answer }: { answer: string }) {
  const lines = answer.split("\n");
  return (
    <div className="mt-3 space-y-2 text-[15px] leading-relaxed text-foreground">
      {lines.map((line, index) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={index} className="h-1" />;
        if (trimmed.startsWith("- ")) {
          return (
            <p key={index} className="pl-1">
              <span className="mr-2 text-muted">–</span>
              {trimmed.slice(2)}
            </p>
          );
        }
        return <p key={index}>{trimmed}</p>;
      })}
    </div>
  );
}

function StarIcon() {
  return (
    <svg viewBox="0 0 20 20" className="size-3.5 fill-current" aria-hidden="true">
      <path d="M10 1.8 12.1 7l5.5.5-4.2 3.6 1.3 5.3L10 13.8 5.3 16.4 6.6 11 2.4 7.5 7.9 7 10 1.8Z" />
    </svg>
  );
}

function StatusIcon({ correct = false }: { correct?: boolean }) {
  return (
    <svg viewBox="0 0 20 20" className="size-4" aria-hidden="true">
      {correct ? (
        <path
          fill="currentColor"
          d="M10 1.5a8.5 8.5 0 1 1 0 17 8.5 8.5 0 0 1 0-17Zm3.7 5.8-4.4 5.2-2.2-2.1-1.2 1.2 3.5 3.4 5.6-6.6-1.3-1.1Z"
        />
      ) : (
        <path
          fill="currentColor"
          d="M10 1.5a8.5 8.5 0 1 1 0 17 8.5 8.5 0 0 1 0-17Zm-2.3 4.7 2.3 2.3 2.3-2.3 1.2 1.2L11.2 9.7l2.3 2.3-1.2 1.2-2.3-2.3-2.3 2.3-1.2-1.2 2.3-2.3-2.3-2.3 1.2-1.2Z"
        />
      )}
    </svg>
  );
}
