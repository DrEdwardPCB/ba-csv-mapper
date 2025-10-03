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
import { CSVRow, MappedRow } from '../types';
import CustomToolbar from './CustomToolbar';
import { useColumnWidths } from '../hooks/useColumnWidths';
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
  mappedData: MappedRow[];
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
  mappedData,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>({type:'include', ids:new Set([])});
  
  // Column width management for mapping modal
  const modalColumnWidths = useColumnWidths('mapping-modal-grid');

  const displayData = isFromSource ? targetData : sourceData;
  const displayColumns = isFromSource ? targetColumns : sourceColumns;

  // Mapping detection logic
  const isRowMapped = (rowId: string) => {
    if (isFromSource) {
      // When mapping from source, check if target row is already mapped
      return mappedData.some(row => 
        row.targetData?.id === rowId && row.sourceData !== null
      );
    } else {
      // When mapping from target, check if source row is already mapped
      return mappedData.some(row => 
        row.sourceData?.id === rowId && row.targetData !== null
      );
    }
  };

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
    width: modalColumnWidths.getColumnWidth(col),
    renderCell: (params) => {
      const isMapped = isRowMapped(params.row.id);
      return (
        <Box sx={{ 
          overflow: 'hidden', 
          textOverflow: 'ellipsis',
          backgroundColor: isMapped ? 'rgba(76, 175, 80, 0.1)' : 'transparent',
          padding: '4px 8px',
          borderRadius: '4px',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center'
        }}>
          {String(params.value || '')}
        </Box>
      );
    },
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
            onColumnWidthChange={(params) => {
              modalColumnWidths.handleColumnWidthChange(params.colDef.field, params.width);
            }}
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

