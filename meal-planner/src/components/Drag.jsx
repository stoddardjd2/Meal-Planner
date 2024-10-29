import React, { useState } from 'react';

function Drag() {
  const [draggedValue, setDraggedValue] = useState('');  // Store the value of the dragged element

  const handleDragStart = (e, value) => {
    setDraggedValue(value);  // Set the value of the dragged element when dragging starts
  };

  const handleDragEnd = (e) => {
    e.target.style.cursor = 'grab';  // Reset the cursor after dragging ends
  };

  return (
    <div className="container">
      {/* Draggable Element */}
      <div
        className="draggable"
        draggable
        onDragStart={(e) => handleDragStart(e, 'Dragged Value')}
        onDragEnd={handleDragEnd}
        style={{ cursor: 'grab' }}
      >
        Drag me!
      </div>
      {/* Draggable Element */}
      <div
        className="draggable"
        draggable
        onDragStart={(e) => handleDragStart(e, 'Dragged Value2')}
        onDragEnd={handleDragEnd}
        style={{ cursor: 'grab' }}
      >
        Drag me!
      </div>

      {/* Drop Target Elements */}
      <DropTarget label="Drop Here 1" draggedValue={draggedValue} />
      <DropTarget label="Drop Here 2" draggedValue={draggedValue} />
    </div>
  );
}

const DropTarget = ({ label, draggedValue }) => {
  const [value, setValue] = useState(label);

  const handleDragOver = (e) => {
    e.preventDefault();  // Necessary to allow dropping
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setValue(draggedValue);  // Set the dropped element's value to the dragged value
  };

  return (
    <div
      className="drop-target"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {value}
    </div>
  );
};

export default Drag;
