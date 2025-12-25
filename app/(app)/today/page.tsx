"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { itemsService } from "@/lib/firestore";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Circle, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { Item } from "@/lib/types";

export default function TodayPage() {
  const { user } = useAuth();
  const [todayItems, setTodayItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTodayItems = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const today = new Date().toISOString().split("T")[0];
      const allItems = await itemsService.list(user.uid, { status: "active" });
      
      // Filter items scheduled for today
      const filtered = allItems.filter(
        (item) => item.schedule?.date === today
      );
      setTodayItems(filtered);
    } catch (error) {
      console.error("Failed to load items:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadTodayItems();
    }
  }, [user, loadTodayItems]);

  const toggleComplete = async (item: Item) => {
    if (!user) return;
    try {
      const newStatus = item.status === "completed" ? "active" : "completed";
      await itemsService.update(user.uid, item.id, { status: newStatus });
      await loadTodayItems();
    } catch (error) {
      console.error("Failed to update item:", error);
    }
  };

  if (loading) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="text-center py-12">Loading...</div>
      </div>
    );
  }

  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Calendar className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">Today</h1>
        </div>
        <p className="text-muted-foreground">{dateStr}</p>
      </div>

      {todayItems.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              No items scheduled for today. Use the Inbox to add tasks with dates!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {todayItems.map((item) => (
            <Card key={item.id}>
              <CardContent className="py-4">
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleComplete(item)}
                    className="mt-0.5 flex-shrink-0"
                  >
                    {item.status === "completed" ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    ) : (
                      <Circle className="w-5 h-5 text-muted-foreground" />
                    )}
                  </button>
                  
                  <div className="flex-1">
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
                    <div className="flex items-center gap-2 mt-2 text-xs">
                      <span className="px-2 py-0.5 rounded-full bg-muted">
                        {item.type}
                      </span>
                      {item.priority && (
                        <span className="px-2 py-0.5 rounded-full bg-muted">
                          {item.priority}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
