import { CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import type { } from '@mui/x-data-grid/themeAugmentation';
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

  components: {
    MuiDataGrid: {
      styleOverrides: {
        root: {
          fontSize: '18px', //'0.875rem',
          fontFamily: 'Arial, sans-serif',


          '& .MuiTablePagination-root .MuiTablePagination-selectLabel': {
            fontSize: '1.25rem !important',
          },
          '& .MuiTablePagination-root .MuiTablePagination-displayedRows': {
            fontSize: '1.25rem !important',
          },
          '& .MuiTablePagination-root .MuiInputBase-root': {
            fontSize: '1.25rem !important',
          },
        },
        columnHeaderTitle: {
          fontSize: '20px', //'1rem',
          fontWeight: 'bold',
        },
        cell: {
          fontSize: '20px', //'0.875rem',
        },
      },
    },
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
