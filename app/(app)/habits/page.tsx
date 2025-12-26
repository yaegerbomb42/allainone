import { ItemsList } from "@/components/items-list";

export default function HabitsPage() {
  return (
    <ItemsList
      type="habit"
      title="Habits"
      description="Build and track your daily habits"
      emptyMessage="No habits tracked yet. Create one through the Inbox!"
    />
  );
}
