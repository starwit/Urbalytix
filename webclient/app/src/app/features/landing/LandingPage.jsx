import {useEffect, useState, useMemo} from "react";
import {Grid, Card, CardActionArea, CardMedia, CardContent, Typography, Link} from "@mui/material";
import {useTranslation} from "react-i18next";

import CityHall from "../../assets/landing/city-hall.jpg";
import TrafficFlow from "../../assets/landing/TrafficFlow.png";
import StreetMap from "../../assets/landing/streetmap-sh.png";
import Police from "../../assets/landing/polizei_alexander-fox_pixabay.jpg";

import LandingPageRest from "../../services/LandingPageRest";

const tiles = [
    {title: "wastemanagement", image: CityHall},
    {title: "trafficlive", image: TrafficFlow},
    {title: "trafficanalysis", image: TrafficFlow},
    {title: "parking", image: TrafficFlow},
    {title: "assetmanagement", image: StreetMap},
    {title: "publicsafety", image: Police},
];

export default function StartPage() {
    const {t, i18n} = useTranslation();
    const landingPageRest = useMemo(() => new LandingPageRest(), []);
    const [landingPageData, setLandingPageData] = useState([]);

    useEffect(() => {
        loadLandingPageData();
    }, []);

    function loadLandingPageData() {
        landingPageRest.findAll().then(response => {
            if (response.data == null) {
                return;
            }
            setLandingPageData(response.data);
        });
    }

    return (
        <Grid container spacing={3} justifyContent="center" rowSpacing={1} columnSpacing={{xs: 1, sm: 2, md: 3}}>
            {tiles.map((entry, index) => (
                <Grid size={{xs: 12, sm: 6, md: 3}} key={index}>
                    <Card sx={{borderRadius: 3, boxShadow: 4}}>
                        <CardActionArea>
                            <CardMedia
                                component="img"
                                height="250"
                                image={entry.image}
                                alt={t(entry.title)}
                            />
                            <CardContent>
                                <Typography align="center" variant="h6">
                                    {t(`landing.${entry.title}`)}
                                </Typography>
                                <Link href="#" variant="body2">
                                    {t(`landing.${entry.title}`)}
                                </Link>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>
            ))
            }
        </Grid >
    );
}