import { QuizApp } from "@/components/quiz-app";
import { questions } from "@/lib/questions";
import type { CatalogQuestion } from "@/lib/types";

const catalog: CatalogQuestion[] = questions.map((question) => ({
  id: question.id,
  sectionId: question.sectionId,
  starred: question.starred,
  prompt: question.prompt,
}));

export default function Page() {
  return <QuizApp catalog={catalog} />;
}
