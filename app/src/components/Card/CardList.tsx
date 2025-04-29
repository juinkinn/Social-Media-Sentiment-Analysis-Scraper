import { Box } from "@mui/material";
import Card from "./Card";

interface Props {
    posts: object[];
    platform: string;
    game: string;
}

const CardList = ({posts, platform, game}: Props) => {

    if (!posts || posts.length === 0) return(null)
    console.log(posts)

    return(
        <Box>
            {posts.map((n, index)=> <Card key={index} game={game} comment={n.Comment} platform={platform} sentiment={0} date={n.Date}/>)}
        </Box>
    );
};
export default CardList;