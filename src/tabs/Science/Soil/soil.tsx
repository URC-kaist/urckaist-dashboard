import React from 'react';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const Soil: React.FC = () => {
  // Sample data arrays
  const moistureData = [50, 55, 67, 70, 60, 70];
  const temperatureData = [6, 5, 4, 3, 4, 5];

  // Convert raw data arrays into objects for the charts.
  const moistureChartData = moistureData.map((value, index) => ({ index, value }));
  const temperatureChartData = temperatureData.map((value, index) => ({ index, value }));

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Top 50% for moisture graph */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <div style={{ textAlign: 'center', fontSize: '20px' }}>
          71%
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={moistureChartData}>
            <Line type="monotone" dataKey="value" stroke="#8884d8" />
            <CartesianGrid stroke="#ccc" />
            <YAxis />
            <Tooltip />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {/* Bottom 50% for temperature graph */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <div style={{ textAlign: 'center', fontSize: '20px' }}>
          6°C
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={temperatureChartData}>
            <Line type="monotone" dataKey="value" stroke="#82ca9d" />
            <CartesianGrid stroke="#ccc" />
            <YAxis />
            <Tooltip />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Soil;
