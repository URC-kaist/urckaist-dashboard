import React, { useState } from 'react';

// Define the type for the ToggleSwitchProps
interface ToggleSwitchProps {
  label?: string; // Optional label for the switch
  defaultChecked?: boolean; // Optional default checked state
  onChange?: (checked: boolean) => void; // Optional callback when toggled
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ label, defaultChecked = false, onChange }) => {
  // State to keep track of the toggle state
  const [isChecked, setIsChecked] = useState(defaultChecked);

  // Handle the toggle change
  const handleChange = () => {
    const newCheckedState = !isChecked;
    setIsChecked(newCheckedState);
    if (onChange) {
      onChange(newCheckedState); // Trigger callback if provided
    }
  };

  return (
    <div className="toggle-switch">
      {label && <label className="toggle-label">{label}</label>}
      <label className="switch">
        <input type="checkbox" checked={isChecked} onChange={handleChange} />
        <span className="slider round"></span>
      </label>
    </div>
  );
};

export default ToggleSwitch;
