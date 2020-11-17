import React, { useCallback } from 'react';
import './cell.css';

const SELECTED_COLOR = '#fff';
const BASE_COLOR = '#ffffff20';
const CELL_SIZE = '70px';
const CIRCLE_SIZE = '16px';

interface CellShadowProps {
  angle: number;
  isSelected: boolean;
  shadowLength: number;
  shadowBlur: number;
  shadowSize: number;
  opacity: number;
}

const CellShadow = ({angle, isSelected, shadowLength, shadowBlur, shadowSize, opacity}: CellShadowProps) => {    
  return (
    <div
      className="cell-shadow"
      style={{
        width: CIRCLE_SIZE,
        height: CIRCLE_SIZE,
        boxShadow: isSelected 
          ? '0 0 100px 40px rgba(255,255,255,0.3)' 
          : `0 -${shadowLength}px ${shadowBlur}px ${shadowSize}px rgba(0,0,0,${opacity})`,
        transform: `rotate(${angle}deg)`,
      }}
    />
  );
};

interface CellProps {
  rowIndex: number;
  value: number;
  columnIndex: number; 
  selected: [number, number]; 
  onClick: (target: [number, number]) => void;
}

export const Cell = ({rowIndex, value, columnIndex, selected, onClick}: CellProps) => {  
  const rowDistance = rowIndex - selected[0];
  const colDistance = columnIndex - selected[1];
  const absDistance = Math.max(Math.abs(rowDistance), Math.abs(colDistance));
  const shadowLength = 5 + 5 * absDistance;
  const shadowBlur = 5 + Math.pow(absDistance, 2);
  const shadowSize = 1 + absDistance;
  const opacity = 1 / (1 + absDistance * 2);
  const isSelected = selected[0] === rowIndex && selected[1] === columnIndex;

  const handleClick = useCallback(() => {
    onClick([rowIndex, columnIndex]);
  }, [onClick, rowIndex, columnIndex]);

  return (
    <div 
      className="cell-container"
      onClick={handleClick}
      style={{
        width: CELL_SIZE,
        height: CELL_SIZE,
      }}
    >
      <div
        className="cell"
        style={{
          width: CIRCLE_SIZE,
          height: CIRCLE_SIZE,
          background: isSelected ? SELECTED_COLOR : BASE_COLOR,
        }}
      >
        <CellShadow 
          isSelected={isSelected} 
          angle={value} 
          shadowBlur={shadowBlur}
          shadowSize={shadowSize}
          shadowLength={shadowLength} 
          opacity={opacity} 
        />
      </div>
    </div>
  );
};
