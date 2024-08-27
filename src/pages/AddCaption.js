import React, { useState, useEffect, useRef } from 'react';
import { Stage, Layer, Image, Text, Circle, Rect, Line, Transformer } from 'react-konva';
import { useLocation } from 'react-router-dom';
import './AddCaption.css'; // Import the CSS file

const AddCaption = () => {
  const { state } = useLocation();
  const [image, setImage] = useState(null);
  const [objects, setObjects] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [editingText, setEditingText] = useState(null);
  const stageRef = useRef(null);
  const transformerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (state?.image?.urls?.regular) {
      const img = new window.Image();
      img.crossOrigin = 'Anonymous'; // Set crossOrigin
      img.src = state.image.urls.regular;
      
      img.onload = () => {
        setImage(img);
      };
    }
  }, [state]);

  useEffect(() => {
    if (editingText) {
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.value = editingText.text;
        }
      }, 0);
    }
  }, [editingText]);

  const addText = () => {
    const newText = {
      type: 'text',
      text: 'Editable Text',
      x: 100,
      y: 100,
      fontSize: 24,
      fill: 'black',
      width: 150,
      height: 50,
    };
    setObjects([...objects, newText]);
  };

  const addShape = (shapeType) => {
    let shape;
    switch (shapeType) {
      case 'circle':
        shape = {
          type: 'circle',
          x: 100,
          y: 100,
          radius: 50,
          fill: 'red',
        };
        break;
      case 'rectangle':
        shape = {
          type: 'rect',
          x: 100,
          y: 100,
          width: 100,
          height: 50,
          fill: 'blue',
        };
        break;
      case 'triangle':
        shape = {
          type: 'line',
          points: [100, 100, 150, 50, 200, 100],
          fill: 'green',
          closed: true,
        };
        break;
      case 'polygon':
        shape = {
          type: 'line',
          points: [100, 100, 150, 50, 200, 100],
          fill: 'yellow',
          closed: true,
        };
        break;
      default:
        return;
    }
    setObjects([...objects, shape]);
    setSelectedId(null);
  };

  const handleSelect = (id) => {
    setSelectedId(id);
    const selectedNode = stageRef.current.findOne(`#${id}`);
    transformerRef.current.nodes([selectedNode]);
    transformerRef.current.getLayer().batchDraw();
  };

  const handleDragEnd = (e, index) => {
    const newObjects = [...objects];
    newObjects[index] = {
      ...newObjects[index],
      x: e.target.x(),
      y: e.target.y(),
    };
    setObjects(newObjects);
  };

  const handleTransformEnd = (e, index) => {
    const node = e.target;
    const newObjects = [...objects];
    
    const updatedObject = {
      ...newObjects[index],
      x: node.x(),
      y: node.y(),
      width: node.width(),
      height: node.height(),
    };
  
    if (node.hasOwnProperty('radius')) {
      updatedObject.radius = node.radius();
    }
  
    if (newObjects[index].type === 'text') {
      updatedObject.fontSize = node.fontSize();
    }
  
    newObjects[index] = updatedObject;
    setObjects(newObjects);
  };

  const handleTextChange = (e) => {
    const newText = e.target.value;
    if (editingText) {
      const newObjects = [...objects];
      newObjects[editingText.index] = {
        ...newObjects[editingText.index],
        text: newText,
      };
      setObjects(newObjects);
    }
  };

  const handleTextClick = (id, index) => {
    setEditingText({ ...objects[index], index });
    // Wait for the state to update and input to render
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);
  };

  const handleInputBlur = () => {
    setEditingText(null);
  };

  const downloadImage = () => {
    if (stageRef.current) {
      try {
        const dataURL = stageRef.current.toDataURL({ pixelRatio: 2 });
        if (dataURL) {
          const link = document.createElement('a');
          link.href = dataURL;
          link.download = 'canvas-image.png';
          document.body.appendChild(link); // Append link to the body
          link.click();
          document.body.removeChild(link); // Remove link after download
        } else {
          console.error("Failed to generate data URL");
        }
      } catch (error) {
        console.error("Konva error:", error.message);
      }
    }
  };

  return (
    <div className="add-caption-page">
      <img src={state?.image?.urls?.small} alt={state?.image?.alt_description} className="thumbnail" />

      <div className="canvas-wrapper">
        <div className="canvas-container">
          <Stage width={800} height={600} ref={stageRef}>
            <Layer>
              {image && <Image image={image} width={800} height={600} />}
              {objects.map((obj, index) => {
                const id = `object_${index}`;
                const isSelected = id === selectedId;
                switch (obj.type) {
                  case 'text':
                    return (
                      <Text
                      className={isSelected}
                        key={id}
                        id={id}
                        text={obj.text}
                        x={obj.x}
                        y={obj.y}
                        fontSize={obj.fontSize}
                        fill={obj.fill}
                        width={obj.width}
                        height={obj.height}
                        draggable
                        onClick={() => handleTextClick(id, index)}
                        onTap={() => handleTextClick(id, index)}
                        onDragEnd={(e) => handleDragEnd(e, index)}
                        onTransformEnd={(e) => handleTransformEnd(e, index)}
                        textAlign="center"
                        fontFamily="Arial"
                        padding={10}
                        cornerRadius={5}
                      />
                    );
                  case 'circle':
                    return (
                      <Circle
                        key={id}
                        id={id}
                        x={obj.x}
                        y={obj.y}
                        radius={obj.radius}
                        fill={obj.fill}
                        draggable
                        onClick={() => handleSelect(id)}
                        onTap={() => handleSelect(id)}
                        onDragEnd={(e) => handleDragEnd(e, index)}
                        onTransformEnd={(e) => handleTransformEnd(e, index)}
                        stroke="black"
                        strokeWidth={1}
                      />
                    );
                  case 'rect':
                    return (
                      <Rect
                        key={id}
                        id={id}
                        x={obj.x}
                        y={obj.y}
                        width={obj.width}
                        height={obj.height}
                        fill={obj.fill}
                        draggable
                        onClick={() => handleSelect(id)}
                        onTap={() => handleSelect(id)}
                        onDragEnd={(e) => handleDragEnd(e, index)}
                        onTransformEnd={(e) => handleTransformEnd(e, index)}
                        stroke="black"
                        strokeWidth={1}
                      />
                    );
                  case 'line':
                    return (
                      <Line
                        key={id}
                        id={id}
                        points={obj.points}
                        fill={obj.fill}
                        closed={obj.closed}
                        draggable
                        onClick={() => handleSelect(id)}
                        onTap={() => handleSelect(id)}
                        onDragEnd={(e) => handleDragEnd(e, index)}
                        onTransformEnd={(e) => handleTransformEnd(e, index)}
                        stroke="black"
                        strokeWidth={1}
                      />
                    );
                  default:
                    return null;
                }
              })}
              <Transformer
                ref={transformerRef}
                anchorSize={6}
                borderStrokeWidth={2}
                rotateEnabled={false}
              />
            </Layer>
          </Stage>
        </div>

        <div className="controls">
          <button onClick={addText}>Add Text</button>
          <button onClick={() => addShape('circle')}>Add Circle</button>
          <button onClick={() => addShape('rectangle')}>Add Rectangle</button>
          <button onClick={() => addShape('triangle')}>Add Triangle</button>
          <button onClick={() => addShape('polygon')}>Add Polygon</button>
          <button className="download-button" onClick={downloadImage}>Download</button>
        </div>
      </div>

      {editingText && (
        <input
          ref={inputRef}
          className="text-input"
          type="text"
          defaultValue={editingText.text}
          onChange={handleTextChange}
          onBlur={handleInputBlur}
          style={{
            position: 'absolute',
            top: `${editingText.y}px`,
            left: `${editingText.x}px`,
            fontSize: `${editingText.fontSize}px`,
            width: `${editingText.width}px`,
            height: `${editingText.height}px`,
            textAlign: 'center',
            transform: 'translate(-50%, -50%)',
          }}
        />
      )}
    </div>
  );
};

export default AddCaption;
