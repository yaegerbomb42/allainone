"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Item, ItemType, ItemStatus } from "@/lib/types";
import { itemsService } from "@/lib/firestore";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ItemsListProps {
  type: ItemType;
  title: string;
  description: string;
  emptyMessage: string;
}

export function ItemsList({ type, title, description, emptyMessage }: ItemsListProps) {
  const { user } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  const loadItems = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const fetchedItems = await itemsService.list(user.uid, {
        type,
        status: "active",
      });
      setItems(fetchedItems);
    } catch (error) {
      console.error("Failed to load items:", error);
    } finally {
      setLoading(false);
    }
  }, [user, type]);

  useEffect(() => {
    if (user) {
      loadItems();
    }
  }, [user, loadItems]);

  const toggleComplete = async (item: Item) => {
    if (!user) return;
    try {
      const newStatus: ItemStatus = item.status === "completed" ? "active" : "completed";
      await itemsService.update(user.uid, item.id, { status: newStatus });
      await loadItems();
    } catch (error) {
      console.error("Failed to update item:", error);
    }
  };

  const deleteItem = async (itemId: string) => {
    if (!user) return;
    try {
      await itemsService.delete(user.uid, itemId);
      await loadItems();
    } catch (error) {
      console.error("Failed to delete item:", error);
    }
  };

  if (loading) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="text-center py-12">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>

      {items.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">{emptyMessage}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <Card key={item.id}>
              <CardContent className="py-4">
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleComplete(item)}
                    className="mt-0.5 flex-shrink-0"
                    aria-label={item.status === "completed" ? "Mark as active" : "Mark as completed"}
                  >
                    {item.status === "completed" ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    ) : (
                      <Circle className="w-5 h-5 text-muted-foreground" />
                    )}
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    <div
                      className={cn(
                        "font-medium",
                        item.status === "completed" && "line-through text-muted-foreground"
                      )}
                    >
                      {item.title}
                    </div>
                    {item.body && (
                      <div className="text-sm text-muted-foreground mt-1">
                        {item.body}
                      </div>
                    )}
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      {item.priority && (
                        <span className="px-2 py-0.5 rounded-full bg-muted">
                          {item.priority}
                        </span>
                      )}
                      {item.schedule?.date && (
                        <span>{item.schedule.date}</span>
                      )}
                      {item.tags && item.tags.length > 0 && (
                        <span>{item.tags.join(", ")}</span>
                      )}
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteItem(item.id)}
                    aria-label="Delete item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
