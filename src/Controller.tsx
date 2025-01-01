import React, { useEffect, useState } from 'react';
import { useROS } from './ROSContext';
import GamepadVisualizer from './GamepadVisualizer';

const Controller: React.FC = () => {
  const { ros } = useROS();

  return <div>
    <GamepadVisualizer />
  </div>;
}

export default Controller;
