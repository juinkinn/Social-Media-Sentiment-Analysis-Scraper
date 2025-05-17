import React from 'react';
import { Box, Typography } from '@mui/material';
import { Bar } from 'react-chartjs-2';

interface SentimentBarChartProps {
  sentimentData: {
    [key: string]: { positive: number; negative: number };
  };
  title: string;
}

const SentimentBarChart: React.FC<SentimentBarChartProps> = ({ sentimentData, title }) => {
  // Bar chart data
  const barChartData = {
    labels: Object.keys(sentimentData),
    datasets: [
      {
        label: 'Positive Sentiment (%)',
        data: Object.values(sentimentData).map((data) => data.positive),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Negative Sentiment (%)',
        data: Object.values(sentimentData).map((data) => data.negative),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
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
      <Bar
        data={barChartData}
        options={{
          responsive: true,
          aspectRatio: 1,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Positive vs Negative Sentiment' },
          },
        }}
      />
    </Box>
  );
};

export default SentimentBarChart;
