import { Box } from "@mui/material";
import Card from "./Card";

type Post = {
    id: string;
    Game: string;
    Platform: string;
    Comment: string;
    Sentiment: string;
    Date: string;
}
interface Props {
    posts: Post[];
    platform: string;
    game: string;
}

const CardList = ({posts}: Props) => {

    if (!posts || posts.length === 0) return(null)
    console.log(posts)

    return(
        <Box className="CardList">
            {posts.map((n)=> <Card key={n.id} game={n.Game} comment={n.Comment} platform={n.Platform} sentiment={n.Sentiment} date={n.Date}/>)}
        </Box>
    );
};
export default CardList;