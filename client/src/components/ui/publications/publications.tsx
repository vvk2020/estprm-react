import Paper from '@mui/material/Paper';
import {
  DataGrid,
  type GridColDef,
  type GridRowParams,
  type GridRowSelectionModel,
} from '@mui/x-data-grid';
import { ruRU } from '@mui/x-data-grid/locales';
import { useState, type FC } from 'react';
import { selectArticles } from '../../../services/publications/slices';
import { useSelector } from '../../../services/store';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID' },
  { field: 'year', headerName: 'Год', width: 60 },
  { field: 'authors', headerName: 'Авторы', width: 160 },
  { field: 'name', headerName: 'Название', flex: 1 },
  // {
  //   field: 'fullName',
  //   headerName: 'ФИО',
  //   description: 'This column has a value getter and is not sortable.',
  //   sortable: false,
  //   width: 160,
  //   valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
  // },
];

export default function DataTable() {
  const articles = useSelector(selectArticles);

  const rows = articles.map(a => {
    return {
      id: a.id,
      year: a.year.toString(),
      authors: a.authors,
      name: a.name,
    };
  });

  const handleRowClick = (params: GridRowParams) => {
    console.log('Clicked row:', params.row);
    console.log('Row ID:', params.id);
    console.log('Row data:', params.row);
  };

  const handleRowDoubleClick = (params: GridRowParams) => {
    console.log('Double clicked row:', params.row);
    console.log('Row ID:', params.id);
    console.log('Row data:', params.row);
  };

  const fontSettings = {
    fontSize: '1.25rem !important',
    fontFamily: 'var(--plain-text-font)',
  };

  console.log('ROWS', rows);
  // Состояние для хранения ID выделенной строки
  const [selectedRowId, setSelectedRowId] = useState<GridRowSelectionModel>();

  const paginationModel = { page: 1, pageSize: 10 };

  return (
    <Paper sx={{ height: '100%', width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        getRowHeight={() => 'auto'}
        initialState={{
          pagination: { paginationModel },
          columns: {
            columnVisibilityModel: {
              id: false,
            },
          },
        }}
        pageSizeOptions={[5, 10, 20]}
        checkboxSelection
        // Контролируемая модель выделения
        rowSelectionModel={selectedRowId}
        // Событие изменения модели (будет вызвано при клике, но мы его переопределяем)
        onRowSelectionModelChange={(newModel: GridRowSelectionModel) => {
          // Необязательно: можно добавить логику, если выделение изменилось другим способом
          setSelectedRowId(newModel);
        }}
        localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
        onRowClick={handleRowClick}
        onRowDoubleClick={handleRowDoubleClick}
        // Отключаем выделение при двойном клике
        disableRowSelectionOnClick={true} // Оставляем выделение при одиночном клике
        sx={{
          border: 0,
          //! Применяем стили напрямую с повышением специфичности
          // Для текста лейбла "Rows per page:"
          '& .MuiTablePagination-selectLabel': fontSettings,
          // Для отображения количества строк (например: "1-5 of 10")
          '& .MuiTablePagination-displayedRows': fontSettings,
          // Для селекта (выпадающий список)
          '& .MuiTablePagination-root .MuiSelect-select': fontSettings,
          // Для элемента с текстом внутри селекта
          '& .MuiInputBase-root': fontSettings,
          // Более специфичный селектор для MUI X DataGrid
          '& .MuiDataGrid-footerContainer .MuiSelect-select': fontSettings,
          // Для всех элементов пагинации
          '& .MuiTablePagination-root': fontSettings,
        }}
      />
    </Paper>
  );
}

export const PublicationsUI: FC = () => {
  return (
    <>
      <h2 className="title">Публикации</h2>
      <DataTable />
    </>
  );
};
