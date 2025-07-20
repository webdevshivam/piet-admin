import { useState } from "react";

interface DragDropProps<T> {
  items: T[];
  onReorder: (items: T[]) => void;
  children: (item: T) => React.ReactNode;
}

export default function DragDrop<T extends { id: number }>({ 
  items, 
  onReorder, 
  children 
}: DragDropProps<T>) {
  const [draggedItem, setDraggedItem] = useState<T | null>(null);

  const handleDragStart = (e: React.DragEvent, item: T) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetItem: T) => {
    e.preventDefault();
    
    if (!draggedItem || draggedItem.id === targetItem.id) {
      return;
    }

    const newItems = [...items];
    const draggedIndex = newItems.findIndex(item => item.id === draggedItem.id);
    const targetIndex = newItems.findIndex(item => item.id === targetItem.id);

    newItems.splice(draggedIndex, 1);
    newItems.splice(targetIndex, 0, draggedItem);

    onReorder(newItems);
    setDraggedItem(null);
  };

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div
          key={item.id}
          draggable
          onDragStart={(e) => handleDragStart(e, item)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, item)}
          className="cursor-move"
        >
          {children(item)}
        </div>
      ))}
    </div>
  );
}
