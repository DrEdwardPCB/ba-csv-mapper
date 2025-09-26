import React, { useState, useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Chip,
  TextField,
  InputAdornment,
} from '@mui/material';
import { DataGridPremium, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid-premium';
import { Search as SearchIcon } from '@mui/icons-material';
import { CSVRow } from '../types';
import CustomToolbar from './CustomToolbar';
interface MappingModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (selectedIds: string[]) => void;
  sourceData: CSVRow[];
  targetData: CSVRow[];
  sourceColumns: string[];
  targetColumns: string[];
  isFromSource: boolean;
  selectedRowId?: string;
}

const MappingModal: React.FC<MappingModalProps> = ({
  open,
  onClose,
  onConfirm,
  sourceData,
  targetData,
  sourceColumns,
  targetColumns,
  isFromSource,
  selectedRowId,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>({type:'include', ids:new Set([])});

  const displayData = isFromSource ? targetData : sourceData;
  const displayColumns = isFromSource ? targetColumns : sourceColumns;

  const filteredData = useMemo(() => {
    if (!searchTerm) return displayData;
    
    return displayData.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [displayData, searchTerm]);

  const columns: GridColDef[] = displayColumns.map((col) => ({
    field: col,
    headerName: col,
    width: 150,
    renderCell: (params) => (
      <Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {String(params.value || '')}
      </Box>
    ),
  }));

  const handleConfirm = () => {
    onConfirm(Array.from(selectedRows.ids) as string[]);
    setSelectedRows({type:'include', ids:new Set([])});
    setSearchTerm('');
  };

  const handleClose = () => {
    onClose();
    setSelectedRows({type:'include', ids:new Set([])});
    setSearchTerm('');
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="h6">
            Map {isFromSource ? 'Target' : 'Source'} Rows
          </Typography>
          {Array.isArray(selectedRows) && selectedRows.length > 0 && (
            <Chip
              label={`${selectedRows.length} selected`}
              color="primary"
              size="small"
            />
          )}
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Box mb={2}>
          <TextField
            fullWidth
            placeholder="Search rows..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        
        <Box sx={{ height: 400, width: '100%' }}>
          <DataGridPremium
            rows={filteredData}
            columns={columns}
            checkboxSelection
            rowSelectionModel={selectedRows as any}
            onRowSelectionModelChange={(newSelection) => setSelectedRows(newSelection)}
            disableRowSelectionOnClick
            getRowId={(row) => row.id}
            slots={{
              toolbar: CustomToolbar,
            }}
            showToolbar
          />
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          disabled={selectedRows.ids.size === 0}
        >
          Map Selected ({selectedRows.ids.size})
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MappingModal;

