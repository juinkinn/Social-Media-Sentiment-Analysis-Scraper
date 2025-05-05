import { Box } from "@mui/material";
import Card from "./Card";

interface Props {
    posts: object[];
    platform: string;
    game: string;
}

const CardList = ({posts}: Props) => {

    if (!posts || posts.length === 0) return(null)
    console.log(posts)

    return(
        <Box>
            {posts.map((n)=> <Card key={n.id} game={n.Game} comment={n.Comment} platform={n.Platform} sentiment={n.Sentiment} date={n.Date}/>)}
        </Box>
    );
};
export default CardList;