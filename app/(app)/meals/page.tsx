import { ItemsList } from "@/components/items-list";

export default function MealsPage() {
  return (
    <ItemsList
      type="meal"
      title="Meals"
      description="Log and track your meals"
      emptyMessage="No meals logged yet. Tell AInima what you ate!"
    />
  );
}
