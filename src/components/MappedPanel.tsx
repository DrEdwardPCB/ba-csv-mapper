import React, { useState, useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Tooltip,
} from '@mui/material';
import {
  Download as DownloadIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { DataGridPremium, GridColDef, GridActionsCellItem } from '@mui/x-data-grid-premium';
import { MappedRow } from '../types';
import { downloadCSV } from '../utils/csvParser';
import CustomToolbar from './CustomToolbar';

interface MappedPanelProps {
  data: MappedRow[];
  onUnmap: (mappingId: string) => void;
  onUpdateRemarks: (mappingId: string, remarks: string) => void;
  sourceColumns: string[];
  targetColumns: string[];
}

const MappedPanel: React.FC<MappedPanelProps> = ({
  data,
  onUnmap,
  onUpdateRemarks,
  sourceColumns,
  targetColumns,
}) => {
  const [editingRemarks, setEditingRemarks] = useState<string | null>(null);
  const [remarksValue, setRemarksValue] = useState('');

  const columns: GridColDef[] = useMemo(() => {
    const cols: GridColDef[] = [];

    // Source columns
    sourceColumns.forEach((col) => {
      cols.push({
        field: `source_${col}`,
        headerName: `source_${col}`,
        width: 150,
        renderCell: (params) => (
          <Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {String(params.value || '')}
          </Box>
        ),
      });
    });

    // Target columns
    targetColumns.forEach((col) => {
      cols.push({
        field: `target_${col}`,
        headerName: `target_${col}`,
        width: 150,
        renderCell: (params) => (
          <Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {String(params.value || '')}
          </Box>
        ),
      });
    });

    // Remarks column
    cols.push({
      field: 'remarks',
      headerName: 'Remarks',
      width: 200,
      renderCell: (params) => {
        const isEditing = editingRemarks === params.id;
        return isEditing ? (
          <TextField
            size="small"
            value={remarksValue}
            onChange={(e) => setRemarksValue(e.target.value)}
            onBlur={() => {
              onUpdateRemarks(params.row.mappingId || params.id as string, remarksValue);
              setEditingRemarks(null);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onUpdateRemarks(params.row.mappingId || params.id as string, remarksValue);
                setEditingRemarks(null);
              }
              if (e.key === 'Escape') {
                setEditingRemarks(null);
                setRemarksValue(params.row.remarks || '');
              }
            }}
            autoFocus
            fullWidth
          />
        ) : (
          <Box
            sx={{
              width: '100%',
              cursor: 'pointer',
              p: 0.5,
              borderRadius: 1,
              '&:hover': { bgcolor: 'action.hover' },
            }}
            onClick={() => {
              setEditingRemarks(params.id as string);
              setRemarksValue(params.row.remarks || '');
            }}
          >
            {params.value || 'Click to add remarks'}
          </Box>
        );
      },
    });

    // Actions column
    cols.push({
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      getActions: (params) => [
        <GridActionsCellItem
          icon={
            <Tooltip title="Unmap">
              <DeleteIcon />
            </Tooltip>
          }
          label="Unmap"
          onClick={() => onUnmap(params.row.mappingId || params.id as string)}
        />,
      ],
    });

    return cols;
  }, [sourceColumns, targetColumns, editingRemarks, remarksValue, onUnmap, onUpdateRemarks]);

  const handleDownload = () => {
    const exportData = data.map((row) => {
      const exportRow: any = { id: row.id };
      
      // Add source data
      if (row.sourceData) {
        sourceColumns.forEach((col) => {
          exportRow[`source_${col}`] = row.sourceData![col] || '';
        });
      } else {
        sourceColumns.forEach((col) => {
          exportRow[`source_${col}`] = '';
        });
      }
      
      // Add target data
      if (row.targetData) {
        targetColumns.forEach((col) => {
          exportRow[`target_${col}`] = row.targetData![col] || '';
        });
      } else {
        targetColumns.forEach((col) => {
          exportRow[`target_${col}`] = '';
        });
      }
      
      exportRow.remarks = row.remarks || '';
      return exportRow;
    });
    
    downloadCSV(exportData, 'mapped-data.csv');
  };

  // Transform data for display
  const transformedData = data.map((row) => {
    const transformedRow: any = { 
      id: row.id, 
      remarks: row.remarks || '',
      mappingId: row.mappingId 
    };
    
    // Add source data
    if (row.sourceData) {
      sourceColumns.forEach((col) => {
        transformedRow[`source_${col}`] = row.sourceData![col] || '';
      });
    } else {
      sourceColumns.forEach((col) => {
        transformedRow[`source_${col}`] = '';
      });
    }
    
    // Add target data
    if (row.targetData) {
      targetColumns.forEach((col) => {
        transformedRow[`target_${col}`] = row.targetData![col] || '';
      });
    } else {
      targetColumns.forEach((col) => {
        transformedRow[`target_${col}`] = '';
      });
    }
    
    return transformedRow;
  });

  return (
    <Paper elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box
        sx={{
          p: 2,
          borderBottom: '1px solid #e0e0e0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6">Mapped Data</Typography>
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={handleDownload}
          disabled={data.length === 0}
        >
          Download CSV
        </Button>
      </Box>

      <Box sx={{ flex: 1, p: 1 }}>
        <DataGridPremium
          rows={transformedData}
          columns={columns}
          getRowId={(row) => row.id}
          disableRowSelectionOnClick
          sx={{
            '& .MuiDataGrid-cell:focus': {
              outline: 'none',
            },
          }}
          slots={{
            toolbar: CustomToolbar,
          }}
          showToolbar
        />
      </Box>
    </Paper>
  );
};

export default MappedPanel;
