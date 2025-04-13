import { Box } from "@mui/material";
import Card from "./Card";

const CardList = () => {
    const arr = [1,2,3,4,5,6,7,8];

    return(
        <Box>
            {arr.map(n => <Card key={n}/>)}
        </Box>
    );
};

export default CardList;