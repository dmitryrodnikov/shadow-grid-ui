import React, { useState, useEffect, useCallback } from 'react';
import { Cell } from './cell';
import './app.css';

type Point = [number, number];

const initialGrid = [
  [0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0],
];

const width = initialGrid[0].length;
const height = initialGrid.length;
const range = 240 - 180;
const horizontalStep = range / width;
const verticalStep = range / height;

const initialPoint: Point = [0,0];

const getShadowAngle = (rowDelta: number, columnDelta: number): number => {
  let absAngle = Math.atan(columnDelta/rowDelta) * 180 / Math.PI;
  return rowDelta < 0 ? -absAngle : 180 - absAngle;
};

function calculateBgColor(selected: [number, number]) {
  const green = horizontalStep * (selected[0] + 1);
  const blue = verticalStep * (selected[1] + 1);
  return `hsl(${180 + green}deg,${20 + blue}%, 25%)`;
}

const App = () => {
  const [selected, setSelected] = useState<Point>(initialPoint);
  const [grid, setGrid] = useState(initialGrid);

  const updateGrid = useCallback((target: Point) => {
    setGrid(grid => grid.map(
      (row, rowIndex) => row.map(
        (_, columnIndex) => {
          const isSelected = target[0] === rowIndex && target[1] === columnIndex;
          const rowDistance = rowIndex - target[0];
          const colDistance = columnIndex - target[1];
          const angle = isSelected ? 0 : getShadowAngle(rowDistance, colDistance);
          return angle < 0 ? 360 + angle : angle;
        }
      )
    ));
    setSelected(target);
  }, []);

  useEffect(() => {
    updateGrid(initialPoint);
  }, [updateGrid]);

  const handleClick = useCallback((target: Point) => {
    updateGrid(target);
  }, [updateGrid]);

  const gridComponent = grid.map((_, rowIndex) => {
    return (
      <div key={rowIndex} className="grid-row">
        {grid[rowIndex].map((value, columnIndex) => {
          return (
            <Cell
              key={columnIndex} 
              value={value}
              rowIndex={rowIndex} 
              columnIndex={columnIndex} 
              selected={selected}
              onClick={handleClick}
            />
          );
        })}
      </div>
    );
  });

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowUp': {
        if (selected[0] === 0) return;
        updateGrid([selected[0] - 1, selected[1]]);
        break;
      }
      case 'ArrowDown': {
        if (selected[0] === grid.length - 1) return;
        updateGrid([selected[0] + 1, selected[1]]);
        break;
      }
      case 'ArrowLeft': {
        if (selected[1] === 0) return;
        updateGrid([selected[0], selected[1] - 1]);
        break;
      }
      case 'ArrowRight': {
        if (selected[1] === grid[0].length - 1) return;
        updateGrid([selected[0], selected[1] + 1]);
        break;
      } 
    }
  }, [updateGrid, selected, grid]);

  return (
    <div 
      className="grid-wrapper" 
      tabIndex={0} 
      onKeyDown={handleKeyDown}
      style={{ backgroundColor: calculateBgColor(selected) }}
    >
      <div>
        {gridComponent}
      </div>
    </div>
  );
};

export default App;
