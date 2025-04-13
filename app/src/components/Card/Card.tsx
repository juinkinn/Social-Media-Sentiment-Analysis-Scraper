import {Paper, Box, Button, Typography } from "@mui/material";

const Card = () => {
    return(
        <Box sx={{gap: '5px', margin: '10px', padding:'5px', backgroundColor: 'lightblue' , borderBottom: 'solid 2px lightcyan'}}>
            <Paper elevation={3} sx={{ marginBottom: '10px', padding:'5px' }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </Paper>
            <Box sx={{display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Typography sx={{color: 'green'}}>Positive</Typography>
                <Button variant='outlined'>Summarize</Button>
            </Box>
        </Box>
    )
}

export default Card;