import { Box } from "@mui/material";
import Card from "./Card";

const CardList = () => {
    const arr = [
        {
            id: 1, 
            comment:   'im sad believe mean sincerely im trying throw shade none male friend life ever hit expected something sexual im lesbian know wouldnt fuck guy million year arent butthurt holding grudge though never saw human conquest win level beat loneliness make feel like dating trying beat game get co ive good bad luck woman doom convince woman whole group nothing conquest',
            platform: 'reddit',
            sentiment: 1,
            date: String(new Date())
        },
        {
            id: 1, 
            comment:   'went from surprisingly good yugioh game to paywin rubbish. the present trend is likely to continue, which is quite a shame since i was excited to finally get to the synchro era.',
            platform: 'reddit',
            sentiment: 0,
            date: String(new Date())
        },
        {
            id: 1, 
            comment:   "this game is a really mixed bag, so it was hard to me to decide whether i recommend it or not.but now i've made up my mind, i do not.the game itself is really enjoyable with different maps and career paths to take.there's a lot to like in this game.however a lot of these types of games get ruined by their economy or atleast fractions of their economy and h&g is no exception.the guns are overpriced and overpowered. if someone uses real money to purchase a gun you'll feel it, the game is very much, pay to win.free credits are not well balanced, specifically designed to be hard to earn to buy new weapons, so that you'll be more tempted to use your hard earned cash.you think that if a game was to have hard to earn rewards, it'd take a planetside approach, and make all guns have strengths, weaknesses and be overall balanced. but they are not. the thompson for example is the be all end all of submachine guns, i picked one up from an enemy and a quick burst of bullets to the chest was all it took to down an enemy.however with the grease gun, america's starting smg it took around , requiring the full clip if you miss.the german starting smg is also stronger than the grease gun as well.there's not a large variety of guns either, which makes me question it a little, considering that i remember a larger array of weaponry in similar ww shooters.the game is fun, refreshing even, however the unfairness of it's economy and weapon tier system really ruin the fun.unbalanced weaponry and inconsistent weapons between both factions, leaves something to be desired.this game would really benefit from leaving it's limitations, creating a third fictional faction to make battles ways, or even adding the ability for way battles which would include weaponry specific to that faction based in that time frame.this game is in need of a massive overhaul in order to improve player satisfaction and balance between all players, new and long running.also, a quick mention for server maintenance, this game is riddled with it, atleast % of the time when i want to jump on, there's server maintenance, and this isn't for short periods of time, these are long downtimes, that when the time to be taken is predicted, takes anywhere from to hours, and when the maintenance is unexpected bugfixes or anything along those lines, the game can be done for a whole night, with no time given to players as to when it'll be back up.my verdict: a good game turned sour by it's online shop.",
            platform: 'youtube',
            sentiment: 0,
            date: String(new Date())
        },
        {
            id: 1, 
            comment:   "a game that starts calm and works it's way up to genuine terror. it's not a gradual rise, but more in spikes, each spike scarier than the last. it always returns to the same calm between spikes of spookiness, until you get far enough... there's randomly generated rooms that you must advance through, most of the time duplicates of previous rooms will turn up time after time. every now and then a rare, interesting room appears, usually having some fun gimic or a reference to another popular horror game. fans of scp containment breach would likely enjoy this.is this game worth your money? it's free. give it a play and you'll see.",
            platform: 'youtube',
            sentiment: 0,
            date: String(new Date())
        },
    ];

    return(
        <Box>
            {arr.map(n => <Card key={n.id} comment={n.comment} platform={n.platform} sentiment={n.sentiment} date={n.date}/>)}
        </Box>
    );
};

export default CardList;