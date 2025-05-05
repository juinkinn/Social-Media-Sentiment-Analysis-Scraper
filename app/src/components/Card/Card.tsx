import {Paper, Box, Button, Typography } from "@mui/material";
import { useState } from "react";
import { summarize } from "../../service/apiService";

interface Props {
    game: string;
    comment: string;
    platform: string;
    sentiment: string;
    date: string;
}

const Card = ({game, comment, platform, sentiment, date}: Props) => {

    const [sum, setSummarized] = useState<string[]>([])

    const handleSummarize = async () => {
        const text = await summarize(comment)
        setSummarized(text)
    }

    return(
        <Box sx={{gap: '5px', margin: '10px', padding:'5px', backgroundColor: 'lightblue' , borderBottom: 'solid 2px lightcyan'}}>
            <Paper elevation={3} sx={{ marginBottom: '10px', padding:'5px' }}>
                <Typography variant='h6'>{game} - {platform} - {date}</Typography>
                {comment}
            </Paper>
            <Box sx={{display: 'flex', alignItems: 'center', gap: '10px' }}>
                {sentiment === 'POSITIVE' ? 
                    <Typography sx={{color: 'green'}}>Positive</Typography>
                    :
                    <Typography sx={{color: 'red'}}>Negative</Typography>
                }    
            </Box>
            {   
                sum.length === 0 ?
                    <Button variant='outlined' onClick={handleSummarize}>Summarize</Button>
                    :
                    <Box sx={{ backgroundColor: "white"}}>
                        <Typography>Summary:</Typography>
                        <ul>
                            {sum.map(n => <li>{n}</li>)}
                        </ul>
                    </Box>
            }
        </Box>
    )
}

export default Card;