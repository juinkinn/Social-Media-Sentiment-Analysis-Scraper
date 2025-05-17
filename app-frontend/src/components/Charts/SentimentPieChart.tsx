import React from 'react';
import { Box, Typography } from '@mui/material';
import { Pie } from 'react-chartjs-2';

interface SentimentPieChartProps {
  sentimentData: {
    [key: string]: { positive: number; negative: number };
  };
  title: string;
  sentiment: 'positive' | 'negative';
}

const SentimentPieChart: React.FC<SentimentPieChartProps> = ({ sentimentData, title, sentiment }) => {
  // Calculate average sentiment percentages
  const positiveTotal =
    Object.values(sentimentData).reduce((sum, data) => sum + data.positive, 0);
  const negativeTotal =
    Object.values(sentimentData).reduce((sum, data) => sum + data.negative, 0);

  // Pie chart data
  const pieChartData = {
    labels: Object.keys(sentimentData),
    datasets: [
      {
        data: Object.keys(sentimentData).map((key) => sentiment === "positive"?
            sentimentData[key][sentiment] / positiveTotal * 100 :
            sentimentData[key][sentiment] / negativeTotal * 100
        ),
        backgroundColor: // Generate colors for each segment
          Object.keys(sentimentData).map((_, index) => {
            const hue = (index * -360) / Object.keys(sentimentData).length;
            return `hsl(${hue}, 50%, 50%)`;
          }),
      },
    ],
  };

  return (
    <Box
      sx={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        height: '400px',
        display: 'flex',
        flexDirection: 'column',
      }}
      className="chart-container"
    >
      <Typography variant="h6" sx={{ marginBottom: '10px' }}>
        {title}
      </Typography>
      <Box sx={{ maxWidth: '400px', margin: 'auto' }}>
        <Pie
          data={pieChartData}
          options={{
            responsive: true,
            plugins: {
              legend: { position: 'top' },
              title: { display: true, text: 'Sentiment Breakdown' },
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default SentimentPieChart;
