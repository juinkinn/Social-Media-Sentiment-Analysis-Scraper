import { Container, Typography, Box, Button } from '@mui/material';
import { Bar, Pie } from 'react-chartjs-2';
import WordCloud from 'react-d3-cloud';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { useNavigate } from 'react-router-dom';
import './index.css'; 

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Sample data structure for sentiment analysis
const sentimentData = {
  Youtube: { positive: 60, negative: 20, neutral: 20 },
  Facebook: { positive: 45, negative: 35, neutral: 20 },
  Reddit: { positive: 50, negative: 30, neutral: 20 },
  Steam: { positive: 70, negative: 15, neutral: 15 },
};

// Sample word cloud data
const words = [
  { text: 'gameplay', value: 100 },
  { text: 'graphics', value: 80 },
  { text: 'story', value: 60 },
  { text: 'bugs', value: 40 },
  { text: 'fun', value: 90 },
  { text: 'lag', value: 30 },
  { text: 'awesome', value: 70 },
  { text: 'crash', value: 20 },
];

// Bar chart data
const barChartData = {
  labels: ['Youtube', 'Facebook', 'Reddit', 'Steam'],
  datasets: [
    {
      label: 'Positive Sentiment (%)',
      data: [
        sentimentData.Youtube.positive,
        sentimentData.Facebook.positive,
        sentimentData.Reddit.positive,
        sentimentData.Steam.positive,
      ],
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
    },
    {
      label: 'Negative Sentiment (%)',
      data: [
        sentimentData.Youtube.negative,
        sentimentData.Facebook.negative,
        sentimentData.Reddit.negative,
        sentimentData.Steam.negative,
      ],
      backgroundColor: 'rgba(255, 99, 132, 0.6)',
    },
  ],
};

// Pie chart data (average sentiment across platforms)
const pieChartData = {
  labels: ['Positive', 'Negative', 'Neutral'],
  datasets: [
    {
      data: [
        (sentimentData.Youtube.positive +
          sentimentData.Facebook.positive +
          sentimentData.Reddit.positive +
          sentimentData.Steam.positive) / 4,
        (sentimentData.Youtube.negative +
          sentimentData.Facebook.negative +
          sentimentData.Reddit.negative +
          sentimentData.Steam.negative) / 4,
        (sentimentData.Youtube.neutral +
          sentimentData.Facebook.neutral +
          sentimentData.Reddit.neutral +
          sentimentData.Steam.neutral) / 4,
      ],
      backgroundColor: [
        'rgba(75, 192, 192, 0.6)',
        'rgba(255, 99, 132, 0.6)',
        'rgba(255, 206, 86, 0.6)',
      ],
    },
  ],
};

function Dashboard() {
  const navigate = useNavigate();

  // Map words to react-d3-cloud format
  const wordCloudData = words.map((word) => ({
    text: word.text,
    value: word.value,
  }));

  return (
    <Container
      sx={{
        padding: '20px',
        minHeight: '100vh',
        overflowY: 'auto',
      }}
      className="dashboard-container"
    >
      <Typography variant="h5" sx={{ marginBottom: '20px' }}>
        Sentiment Analysis Dashboard
      </Typography>

      {/* Grid layout for dashboard */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '20px',
        }}
      >
        {/* Bar Chart */}
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
            Sentiment Comparison Across Platforms
          </Typography>
          <Bar
            data={barChartData}
            options={{
              responsive: true,
              aspectRatio: 1.5,
              plugins: {
                legend: { position: 'top' },
                title: { display: true, text: 'Positive vs Negative Sentiment' },
              },
            }}
          />
        </Box>

        {/* Pie Chart */}
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
            Overall Sentiment Distribution
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

        {/* Word Cloud */}
        <Box
          sx={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            height: '400px',
            display: 'flex',
            flexDirection: 'column',
          }}
          className="wordcloud-container"
        >
          <Typography variant="h6" sx={{ marginBottom: '10px' }}>
            Common Words in Reviews
          </Typography>
          <Box sx={{ height: '300px' }}>
            <WordCloud
              data={wordCloudData}
              width={500}
              height={300}
              fontSize={(word) => Math.min(word.value / 2, 60)}
              rotate={() => (Math.random() > 0.5 ? 90 : 0)}
            />
          </Box>
        </Box>
      </Box>

      {/* Return to Main Page Button */}
      <Box sx={{ marginTop: '30px', textAlign: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/')}
        >
          Return to Main Page
        </Button>
      </Box>
    </Container>
  );
}

export default Dashboard;
