import {Paper, Box, Button, Typography } from "@mui/material";

interface Props {
    game: string;
    comment: string;
    platform: string;
    sentiment: number;
    date: string;
}

const Card = ({game, comment, platform, sentiment, date}: Props) => {
    return(
        <Box sx={{gap: '5px', margin: '10px', padding:'5px', backgroundColor: 'lightblue' , borderBottom: 'solid 2px lightcyan'}}>
            <Paper elevation={3} sx={{ marginBottom: '10px', padding:'5px' }}>
                <Typography variant='h6'>{game} - {platform} - {date}</Typography>
                {comment}
            </Paper>
            <Box sx={{display: 'flex', alignItems: 'center', gap: '10px' }}>
                {sentiment === 1 ? 
                    <Typography sx={{color: 'green'}}>Positive</Typography>
                    :
                    <Typography sx={{color: 'red'}}>Negative</Typography>
                }
                <Button variant='outlined'>Summarize</Button>
            </Box>
        </Box>
    )
}

export default Card;