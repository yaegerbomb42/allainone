import { ItemsList } from "@/components/items-list";

export default function GoalsPage() {
  return (
    <ItemsList
      type="goal"
      title="Goals"
      description="Set and track your long-term goals"
      emptyMessage="No goals yet. Tell AInima about your aspirations in the Inbox!"
    />
  );
}
