import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Container, Typography, Button, TextField, MenuList, MenuItem, Box } from '@mui/material';
import { Check } from '@mui/icons-material';
import CardList from './components/Card/CardList';
import Dashboard from './Dashboard';
import './index.css';
import { useState, useEffect } from 'react';
import { fetchPost } from './service/apiService';
import { Post } from './types';

function App() {
  const [game, setGame] = useState<string>('');
  const [social, setSocial] = useState<string>('');
  const [crawl, setCrawl] = useState<boolean>(false);
  const [posts, setPost] = useState<Post[]>([])
  const [ids, setIDs] = useState<string[]>([])

  useEffect(() => {
    const getPost = async () => {
      if (game !== '' && social !== '') {
        console.log(`${game} from ${social}`)

        try{
          const Posts = await fetchPost(game, social) as Post[]

          const newPosts = Posts.filter(post => !ids.includes(post['id']))
          setIDs(newPosts.map(post => post['id']))

          setPost(posts.concat(newPosts))
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        catch(error: object | any) {
          if(error){
            alert(JSON.stringify(error.repsonse.data))
          }
        }

      }
    }
  
    let intervalId = null;

    if (crawl) {
      // Immediately fetch once
      getPost();
  
      // Then set interval for 5-minute polling
      intervalId = setInterval(() => {
        getPost();
      }, 300000); // 5 minutes
    }
  
    // Cleanup on crawl change or unmount
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [crawl, social])

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
        <TextField autoFocus id="game" label="Game name" value={game} onChange={(e) => setGame(e.target.value)}/>
        <Box>
          <Typography>Choose platform:</Typography>
          <MenuList sx={{ backgroundColor: 'lightblue', borderRadius: '5px' }}>
            <MenuItem onClick={() => setSocial('youtube')}>
              Youtube {social === 'youtube' ? <Check /> : null}
            </MenuItem>
            <MenuItem onClick={() => setSocial('reddit')}>
              Reddit {social === 'reddit' ? <Check /> : null}
            </MenuItem>
            <MenuItem onClick={() => setSocial('steam')}>
              Steam {social === 'steam' ? <Check /> : null}
            </MenuItem>
          </MenuList>
        </Box>

        { 
          social !== '' ? 
            <Button variant='contained' sx={{ backgroundColor: crawl ? 'rgb(199, 35, 35)' : 'rgb(25, 118, 210)'}} onClick={() => setCrawl(!crawl)}>{ crawl ? 'Stop web scrape' : 'Start web scrape'}</Button>
            : 
            null
        }

        <Link to="/dashboard">
          <Button variant="contained" sx={{ marginTop: '10px' }}>
            View Dashboard
          </Button>
        </Link>
      </Container>

      <Container sx={{ height: '90vh', width: '80%', overflowY: 'scroll', backgroundColor: 'lightblue' }}>
        <CardList posts={posts} game={game} platform={social}/>
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
