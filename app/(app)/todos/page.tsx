import { ItemsList } from "@/components/items-list";

export default function TodosPage() {
  return (
    <ItemsList
      type="todo"
      title="Todos"
      description="Track your tasks and to-do items"
      emptyMessage="No todos yet. Use the Inbox to create your first task!"
    />
  );
}
