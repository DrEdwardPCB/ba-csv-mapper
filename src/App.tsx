import React, { useState, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Upload as UploadIcon } from '@mui/icons-material';
import { DataGridPremium, GridColDef } from '@mui/x-data-grid-premium';
import { MappedRow, PanelData } from './types';
import { parseCSV } from './utils/csvParser';
import MappedPanel from './components/MappedPanel';
import MappingModal from './components/MappingModal';
import CustomToolbar from './components/CustomToolbar';
import { useColumnWidths } from './hooks/useColumnWidths';

const App: React.FC = () => {
  const [sourceData, setSourceData] = useState<PanelData>({ data: [], columns: [] });
  const [targetData, setTargetData] = useState<PanelData>({ data: [], columns: [] });
  const [mappedData, setMappedData] = useState<MappedRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mappingModal, setMappingModal] = useState<{
    open: boolean;
    isFromSource: boolean;
    selectedRowId?: string;
  }>({ open: false, isFromSource: false });

  // Column width management for different grids
  const sourceColumnWidths = useColumnWidths('source-grid');
  const targetColumnWidths = useColumnWidths('target-grid');

  // Generate initial full outer join when data changes
  const generateInitialMappedData = useCallback(() => {
    const mapped: MappedRow[] = [];
    
    // Add all source rows
    sourceData.data.forEach((sourceRow) => {
      mapped.push({
        id: `source-${sourceRow.id}`,
        sourceData: sourceRow,
        targetData: null,
        mappingId: `source-${sourceRow.id}`,
      });
    });
    
    // Add all target rows
    targetData.data.forEach((targetRow) => {
      mapped.push({
        id: `target-${targetRow.id}`,
        sourceData: null,
        targetData: targetRow,
        mappingId: `target-${targetRow.id}`,
      });
    });
    
    return mapped;
  }, [sourceData.data, targetData.data]);

  // Update mapped data when source or target data changes
  React.useEffect(() => {
    if (sourceData.data.length > 0 || targetData.data.length > 0) {
      setMappedData(generateInitialMappedData());
    }
  }, [generateInitialMappedData, sourceData.data.length, targetData.data.length]);

  const handleFileUpload = useCallback(async (file: File, isSource: boolean) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, columns } = await parseCSV(file);
      const panelData: PanelData = { data, columns, filename: file.name };
      
      if (isSource) {
        setSourceData(panelData);
      } else {
        setTargetData(panelData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse CSV file');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSourceFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file, true);
    }
  };

  const handleTargetFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file, false);
    }
  };

  const handleMapRows = (isFromSource: boolean, selectedRowId?: string) => {
    setMappingModal({ open: true, isFromSource, selectedRowId });
  };

  const handleMappingConfirm = (selectedIds: string[]) => {
    const { isFromSource, selectedRowId } = mappingModal;
    
    setMappedData(prev => {
      let newMappedData = [...prev];
      
      if (isFromSource && selectedRowId) {
        // Map source row to multiple target rows
        const sourceRow = sourceData.data.find(row => row.id === selectedRowId);
        if (sourceRow) {
          // Remove the original source-only row
          newMappedData = newMappedData.filter(row => row.id !== `source-${selectedRowId}`);
          
          // Add new mapped rows
          selectedIds.forEach(targetId => {
            const targetRow = targetData.data.find(row => row.id === targetId);
            if (targetRow) {
              // Remove the original target-only row
              newMappedData = newMappedData.filter(row => row.id !== `target-${targetId}`);
              
              // Add the mapped row
              newMappedData.push({
                id: `mapping-${selectedRowId}-${targetId}`,
                sourceData: sourceRow,
                targetData: targetRow,
                mappingId: `mapping-${selectedRowId}-${targetId}`,
              });
            }
          });
        }
      } else if (!isFromSource && selectedRowId) {
        // Map target row to multiple source rows
        const targetRow = targetData.data.find(row => row.id === selectedRowId);
        if (targetRow) {
          // Remove the original target-only row
          newMappedData = newMappedData.filter(row => row.id !== `target-${selectedRowId}`);
          
          // Add new mapped rows
          selectedIds.forEach(sourceId => {
            const sourceRow = sourceData.data.find(row => row.id === sourceId);
            if (sourceRow) {
              // Remove the original source-only row
              newMappedData = newMappedData.filter(row => row.id !== `source-${sourceId}`);
              
              // Add the mapped row
              newMappedData.push({
                id: `mapping-${sourceId}-${selectedRowId}`,
                sourceData: sourceRow,
                targetData: targetRow,
                mappingId: `mapping-${sourceId}-${selectedRowId}`,
              });
            }
          });
        }
      }
      
      return newMappedData;
    });
    
    setMappingModal({ open: false, isFromSource: false });
  };

  const handleUnmap = (mappingId: string) => {
    setMappedData(prev => {
      const mappedRow = prev.find(row => row.mappingId === mappingId);
      if (!mappedRow) return prev;
      
      let newMappedData = prev.filter(row => row.mappingId !== mappingId);
      
      // Restore individual source row if it exists
      if (mappedRow.sourceData) {
        const sourceId = mappedRow.sourceData.id;
        const sourceExists = newMappedData.some(row => row.id === `source-${sourceId}`);
        if (!sourceExists) {
          newMappedData.push({
            id: `source-${sourceId}`,
            sourceData: mappedRow.sourceData,
            targetData: null,
            mappingId: `source-${sourceId}`,
          });
        }
      }
      
      // Restore individual target row if it exists
      if (mappedRow.targetData) {
        const targetId = mappedRow.targetData.id;
        const targetExists = newMappedData.some(row => row.id === `target-${targetId}`);
        if (!targetExists) {
          newMappedData.push({
            id: `target-${targetId}`,
            sourceData: null,
            targetData: mappedRow.targetData,
            mappingId: `target-${targetId}`,
          });
        }
      }
      
      return newMappedData;
    });
  };

  const handleUpdateRemarks = (mappingId: string, remarks: string) => {
    setMappedData(prev => 
      prev.map(row => 
        row.mappingId === mappingId 
          ? { ...row, remarks }
          : row
      )
    );
  };

  // Helper functions to check if a row is mapped
  const isSourceRowMapped = useCallback((sourceId: string) => {
    return mappedData.some(row => 
      row.sourceData?.id === sourceId && row.targetData !== null
    );
  }, [mappedData]);

  const isTargetRowMapped = useCallback((targetId: string) => {
    return mappedData.some(row => 
      row.targetData?.id === targetId && row.sourceData !== null
    );
  }, [mappedData]);

  const sourceColumns: GridColDef[] = sourceData.columns.map(col => ({
    field: col,
    headerName: col,
    width: sourceColumnWidths.getColumnWidth(col),
    renderCell: (params) => {
      const isMapped = isSourceRowMapped(params.row.id);
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

  const targetColumns: GridColDef[] = targetData.columns.map(col => ({
    field: col,
    headerName: col,
    width: targetColumnWidths.getColumnWidth(col),
    renderCell: (params) => {
      const isMapped = isTargetRowMapped(params.row.id);
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

  return (
    <Container maxWidth={false} sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        CSV Mapping Tool
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Source and Target Data Panels */}
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          {/* Source Data Panel */}
          <Box sx={{ flex: '1 1 400px', minWidth: '400px', overflow: 'scroll' }}>
            <Paper elevation={2} sx={{ height: 500, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
              <Typography variant="h6">Source Data</Typography>
              <Button
                variant="outlined"
                component="label"
                startIcon={<UploadIcon />}
                sx={{ mt: 1 }}
                disabled={loading}
              >
                Upload Source CSV
                <input
                  type="file"
                  accept=".csv"
                  hidden
                  onChange={handleSourceFileChange}
                />
              </Button>
            </Box>
            
            <Box sx={{ flex: 1, p: 1 }}>
              {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                  <CircularProgress />
                </Box>
              ) : sourceData.data.length > 0 ? (
                <DataGridPremium
                  rows={sourceData.data}
                  columns={[
                    ...sourceColumns,
                    {
                      field: 'actions',
                      headerName: 'Actions',
                      width: sourceColumnWidths.getColumnWidth('actions'),
                      renderCell: (params) => {
                        const isMapped = isSourceRowMapped(params.row.id);
                        return (
                          <Box sx={{ 
                            backgroundColor: isMapped ? 'rgba(76, 175, 80, 0.1)' : 'transparent',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center'
                          }}>
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => handleMapRows(true, params.id as string)}
                            >
                              Map
                            </Button>
                          </Box>
                        );
                      },
                    },
                  ]}
                  getRowId={(row) => row.id}
                  disableRowSelectionOnClick
                  slots={{
                    toolbar: CustomToolbar,
                  }}
                  showToolbar
                  onColumnWidthChange={(params) => {
                    sourceColumnWidths.handleColumnWidthChange(params.colDef.field, params.width);
                  }}
                />
              ) : (
                <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                  <Typography color="text.secondary">
                    Upload a CSV file to get started
                  </Typography>
                </Box>
              )}
            </Box>
            </Paper>
          </Box>

        {/* Target Data Panel */}
        <Box sx={{ flex: '1 1 400px', minWidth: '400px', overflow: 'scroll' }}>
          <Paper elevation={2} sx={{ height: 500, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
              <Typography variant="h6">Target Data</Typography>
              <Button
                variant="outlined"
                component="label"
                startIcon={<UploadIcon />}
                sx={{ mt: 1 }}
                disabled={loading}
              >
                Upload Target CSV
                <input
                  type="file"
                  accept=".csv"
                  hidden
                  onChange={handleTargetFileChange}
                />
              </Button>
            </Box>
            
            <Box sx={{ flex: 1, p: 1 }}>
              {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                  <CircularProgress />
                </Box>
              ) : targetData.data.length > 0 ? (
                <DataGridPremium
                  rows={targetData.data}
                  columns={[
                    ...targetColumns,
                    {
                      field: 'actions',
                      headerName: 'Actions',
                      width: targetColumnWidths.getColumnWidth('actions'),
                      renderCell: (params) => {
                        const isMapped = isTargetRowMapped(params.row.id);
                        return (
                          <Box sx={{ 
                            backgroundColor: isMapped ? 'rgba(76, 175, 80, 0.1)' : 'transparent',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center'
                          }}>
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => handleMapRows(false, params.id as string)}
                            >
                              Map
                            </Button>
                          </Box>
                        );
                      },
                    },
                  ]}
                  getRowId={(row) => row.id}
                  disableRowSelectionOnClick
                  slots={{
                    toolbar: CustomToolbar,
                  }}
                  showToolbar
                  onColumnWidthChange={(params) => {
                    targetColumnWidths.handleColumnWidthChange(params.colDef.field, params.width);
                  }}
                />
              ) : (
                <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                  <Typography color="text.secondary">
                    Upload a CSV file to get started
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Box>
        </Box>

        {/* Mapped Data Panel */}
        <Box>
          <MappedPanel
            data={mappedData}
            onUnmap={handleUnmap}
            onUpdateRemarks={handleUpdateRemarks}
            sourceColumns={sourceData.columns}
            targetColumns={targetData.columns}
          />
        </Box>
      </Box>

      {/* Mapping Modal */}
      <MappingModal
        open={mappingModal.open}
        onClose={() => setMappingModal({ open: false, isFromSource: false })}
        onConfirm={handleMappingConfirm}
        sourceData={sourceData.data}
        targetData={targetData.data}
        sourceColumns={sourceData.columns}
        targetColumns={targetData.columns}
        isFromSource={mappingModal.isFromSource}
        selectedRowId={mappingModal.selectedRowId}
        mappedData={mappedData}
      />
    </Container>
  );
};

export default App;
