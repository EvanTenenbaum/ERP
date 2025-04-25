'use client';

import React from 'react';
import { 
  Table as MuiTable, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  TablePagination,
  TableSortLabel,
  Paper,
  Box,
  Typography,
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
  overflow: 'hidden',
  border: `1px solid ${theme.palette.divider}`
}));

/**
 * Table component for displaying tabular data
 * 
 * @param {Object} props - Component props
 * @param {Array} props.columns - Array of column objects with 'id', 'label', and optional 'align', 'format' properties
 * @param {Array} props.data - Array of data objects
 * @param {boolean} [props.isLoading=false] - Whether the table is in loading state
 * @param {boolean} [props.pagination=false] - Whether to show pagination
 * @param {number} [props.page=0] - Current page (0-indexed)
 * @param {number} [props.rowsPerPage=10] - Rows per page
 * @param {function} [props.onPageChange] - Callback when page changes
 * @param {function} [props.onRowsPerPageChange] - Callback when rows per page changes
 * @param {boolean} [props.sorting=false] - Whether to enable sorting
 * @param {string} [props.orderBy] - Column id to sort by
 * @param {string} [props.order='asc'] - Sort order ('asc' or 'desc')
 * @param {function} [props.onSort] - Callback when sort changes
 * @param {React.ReactNode} [props.emptyState] - Content to show when there's no data
 * @param {string} [props.className] - Additional CSS classes
 */
export default function Table({
  columns = [],
  data = [],
  isLoading = false,
  pagination = false,
  page = 0,
  rowsPerPage = 10,
  onPageChange,
  onRowsPerPageChange,
  sorting = false,
  orderBy,
  order = 'asc',
  onSort,
  emptyState,
  className = '',
  ...props
}) {
  // Handle sort request
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    if (onSort) {
      onSort(property, isAsc ? 'desc' : 'asc');
    }
  };

  // Handle page change
  const handleChangePage = (event, newPage) => {
    if (onPageChange) {
      onPageChange(newPage);
    }
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    if (onRowsPerPageChange) {
      onRowsPerPageChange(parseInt(event.target.value, 10));
    }
  };

  // Calculate rows to display based on pagination
  const displayRows = pagination
    ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : data;

  // Render loading state
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Render empty state
  if (data.length === 0 && !isLoading) {
    if (emptyState) {
      return emptyState;
    }
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          No data available
        </Typography>
      </Box>
    );
  }

  return (
    <div className={className}>
      <StyledTableContainer component={Paper}>
        <MuiTable {...props}>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align || 'left'}
                  sx={{ fontWeight: 'bold' }}
                >
                  {sorting && onSort ? (
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : 'asc'}
                      onClick={() => handleRequestSort(column.id)}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {displayRows.map((row, rowIndex) => (
              <TableRow
                key={rowIndex}
                hover
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                {columns.map((column) => {
                  const value = row[column.id];
                  return (
                    <TableCell key={column.id} align={column.align || 'left'}>
                      {column.format ? column.format(value, row) : value}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </MuiTable>
      </StyledTableContainer>
      
      {pagination && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}
    </div>
  );
}
