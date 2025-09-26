export interface CSVRow {
  [key: string]: string | number;
  id: string;
}

export interface Mapping {
  sourceId: string;
  targetId: string;
  remarks?: string;
}

export interface MappedRow {
  id: string;
  sourceData: CSVRow | null;
  targetData: CSVRow | null;
  remarks?: string;
  mappingId?: string;
}

export interface PanelData {
  data: CSVRow[];
  columns: string[];
  filename?: string;
}

export interface MappingModalProps {
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

