/**
 * CSV Export Utilities
 * 
 * This file contains utility functions to format data for CSV export
 * that matches exactly what is shown in the UI tables, including:
 * - Same column headers and structure
 * - Same data formatting (numbers, percentages, currencies)
 * - Same color indicators (red for negative, green for positive)
 * - Same row grouping and totals
 */

export interface CSVExportOptions {
  includeColors?: boolean;
  includeHeaders?: boolean;
  sectionType: 'summary' | 'total-brands' | 'customers' | 'trend' | 'sales-to-fgp';
}

/**
 * Format number for CSV export (matches UI formatting)
 */
export const formatNumberForCSV = (num: number | undefined | null, isPercent = false): string => {
  if (num === undefined || num === null || isNaN(num)) {
    return isPercent ? '0.0%' : '0';
  }
  
  if (isPercent) {
    return `${num.toFixed(1)}%`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(0)}`;
  }
  return num.toFixed(0);
};

/**
 * Format variance for CSV export (matches UI formatting with color indicators)
 */
export const formatVarianceForCSV = (num: number | undefined | null, isPercent = false, includeColor = true): string => {
  if (num === undefined || num === null || isNaN(num)) {
    return isPercent ? '0.0%' : '0';
  }
  
  let formatted: string;
  if (isPercent) {
    formatted = num >= 0 ? `${num.toFixed(1)}%` : `(${Math.abs(num).toFixed(1)}%)`;
  } else {
    formatted = num >= 0 ? num.toFixed(0) : `(${Math.abs(num).toFixed(0)})`;
  }
  
  // Add color indicator for CSV (Excel will interpret these)
  if (includeColor && num < 0) {
    return `🔴 ${formatted}`; // Red circle for negative
  } else if (includeColor && num > 0) {
    return `🟢 ${formatted}`; // Green circle for positive
  }
  
  return formatted;
};

/**
 * Generate CSV headers for Summary table
 */
export const generateSummaryCSVHeaders = (periodLabel: string = 'YTD'): string[] => {
  return [
    'Name',
    // Cases columns
    `Cases ${periodLabel}`, 'Cases LY', 'Cases LY Var', 'Cases LY Var %',
    // gSales columns
    `gSales ${periodLabel} (€'000)`, 'gSales LY (€\'000)', 'gSales LY Var (€\'000)', 'gSales LY Var %',
    // fGP columns
    `fGP ${periodLabel} (€'000)`, 'fGP LY (€\'000)', 'fGP LY Var (€\'000)', 'fGP LY Var %',
    // fGP % columns
    `fGP % ${periodLabel}`, 'fGP % LY Var',
    // fGP FY24 columns
    `fGP FY24 ${periodLabel} (€\'000)`, 'fGP FY24 CY v LY %'
  ];
};

/**
 * Generate CSV headers for Trend by Month table
 */
export const generateTrendCSVHeaders = (): string[] => {
  return [
    'Month',
    // Cases columns
    'Cases 2025 No.', 'Cases 2024 No.', 'Cases Var No.', 'Cases Var %',
    // gSales columns
    'gSales 2025 (€\'000)', 'gSales 2024 (€\'000)', 'gSales Var (€\'000)', 'gSales Var %',
    // fGP columns
    'fGP 2025 (€\'000)', 'fGP 2024 (€\'000)', 'fGP Var (€\'000)', 'fGP Var %',
    // fGP % columns
    'fGP % 2025', 'fGP % 2024', 'fGP % Var',
    // 2024 Full Month columns
    '2024 Full Month gSales', '2024 Full Month fGP', '2024 Full Month fGP %'
  ];
};

/**
 * Generate CSV headers for Sales to FGP table
 */
export const generateSalesToFGPCSVHeaders = (currentYear: number = 2025, previousYear: number = 2024): string[] => {
  return [
    'Item',
    // Current Year columns
    `${currentYear} No.`, `${currentYear} €\'000`, `${currentYear} % sales`,
    // Previous Year columns
    `${previousYear} No.`, `${previousYear} €\'000`, `${previousYear} % sales`,
    // Variance columns
    'Variance No.', 'Variance €\'000', 'Variance %',
    // Var % Sales
    'Var % Sales'
  ];
};

/**
 * Convert SummaryRowData to CSV row
 */
export const summaryRowToCSV = (item: any, periodLabel: string = 'YTD', includeColors = true): string[] => {
  return [
    item.name || '',
    // Cases columns
    formatNumberForCSV(item.cases?.ytd),
    formatNumberForCSV(item.cases?.ly),
    formatVarianceForCSV(item.cases?.lyVar, false, includeColors),
    formatVarianceForCSV(item.cases?.lyVarPercent, true, includeColors),
    // gSales columns
    formatNumberForCSV(item.gSales?.ytd),
    formatNumberForCSV(item.gSales?.ly),
    formatVarianceForCSV(item.gSales?.lyVar, false, includeColors),
    formatVarianceForCSV(item.gSales?.lyVarPercent, true, includeColors),
    // fGP columns
    formatNumberForCSV(item.fGP?.ytd),
    formatNumberForCSV(item.fGP?.ly),
    formatVarianceForCSV(item.fGP?.lyVar, false, includeColors),
    formatVarianceForCSV(item.fGP?.lyVarPercent, true, includeColors),
    // fGP % columns
    formatNumberForCSV(item.fGPPercent?.ytd, true),
    formatVarianceForCSV(item.fGPPercent?.lyVar, true, includeColors),
    // fGP FY24 columns
    formatNumberForCSV(item.fGPFY24?.ytd),
    formatVarianceForCSV(item.fGPFY24?.cyVLy, true, includeColors)
  ];
};

/**
 * Convert Trend data to CSV row
 */
export const trendRowToCSV = (row: any, includeColors = true): string[] => {
  return [
    row.name || '',
    // Cases columns
    formatNumberForCSV(row.cases?.ytd || 0),
    formatNumberForCSV(row.cases?.ly || 0),
    formatVarianceForCSV(row.cases?.lyVar || 0, false, includeColors),
    formatVarianceForCSV(row.cases?.lyVarPercent || 0, true, includeColors),
    // gSales columns
    formatNumberForCSV(row.gSales?.ytd || 0),
    formatNumberForCSV(row.gSales?.ly || 0),
    formatVarianceForCSV(row.gSales?.lyVar || 0, false, includeColors),
    formatVarianceForCSV(row.gSales?.lyVarPercent || 0, true, includeColors),
    // fGP columns
    formatNumberForCSV(row.fGP?.ytd || 0),
    formatNumberForCSV(row.fGP?.ly || 0),
    formatVarianceForCSV(row.fGP?.lyVar || 0, false, includeColors),
    formatVarianceForCSV(row.fGP?.lyVarPercent || 0, true, includeColors),
    // fGP % columns
    formatNumberForCSV(row.fGPPercent?.ytd || 0, true),
    formatNumberForCSV(row.fGPPercent?.ly || 0, true),
    formatVarianceForCSV(row.fGPPercent?.lyVar || 0, true, includeColors),
    // 2024 Full Month columns
    formatNumberForCSV(row.fullMonth2024?.gSales || 0),
    formatNumberForCSV(row.fullMonth2024?.fGP || 0),
    formatNumberForCSV(row.fullMonth2024?.fGPPercent || 0, true)
  ];
};

/**
 * Convert Sales to FGP data to CSV row
 */
export const salesToFGPRowToCSV = (row: any, includeColors = true): string[] => {
  return [
    row.name || '',
    // Current Year columns
    row.name === 'Cases' ? formatNumberForCSV(row.valueCurrent) : '',
    row.name !== 'Cases' ? formatNumberForCSV(row.valueCurrent) : '',
    formatNumberForCSV(row.percentSalesCurrent, true),
    // Previous Year columns
    row.name === 'Cases' ? formatNumberForCSV(row.valuePrevious) : '',
    row.name !== 'Cases' ? formatNumberForCSV(row.valuePrevious) : '',
    formatNumberForCSV(row.percentSalesPrevious, true),
    // Variance columns
    row.name === 'Cases' ? formatVarianceForCSV(row.variance, false, includeColors) : '',
    row.name !== 'Cases' ? formatVarianceForCSV(row.variance, false, includeColors) : '',
    formatVarianceForCSV(row.variancePercent, true, includeColors),
    // Var % Sales
    formatVarianceForCSV(row.percentSalesVar, true, includeColors)
  ];
};

/**
 * Escape CSV field (handle commas, quotes, newlines)
 */
export const escapeCSVField = (field: string): string => {
  if (field.includes(',') || field.includes('"') || field.includes('\n')) {
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
};

/**
 * Convert array of strings to CSV row
 */
export const arrayToCSVRow = (row: string[]): string => {
  return row.map(escapeCSVField).join(',');
};

/**
 * Generate complete CSV content for a section
 */
export const generateCSVContent = (
  data: any[],
  sectionType: 'summary' | 'total-brands' | 'customers' | 'trend' | 'sales-to-fgp',
  options: CSVExportOptions = { sectionType }
): string => {
  const { includeHeaders = true, includeColors = true } = options;
  const rows: string[] = [];
  
  // Add headers if requested
  if (includeHeaders) {
    let headers: string[] = [];
    
    switch (sectionType) {
      case 'summary':
      case 'total-brands':
      case 'customers':
        headers = generateSummaryCSVHeaders();
        break;
      case 'trend':
        headers = generateTrendCSVHeaders();
        break;
      case 'sales-to-fgp':
        headers = generateSalesToFGPCSVHeaders();
        break;
    }
    
    rows.push(arrayToCSVRow(headers));
  }
  
  // Add data rows
  data.forEach(item => {
    let csvRow: string[] = [];
    
    switch (sectionType) {
      case 'summary':
      case 'total-brands':
      case 'customers':
        csvRow = summaryRowToCSV(item, undefined, includeColors);
        break;
      case 'trend':
        csvRow = trendRowToCSV(item, includeColors);
        break;
      case 'sales-to-fgp':
        csvRow = salesToFGPRowToCSV(item, includeColors);
        break;
    }
    
    rows.push(arrayToCSVRow(csvRow));
  });
  
  return rows.join('\n');
};
