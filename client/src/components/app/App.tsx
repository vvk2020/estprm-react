import { CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { RouterProvider } from 'react-router-dom';
import { router } from '../routes';
import './App.scss';

// Тема с кастомным шрифтом
const theme = createTheme({
  typography: {
    fontFamily: 'Sofia Sans Extra Condensed Regular, sans-serif',
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
  },
});

function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline /> {/* Сброс базовых стилей и применение fontFamily */}
        {/* <Typography variant="body1">Весь текст в приложении будет использовать Roboto.</Typography> */}
        {/* <Typography variant="h1" fontWeight={550}>
          Заголовок с нестандартным весом 550
        </Typography> */}
        <RouterProvider router={router} />
        {/* <AppHeader /> */}
        {/* <Button variant="contained">Hello world</Button> */}
      </ThemeProvider>
    </>
  );
}

export default App;
