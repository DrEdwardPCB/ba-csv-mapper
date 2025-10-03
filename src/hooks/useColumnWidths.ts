import { useState, useEffect, useCallback } from 'react';

interface ColumnWidths {
  [key: string]: number;
}

const STORAGE_KEY_PREFIX = 'column-widths-';

export const useColumnWidths = (gridId: string, defaultWidth: number = 150) => {
  const [columnWidths, setColumnWidths] = useState<ColumnWidths>({});

  // Load column widths from sessionStorage on mount
  useEffect(() => {
    const storageKey = `${STORAGE_KEY_PREFIX}${gridId}`;
    try {
      const saved = sessionStorage.getItem(storageKey);
      if (saved) {
        setColumnWidths(JSON.parse(saved));
      }
    } catch (error) {
      console.warn('Failed to load column widths from sessionStorage:', error);
    }
  }, [gridId]);

  // Save column widths to sessionStorage whenever they change
  useEffect(() => {
    const storageKey = `${STORAGE_KEY_PREFIX}${gridId}`;
    try {
      sessionStorage.setItem(storageKey, JSON.stringify(columnWidths));
    } catch (error) {
      console.warn('Failed to save column widths to sessionStorage:', error);
    }
  }, [columnWidths, gridId]);

  // Get width for a specific column
  const getColumnWidth = useCallback((field: string): number => {
    return columnWidths[field] || defaultWidth;
  }, [columnWidths, defaultWidth]);

  // Update width for a specific column
  const updateColumnWidth = useCallback((field: string, width: number) => {
    setColumnWidths(prev => ({
      ...prev,
      [field]: width
    }));
  }, []);

  // Handle column width change from DataGrid
  const handleColumnWidthChange = useCallback((field: string, width: number) => {
    updateColumnWidth(field, width);
  }, [updateColumnWidth]);

  // Reset all column widths to default
  const resetColumnWidths = useCallback(() => {
    setColumnWidths({});
  }, []);

  return {
    columnWidths,
    getColumnWidth,
    updateColumnWidth,
    handleColumnWidthChange,
    resetColumnWidths
  };
};
