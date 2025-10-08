'use client';

import { useState, useEffect } from 'react';
import DashboardHeader from '../DashboardHeader';
import CollapsibleSection from '../components/CollapsibleSection';
import SectionFilters from '../components/SectionFilters';
import TotalBrandsFilters from '../components/TotalBrandsFilters';
import CustomerFilters from '../components/CustomerFilters';
import SummaryTable from '../components/SummaryTable';
import TrendTable from '../components/TrendTable';
import SalesToFGPTable from '../components/SalesToFGPTable';
import FoodBrandsTable from '../components/FoodBrandsTable';
import FoodBrandsDetailsTable from '../components/FoodBrandsDetailsTable';
import HouseholdBrandsTable from '../components/HouseholdBrandsTable';
import HouseholdBrandsDetailsTable from '../components/HouseholdBrandsDetailsTable';
import { dashboardAPI } from '../../services/api';
import { SummaryRowData } from '../../services/summaryCalculationService';

// CSV Generation Functions
const formatNumberForCSV = (num: number | undefined | null, isPercent = false): string => {
  if (num === undefined || num === null || isNaN(num)) {
    return isPercent ? '0.0%' : '0';
  }
  
  if (isPercent) {
    return `${num.toFixed(1)}%`;
  }
  
  // Format numbers with thousands separators and round to whole numbers like in UI
  return new Intl.NumberFormat('en-US').format(Math.round(num));
};

const formatVarianceForCSV = (num: number | undefined | null, isPercent = false): string => {
  if (num === undefined || num === null || isNaN(num)) {
    return isPercent ? '0.0%' : '0';
  }
  
  let formatted: string;
  if (isPercent) {
    formatted = num >= 0 ? `${num.toFixed(1)}%` : `(${Math.abs(num).toFixed(1)}%)`;
  } else {
    // Format numbers with thousands separators and round to whole numbers
    const absNum = Math.abs(num);
    const formattedNum = new Intl.NumberFormat('en-US').format(Math.round(absNum));
    formatted = num >= 0 ? formattedNum : `(${formattedNum})`;
  }
  
  // Return just the formatted number without color indicators for CSV
  // Excel/CSV viewers will handle the formatting
  return formatted;
};

const escapeCSVField = (field: string): string => {
  if (field.includes(',') || field.includes('"') || field.includes('\n')) {
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
};

const arrayToCSVRow = (row: string[]): string => {
  return row.map(escapeCSVField).join(',');
};

const generateSummaryTableCSV = (data: SummaryRowData[], title: string, periodLabel: string): string => {
  const headers = [
    title,
    // Cases columns
    `Cases ${periodLabel}`, 'Cases LY', 'Cases LY Var', 'Cases LY Var %',
    // gSales columns
    `gSales ${periodLabel} (€'000)`, "gSales LY (€'000)", "gSales LY Var (€'000)", 'gSales LY Var %',
    // fGP columns
    `fGP ${periodLabel} (€'000)`, "fGP LY (€'000)", "fGP LY Var (€'000)", 'fGP LY Var %',
    // fGP % columns
    `fGP % ${periodLabel}`, 'fGP % LY Var',
    // fGP FY24 columns
    `fGP FY24 ${periodLabel} (€'000)`, 'fGP FY24 CY v LY %'
  ];

  const rows = [arrayToCSVRow(headers)];

  data.forEach(item => {
    const row = [
      item.name || '',
      // Cases columns
      formatNumberForCSV(item.cases?.ytd),
      formatNumberForCSV(item.cases?.ly),
      formatVarianceForCSV(item.cases?.lyVar, false),
      formatVarianceForCSV(item.cases?.lyVarPercent, true),
      // gSales columns
      formatNumberForCSV(item.gSales?.ytd),
      formatNumberForCSV(item.gSales?.ly),
      formatVarianceForCSV(item.gSales?.lyVar, false),
      formatVarianceForCSV(item.gSales?.lyVarPercent, true),
      // fGP columns
      formatNumberForCSV(item.fGP?.ytd),
      formatNumberForCSV(item.fGP?.ly),
      formatVarianceForCSV(item.fGP?.lyVar, false),
      formatVarianceForCSV(item.fGP?.lyVarPercent, true),
      // fGP % columns
      formatNumberForCSV(item.fGPPercent?.ytd, true),
      formatVarianceForCSV(item.fGPPercent?.lyVar, true),
      // fGP FY24 columns
      formatNumberForCSV(item.fGPFY24?.ytd),
      formatVarianceForCSV(item.fGPFY24?.cyVLy, true)
    ];
    rows.push(arrayToCSVRow(row));
  });

  return rows.join('\n');
};

const generateTrendTableCSV = (data: any[]): string => {
  const headers = [
    'Month',
    // Cases columns
    'Cases 2025 No.', 'Cases 2024 No.', 'Cases Var No.', 'Cases Var %',
    // gSales columns
    "gSales 2025 (€'000)", "gSales 2024 (€'000)", "gSales Var (€'000)", 'gSales Var %',
    // fGP columns
    "fGP 2025 (€'000)", "fGP 2024 (€'000)", "fGP Var (€'000)", 'fGP Var %',
    // fGP % columns
    'fGP % 2025', 'fGP % 2024', 'fGP % Var',
    // 2024 Full Month columns
    '2024 Full Month gSales', '2024 Full Month fGP', '2024 Full Month fGP %'
  ];

  const rows = [arrayToCSVRow(headers)];

  data.forEach(row => {
    const csvRow = [
      row.name || '',
      // Cases columns
      formatNumberForCSV(row.cases?.ytd || 0),
      formatNumberForCSV(row.cases?.ly || 0),
      formatVarianceForCSV(row.cases?.lyVar || 0, false),
      formatVarianceForCSV(row.cases?.lyVarPercent || 0, true),
      // gSales columns
      formatNumberForCSV(row.gSales?.ytd || 0),
      formatNumberForCSV(row.gSales?.ly || 0),
      formatVarianceForCSV(row.gSales?.lyVar || 0, false),
      formatVarianceForCSV(row.gSales?.lyVarPercent || 0, true),
      // fGP columns
      formatNumberForCSV(row.fGP?.ytd || 0),
      formatNumberForCSV(row.fGP?.ly || 0),
      formatVarianceForCSV(row.fGP?.lyVar || 0, false),
      formatVarianceForCSV(row.fGP?.lyVarPercent || 0, true),
      // fGP % columns
      formatNumberForCSV(row.fGPPercent?.ytd || 0, true),
      formatNumberForCSV(row.fGPPercent?.ly || 0, true),
      formatVarianceForCSV(row.fGPPercent?.lyVar || 0, true),
      // 2024 Full Month columns
      formatNumberForCSV(row.fullMonth2024?.gSales || 0),
      formatNumberForCSV(row.fullMonth2024?.fGP || 0),
      formatNumberForCSV(row.fullMonth2024?.fGPPercent || 0, true)
    ];
    rows.push(arrayToCSVRow(csvRow));
  });

  return rows.join('\n');
};

const generateSalesToFGPTableCSV = (data: any[], currentYear: number, previousYear: number): string => {
  const headers = [
    'Item',
    // Current Year columns
    `${currentYear} No.`, `${currentYear} €'000`, `${currentYear} % sales`,
    // Previous Year columns
    `${previousYear} No.`, `${previousYear} €'000`, `${previousYear} % sales`,
    // Variance columns
    'Variance N', "Variance €'000", 'Variance %',
    // Var % Sales
    'Var % Sales'
  ];

  const rows = [arrayToCSVRow(headers)];

  data.forEach(row => {
    const csvRow = [
      row.name || '',
      // Current Year columns - Cases shows in No. column, others in €'000 column
      row.name === 'Cases' ? formatNumberForCSV(row.valueCurrent) : '',
      row.name !== 'Cases' ? formatNumberForCSV(row.valueCurrent) : '',
      formatNumberForCSV(row.percentSalesCurrent, true),
      // Previous Year columns - Cases shows in No. column, others in €'000 column
      row.name === 'Cases' ? formatNumberForCSV(row.valuePrevious) : '',
      row.name !== 'Cases' ? formatNumberForCSV(row.valuePrevious) : '',
      formatNumberForCSV(row.percentSalesPrevious, true),
      // Variance columns - Cases shows in Variance N column, others in Variance €'000 column
      row.name === 'Cases' ? formatVarianceForCSV(row.variance, false) : '',
      row.name !== 'Cases' ? formatVarianceForCSV(row.variance, false) : '',
      formatVarianceForCSV(row.variancePercent, true),
      // Var % Sales
      formatVarianceForCSV(row.percentSalesVar, true)
    ];
    rows.push(arrayToCSVRow(csvRow));
  });

  return rows.join('\n');
};

const generateFoodBrandsTableCSV = (data: any[]): string => {
  const headers = [
    'Brand',
    // Cases columns
    'Cases YTD No.', 'Cases LY Var No.', 'Cases LY Var %',
    // gSales columns
    "gSales YTD €'000", "gSales LY Var €'000", 'gSales LY Var %',
    // fGP columns
    "fGP YTD €'000", "fGP LY Var €'000", 'fGP LY Var %',
    // fGP % columns
    'fGP % YTD %', 'fGP % LY Var %',
    // fGP FY24 columns
    "fGP FY24 YTD €'000", 'fGP FY24 CY v LY %'
  ];

  const rows = [arrayToCSVRow(headers)];

  // Group data by brand category
  const bvBrands = data.filter(item => 
    ['McDonnells', 'BV Honey', 'Don Carlos', 'Chivers', 'Homecook', 'Erin', 'Lakeshore', 'Panda', 'Lifeforce', 'GDF', 'Richmond', 'Cali Cali'].includes(item.name)
  );
  
  const agcBrands = data.filter(item => 
    ['Koka', 'Bonne Maman', 'Bensons'].includes(item.name)
  );
  
  const plBrands = data.filter(item => 
    ['Tesco', 'Dunnes'].includes(item.name)
  );

  // Calculate totals for each category
  const calculateTotals = (brands: any[]) => {
    return brands.reduce((totals, brand) => ({
      cases: {
        ytd: totals.cases.ytd + (brand.cases?.ytd || 0),
        lyVar: totals.cases.lyVar + (brand.cases?.lyVar || 0),
        lyVarPercent: 0
      },
      gSales: {
        ytd: totals.gSales.ytd + (brand.gSales?.ytd || 0),
        lyVar: totals.gSales.lyVar + (brand.gSales?.lyVar || 0),
        lyVarPercent: 0
      },
      fGP: {
        ytd: totals.fGP.ytd + (brand.fGP?.ytd || 0),
        lyVar: totals.fGP.lyVar + (brand.fGP?.lyVar || 0),
        lyVarPercent: 0
      },
      fGPPercent: {
        ytd: totals.fGP.ytd > 0 ? (totals.fGP.ytd / totals.gSales.ytd) * 100 : 0,
        lyVar: 0
      },
      fGPFY24: {
        ytd: totals.fGPFY24.ytd + (brand.fGPFY24?.ytd || 0),
        cyVLy: 0
      }
    }), {
      cases: { ytd: 0, lyVar: 0, lyVarPercent: 0 },
      gSales: { ytd: 0, lyVar: 0, lyVarPercent: 0 },
      fGP: { ytd: 0, lyVar: 0, lyVarPercent: 0 },
      fGPPercent: { ytd: 0, lyVar: 0 },
      fGPFY24: { ytd: 0, cyVLy: 0 }
    });
  };

  const bvTotals = calculateTotals(bvBrands);
  const agcTotals = calculateTotals(agcBrands);
  const plTotals = calculateTotals(plBrands);
  const overallTotals = calculateTotals(data);

  // Calculate percentages for totals
  const calculatePercentages = (totals: any) => {
    const casesLyVarPercent = totals.cases.ytd > 0 ? (totals.cases.lyVar / (totals.cases.ytd - totals.cases.lyVar)) * 100 : 0;
    const gSalesLyVarPercent = totals.gSales.ytd > 0 ? (totals.gSales.lyVar / (totals.gSales.ytd - totals.gSales.lyVar)) * 100 : 0;
    const fGPLyVarPercent = totals.fGP.ytd > 0 ? (totals.fGP.lyVar / (totals.fGP.ytd - totals.fGP.lyVar)) * 100 : 0;
    const fGPPercentLyVar = totals.fGPPercent.ytd > 0 ? ((totals.fGP.ytd / totals.gSales.ytd) - ((totals.fGP.ytd - totals.fGP.lyVar) / (totals.gSales.ytd - totals.gSales.lyVar))) * 100 : 0;
    const fGPFY24CyVLy = totals.fGPFY24.ytd > 0 ? (totals.fGP.ytd / totals.fGPFY24.ytd) * 100 : 0;

    return {
      ...totals,
      cases: { ...totals.cases, lyVarPercent: casesLyVarPercent },
      gSales: { ...totals.gSales, lyVarPercent: gSalesLyVarPercent },
      fGP: { ...totals.fGP, lyVarPercent: fGPLyVarPercent },
      fGPPercent: { ...totals.fGPPercent, lyVar: fGPPercentLyVar },
      fGPFY24: { ...totals.fGPFY24, cyVLy: fGPFY24CyVLy }
    };
  };

  const bvTotalsWithPercentages = calculatePercentages(bvTotals);
  const agcTotalsWithPercentages = calculatePercentages(agcTotals);
  const plTotalsWithPercentages = calculatePercentages(plTotals);
  const overallTotalsWithPercentages = calculatePercentages(overallTotals);

  const renderBrandRow = (brand: any) => {
    const csvRow = [
      brand.name || '',
      // Cases columns
      formatNumberForCSV(brand.cases?.ytd),
      formatVarianceForCSV(brand.cases?.lyVar, false),
      formatVarianceForCSV(brand.cases?.lyVarPercent, true),
      // gSales columns
      formatNumberForCSV(brand.gSales?.ytd),
      formatVarianceForCSV(brand.gSales?.lyVar, false),
      formatVarianceForCSV(brand.gSales?.lyVarPercent, true),
      // fGP columns
      formatNumberForCSV(brand.fGP?.ytd),
      formatVarianceForCSV(brand.fGP?.lyVar, false),
      formatVarianceForCSV(brand.fGP?.lyVarPercent, true),
      // fGP % columns
      formatNumberForCSV(brand.fGPPercent?.ytd, true),
      formatVarianceForCSV(brand.fGPPercent?.lyVar, true),
      // fGP FY24 columns
      formatNumberForCSV(brand.fGPFY24?.ytd),
      formatVarianceForCSV(brand.fGPFY24?.cyVLy, true)
    ];
    rows.push(arrayToCSVRow(csvRow));
  };

  const renderTotalRow = (totals: any, label: string) => {
    const csvRow = [
      label,
      // Cases columns
      formatNumberForCSV(totals.cases?.ytd),
      formatVarianceForCSV(totals.cases?.lyVar, false),
      formatVarianceForCSV(totals.cases?.lyVarPercent, true),
      // gSales columns
      formatNumberForCSV(totals.gSales?.ytd),
      formatVarianceForCSV(totals.gSales?.lyVar, false),
      formatVarianceForCSV(totals.gSales?.lyVarPercent, true),
      // fGP columns
      formatNumberForCSV(totals.fGP?.ytd),
      formatVarianceForCSV(totals.fGP?.lyVar, false),
      formatVarianceForCSV(totals.fGP?.lyVarPercent, true),
      // fGP % columns
      formatNumberForCSV(totals.fGPPercent?.ytd, true),
      formatVarianceForCSV(totals.fGPPercent?.lyVar, true),
      // fGP FY24 columns
      formatNumberForCSV(totals.fGPFY24?.ytd),
      formatVarianceForCSV(totals.fGPFY24?.cyVLy, true)
    ];
    rows.push(arrayToCSVRow(csvRow));
  };

  // Add BV Brands section
  rows.push(arrayToCSVRow(['BV Brands - Food']));
  bvBrands.forEach(renderBrandRow);
  renderTotalRow(bvTotalsWithPercentages, 'Total (BV Brands - Food)');
  rows.push(arrayToCSVRow(['']));

  // Add AGC Brands section
  rows.push(arrayToCSVRow(['AGC Brands - Food']));
  agcBrands.forEach(renderBrandRow);
  renderTotalRow(agcTotalsWithPercentages, 'Total (AGC Brands - Food)');
  rows.push(arrayToCSVRow(['']));

  // Add PL Brands section
  rows.push(arrayToCSVRow(['PL Brands - Food']));
  plBrands.forEach(renderBrandRow);
  renderTotalRow(plTotalsWithPercentages, 'Total (PL Brands - Food)');
  rows.push(arrayToCSVRow(['']));

  // Add Overall Total
  renderTotalRow(overallTotalsWithPercentages, 'Overall Total');

  return rows.join('\n');
};

const generateFoodBrandsDetailsTableCSV = (data: any[]): string => {
  const headers = [
    'Brand',
    'Sub-Category',
    'Product',
    // Cases columns
    'Cases YTD No.', 'Cases LY Var No.', 'Cases LY Var %',
    // gSales columns
    "gSales YTD €'000", "gSales LY Var €'000", 'gSales LY Var %',
    // fGP columns
    "fGP YTD €'000", "fGP LY Var €'000", 'fGP LY Var %',
    // fGP % columns
    'fGP % YTD %', 'fGP % LY Var %'
  ];

  const rows = [arrayToCSVRow(headers)];

  // Group data by brand and sub-category
  const groupedData = data.reduce((acc, item) => {
    if (!acc[item.brand]) {
      acc[item.brand] = {};
    }
    if (!acc[item.brand][item.subCategory]) {
      acc[item.brand][item.subCategory] = [];
    }
    acc[item.brand][item.subCategory].push(item);
    return acc;
  }, {} as Record<string, Record<string, any[]>>);

  // Process each brand and its sub-categories
  Object.entries(groupedData).forEach(([brand, subCategories]) => {
    // Add brand header
    rows.push(arrayToCSVRow([brand, '', '', '', '', '', '', '', '', '', '', '', '', '']));
    
    Object.entries(subCategories as Record<string, any[]>).forEach(([subCategory, products]) => {
      // Add sub-category header
      rows.push(arrayToCSVRow(['', subCategory, '', '', '', '', '', '', '', '', '', '', '', '']));
      
      // Add product rows
      products.forEach((product: any) => {
        rows.push(arrayToCSVRow([
          '',
          '',
          product.product,
          formatNumberForCSV(product.cases?.ytd),
          formatVarianceForCSV(product.cases?.lyVar),
          formatVarianceForCSV(product.cases?.lyVarPercent, true),
          formatNumberForCSV(product.gSales?.ytd),
          formatVarianceForCSV(product.gSales?.lyVar),
          formatVarianceForCSV(product.gSales?.lyVarPercent, true),
          formatNumberForCSV(product.fGP?.ytd),
          formatVarianceForCSV(product.fGP?.lyVar),
          formatVarianceForCSV(product.fGP?.lyVarPercent, true),
          formatNumberForCSV(product.fGPPercent?.ytd, true),
          formatVarianceForCSV(product.fGPPercent?.lyVar, true)
        ]));
      });
    });
  });

  return rows.join('\n');
};

const generateHouseholdBrandsTableCSV = (data: any[]): string => {
  const headers = [
    'Brand',
    // Cases columns
    'Cases YTD No.', 'Cases LY Var No.', 'Cases LY Var %',
    // gSales columns
    "gSales YTD €'000", "gSales LY Var €'000", 'gSales LY Var %',
    // fGP columns
    "fGP YTD €'000", "fGP LY Var €'000", 'fGP LY Var %',
    // fGP % columns
    'fGP % YTD %', 'fGP % LY Var %',
    // fGP FY24 columns
    "fGP FY24 YTD €'000", 'fGP FY24 CY v LY %'
  ];

  const rows = [arrayToCSVRow(headers)];

  data.forEach((brand: any) => {
    rows.push(arrayToCSVRow([
      brand.name,
      formatNumberForCSV(brand.cases?.ytd),
      formatVarianceForCSV(brand.cases?.lyVar),
      formatVarianceForCSV(brand.cases?.lyVarPercent, true),
      formatNumberForCSV(brand.gSales?.ytd),
      formatVarianceForCSV(brand.gSales?.lyVar),
      formatVarianceForCSV(brand.gSales?.lyVarPercent, true),
      formatNumberForCSV(brand.fGP?.ytd),
      formatVarianceForCSV(brand.fGP?.lyVar),
      formatVarianceForCSV(brand.fGP?.lyVarPercent, true),
      formatNumberForCSV(brand.fGPPercent?.ytd, true),
      formatVarianceForCSV(brand.fGPPercent?.lyVar, true),
      formatNumberForCSV(brand.fGPFY24?.ytd),
      formatNumberForCSV(brand.fGPFY24?.cyVLy, true)
    ]));
  });

  return rows.join('\n');
};

const generateHouseholdBrandsDetailsTableCSV = (data: any[]): string => {
  const headers = [
    'Brand',
    'Sub-Category',
    'Product',
    // Cases columns
    'Cases YTD No.', 'Cases LY Var No.', 'Cases LY Var %',
    // gSales columns
    "gSales YTD €'000", "gSales LY Var €'000", 'gSales LY Var %',
    // fGP columns
    "fGP YTD €'000", "fGP LY Var €'000", 'fGP LY Var %',
    // fGP % columns
    'fGP % YTD %', 'fGP % LY Var %'
  ];

  const rows = [arrayToCSVRow(headers)];

  // Group data by brand and sub-category
  const groupedData = data.reduce((acc, item) => {
    if (!acc[item.brand]) {
      acc[item.brand] = {};
    }
    if (!acc[item.brand][item.subCategory]) {
      acc[item.brand][item.subCategory] = [];
    }
    acc[item.brand][item.subCategory].push(item);
    return acc;
  }, {} as Record<string, Record<string, any[]>>);

  // Process each brand and its sub-categories
  Object.entries(groupedData).forEach(([brand, subCategories]) => {
    // Add brand header
    rows.push(arrayToCSVRow([brand, '', '', '', '', '', '', '', '', '', '', '', '', '']));
    
    Object.entries(subCategories as Record<string, any[]>).forEach(([subCategory, products]) => {
      // Add sub-category header
      rows.push(arrayToCSVRow(['', subCategory, '', '', '', '', '', '', '', '', '', '', '', '']));
      
      // Add product rows
      products.forEach((product: any) => {
        rows.push(arrayToCSVRow([
          '',
          '',
          product.name,
          formatNumberForCSV(product.cases?.ytd),
          formatVarianceForCSV(product.cases?.lyVar),
          formatVarianceForCSV(product.cases?.lyVarPercent, true),
          formatNumberForCSV(product.gSales?.ytd),
          formatVarianceForCSV(product.gSales?.lyVar),
          formatVarianceForCSV(product.gSales?.lyVarPercent, true),
          formatNumberForCSV(product.fGP?.ytd),
          formatVarianceForCSV(product.fGP?.lyVar),
          formatVarianceForCSV(product.fGP?.lyVarPercent, true),
          formatNumberForCSV(product.fGPPercent?.ytd, true),
          formatVarianceForCSV(product.fGPPercent?.lyVar, true)
        ]));
      });
    });
  });

  return rows.join('\n');
};

interface FilterState {
  selectedYear: string;
  selectedMonth: string;
  selectedBusinessArea: string;
  selectedChannel: string;
  selectedBrand: string;
  selectedCategory: string;
  selectedSubCategory: string;
  selectedCustomer: string;
  selectedRoi: string;
}

// Mock data function for Household Brands
const getHouseholdBrandsMockData = () => {
  return [
    // BV Brands - Household
    {
      name: 'Killeen',
      cases: { ytd: 265564, lyVar: 5184, lyVarPercent: 2.0 },
      gSales: { ytd: 5452, lyVar: 49, lyVarPercent: 0.9 },
      fGP: { ytd: 1974, lyVar: -10, lyVarPercent: -0.5 },
      fGPPercent: { ytd: 36.2, lyVar: -0.5 },
      fGPFY24: { ytd: 1984, cyVLy: 99.5 }
    },
    {
      name: 'Green Aware',
      cases: { ytd: 51604, lyVar: 1673, lyVarPercent: 3.4 },
      gSales: { ytd: 2771, lyVar: 514, lyVarPercent: 22.8 },
      fGP: { ytd: 956, lyVar: 152, lyVarPercent: 18.9 },
      fGPPercent: { ytd: 34.5, lyVar: -1.1 },
      fGPFY24: { ytd: 804, cyVLy: 118.9 }
    },
    {
      name: 'Goddards',
      cases: { ytd: 44546, lyVar: -13129, lyVarPercent: -22.8 },
      gSales: { ytd: 437, lyVar: -159, lyVarPercent: -26.7 },
      fGP: { ytd: 111, lyVar: -59, lyVarPercent: -34.7 },
      fGPPercent: { ytd: 25.5, lyVar: -3.1 },
      fGPFY24: { ytd: 171, cyVLy: 65.3 }
    },
    {
      name: 'Irish Breeze',
      cases: { ytd: 9916, lyVar: 595, lyVarPercent: 6.4 },
      gSales: { ytd: 260, lyVar: 13, lyVarPercent: 5.5 },
      fGP: { ytd: 92, lyVar: 14, lyVarPercent: 18.7 },
      fGPPercent: { ytd: 35.4, lyVar: 3.9 },
      fGPFY24: { ytd: 77, cyVLy: 118.7 }
    },
    {
      name: 'Babykind',
      cases: { ytd: 498, lyVar: -1163, lyVarPercent: -70.0 },
      gSales: { ytd: 9, lyVar: -40, lyVarPercent: -82.2 },
      fGP: { ytd: 3, lyVar: -8, lyVarPercent: -74.5 },
      fGPPercent: { ytd: 31.4, lyVar: 9.5 },
      fGPFY24: { ytd: 11, cyVLy: 25.5 }
    },
    {
      name: 'BV Brands - Household Total',
      cases: { ytd: 372128, lyVar: -6840, lyVarPercent: -1.8 },
      gSales: { ytd: 8928, lyVar: 377, lyVarPercent: 4.4 },
      fGP: { ytd: 3136, lyVar: 89, lyVarPercent: 2.9 },
      fGPPercent: { ytd: 35.1, lyVar: -0.5 },
      fGPFY24: { ytd: 3047, cyVLy: 102.9 },
      isTotal: true
    },
    // PL Brands - Household
    {
      name: 'Alio',
      cases: { ytd: 0, lyVar: 0, lyVarPercent: 0 },
      gSales: { ytd: 0, lyVar: 0, lyVarPercent: 0 },
      fGP: { ytd: 0, lyVar: 0, lyVarPercent: 0 },
      fGPPercent: { ytd: 0, lyVar: 0 },
      fGPFY24: { ytd: 0, cyVLy: 0 }
    },
    {
      name: 'Centra',
      cases: { ytd: 17973, lyVar: 749, lyVarPercent: 4.3 },
      gSales: { ytd: 219, lyVar: -2, lyVarPercent: -1.1 },
      fGP: { ytd: 38, lyVar: -5, lyVarPercent: -11.2 },
      fGPPercent: { ytd: 17.1, lyVar: -2.0 },
      fGPFY24: { ytd: 42, cyVLy: 88.8 }
    },
    {
      name: 'PL Minor',
      cases: { ytd: 4243, lyVar: -1228, lyVarPercent: -22.4 },
      gSales: { ytd: 73, lyVar: -26, lyVarPercent: -26.4 },
      fGP: { ytd: 21, lyVar: -10, lyVarPercent: -32.7 },
      fGPPercent: { ytd: 29.5, lyVar: -2.8 },
      fGPFY24: { ytd: 32, cyVLy: 67.3 }
    },
    {
      name: 'SuperValu',
      cases: { ytd: 63034, lyVar: -4622, lyVarPercent: -6.8 },
      gSales: { ytd: 803, lyVar: -80, lyVarPercent: -9.1 },
      fGP: { ytd: 136, lyVar: -39, lyVarPercent: -22.3 },
      fGPPercent: { ytd: 16.9, lyVar: -2.9 },
      fGPFY24: { ytd: 175, cyVLy: 77.7 }
    },
    {
      name: 'Powerforce',
      cases: { ytd: 188228, lyVar: 62525, lyVarPercent: 49.7 },
      gSales: { ytd: 2738, lyVar: 751, lyVarPercent: 37.8 },
      fGP: { ytd: 727, lyVar: 270, lyVarPercent: 59.1 },
      fGPPercent: { ytd: 26.5, lyVar: 3.6 },
      fGPFY24: { ytd: 457, cyVLy: 159.1 }
    },
    {
      name: 'PL Brands - Household Total',
      cases: { ytd: 273478, lyVar: 57424, lyVarPercent: 26.6 },
      gSales: { ytd: 3832, lyVar: 643, lyVarPercent: 20.1 },
      fGP: { ytd: 922, lyVar: 216, lyVarPercent: 30.6 },
      fGPPercent: { ytd: 24.1, lyVar: 1.9 },
      fGPFY24: { ytd: 706, cyVLy: 130.6 },
      isTotal: true
    },
    {
      name: 'Overall Total',
      cases: { ytd: 645606, lyVar: 50584, lyVarPercent: 8.5 },
      gSales: { ytd: 12760, lyVar: 1020, lyVarPercent: 8.7 },
      fGP: { ytd: 4058, lyVar: 305, lyVarPercent: 8.1 },
      fGPPercent: { ytd: 31.8, lyVar: -0.2 },
      fGPFY24: { ytd: 3752, cyVLy: 108.1 },
      isTotal: true
    }
  ];
};

export default function Reports() {
  const [activeTab, setActiveTab] = useState<'reports' | 'summary'>('reports');
  
  const [filters, setFilters] = useState<FilterState>({
    selectedYear: '2024',
    selectedMonth: 'All',
    selectedBusinessArea: 'All',
    selectedChannel: 'All',
    selectedBrand: 'All',
    selectedCategory: 'All',
    selectedSubCategory: 'All',
    selectedCustomer: 'All',
    selectedRoi: 'All',
  });

  const [businessAreaData, setBusinessAreaData] = useState<SummaryRowData[]>([]);
  const [channelData, setChannelData] = useState<SummaryRowData[]>([]);
  const [brandsData, setBrandsData] = useState<SummaryRowData[]>([]);
  const [customersData, setCustomersData] = useState<SummaryRowData[]>([]);
  const [trendData, setTrendData] = useState<any[]>([]);
  const [salesToFGPData, setSalesToFGPData] = useState<any[]>([]);
  const [foodBrandsData, setFoodBrandsData] = useState<any[]>([]);
  const [foodBrandsDetailsData, setFoodBrandsDetailsData] = useState<any[]>([]);
  const [householdBrandsData, setHouseholdBrandsData] = useState<any[]>([]);
  const [householdBrandsDetailsData, setHouseholdBrandsDetailsData] = useState<any[]>([]);
  
  // Individual loading states for each section
  const [loadingStates, setLoadingStates] = useState({
    summary: false,
    totalBrands: false,
    customers: false,
    trend: false,
    salesToFGP: false,
    foodBrands: false,
    foodBrandsDetails: false,
    householdBrands: false,
    householdBrandsDetails: false
  });
  
  // Track which sections have been loaded
  const [loadedSections, setLoadedSections] = useState<Set<string>>(new Set());
  
  const [exporting, setExporting] = useState(false);

  // Helper function to get filter params
  const getFilterParams = () => {
    return {
      year: filters.selectedYear !== 'All' ? parseInt(filters.selectedYear) : undefined,
      month: filters.selectedMonth !== 'All' ? filters.selectedMonth : undefined,
      businessArea: filters.selectedBusinessArea !== 'All' ? filters.selectedBusinessArea : undefined,
      channel: filters.selectedChannel !== 'All' ? filters.selectedChannel : undefined,
      customer: filters.selectedCustomer !== 'All' ? filters.selectedCustomer : undefined,
      brand: filters.selectedBrand !== 'All' ? filters.selectedBrand : undefined,
      category: filters.selectedCategory !== 'All' ? filters.selectedCategory : undefined,
      subCategory: filters.selectedSubCategory !== 'All' ? filters.selectedSubCategory : undefined,
      roiOnly: filters.selectedRoi === 'ROI',
    };
  };

  // No initial fetch - data loads when sections are expanded

  // Individual data fetching functions for each section
  const fetchSummaryData = async () => {
    setLoadingStates(prev => ({ ...prev, summary: true }));
    try {
      const filterParams = getFilterParams();

      const [businessAreaResponse, channelResponse] = await Promise.all([
        dashboardAPI.getReportsBusinessAreaSummary(filterParams),
        dashboardAPI.getReportsChannelSummary(filterParams)
      ]);

      if (businessAreaResponse.data.success) {
        setBusinessAreaData(businessAreaResponse.data.data || []);
      }
      if (channelResponse.data.success) {
        setChannelData(channelResponse.data.data || []);
      }
      
      setLoadedSections(prev => new Set(prev).add('summary'));
    } catch (error) {
      console.error('Error fetching summary data:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, summary: false }));
    }
  };

  const fetchCustomersData = async () => {
    setLoadingStates(prev => ({ ...prev, customers: true }));
    try {
      const filterParams = getFilterParams();

      const customersResponse = await dashboardAPI.getCustomerSummary(filterParams);
      if (customersResponse.data.success) {
        setCustomersData(customersResponse.data.data || []);
      }
      
      setLoadedSections(prev => new Set(prev).add('customers'));
    } catch (error) {
      console.error('Error fetching customers data:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, customers: false }));
    }
  };

  const fetchTrendData = async () => {
    setLoadingStates(prev => ({ ...prev, trend: true }));
    try {
      const filterParams = getFilterParams();

      const trendResponse = await dashboardAPI.getTrendByMonthSummary(filterParams);
      if (trendResponse.data.success) {
        setTrendData(trendResponse.data.data || []);
      }
      
      setLoadedSections(prev => new Set(prev).add('trend'));
    } catch (error) {
      console.error('Error fetching trend data:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, trend: false }));
    }
  };

  const fetchSalesToFGPData = async () => {
    setLoadingStates(prev => ({ ...prev, salesToFGP: true }));
    try {
      const filterParams = getFilterParams();

      const salesToFGPResponse = await dashboardAPI.getSalesToFGPSummary(filterParams);
      if (salesToFGPResponse.data.success) {
        setSalesToFGPData(salesToFGPResponse.data.data || []);
      }
      
      setLoadedSections(prev => new Set(prev).add('salesToFGP'));
    } catch (error) {
      console.error('Error fetching sales to FGP data:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, salesToFGP: false }));
    }
  };

  const fetchFoodBrandsData = async () => {
    setLoadingStates(prev => ({ ...prev, foodBrands: true }));
    try {
      const filterParams = getFilterParams();

      const foodBrandsResponse = await dashboardAPI.getFoodBrandsSummary(filterParams);
      if (foodBrandsResponse.data.success) {
        setFoodBrandsData(foodBrandsResponse.data.data || []);
      }
      
      setLoadedSections(prev => new Set(prev).add('foodBrands'));
    } catch (error) {
      console.error('Error fetching food brands data:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, foodBrands: false }));
    }
  };

  const fetchFoodBrandsDetailsData = async () => {
    setLoadingStates(prev => ({ ...prev, foodBrandsDetails: true }));
    try {
      const filterParams = getFilterParams();
      
      const foodBrandsDetailsResponse = await dashboardAPI.getFoodBrandsDetails(filterParams);
      
      if (foodBrandsDetailsResponse.data.success && foodBrandsDetailsResponse.data.data && foodBrandsDetailsResponse.data.data.length > 0) {
        setFoodBrandsDetailsData(foodBrandsDetailsResponse.data.data);
      } else {
        setFoodBrandsDetailsData([]);
      }
      
      setLoadedSections(prev => new Set(prev).add('foodBrandsDetails'));
    } catch (error) {
      console.error('Error fetching food brands details data:', error);
      setFoodBrandsDetailsData([]);
    } finally {
      setLoadingStates(prev => ({ ...prev, foodBrandsDetails: false }));
    }
  };

  const fetchHouseholdBrandsData = async () => {
    setLoadingStates(prev => ({ ...prev, householdBrands: true }));
    try {
      const filterParams = getFilterParams();
      
      const householdBrandsResponse = await dashboardAPI.getHouseholdBrands(filterParams);
        
      if (householdBrandsResponse.data.success && householdBrandsResponse.data.data && householdBrandsResponse.data.data.length > 0) {
        setHouseholdBrandsData(householdBrandsResponse.data.data);
      } else {
        setHouseholdBrandsData(getHouseholdBrandsMockData());
      }
      
      setLoadedSections(prev => new Set(prev).add('householdBrands'));
    } catch (error) {
      console.error('Error fetching household brands data:', error);
      setHouseholdBrandsData(getHouseholdBrandsMockData());
    } finally {
      setLoadingStates(prev => ({ ...prev, householdBrands: false }));
    }
  };

  const fetchHouseholdBrandsDetailsData = async () => {
    setLoadingStates(prev => ({ ...prev, householdBrandsDetails: true }));
    try {
      const filterParams = getFilterParams();
      
      const householdBrandsDetailsResponse = await dashboardAPI.getHouseholdBrandsDetails(filterParams);
        
      if (householdBrandsDetailsResponse.data.success && householdBrandsDetailsResponse.data.data && householdBrandsDetailsResponse.data.data.length > 0) {
        setHouseholdBrandsDetailsData(householdBrandsDetailsResponse.data.data);
      } else {
        setHouseholdBrandsDetailsData([]);
      }
      
      setLoadedSections(prev => new Set(prev).add('householdBrandsDetails'));
    } catch (error) {
      console.error('Error fetching household brands details data:', error);
      setHouseholdBrandsDetailsData([]);
    } finally {
      setLoadingStates(prev => ({ ...prev, householdBrandsDetails: false }));
    }
  };

  // Add Total Brands fetch function
  const fetchTotalBrandsData = async () => {
    setLoadingStates(prev => ({ ...prev, totalBrands: true }));
    try {
      const filterParams = getFilterParams();

      const brandsResponse = await dashboardAPI.getTotalBrandsSummary(filterParams);
      if (brandsResponse.data.success) {
        setBrandsData(brandsResponse.data.data || []);
      }
      
      setLoadedSections(prev => new Set(prev).add('totalBrands'));
    } catch (error) {
      console.error('Error fetching total brands data:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, totalBrands: false }));
    }
  };

  // Handle section expansion - fetch data when section is opened for the first time
  const handleSectionExpand = (sectionName: string, isExpanded: boolean) => {
    if (isExpanded && !loadedSections.has(sectionName)) {
      switch (sectionName) {
        case 'summary':
          fetchSummaryData();
          break;
        case 'totalBrands':
          fetchTotalBrandsData();
          break;
        case 'customers':
          fetchCustomersData();
          break;
        case 'trend':
          fetchTrendData();
          break;
        case 'salesToFGP':
          fetchSalesToFGPData();
          break;
        case 'foodBrands':
          fetchFoodBrandsData();
          break;
        case 'foodBrandsDetails':
          fetchFoodBrandsDetailsData();
          break;
        case 'householdBrands':
          fetchHouseholdBrandsData();
          break;
        case 'householdBrandsDetails':
          fetchHouseholdBrandsDetailsData();
          break;
      }
    }
  };

  const handleResetFilters = () => {
    setFilters({
      selectedYear: '2024',
      selectedMonth: 'All',
      selectedBusinessArea: 'All',
      selectedChannel: 'All',
      selectedBrand: 'All',
      selectedCategory: 'All',
      selectedSubCategory: 'All',
      selectedCustomer: 'All',
      selectedRoi: 'All',
    });
  };

  // Generic CSV export function
  const handleExportCSV = async () => {
    setExporting(true);
    try {
      const filterParams = {
        year: filters.selectedYear !== 'All' ? parseInt(filters.selectedYear) : undefined,
        month: filters.selectedMonth !== 'All' ? filters.selectedMonth : undefined,
        businessArea: filters.selectedBusinessArea !== 'All' ? filters.selectedBusinessArea : undefined,
        channel: filters.selectedChannel !== 'All' ? filters.selectedChannel : undefined,
        brand: filters.selectedBrand !== 'All' ? filters.selectedBrand : undefined,
        category: filters.selectedCategory !== 'All' ? filters.selectedCategory : undefined,
        subCategory: filters.selectedSubCategory !== 'All' ? filters.selectedSubCategory : undefined,
        customer: filters.selectedCustomer !== 'All' ? filters.selectedCustomer : undefined,
        roiOnly: filters.selectedRoi === 'ROI',
      };

      const response = await dashboardAPI.exportCSV(filterParams);
      
      // Create blob and download
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `kinetica-report-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('Failed to export CSV. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  // Section-specific CSV export functions
  const handleExportSummaryCSV = async () => {
    setExporting(true);
    try {
      const periodLabel = filters.selectedMonth !== 'All' ? filters.selectedMonth : 'YTD';
      
      // Generate CSV content from UI data
      let csvContent = '';
      
      // Business Area Section
      csvContent += 'BUSINESS AREA SUMMARY\n';
      csvContent += generateSummaryTableCSV(businessAreaData, 'Business Area', periodLabel);
      csvContent += '\n\n';
      
      // Channel Section
      csvContent += 'CHANNEL SUMMARY\n';
      csvContent += generateSummaryTableCSV(channelData, 'Channel', periodLabel);
      
      // Create blob and download with BOM for Excel compatibility
      const BOM = '\uFEFF';
      const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `kinetica-summary-report-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting Summary CSV:', error);
      alert('Failed to export Summary CSV. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const handleExportTotalBrandsCSV = async () => {
    setExporting(true);
    try {
      const periodLabel = filters.selectedMonth !== 'All' ? filters.selectedMonth : 'YTD';
      
      // Generate CSV content from UI data
      const csvContent = generateSummaryTableCSV(brandsData, 'Brand Name', periodLabel);
      
      // Create blob and download with BOM for Excel compatibility
      const BOM = '\uFEFF';
      const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `kinetica-total-brands-report-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting Total Brands CSV:', error);
      alert('Failed to export Total Brands CSV. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const handleExportCustomersCSV = async () => {
    setExporting(true);
    try {
      const periodLabel = filters.selectedMonth !== 'All' ? filters.selectedMonth : 'YTD';
      
      // Generate CSV content from UI data
      const csvContent = generateSummaryTableCSV(customersData, 'Customer Name', periodLabel);
      
      // Create blob and download with BOM for Excel compatibility
      const BOM = '\uFEFF';
      const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `kinetica-customers-report-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting Customers CSV:', error);
      alert('Failed to export Customers CSV. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const handleExportTrendByMonthCSV = async () => {
    setExporting(true);
    try {
      // Generate CSV content from UI data
      const csvContent = generateTrendTableCSV(trendData);
      
      // Create blob and download with BOM for Excel compatibility
      const BOM = '\uFEFF';
      const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `kinetica-trend-by-month-report-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting Trend by Month CSV:', error);
      alert('Failed to export Trend by Month CSV. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const handleExportSalesToFGPCSV = async () => {
    setExporting(true);
    try {
      // Generate CSV content from UI data
      const csvContent = generateSalesToFGPTableCSV(salesToFGPData, parseInt(filters.selectedYear), parseInt(filters.selectedYear) - 1);
      
      // Create blob and download with BOM for Excel compatibility
      const BOM = '\uFEFF';
      const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `kinetica-sales-to-fgp-report-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting Sales to FGP CSV:', error);
      alert('Failed to export Sales to FGP CSV. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const handleExportFoodBrandsCSV = async () => {
    setExporting(true);
    try {
      // Generate CSV content from UI data
      const csvContent = generateFoodBrandsTableCSV(foodBrandsData);
      
      // Create blob and download with BOM for Excel compatibility
      const BOM = '\uFEFF';
      const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `kinetica-food-brands-report-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting Food Brands CSV:', error);
      alert('Failed to export Food Brands CSV. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const handleExportFoodBrandsDetailsCSV = async () => {
    setExporting(true);
    try {
      // Generate CSV content from UI data
      const csvContent = generateFoodBrandsDetailsTableCSV(foodBrandsDetailsData);
      
      // Create blob and download with BOM for Excel compatibility
      const BOM = '\uFEFF';
      const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `kinetica-food-brands-details-report-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting Food Brands Details CSV:', error);
      alert('Failed to export Food Brands Details CSV. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const handleExportHouseholdBrandsCSV = async () => {
    setExporting(true);
    try {
      // Generate CSV content from UI data
      const csvContent = generateHouseholdBrandsTableCSV(householdBrandsData);
      
      // Create blob and download with BOM for Excel compatibility
      const BOM = '\uFEFF';
      const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `kinetica-household-brands-report-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting Household Brands CSV:', error);
      alert('Failed to export Household Brands CSV. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const handleExportHouseholdBrandsDetailsCSV = async () => {
    setExporting(true);
    try {
      // Generate CSV content from UI data
      const csvContent = generateHouseholdBrandsDetailsTableCSV(householdBrandsDetailsData);
      
      // Create blob and download with BOM for Excel compatibility
      const BOM = '\uFEFF';
      const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `kinetica-household-brands-details-report-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting Household Brands Details CSV:', error);
      alert('Failed to export Household Brands Details CSV. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <div className="w-full max-w-none mx-auto p-6 space-y-6">
        {/* Header with Tabs */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex space-x-1">
              <button
                onClick={() => setActiveTab('reports')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'reports'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Reports
              </button>
              <button
                onClick={() => setActiveTab('summary')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'summary'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Summary
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-semibold text-gray-900">Business Area and Channel-Summary</h1>
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Collapsible Sections */}
        <div className="space-y-4">
          {/* Summary Section */}
          <CollapsibleSection 
            title="Summary" 
            defaultExpanded={true}
            onToggle={(isExpanded) => handleSectionExpand('summary', isExpanded)}
          >
            <SectionFilters
              selectedYear={filters.selectedYear}
              setSelectedYear={(year) => setFilters(prev => ({ ...prev, selectedYear: year }))}
              selectedMonth={filters.selectedMonth}
              setSelectedMonth={(month) => setFilters(prev => ({ ...prev, selectedMonth: month }))}
              selectedBusinessArea={filters.selectedBusinessArea}
              setSelectedBusinessArea={(area) => setFilters(prev => ({ ...prev, selectedBusinessArea: area }))}
              selectedChannel={filters.selectedChannel}
              setSelectedChannel={(channel) => setFilters(prev => ({ ...prev, selectedChannel: channel }))}
              selectedBrand={filters.selectedBrand}
              setSelectedBrand={(brand) => setFilters(prev => ({ ...prev, selectedBrand: brand }))}
              selectedCategory={filters.selectedCategory}
              setSelectedCategory={(category) => setFilters(prev => ({ ...prev, selectedCategory: category }))}
              selectedSubCategory={filters.selectedSubCategory}
              setSelectedSubCategory={(subCategory) => setFilters(prev => ({ ...prev, selectedSubCategory: subCategory }))}
              selectedCustomer={filters.selectedCustomer}
              setSelectedCustomer={(customer) => setFilters(prev => ({ ...prev, selectedCustomer: customer }))}
              onApplyFilters={fetchSummaryData}
              onResetFilters={handleResetFilters}
              onDownloadCSV={handleExportSummaryCSV}
              isDownloading={exporting}
              sectionType="summary"
            />
            
            <div className="mt-6 space-y-6">
              <SummaryTable 
                title="Business Area" 
                data={businessAreaData} 
                loading={loadingStates.summary}
                periodLabel={filters.selectedMonth !== 'All' ? filters.selectedMonth : 'YTD'}
              />
              <SummaryTable 
                title="Channel" 
                data={channelData} 
                loading={loadingStates.summary}
                periodLabel={filters.selectedMonth !== 'All' ? filters.selectedMonth : 'YTD'}
              />
            </div>
          </CollapsibleSection>

          {/* Total Brands Section */}
          <CollapsibleSection 
            title="Total Brands"
            onToggle={(isExpanded) => handleSectionExpand('totalBrands', isExpanded)}
          >
            <TotalBrandsFilters
              selectedYear={filters.selectedYear}
              setSelectedYear={(year) => setFilters(prev => ({ ...prev, selectedYear: year }))}
              selectedMonth={filters.selectedMonth}
              setSelectedMonth={(month) => setFilters(prev => ({ ...prev, selectedMonth: month }))}
              selectedChannel={filters.selectedChannel}
              setSelectedChannel={(channel) => setFilters(prev => ({ ...prev, selectedChannel: channel }))}
              selectedCategory={filters.selectedCategory}
              setSelectedCategory={(category) => setFilters(prev => ({ ...prev, selectedCategory: category }))}
              selectedSubCategory={filters.selectedSubCategory}
              setSelectedSubCategory={(subCategory) => setFilters(prev => ({ ...prev, selectedSubCategory: subCategory }))}
              selectedCustomer={filters.selectedCustomer}
              setSelectedCustomer={(customer) => setFilters(prev => ({ ...prev, selectedCustomer: customer }))}
              selectedRoi={filters.selectedRoi}
              setSelectedRoi={(roi) => setFilters(prev => ({ ...prev, selectedRoi: roi }))}
              onApplyFilters={fetchTotalBrandsData}
              onResetFilters={handleResetFilters}
              onDownloadCSV={handleExportTotalBrandsCSV}
              isDownloading={exporting}
              sectionType="total-brands"
            />
            
            <div className="mt-6">
              <SummaryTable 
                data={brandsData}
                title="Brand Name"
                loading={loadingStates.totalBrands}
                periodLabel={filters.selectedMonth !== 'All' ? filters.selectedMonth : 'YTD'}
              />
            </div>
          </CollapsibleSection>

          {/* Customers Section */}
          <CollapsibleSection 
            title="Customers"
            onToggle={(isExpanded) => handleSectionExpand('customers', isExpanded)}
          >
            <CustomerFilters
              selectedYear={filters.selectedYear}
              setSelectedYear={(year) => setFilters(prev => ({ ...prev, selectedYear: year }))}
              selectedMonth={filters.selectedMonth}
              setSelectedMonth={(month) => setFilters(prev => ({ ...prev, selectedMonth: month }))}
              selectedChannel={filters.selectedChannel}
              setSelectedChannel={(channel) => setFilters(prev => ({ ...prev, selectedChannel: channel }))}
              selectedCategory={filters.selectedCategory}
              setSelectedCategory={(category) => setFilters(prev => ({ ...prev, selectedCategory: category }))}
              selectedSubCategory={filters.selectedSubCategory}
              setSelectedSubCategory={(subCategory) => setFilters(prev => ({ ...prev, selectedSubCategory: subCategory }))}
              selectedCustomer={filters.selectedCustomer}
              setSelectedCustomer={(customer) => setFilters(prev => ({ ...prev, selectedCustomer: customer }))}
              onApplyFilters={fetchCustomersData}
              onResetFilters={handleResetFilters}
              onDownloadCSV={handleExportCustomersCSV}
              isDownloading={exporting}
            />
            
            <div className="mt-6">
              <SummaryTable 
                data={customersData}
                title="Customer Name"
                loading={loadingStates.customers}
                periodLabel={filters.selectedMonth !== 'All' ? filters.selectedMonth : 'YTD'}
              />
            </div>
          </CollapsibleSection>

          {/* Trend Section */}
          <CollapsibleSection 
            title="Trend by Month"
            onToggle={(isExpanded) => handleSectionExpand('trend', isExpanded)}
          >
            <SectionFilters
              selectedYear={filters.selectedYear}
              setSelectedYear={(year) => setFilters(prev => ({ ...prev, selectedYear: year }))}
              selectedMonth={filters.selectedMonth}
              setSelectedMonth={(month) => setFilters(prev => ({ ...prev, selectedMonth: month }))}
              selectedBusinessArea={filters.selectedBusinessArea}
              setSelectedBusinessArea={(area) => setFilters(prev => ({ ...prev, selectedBusinessArea: area }))}
              selectedChannel={filters.selectedChannel}
              setSelectedChannel={(channel) => setFilters(prev => ({ ...prev, selectedChannel: channel }))}
              selectedBrand={filters.selectedBrand}
              setSelectedBrand={(brand) => setFilters(prev => ({ ...prev, selectedBrand: brand }))}
              selectedCategory={filters.selectedCategory}
              setSelectedCategory={(category) => setFilters(prev => ({ ...prev, selectedCategory: category }))}
              selectedSubCategory={filters.selectedSubCategory}
              setSelectedSubCategory={(subCategory) => setFilters(prev => ({ ...prev, selectedSubCategory: subCategory }))}
              selectedCustomer={filters.selectedCustomer}
              setSelectedCustomer={(customer) => setFilters(prev => ({ ...prev, selectedCustomer: customer }))}
              onApplyFilters={fetchTrendData}
              onResetFilters={handleResetFilters}
              onDownloadCSV={handleExportTrendByMonthCSV}
              isDownloading={exporting}
              sectionType="trend"
            />
            
            <div className="mt-6">
              <TrendTable 
                data={trendData}
                title="Trend by Month"
                loading={loadingStates.trend}
                periodLabel={filters.selectedMonth !== 'All' ? filters.selectedMonth : 'YTD'}
              />
            </div>
          </CollapsibleSection>

          {/* Sales to FGP Section */}
          <CollapsibleSection 
            title="Sales to FGP"
            onToggle={(isExpanded) => handleSectionExpand('salesToFGP', isExpanded)}
          >
            <SectionFilters
              selectedYear={filters.selectedYear}
              setSelectedYear={(year) => setFilters(prev => ({ ...prev, selectedYear: year }))}
              selectedMonth={filters.selectedMonth}
              setSelectedMonth={(month) => setFilters(prev => ({ ...prev, selectedMonth: month }))}
              selectedBusinessArea={filters.selectedBusinessArea}
              setSelectedBusinessArea={(area) => setFilters(prev => ({ ...prev, selectedBusinessArea: area }))}
              selectedChannel={filters.selectedChannel}
              setSelectedChannel={(channel) => setFilters(prev => ({ ...prev, selectedChannel: channel }))}
              selectedBrand={filters.selectedBrand}
              setSelectedBrand={(brand) => setFilters(prev => ({ ...prev, selectedBrand: brand }))}
              selectedCategory={filters.selectedCategory}
              setSelectedCategory={(category) => setFilters(prev => ({ ...prev, selectedCategory: category }))}
              selectedSubCategory={filters.selectedSubCategory}
              setSelectedSubCategory={(subCategory) => setFilters(prev => ({ ...prev, selectedSubCategory: subCategory }))}
              selectedCustomer={filters.selectedCustomer}
              setSelectedCustomer={(customer) => setFilters(prev => ({ ...prev, selectedCustomer: customer }))}
              onApplyFilters={fetchSalesToFGPData}
              onResetFilters={handleResetFilters}
              onDownloadCSV={handleExportSalesToFGPCSV}
              isDownloading={exporting}
              sectionType="sales-to-fgp"
            />
            
            <div className="mt-6">
              <SalesToFGPTable 
                data={salesToFGPData}
                title="Sales to fGP"
                loading={loadingStates.salesToFGP}
                periodLabel={filters.selectedMonth !== 'All' ? filters.selectedMonth : 'YTD'}
                currentYear={parseInt(filters.selectedYear)}
                previousYear={parseInt(filters.selectedYear) - 1}
              />
            </div>
          </CollapsibleSection>

        {/* Food Brands Section */}
        <CollapsibleSection 
          title="Food Brands"
          onToggle={(isExpanded) => handleSectionExpand('foodBrands', isExpanded)}
        >
          <SectionFilters
            selectedYear={filters.selectedYear}
            setSelectedYear={(year) => setFilters(prev => ({ ...prev, selectedYear: year }))}
            selectedMonth={filters.selectedMonth}
            setSelectedMonth={(month) => setFilters(prev => ({ ...prev, selectedMonth: month }))}
            selectedBusinessArea={filters.selectedBusinessArea}
            setSelectedBusinessArea={(area) => setFilters(prev => ({ ...prev, selectedBusinessArea: area }))}
            selectedChannel={filters.selectedChannel}
            setSelectedChannel={(channel) => setFilters(prev => ({ ...prev, selectedChannel: channel }))}
            selectedBrand={filters.selectedBrand}
            setSelectedBrand={(brand) => setFilters(prev => ({ ...prev, selectedBrand: brand }))}
            selectedCategory={filters.selectedCategory}
            setSelectedCategory={(category) => setFilters(prev => ({ ...prev, selectedCategory: category }))}
            selectedSubCategory={filters.selectedSubCategory}
            setSelectedSubCategory={(subCategory) => setFilters(prev => ({ ...prev, selectedSubCategory: subCategory }))}
            selectedCustomer={filters.selectedCustomer}
            setSelectedCustomer={(customer) => setFilters(prev => ({ ...prev, selectedCustomer: customer }))}
            onApplyFilters={fetchFoodBrandsData}
            onResetFilters={handleResetFilters}
            onDownloadCSV={handleExportFoodBrandsCSV}
            isDownloading={exporting}
            sectionType="food-brands"
            // Hide the filters we don't want for Food Brands
            hideBusinessArea={true}
            hideBrand={true}
            hideCategory={true}
            hideSubCategory={true}
          />
          
          <div className="mt-6">
            <FoodBrandsTable 
              data={foodBrandsData}
              isLoading={loadingStates.foodBrands}
            />
          </div>
        </CollapsibleSection>

        {/* Food Brands Details Section */}
        <CollapsibleSection 
          title="Food Brands Details"
          onToggle={(isExpanded) => handleSectionExpand('foodBrandsDetails', isExpanded)}
        >
          <SectionFilters
            selectedYear={filters.selectedYear}
            setSelectedYear={(year) => setFilters(prev => ({ ...prev, selectedYear: year }))}
            selectedMonth={filters.selectedMonth}
            setSelectedMonth={(month) => setFilters(prev => ({ ...prev, selectedMonth: month }))}
            selectedBusinessArea={filters.selectedBusinessArea}
            setSelectedBusinessArea={(area) => setFilters(prev => ({ ...prev, selectedBusinessArea: area }))}
            selectedChannel={filters.selectedChannel}
            setSelectedChannel={(channel) => setFilters(prev => ({ ...prev, selectedChannel: channel }))}
            selectedBrand={filters.selectedBrand}
            setSelectedBrand={(brand) => setFilters(prev => ({ ...prev, selectedBrand: brand }))}
            selectedCategory={filters.selectedCategory}
            setSelectedCategory={(category) => setFilters(prev => ({ ...prev, selectedCategory: category }))}
            selectedSubCategory={filters.selectedSubCategory}
            setSelectedSubCategory={(subCategory) => setFilters(prev => ({ ...prev, selectedSubCategory: subCategory }))}
            selectedCustomer={filters.selectedCustomer}
            setSelectedCustomer={(customer) => setFilters(prev => ({ ...prev, selectedCustomer: customer }))}
            onApplyFilters={fetchFoodBrandsDetailsData}
            onResetFilters={handleResetFilters}
            onDownloadCSV={handleExportFoodBrandsDetailsCSV}
            isDownloading={exporting}
            sectionType="food-brands-details"
            // Hide the filters we don't want for Food Brands Details
            hideBusinessArea={true}
            hideBrand={true}
            hideCategory={true}
            hideSubCategory={true}
          />
          
          <div className="mt-6">
            <FoodBrandsDetailsTable 
              data={foodBrandsDetailsData}
              isLoading={loadingStates.foodBrandsDetails}
            />
          </div>
        </CollapsibleSection>

        {/* Household Brands Section */}
        <CollapsibleSection 
          title="Household Brands"
          onToggle={(isExpanded) => handleSectionExpand('householdBrands', isExpanded)}
        >
          <SectionFilters
            selectedYear={filters.selectedYear}
            setSelectedYear={(year) => setFilters(prev => ({ ...prev, selectedYear: year }))}
            selectedMonth={filters.selectedMonth}
            setSelectedMonth={(month) => setFilters(prev => ({ ...prev, selectedMonth: month }))}
            selectedBusinessArea={filters.selectedBusinessArea}
            setSelectedBusinessArea={(area) => setFilters(prev => ({ ...prev, selectedBusinessArea: area }))}
            selectedChannel={filters.selectedChannel}
            setSelectedChannel={(channel) => setFilters(prev => ({ ...prev, selectedChannel: channel }))}
            selectedBrand={filters.selectedBrand}
            setSelectedBrand={(brand) => setFilters(prev => ({ ...prev, selectedBrand: brand }))}
            selectedCategory={filters.selectedCategory}
            setSelectedCategory={(category) => setFilters(prev => ({ ...prev, selectedCategory: category }))}
            selectedSubCategory={filters.selectedSubCategory}
            setSelectedSubCategory={(subCategory) => setFilters(prev => ({ ...prev, selectedSubCategory: subCategory }))}
            selectedCustomer={filters.selectedCustomer}
            setSelectedCustomer={(customer) => setFilters(prev => ({ ...prev, selectedCustomer: customer }))}
            onApplyFilters={fetchHouseholdBrandsData}
            onResetFilters={handleResetFilters}
            onDownloadCSV={handleExportHouseholdBrandsCSV}
            isDownloading={exporting}
            sectionType="household-brands"
            // Hide the filters we don't want for Household Brands
            hideBusinessArea={true}
            hideBrand={true}
            hideCategory={true}
            hideSubCategory={true}
          />
          
          <div className="mt-6">
            <HouseholdBrandsTable 
              data={householdBrandsData}
              isLoading={loadingStates.householdBrands}
            />
          </div>
        </CollapsibleSection>

        {/* Household Brands Details Section */}
        <CollapsibleSection 
          title="Household Brands Details"
          onToggle={(isExpanded) => handleSectionExpand('householdBrandsDetails', isExpanded)}
        >
          <SectionFilters
            selectedYear={filters.selectedYear}
            setSelectedYear={(year) => setFilters(prev => ({ ...prev, selectedYear: year }))}
            selectedMonth={filters.selectedMonth}
            setSelectedMonth={(month) => setFilters(prev => ({ ...prev, selectedMonth: month }))}
            selectedBusinessArea={filters.selectedBusinessArea}
            setSelectedBusinessArea={(area) => setFilters(prev => ({ ...prev, selectedBusinessArea: area }))}
            selectedChannel={filters.selectedChannel}
            setSelectedChannel={(channel) => setFilters(prev => ({ ...prev, selectedChannel: channel }))}
            selectedBrand={filters.selectedBrand}
            setSelectedBrand={(brand) => setFilters(prev => ({ ...prev, selectedBrand: brand }))}
            selectedCategory={filters.selectedCategory}
            setSelectedCategory={(category) => setFilters(prev => ({ ...prev, selectedCategory: category }))}
            selectedSubCategory={filters.selectedSubCategory}
            setSelectedSubCategory={(subCategory) => setFilters(prev => ({ ...prev, selectedSubCategory: subCategory }))}
            selectedCustomer={filters.selectedCustomer}
            setSelectedCustomer={(customer) => setFilters(prev => ({ ...prev, selectedCustomer: customer }))}
            onApplyFilters={fetchHouseholdBrandsDetailsData}
            onResetFilters={handleResetFilters}
            onDownloadCSV={handleExportHouseholdBrandsDetailsCSV}
            isDownloading={exporting}
            sectionType="household-brands"
            // Hide the filters we don't want for Household Brands Details
            hideBusinessArea={true}
            hideBrand={true}
            hideCategory={true}
            hideSubCategory={true}
          />
          
          <div className="mt-6">
            <HouseholdBrandsDetailsTable 
              data={householdBrandsDetailsData}
              isLoading={loadingStates.householdBrandsDetails}
            />
          </div>
        </CollapsibleSection>
        </div>

        {/* Footnotes */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Notes</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>1. Food includes Food, Mell & CAL business units.</p>
            <p>2. Waterwipes are excluded.</p>
            <p>3. Samples and sell off of stressed stock are excluded.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
