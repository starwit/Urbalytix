import {Grid, Card, CardActionArea, CardMedia, CardContent, Typography} from "@mui/material";
import {useTranslation} from "react-i18next";

import CityHall from "./../../assets/landing/city-hall.jpg";
import TrafficFlow from "./../../assets/landing/TrafficFlow.png";
import StreetMap from "./../../assets/landing/streetmap-sh.png";
import Police from "./../../assets/landing/polizei_alexander-fox_pixabay.jpg";

const tiles = [
    {title: "Waste Management", image: CityHall},
    {title: "Traffic Life", image: TrafficFlow},
    {title: "Traffic Analysis", image: TrafficFlow},
    {title: "Asset Management", image: StreetMap},
    {title: "Safety", image: Police},
];

export default function StartPage() {
    const {t, i18n} = useTranslation();

    return (
        <Grid container spacing={3} justifyContent="center" rowSpacing={1} columnSpacing={{xs: 1, sm: 2, md: 3}}>
            {tiles.map((tile, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                    <Card sx={{borderRadius: 3, boxShadow: 4}}>
                        <CardActionArea>
                            <CardMedia
                                component="img"
                                height="250"
                                image={t(tile.title)}
                                alt={t(tile.title)}
                            />
                            <CardContent>
                                <Typography align="center" variant="h6">
                                    {t(tile.title)}
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
}