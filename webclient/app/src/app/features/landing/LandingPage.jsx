import {useEffect, useState, useMemo} from "react";
import {Grid, Card, CardActionArea, CardMedia, CardContent, Typography, Link} from "@mui/material";
import {useTranslation} from "react-i18next";

import LandingPageRest from "../../services/LandingPageRest";

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
            {Object.keys(landingPageData).map((entry, index) => (
                <Grid size={{xs: 12, sm: 6, md: 4}} key={index}>
                    <Card sx={{borderRadius: 3, boxShadow: 4}}>
                        <CardActionArea onClick={() => window.open(landingPageData[entry].endpoint, '_blank')}>
                            <CardMedia
                                component="img"
                                height="350"
                                image={'landing/' + landingPageData[entry].image}
                                alt={t(landingPageData[entry].name)}
                            />
                            <CardContent>
                                <Typography align="center" variant="h6">
                                    {t(`landing.${landingPageData[entry].name}`)}
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>
            ))
            }
        </Grid >
    );
}