import { useState, useEffect } from "react";
import { useThemeContext } from "./components/Theme";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import { v4 as uuidv4 } from "uuid";
import { MdDeleteForever } from "react-icons/md";
import { IoMdAddCircle } from "react-icons/io";
import { FaEdit } from "react-icons/fa";
import Header from "./components/Header";

interface Item {
  id: string;
  value: string | undefined;
}

// Object - essentially dictionary
type CheckedItems = {
  [itemId: string]: boolean;
};

export default function App() {
  // light Dark Theme
  const { isDarkTheme } = useThemeContext();
  // =================================================== //
  const [newItem, setNewItem] = useState<string>();
  const [items, setItems] = useState<Item[]>([]);
  // Example item
  // ([
  //   {
  //     id: Math.floor(Math.random() * 1000).toString(),
  //     value: "Example item, delete this!",
  //   },
  // ]);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [checkedItems, setCheckedItems] = useState<CheckedItems>({});
  // Task count
  const [itemCount, setItemCount] = useState<number>(items.length);
  // Filter states
  const [showActiveItems, setShowActiveItems] = useState<boolean>(true);
  const [showCompletedItems, setShowCompletedItems] = useState<boolean>(true);

  // ======= Filter functions ================

  // Active items
  function filterActiveItems(): void {
    setShowActiveItems(!showActiveItems);
  }
  // Completed Items
  function filterCompletedItems(): void {
    setShowCompletedItems(!showCompletedItems);
  }

  // Clear completed items
  function clearCheckedItems(): void {
    setItems((oldList) => oldList.filter((item) => !checkedItems[item.id]));
    console.log(items);
    setItemCount(items.length);
    setCheckedItems({});
  }

  // Clear all
  function clearAllItems(): void {
    setItems([]);
    // Reset task counts
    setCheckedItems({});
    setItemCount(0);
  }
  // ===============================================

  // Make sure each item check is handled individually
  const handleCheckboxChange = (itemId: string) => {
    setCheckedItems((prevCheckedItems) => ({
      ...prevCheckedItems,
      [itemId]: !prevCheckedItems[itemId],
    }));
  };

  // Some logging for testing
  // useEffect(() => {
  //   console.log(items);
  // }, [items]);

  // useEffect(() => {
  //   console.log(checkedItems);
  // }, [checkedItems]);

  // Todo Item Manipulation
  function addItem(): void {
    const item: Item = {
      id: uuidv4(),
      value: newItem,
    };
    setItems((oldList) => [...oldList, item]);
    setItemCount((prevItemCount) => prevItemCount + 1);
    // console.log(newItem);

    // This resets the input field
    const input = document.querySelector(
      'input[type="text"]'
    ) as HTMLInputElement;
    if (input) {
      input.value = "";
    }
  }

  function deleteItem(id: string): void {
    // Reset editingItemId if the item being edited is deleted
    if (editingItemId === id) {
      setEditingItemId(null);
    }

    setItems((oldList) => oldList.filter((item) => item.id !== id));
  }

  function editItem(id: string): void {
    setEditingItemId(id);
  }

  // Drag N Drop Stuff
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const reorderedItems = Array.from(items);
    const [reorderedItem] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, reorderedItem);

    setItems(reorderedItems);
  };

  // Generate a unique droppableId
  const droppableId = "droppable-" + uuidv4();

  return (
    <>
      <Header>
        <div className="grid g-w">
          <input
            className={isDarkTheme ? "" : "light"}
            onChange={(event) => setNewItem(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                addItem();
              }
            }}
            type="text"
            placeholder="add an item"
          />
          <button onClick={() => addItem()} className="add-btn">
            <IoMdAddCircle size={50} />
          </button>
        </div>
      </Header>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId={droppableId}>
          {(provided) => (
            <div
              className="container"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {items.map((item, index) => {
                const isChecked = checkedItems[item.id];
                const isActive = !isChecked;
                if (
                  (isChecked && !showCompletedItems) ||
                  (isActive && !showActiveItems)
                ) {
                  return null; // Skip rendering if the item should be hidden
                }

                return (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided) => (
                      <div
                        className="grid grid-two"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        {editingItemId === item.id ? (
                          <input
                            type="text"
                            value={item.value}
                            onChange={(e) => {
                              const newValue = e.target.value;
                              setItems((oldItems) =>
                                oldItems.map((oldItem) =>
                                  oldItem.id === item.id
                                    ? { ...oldItem, value: newValue }
                                    : oldItem
                                )
                              );
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                setEditingItemId(null);
                              }
                            }}
                            onBlur={() => {
                              setEditingItemId(null);
                            }}
                            autoFocus
                          />
                        ) : (
                          <ul>
                            <label key={item.id} className="test-flex">
                              <div className="checkbox-container">
                                <input
                                  type="checkbox"
                                  checked={checkedItems[item.id] || false}
                                  onChange={() => {
                                    handleCheckboxChange(item.id);
                                  }}
                                />
                                <span></span>
                              </div>

                              <li
                                style={{
                                  textDecoration: checkedItems[item.id]
                                    ? "line-through"
                                    : "none",
                                }}
                                className={
                                  isDarkTheme ? "to-do" : "to-do light"
                                }
                              >
                                {item.value}
                              </li>
                            </label>
                          </ul>
                        )}
                        <button
                          className={isDarkTheme ? "del-btn" : "del-btn l-btn"}
                          onClick={() => deleteItem(item.id)}
                        >
                          <MdDeleteForever size={30} />
                        </button>
                        {!editingItemId && (
                          <button
                            className={
                              isDarkTheme ? "edit-btn" : "edit-btn l-btn"
                            }
                            onClick={() => editItem(item.id)}
                          >
                            <FaEdit size={25} />
                          </button>
                        )}
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <h2 className={isDarkTheme ? "" : "light-h2"}>
        Drag and drop the items to re-order list!
      </h2>

      <div className="btn-grid">
        <button
          onClick={filterActiveItems}
          className={showActiveItems ? "filter-btn" : "filter-btn filter-on"}
        >
          Completed:{" "}
          {Object.values(checkedItems).reduce(
            (acc, curr) => (curr ? acc + 1 : acc),
            0
          )}
        </button>
        <button
          onClick={filterCompletedItems}
          className={showCompletedItems ? "filter-btn" : "filter-btn filter-on"}
        >
          Active:{" "}
          {itemCount -
            Object.values(checkedItems).reduce(
              (acc, curr) => (curr ? acc + 1 : acc),
              0
            )}
        </button>
        <button onClick={clearCheckedItems} className="filter-btn">
          Clear Completed
        </button>
        <button onClick={clearAllItems} className="filter-btn">
          Clear All
        </button>
      </div>
    </>
  );
}
