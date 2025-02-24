import React, { useEffect, useState } from 'react';
import { useROS } from 'ROSContext';
import ROSLIB from 'roslib';
import './Bms.css';

interface BMSMessage {
  cell_voltages: number[];
  global_voltage: number;
  temperature_fet: number;
  temperature_probe_1: number;
  temperature_probe_2: number;
  current: number;
  capacity: number;
}

const Bms: React.FC = () => {
  const { ros } = useROS();

  const [cellVoltages, setCellVoltages] = useState<number[]>([]);
  const [batteryVoltage, setBatteryVoltage] = useState<number | null>(null);
  const [bmsMosfetTemp, setBmsMosfetTemp] = useState<number | null>(null);
  const [temp1, setTemp1] = useState<number | null>(null);
  const [temp2, setTemp2] = useState<number | null>(null);
  const [current, setCurrent] = useState<number | null>(null);
  const [capacity, setCapacity] = useState<number | null>(null);

  // Helper functions to get background color based on ranges
  // Adjust these threshold values as needed:
  const getCellVoltageColor = (voltage: number): string => {
    if (voltage < 3.0) {
      return '#ffcccc'; // red
    } else if (voltage < 3.2) {
      return '#fff7cc'; // yellow
    }
    // anything above ~3.2 considered healthy for this example
    return '#ccffcc'; // green
  };

  const getBatteryVoltageColor = (voltage: number): string => {
    // Example thresholds for an assumed battery pack
    if (voltage < 3.0 * 6) {
      return '#ffcccc'; // red
    } else if (voltage < 3.2 * 6) {
      return '#fff7cc'; // yellow
    }
    return '#ccffcc'; // green
  };

  const getCurrentColor = (currentValue: number): string => {
    // Arbitrary example thresholds
    const absCurrent = Math.abs(currentValue);
    if (absCurrent > 50) {
      return '#ffcccc'; // big current draw => red
    } else if (absCurrent > 20) {
      return '#fff7cc'; // moderate current => yellow
    }
    return '#ccffcc'; // small current => green
  };

  const getCapacityColor = (cap: number): string => {
    if (cap < 20) {
      return '#ffcccc'; // red
    } else if (cap < 50) {
      return '#fff7cc'; // yellow
    }
    return '#ccffcc'; // green
  };

  const getTemperatureColor = (temp: number): string => {
    // Example thresholds for temperature
    if (temp > 40) {
      return '#ffcccc'; // red
    } else if (temp > 30) {
      return '#fff7cc'; // yellow
    }
    return '#ccffcc'; // green
  };

  useEffect(() => {
    if (!ros) return;

    const bmsTopic = new ROSLIB.Topic({
      ros,
      name: '/bms_metrics',
      messageType: 'mr2_jk_bms_interfaces/msg/BMSData',
    });

    bmsTopic.subscribe((message: ROSLIB.Message) => {
      const data = message as unknown as BMSMessage;
      setCellVoltages(data.cell_voltages);
      setBatteryVoltage(data.global_voltage);
      setBmsMosfetTemp(data.temperature_fet);
      setTemp1(data.temperature_probe_1);
      setTemp2(data.temperature_probe_2);
      setCurrent(data.current);
      setCapacity(data.capacity);
    });

    return () => {
      bmsTopic.unsubscribe();
    };
  }, [ros]);

  return (
    <div className="bms">
      <div className="title">BMS Info</div>

      {/* Cell Voltages */}
      <div className="section">
        <div className="grid voltages">
          {cellVoltages.length > 0 ? (
            cellVoltages.map((voltage, index) => (
              <div
                key={index}
                className="cell"
                style={{ backgroundColor: getCellVoltageColor(voltage) }}
              >
                {voltage.toFixed(2)} V
              </div>
            ))
          ) : (
            <div className="cell">No Data</div>
          )}
        </div>
      </div>

      {/* Metrics */}
      <div className="section">
        <div className="grid metrics">
          <div
            className="metric"
            style={{
              backgroundColor:
                batteryVoltage !== null
                  ? getBatteryVoltageColor(batteryVoltage)
                  : '#f5f5f5',
            }}
          >
            <div className="label">V</div>
            <div className="value">
              {batteryVoltage !== null ? batteryVoltage.toFixed(2) + ' V' : 'N/A'}
            </div>
          </div>

          <div
            className="metric"
            style={{
              backgroundColor:
                current !== null ? getCurrentColor(current) : '#f5f5f5',
            }}
          >
            <div className="label">I</div>
            <div className="value">
              {current !== null ? current.toFixed(2) + ' A' : 'N/A'}
            </div>
          </div>

          <div
            className="metric"
            style={{
              backgroundColor:
                capacity !== null ? getCapacityColor(capacity) : '#f5f5f5',
            }}
          >
            <div className="label">Cap</div>
            <div className="value">
              {capacity !== null ? capacity + ' %' : 'N/A'}
            </div>
          </div>

          <div
            className="metric"
            style={{
              backgroundColor:
                bmsMosfetTemp !== null
                  ? getTemperatureColor(bmsMosfetTemp)
                  : '#f5f5f5',
            }}
          >
            <div className="label">FET</div>
            <div className="value">
              {bmsMosfetTemp !== null ? bmsMosfetTemp.toFixed(1) + '°C' : 'N/A'}
            </div>
          </div>

          <div
            className="metric"
            style={{
              backgroundColor:
                temp1 !== null ? getTemperatureColor(temp1) : '#f5f5f5',
            }}
          >
            <div className="label">T1</div>
            <div className="value">
              {temp1 !== null ? temp1.toFixed(1) + '°C' : 'N/A'}
            </div>
          </div>

          <div
            className="metric"
            style={{
              backgroundColor:
                temp2 !== null ? getTemperatureColor(temp2) : '#f5f5f5',
            }}
          >
            <div className="label">T2</div>
            <div className="value">
              {temp2 !== null ? temp2.toFixed(1) + '°C' : 'N/A'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bms;
