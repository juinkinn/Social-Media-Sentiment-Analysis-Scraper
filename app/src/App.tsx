import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Container, Typography, Button, TextField, MenuList, MenuItem, Box } from '@mui/material';
import { Check } from '@mui/icons-material';
import CardList from './components/Card/CardList';
import Dashboard from './Dashboard';
import './index.css';
import { useState } from 'react';

function App() {
  const [game, setGame] = useState<string>('');
  const [social, setSocial] = useState<string>('');
  const [crawl, setCrawl] = useState<boolean>(false);

  const MainContent = () => (
    <Container
      sx={{
        display: 'flex',
        overflowY: 'hidden',
        height: '100vh',
        width: '100vw',
        justifyContent: 'space-evenly',
        alignItems: 'center',
      }}
    >
      <Container
        sx={{
          width: '20%',
          height: '90vh',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        <Typography variant="h5" sx={{ padding: '3px', border: 'solid 2px lightblue' }}>
          Realtime Web Scraping and Sentiment Analysis on Games
        </Typography>
        <TextField label="Game name" value={game} onChange={(e) => setGame(e.target.value)} />
        <Box>
          <Typography>Choose platform:</Typography>
          <MenuList sx={{ backgroundColor: 'lightblue', borderRadius: '5px' }}>
            <MenuItem onClick={() => setSocial('Youtube')}>
              Youtube {social === 'Youtube' ? <Check /> : null}
            </MenuItem>
            <MenuItem onClick={() => setSocial('Facebook')}>
              Facebook {social === 'Facebook' ? <Check /> : null}
            </MenuItem>
            <MenuItem onClick={() => setSocial('Reddit')}>
              Reddit {social === 'Reddit' ? <Check /> : null}
            </MenuItem>
            <MenuItem onClick={() => setSocial('Steam')}>
              Steam {social === 'Steam' ? <Check /> : null}
            </MenuItem>
          </MenuList>
        </Box>

        <Button
          variant="contained"
          sx={{ backgroundColor: crawl ? 'rgb(199, 35, 35)' : 'rgb(25, 118, 210)' }}
          onClick={() => setCrawl(!crawl)}
        >
          {crawl ? 'Stop web scrape' : 'Start web scrape'}
        </Button>

        <Link to="/dashboard">
          <Button variant="contained" sx={{ marginTop: '10px' }}>
            View Dashboard
          </Button>
        </Link>
      </Container>

      <Container sx={{ height: '90vh', width: '80%', overflowY: 'scroll', backgroundColor: 'lightblue' }}>
        <CardList />
      </Container>
    </Container>
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainContent />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
