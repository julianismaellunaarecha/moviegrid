// Import MUI stuff
import "@fontsource/roboto"; // Loading Roboto font. MUI was designed with this font in mind.
import {
    AppBar,
    BottomNavigation,
    Card,
    CardContent,
    CardHeader,
    Container,
    CssBaseline,
    FormControlLabel,
    FormGroup,
    Switch,
} from "@mui/material";
import {createTheme, ThemeProvider} from "@mui/material/styles";

import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import {DataGrid, GridColDef, GridEventListener} from "@mui/x-data-grid";
import Box from "@mui/material/Box"
import React, {useEffect, useState} from "react";
import axios from "axios";
import {Pelicula} from "./components/pelicula/Pelicula.tsx";

const TokenApiPublicoQuery = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkNmNjODcyODBjMGY3ZDA5YmIxY2Y0NjMyOGExMmI4YSIsInN1YiI6IjY0YWVjN2I0ZDY1OTBiMDBjN2FkNDJiYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.1Chxl24HDrMzC6plp73r-Hf-3_RX5SRSB29FZV7zXrA';

// Opciones
const opciones = {
    includeAdult: "false",
    includeVideo: "true",
    language: "es-AR",
    page: "1",
    sortBy: "popularity.desc",
}

const baseURL = "https://api.themoviedb.org/3/discover/movie?";

function App() {

    const [isDarkTheme, setIsDarkTheme] = useState(false);

    // This function is triggered when the Switch component is toggled
    const changeTheme = () => {
        setIsDarkTheme(!isDarkTheme);
    };

    const columns: GridColDef[] = [

        {
            field: 'title',
            headerName: 'Titulo',
            width: 200,
            editable: false,
            hideable: false,
        },
        {
            field: 'original_title',
            headerName: 'Titulo Original',
            width: 200,
            editable: false,
            hideable: false,
        },
        {
            field: 'release_date',
            headerName: 'Fecha de lanzamiento',
            width: 200,
            editable: false,
            hideable: false,
        },
    ];

    const [peliculaSeleccionada, setpeliculaSeleccionada] = React.useState<Pelicula>();

    const handleRowClick: GridEventListener<'rowClick'> = (params) => {
        setpeliculaSeleccionada(params.row);
    };

    const [rows, setRows] = useState([]);

    const getData = async () => {
        const headersCall = {
            accept: 'application/json',
            Authorization: 'Bearer ' + TokenApiPublicoQuery
        };
        await axios.get(
            baseURL
            + "include_adult=" + opciones.includeAdult
            + "&include_video=" + opciones.includeVideo
            + "&language=" + opciones.language
            + "&page=" + opciones.page
            + "&sort_by=" + opciones.sortBy,
            {
                headers: headersCall
            }
        ).then((response) => {
            setRows(response.data.results);
        });
    };

    useEffect(() => {
        void getData();
    }, []);

    const [paginationModel, setPaginationModel] = useState({
        pageSize: 5,
        page: 0,
    });

    return (
        <ThemeProvider
            theme={isDarkTheme ? createTheme({palette: {mode: "dark"}}) : createTheme({palette: {mode: "light"}})}>
            <Box sx={{
                display: 'flex',
                flexGrow: 1,
                position: 'relative',
                overflow: 'hidden',
                paddingTop: '0px',
                paddingBottom: '0rem',
            }}>
                <AppBar>
                    <CardHeader
                        action={
                            <FormGroup>
                                <FormControlLabel
                                    control={
                                        <Switch checked={isDarkTheme} onChange={changeTheme}/>
                                    }
                                    label={"Cambiar a " + (isDarkTheme ? "Modo Claro" : "Modo Oscuro")}
                                />
                            </FormGroup>
                        }
                        sx={{height: 50, width: 50}}
                    />
                </AppBar>
            </Box>
            <CssBaseline/>
            <Box>
                <Typography gutterBottom variant="h6" component="div" sx={{  marginLeft: 5 , height: 50}}>
                    Selecciona una película para ver el detalle:
                </Typography>
            </Box>
            <Container maxWidth={false} className="App" sx={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: "center", justifyContent: "space-between", flexGrow: "1"}}>
                <Box sx={{height: 400, minWidth: 360, maxWidth: 730, display: 'flex', flexDirection: 'row', flexGrow: "1"}}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        onPaginationModelChange={setPaginationModel}
                        paginationModel={paginationModel}
                        onRowClick={handleRowClick} {...rows}
                    />
                </Box>
                <Card sx={{height: 400, minWidth: 360, maxWidth: 730, display: 'flex', flexDirection: 'row'}}>
                    {peliculaSeleccionada &&
                        <CardMedia sx={{height: 400}}
                                   component="img"
                                   src={'https://image.tmdb.org/t/p/w185' + peliculaSeleccionada.poster_path}
                                   alt=""
                        />
                    }
                    <CardContent sx={{minWidth: 200}}>
                        {peliculaSeleccionada &&
                            <Typography gutterBottom variant="h5" component="div" sx={{height: 100}}>
                                {peliculaSeleccionada.title}
                            </Typography>
                        }
                        {peliculaSeleccionada &&
                            <Typography variant="body2" color="text.secondary" sx={{
                                mb: 2, display: "flex",
                                flexDirection: "column", overflow: "hidden", overflowY: "auto", height: 250
                            }}>
                                {peliculaSeleccionada.overview}
                            </Typography>
                        }
                    </CardContent>
                </Card>
            </Container>
            <BottomNavigation sx={{minwidth: 400, justifyItems: "center", margin: "10px"}}>
                <img src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_long_1-8ba2ac31f354005783fab473602c34c3f4fd207150182061e425d366e4f34596.svg"/>
            </BottomNavigation>
        </ThemeProvider>
    )
}

export default App
