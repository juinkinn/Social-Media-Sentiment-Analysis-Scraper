import { useEffect, useState } from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
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
import { Post } from './types';
import { 
  getAlldata, 
  getAvailableData, 
  getDataOfDate, 
  resetData, 
  resetDataOfDate,
  downloadAllData,
  downloadDataOfDate} from './service/apiService';
import SentimentBarChart from './components/Charts/SentimentBarChart';
import SentimentPieChart from './components/Charts/SentimentPieChart';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function Dashboard() {
  const navigate = useNavigate();
  const [sentimentData, setSentimentData] = useState<{
    platform: { [key: string]: { positive: number; negative: number } },
    game: { [key: string]: { positive: number; negative: number } };
  }>({platform: {}, game: {}});
  const [wordCloudData, setWordCloudData] = useState<{ text: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dates, setDates] = useState<string[] | null>([]);
  const [date, setDate] = useState<string>('');

  // Fetch data from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch sentiment data
        const dataResponse = date === '' ? await getAlldata() : await getDataOfDate(date);
        const data = dataResponse as Post[];
        
        // Process sentiment data
        const sentimentCounts: {
          platform: { [key: string]: { positive: number; negative: number } },
          game: { [key: string]: { positive: number; negative: number } };
        } = {platform: {}, game: {}};

        if(data.length === 0) {;  
          setLoading(false);
          setSentimentData({platform: {}, game: {}});
          return;
        }

        data.forEach((item) => {
          const game = item.Game;
          const platform = item.Platform;
          const sentiment = item.Sentiment.toLowerCase();

          if (!sentimentCounts.platform[platform]) {
            sentimentCounts.platform[platform] = { positive: 0, negative: 0 };
          }
          if (!sentimentCounts.game[game]) {
            sentimentCounts.game[game] = { positive: 0, negative: 0 };
          }

          if (sentiment === 'positive') {
            sentimentCounts.platform[platform].positive += 1;
            sentimentCounts.game[game].positive += 1;
          } else if (sentiment === 'negative') {
            sentimentCounts.platform[platform].negative += 1;
            sentimentCounts.game[game].negative += 1;
          }
        });

        // Convert counts to percentages
        Object.keys(sentimentCounts.platform).forEach((platform) => {
          const total = sentimentCounts.platform[platform].positive + sentimentCounts.platform[platform].negative
          if (total > 0) {
            sentimentCounts.platform[platform].positive = (sentimentCounts.platform[platform].positive / total) * 100;
            sentimentCounts.platform[platform].negative = (sentimentCounts.platform[platform].negative / total) * 100;
          }
        });

        Object.keys(sentimentCounts.game).forEach((game) => {
          const total = sentimentCounts.game[game].positive + sentimentCounts.game[game].negative
          if (total > 0) {
            sentimentCounts.game[game].positive = (sentimentCounts.game[game].positive / total) * 100;
            sentimentCounts.game[game].negative = (sentimentCounts.game[game].negative / total) * 100;
          }
        });

        setSentimentData(sentimentCounts);

        // Fetch word cloud data
        const wordCounts: { [word: string]: number } = {};
        data.forEach((item) => {
          // Simple word splitting (improve this based on your needs)
          const words = item.Comment.toLowerCase().split(/\s+/);
          words.forEach((word) => {
            if (word.length > 3) { // Ignore short words
              wordCounts[word] = (wordCounts[word] || 0) + 1;
            }
          });
        });

        // Convert word counts to word cloud format
        const wordCloud = Object.entries(wordCounts)
          .map(([text, value]) => ({ text, value: value * 10 })) // Scale value for visibility
          .sort((a, b) => b.value - a.value)
          .slice(0, 20); // Limit to top 20 words
        setWordCloudData(wordCloud);

        setLoading(false);
      } catch (err) {
        setError('Failed to fetch data');
        setLoading(false);
        console.error(err);
      }
    };

    const fetchAvilableData = async () => {
      try {
        const data = await getAvailableData()
        setDates(data)
      } catch (err) {
        setError('Failed to fetch available data');
        console.error(err);
      }
    }

    fetchData();
    fetchAvilableData();
  }, [date]);

  // Reset data
  const handleResetData = async () => {
    try {
      if (date === '') {
        await resetData();
      }
      else { await resetDataOfDate(date); }
      setSentimentData({platform: {}, game: {}});
      setWordCloudData([]);
      setError(null);
    } catch (err) {
      setError('Failed to reset data');
      console.error(err);
    }
  }

  //handle download data
  const handleDownloadData = async () => {
    try {
      const response = date === '' ? await downloadAllData() : await downloadDataOfDate(date);
      const blob = new Blob([response], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `data_${date}.csv`);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      alert('Failed to download data');
      console.error(err);
    }
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

      {/* Date Selection */}
      <Box sx={{ marginTop: '30px', textAlign: 'center', marginBottom: '20px' }}>
        <Typography variant="h6" sx={{ marginBottom: '10px' }}>
          Select Date for Data
        </Typography>
        <select
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{ padding: '10px', borderRadius: '5px' }}
        >
          <option value=''>All Data</option>
          {dates && dates.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        <Button onClick={handleResetData} variant="outlined" color="secondary" sx={{ marginLeft: '20px' }}>
          Reset Data
        </Button>
      </Box>

      <Box sx={{ marginTop: '30px', textAlign: 'center', marginBottom: '20px' }}>
        <Button onClick={handleDownloadData} variant="contained" color="secondary">
          Download Data
        </Button>
      </Box>

      {/* Grid layout for dashboard */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '20px',
        }}
      >
        {/* Bar Chart */}
        <SentimentBarChart
          sentimentData={sentimentData.platform}
          title="Platform Sentiment Analysis"
        />

        <SentimentBarChart
          sentimentData={sentimentData.game}
          title="Game Sentiment Analysis"
        />

        {/* Pie Chart */}
        <SentimentPieChart
          sentimentData={sentimentData.platform}
          title="Average Platform  Sentiment Breakdown"
          sentiment="positive"
        />

        <SentimentPieChart
          sentimentData={sentimentData.game}
          title="Average Game Positive Sentiment Breakdown"
          sentiment="positive"
        />

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

      
    </Container>
  );
}

export default Dashboard;