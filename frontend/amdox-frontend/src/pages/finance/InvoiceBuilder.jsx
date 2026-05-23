import {
  DragDropContext,
  Droppable,
  Draggable,
} from "react-beautiful-dnd";

import {
  useState,
} from "react";

export default function InvoiceBuilder() {

  const [items, setItems] =
    useState([
      {
        id: "1",
        name: "GST",
      },
      {
        id: "2",
        name: "Discount",
      },
    ]);

  const onDragEnd =
    (result) => {

      if (!result.destination)
        return;

      const reordered =
        [...items];

      const [removed] =
        reordered.splice(
          result.source.index,
          1
        );

      reordered.splice(
        result.destination.index,
        0,
        removed
      );

      setItems(reordered);

    };

  return (

    <div className="p-6">

      <h2 className="text-2xl font-bold mb-6">
        Invoice Builder
      </h2>

      <DragDropContext
        onDragEnd={onDragEnd}
      >

        <Droppable
          droppableId="invoice"
        >

          {(provided) => (

            <div
              ref={
                provided.innerRef
              }

              {...provided.droppableProps}
            >

              {items.map(
                (
                  item,
                  index
                ) => (

                  <Draggable
                    key={item.id}
                    draggableId={
                      item.id
                    }
                    index={index}
                  >

                    {(provided) => (

                      <div
                        ref={
                          provided.innerRef
                        }

                        {...provided.draggableProps}

                        {...provided.dragHandleProps}

                        className="bg-white p-4 rounded shadow mb-3"
                      >

                        {item.name}

                      </div>

                    )}

                  </Draggable>

                )
              )}

              {
                provided.placeholder
              }

            </div>

          )}

        </Droppable>

      </DragDropContext>

    </div>

  );

}