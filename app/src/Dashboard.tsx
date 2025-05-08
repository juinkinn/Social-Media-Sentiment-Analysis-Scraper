import { useEffect, useState } from 'react';
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
import axios from 'axios';
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

// Interface for the data structure returned by get_data
interface Comment {
  id: string;
  gameName: string;
  platform: string;
  comment: string;
  sentiment: string;
  date: string;
  userSuggestion: string | null;
}

function Dashboard() {
  const navigate = useNavigate();
  const [sentimentData, setSentimentData] = useState<{
    [platform: string]: { positive: number; negative: number };
  }>({});
  const [wordCloudData, setWordCloudData] = useState<{ text: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch sentiment data
        const dataResponse = await axios.get('http://localhost:5000/alldata');
        const data = dataResponse.data;
        
        // Process sentiment data
        const sentimentCounts: {
          [platform: string]: { positive: number; negative: number; neutral: number };
        } = {};
        data.forEach((item) => {
          const platform = item.platform;
          const sentiment = item.sentiment.toLowerCase();

          if (!sentimentCounts[platform]) {
            sentimentCounts[platform] = { positive: 0, negative: 0, neutral: 0 };
          }

          if (sentiment === 'positive') {
            sentimentCounts[platform].positive += 1;
          } else if (sentiment === 'negative') {
            sentimentCounts[platform].negative += 1;
          }
        });

        // Convert counts to percentages
        Object.keys(sentimentCounts).forEach((platform) => {
          const total =
            sentimentCounts[platform].positive +
            sentimentCounts[platform].negative
          if (total > 0) {
            sentimentCounts[platform].positive = (sentimentCounts[platform].positive / total) * 100;
            sentimentCounts[platform].negative = (sentimentCounts[platform].negative / total) * 100;
          }
        });

        setSentimentData(sentimentCounts);

        // Fetch word cloud data
        const wordCloudResponse = await axios.get('http://localhost:5000/wordcloud');
        setWordCloudData(wordCloudResponse.data);

        setLoading(false);
      } catch (err) {
        setError('Failed to fetch data');
        setLoading(false);
        console.error(err);
      }
    };

    fetchData();
  }, []);

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

  // Pie chart data (average sentiment across platforms)
  const pieChartData = {
    labels: ['Positive', 'Negative'],
    datasets: [
      {
        data: [
          Object.values(sentimentData).reduce((sum, data) => sum + data.positive, 0) /
            Object.keys(sentimentData).length || 0,
          Object.values(sentimentData).reduce((sum, data) => sum + data.negative, 0) /
            Object.keys(sentimentData).length || 0,
        ],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 99, 132, 0.6)',
        ],
      },
    ],
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

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