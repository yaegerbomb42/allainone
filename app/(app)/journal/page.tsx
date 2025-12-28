import { ItemsList } from "@/components/items-list";

export default function JournalPage() {
  return (
    <ItemsList
      type="journal"
      title="Journal"
      description="Reflect on your day and capture your thoughts"
      emptyMessage="No journal entries yet. Start writing in the Inbox!"
    />
  );
}
