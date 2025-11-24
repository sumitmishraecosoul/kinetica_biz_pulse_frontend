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
import BrilloKilleenTable from '../../components/BrilloKilleenTable';
import KineticaTable from '../../components/KineticaTable';
import CategoriesSubcategoryTable from '../../components/CategoriesSubcategoryTable';
import CategoriesTable from '../../components/CategoriesTable';
import PrivateLabelTable from '../../components/PrivateLabelTable';
import NPDTable from '../../components/NPDTable';
import WSROIChannelTable from '../../components/WSROIChannelTable';
import WSUKNIChannelTable from '../../components/WSUKNIChannelTable';
import FoodserviceSKUsTable from '../../components/FoodserviceSKUsTable';
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
  const [brilloKilleenData, setBrilloKilleenData] = useState<any[]>([]);
  const [kineticaData, setKineticaData] = useState<any[]>([]);
  const [categoriesSubcategoryData, setCategoriesSubcategoryData] = useState<any[]>([]);
  const [categoriesData, setCategoriesData] = useState<any[]>([]);
  const [privateLabelData, setPrivateLabelData] = useState<any[]>([]);
  const [npdData, setNpdData] = useState<any[]>([]);
  const [wsroiChannelData, setWsroiChannelData] = useState<any[]>([]);
  const [wsukniChannelData, setWsukniChannelData] = useState<any[]>([]);
  const [foodserviceSKUsData, setFoodserviceSKUsData] = useState<any[]>([]);
  
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
    householdBrandsDetails: false,
    brilloKilleen: false,
    kinetica: false,
    categoriesSubcategory: false,
    categories: false,
    privateLabel: false,
    npd: false,
    wsroiChannel: false,
    wsukniChannel: false,
    foodserviceSKUs: false
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

  // Add Brillo & Killeen fetch function
  const fetchFoodserviceSKUsData = async () => {
    console.log('🔍 fetchFoodserviceSKUsData called!');
    setLoadingStates(prev => ({ ...prev, foodserviceSKUs: true }));
    try {
      const filterParams = getFilterParams();
      console.log('🔍 Filter params:', JSON.stringify(filterParams, null, 2));

      // Mock data based on the screenshots
      let mockData: any[] = [
        // Wholesale ROI section
        { name: 'Others ROI', isTotal: false, gSales: { ytd: 1275, ly: 1325, lyVar: -50, lyVarPercent: -3.8 }, fGP: { ytd: 622, ly: 628, lyVar: -6, lyVarPercent: -0.9 }, fGPPercent: { ytd: 48.8, ly: 47.4, lyVar: 1.4 } },
        { name: 'BWG', isTotal: false, gSales: { ytd: 908, ly: 928, lyVar: -20, lyVarPercent: -2.1 }, fGP: { ytd: 326, ly: 325, lyVar: 1, lyVarPercent: 0.3 }, fGPPercent: { ytd: 35.9, ly: 35.1, lyVar: 0.9 } },
        { name: 'Musgrave ROI', isTotal: false, gSales: { ytd: 832, ly: 847, lyVar: -15, lyVarPercent: -1.8 }, fGP: { ytd: 213, ly: 215, lyVar: -2, lyVarPercent: -0.9 }, fGPPercent: { ytd: 25.6, ly: 25.3, lyVar: 0.2 } },
        { name: 'Stonehouse', isTotal: false, gSales: { ytd: 737, ly: 699, lyVar: 38, lyVarPercent: 5.4 }, fGP: { ytd: 286, ly: 256, lyVar: 30, lyVarPercent: 11.7 }, fGPPercent: { ytd: 38.8, ly: 36.6, lyVar: 2.2 } },
        { name: 'Pallas', isTotal: false, gSales: { ytd: 498, ly: 404, lyVar: 94, lyVarPercent: 23.2 }, fGP: { ytd: 196, ly: 141, lyVar: 54, lyVarPercent: 38.3 }, fGPPercent: { ytd: 39.3, ly: 35.0, lyVar: 4.3 } },
        { name: 'Barry Group', isTotal: false, gSales: { ytd: 43, ly: 43, lyVar: 0, lyVarPercent: -0.5 }, fGP: { ytd: 17, ly: 18, lyVar: -1, lyVarPercent: -6.8 }, fGPPercent: { ytd: 38.7, ly: 41.2, lyVar: -2.6 } },
        { name: 'Total (Wholesale ROI)', isTotal: false, isSubTotal: true, gSales: { ytd: 4293, ly: 4247, lyVar: 46, lyVarPercent: 1.1 }, fGP: { ytd: 1659, ly: 1583, lyVar: 76, lyVarPercent: 4.8 }, fGPPercent: { ytd: 38.6, ly: 37.3, lyVar: 1.4 } },
        
        // Grocery ROI section
        { name: 'Dunnes ROI', isTotal: false, gSales: { ytd: 184, ly: 161, lyVar: 23, lyVarPercent: 14.3 }, fGP: { ytd: 48, ly: 41, lyVar: 7, lyVarPercent: 18.0 }, fGPPercent: { ytd: 26.1, ly: 25.2, lyVar: 0.8 } },
        { name: 'Musgrave ROI', isTotal: false, gSales: { ytd: 73, ly: 74, lyVar: -1, lyVarPercent: -1.6 }, fGP: { ytd: 18, ly: 16, lyVar: 1, lyVarPercent: 7.5 }, fGPPercent: { ytd: 24.2, ly: 22.1, lyVar: 2.1 } },
        { name: 'Others ROI', isTotal: false, gSales: { ytd: 5, ly: 6, lyVar: -1, lyVarPercent: -18.0 }, fGP: { ytd: 3, ly: 3, lyVar: 0, lyVarPercent: -15.4 }, fGPPercent: { ytd: 59.8, ly: 58.0, lyVar: 1.8 } },
        { name: 'Tesco ROI', isTotal: false, gSales: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 100.0 }, fGP: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 100.0 }, fGPPercent: { ytd: 0.0, ly: 0.0, lyVar: 0.0 } },
        { name: 'Total (Grocery ROI)', isTotal: false, isSubTotal: true, gSales: { ytd: 261, ly: 241, lyVar: 21, lyVarPercent: 8.6 }, fGP: { ytd: 68, ly: 60, lyVar: 8, lyVarPercent: 13.4 }, fGPPercent: { ytd: 26.1, ly: 25.0, lyVar: 1.1 } },
        
        // Wholesale UK & NI section
        { name: 'Scotland', isTotal: false, gSales: { ytd: 0, ly: 2, lyVar: -2, lyVarPercent: -100.0 }, fGP: { ytd: 0, ly: 2, lyVar: -2, lyVarPercent: -100.0 }, fGPPercent: { ytd: 0.0, ly: 100.0, lyVar: -100.0 } },
        { name: 'Others NI', isTotal: false, gSales: { ytd: 114, ly: 109, lyVar: 5, lyVarPercent: 4.3 }, fGP: { ytd: 57, ly: 54, lyVar: 3, lyVarPercent: 5.4 }, fGPPercent: { ytd: 49.5, ly: 49.0, lyVar: 0.5 } },
        { name: 'Savage & Whitten', isTotal: false, gSales: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 100.0 }, fGP: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 100.0 }, fGPPercent: { ytd: 0.0, ly: 0.0, lyVar: 0.0 } },
        { name: 'Hendersons', isTotal: false, gSales: { ytd: 100, ly: 49, lyVar: 51, lyVarPercent: 105.3 }, fGP: { ytd: 44, ly: 19, lyVar: 25, lyVarPercent: 134.4 }, fGPPercent: { ytd: 43.6, ly: 38.2, lyVar: 5.4 } },
        { name: 'Musgrave NI', isTotal: false, gSales: { ytd: 48, ly: 47, lyVar: 1, lyVarPercent: 1.5 }, fGP: { ytd: 15, ly: 16, lyVar: 0, lyVarPercent: -1.7 }, fGPPercent: { ytd: 31.9, ly: 32.9, lyVar: -1.0 } },
        { name: 'Lynas', isTotal: false, gSales: { ytd: 135, ly: 189, lyVar: -54, lyVarPercent: -28.5 }, fGP: { ytd: 47, ly: 77, lyVar: -31, lyVarPercent: -39.6 }, fGPPercent: { ytd: 34.5, ly: 40.9, lyVar: -6.4 } },
        { name: 'Total (Wholesale UK & NI)', isTotal: false, isSubTotal: true, gSales: { ytd: 398, ly: 396, lyVar: 1, lyVarPercent: 0.3 }, fGP: { ytd: 162, ly: 167, lyVar: -5, lyVarPercent: -2.8 }, fGPPercent: { ytd: 40.8, ly: 42.1, lyVar: -1.3 } },
        
        // Grocery UK & NI section
        { name: 'Tesco UK', isTotal: false, gSales: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 100.0 }, fGP: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 100.0 }, fGPPercent: { ytd: 0.0, ly: 0.0, lyVar: 0.0 } },
        { name: 'Independent Retail', isTotal: false, gSales: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 100.0 }, fGP: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 100.0 }, fGPPercent: { ytd: 0.0, ly: 0.0, lyVar: 0.0 } },
        { name: 'Asda UK', isTotal: false, gSales: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 100.0 }, fGP: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 100.0 }, fGPPercent: { ytd: 0.0, ly: 0.0, lyVar: 0.0 } },
        { name: 'Sainsbury UK', isTotal: false, gSales: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 100.0 }, fGP: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 100.0 }, fGPPercent: { ytd: 0.0, ly: 0.0, lyVar: 0.0 } },
        { name: 'Dunnes NI', isTotal: false, gSales: { ytd: 3, ly: 1, lyVar: 2, lyVarPercent: 151.6 }, fGP: { ytd: 1, ly: 0, lyVar: 1, lyVarPercent: 175.6 }, fGPPercent: { ytd: 28.4, ly: 26.0, lyVar: 2.5 } },
        { name: 'Foodforce', isTotal: false, gSales: { ytd: 4, ly: 2, lyVar: 2, lyVarPercent: 88.6 }, fGP: { ytd: 1, ly: 1, lyVar: 1, lyVarPercent: 101.1 }, fGPPercent: { ytd: 38.8, ly: 36.4, lyVar: 2.4 } },
        
        // Bus Area section
        { name: 'Foodforce', isTotal: false, gSales: { ytd: 4, ly: 2, lyVar: 2, lyVarPercent: 88.6 }, fGP: { ytd: 1, ly: 1, lyVar: 1, lyVarPercent: 101.1 }, fGPPercent: { ytd: 38.8, ly: 36.4, lyVar: 2.4 } },
        { name: 'O\'Kanes Food', isTotal: false, gSales: { ytd: 6, ly: 12, lyVar: -6, lyVarPercent: -49.5 }, fGP: { ytd: 3, ly: 6, lyVar: -3, lyVarPercent: -49.4 }, fGPPercent: { ytd: 50.5, ly: 50.4, lyVar: 0.1 } },
        { name: 'Nisa Retail', isTotal: false, gSales: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 100.0 }, fGP: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 100.0 }, fGPPercent: { ytd: 0.0, ly: 0.0, lyVar: 0.0 } },
        { name: 'Tesco NI', isTotal: false, gSales: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 100.0 }, fGP: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 100.0 }, fGPPercent: { ytd: 0.0, ly: 0.0, lyVar: 0.0 } },
        { name: 'Musgrave NI', isTotal: false, gSales: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 100.0 }, fGP: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 100.0 }, fGPPercent: { ytd: 0.0, ly: 0.0, lyVar: 0.0 } },
        { name: 'Sainsburys NI', isTotal: false, gSales: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 100.0 }, fGP: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 100.0 }, fGPPercent: { ytd: 0.0, ly: 0.0, lyVar: 0.0 } },
        { name: 'Asda NI', isTotal: false, gSales: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 100.0 }, fGP: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 100.0 }, fGPPercent: { ytd: 0.0, ly: 0.0, lyVar: 0.0 } },
        { name: 'Others NI', isTotal: false, gSales: { ytd: 13, ly: 5, lyVar: 8, lyVarPercent: 160.0 }, fGP: { ytd: 5, ly: 2, lyVar: 3, lyVarPercent: 150.0 }, fGPPercent: { ytd: 38.5, ly: 40.0, lyVar: -1.5 } },
        { name: 'Total (Bus Area)', isTotal: false, isSubTotal: true, gSales: { ytd: 23, ly: 19, lyVar: 4, lyVarPercent: 20.2 }, fGP: { ytd: 9, ly: 9, lyVar: 0, lyVarPercent: 3.5 }, fGPPercent: { ytd: 38.4, ly: 44.7, lyVar: -6.2 } },
        
        // International section
        { name: 'USA', isTotal: false, gSales: { ytd: 148, ly: 120, lyVar: 29, lyVarPercent: 24.0 }, fGP: { ytd: 73, ly: 56, lyVar: 17, lyVarPercent: 31.0 }, fGPPercent: { ytd: 49.2, ly: 46.6, lyVar: 2.6 } },
        { name: 'Australia', isTotal: false, gSales: { ytd: 45, ly: 42, lyVar: 3, lyVarPercent: 7.1 }, fGP: { ytd: 22, ly: 20, lyVar: 2, lyVarPercent: 10.0 }, fGPPercent: { ytd: 48.9, ly: 47.6, lyVar: 1.3 } },
        { name: 'UAE', isTotal: false, gSales: { ytd: 33, ly: 40, lyVar: -7, lyVarPercent: -16.6 }, fGP: { ytd: 15, ly: 18, lyVar: -3, lyVarPercent: -16.5 }, fGPPercent: { ytd: 46.4, ly: 46.4, lyVar: 0.0 } },
        { name: 'Spain', isTotal: false, gSales: { ytd: 25, ly: 30, lyVar: -5, lyVarPercent: -16.7 }, fGP: { ytd: 12, ly: 14, lyVar: -2, lyVarPercent: -14.3 }, fGPPercent: { ytd: 48.0, ly: 46.7, lyVar: 1.3 } },
        { name: 'Canada', isTotal: false, gSales: { ytd: 12, ly: 15, lyVar: -3, lyVarPercent: -20.0 }, fGP: { ytd: 6, ly: 7, lyVar: -1, lyVarPercent: -14.3 }, fGPPercent: { ytd: 50.0, ly: 46.7, lyVar: 3.3 } },
        { name: 'France', isTotal: false, gSales: { ytd: 3, ly: 3, lyVar: 0, lyVarPercent: 0.0 }, fGP: { ytd: 1, ly: 1, lyVar: 0, lyVarPercent: 0.0 }, fGPPercent: { ytd: 33.3, ly: 33.3, lyVar: 0.0 } },
        { name: 'Singapore', isTotal: false, gSales: { ytd: 2, ly: 2, lyVar: 0, lyVarPercent: 0.0 }, fGP: { ytd: 1, ly: 1, lyVar: 0, lyVarPercent: 0.0 }, fGPPercent: { ytd: 50.0, ly: 50.0, lyVar: 0.0 } },
        { name: 'Total (International)', isTotal: false, isSubTotal: true, gSales: { ytd: 268, ly: 252, lyVar: 16, lyVarPercent: 6.5 }, fGP: { ytd: 130, ly: 117, lyVar: 14, lyVarPercent: 11.7 }, fGPPercent: { ytd: 48.6, ly: 46.4, lyVar: 2.2 } },
        
        // Sports & Others section
        { name: 'Sports ROI', isTotal: false, gSales: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 100.0 }, fGP: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 100.0 }, fGPPercent: { ytd: 0.0, ly: 0.0, lyVar: 0.0 } },
        { name: 'Others ROI', isTotal: false, gSales: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 100.0 }, fGP: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 100.0 }, fGPPercent: { ytd: 0.0, ly: 0.0, lyVar: 0.0 } },
        { name: 'Sports UK', isTotal: false, gSales: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 100.0 }, fGP: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 100.0 }, fGPPercent: { ytd: 0.0, ly: 0.0, lyVar: 0.0 } },
        { name: 'Sports NI', isTotal: false, gSales: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 100.0 }, fGP: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 100.0 }, fGPPercent: { ytd: 0.0, ly: 0.0, lyVar: 0.0 } },
        { name: 'Total (Sports & Others)', isTotal: false, isSubTotal: true, gSales: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 100.0 }, fGP: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 100.0 }, fGPPercent: { ytd: 0.0, ly: 0.0, lyVar: 0.0 } },
        
        // Overall Total
        { name: 'Overall Total', isTotal: true, gSales: { ytd: 5243, ly: 5155, lyVar: 89, lyVarPercent: 1.7 }, fGP: { ytd: 2029, ly: 1935, lyVar: 94, lyVarPercent: 4.8 }, fGPPercent: { ytd: 38.7, ly: 37.5, lyVar: 1.2 } }
      ];

      // Apply filters to mock data
      let filteredData = [...mockData];

      // Add visual indicators to show filters are working
      let titleSuffix = '';
      if (filterParams.year && filterParams.year !== 2024) {
        titleSuffix += ` (Year: ${filterParams.year})`;
      }
      if (filterParams.month && filterParams.month !== 'All') {
        titleSuffix += ` (Month: ${filterParams.month})`;
      }

      if (titleSuffix) {
        // Update the main title
        filteredData = filteredData.map(item => {
          if (item.name === 'Overall Total') {
            return { ...item, name: `Overall Total${titleSuffix}` };
          }
          return item;
        });
      }

      // Apply year filter (simulate different data for different years)
      if (filterParams.year && filterParams.year !== 2024) {
        const yearMultiplier = filterParams.year === 2023 ? 0.8 : filterParams.year === 2025 ? 1.2 : 1.0;
        filteredData = filteredData.map(item => {
          const newItem = { ...item };
          if (newItem.gSales) {
            newItem.gSales = {
              ytd: Math.round(newItem.gSales.ytd * yearMultiplier),
              ly: Math.round(newItem.gSales.ly * yearMultiplier),
              lyVar: Math.round(newItem.gSales.lyVar * yearMultiplier),
              lyVarPercent: newItem.gSales.lyVarPercent
            };
          }
          if (newItem.fGP) {
            newItem.fGP = {
              ytd: Math.round(newItem.fGP.ytd * yearMultiplier),
              ly: Math.round(newItem.fGP.ly * yearMultiplier),
              lyVar: Math.round(newItem.fGP.lyVar * yearMultiplier),
              lyVarPercent: newItem.fGP.lyVarPercent
            };
          }
          if (newItem.fGPPercent) {
            newItem.fGPPercent = {
              ytd: newItem.fGPPercent.ytd,
              ly: newItem.fGPPercent.ly,
              lyVar: newItem.fGPPercent.lyVar
            };
          }
          return newItem;
        });
      }

      // Apply month filter (simulate monthly data)
      if (filterParams.month && filterParams.month !== 'All') {
        const monthMultiplier = 0.1; // Simulate monthly data (1/12 of annual)
        filteredData = filteredData.map(item => {
          const newItem = { ...item };
          if (newItem.gSales) {
            newItem.gSales = {
              ytd: Math.round(newItem.gSales.ytd * monthMultiplier),
              ly: Math.round(newItem.gSales.ly * monthMultiplier),
              lyVar: Math.round(newItem.gSales.lyVar * monthMultiplier),
              lyVarPercent: newItem.gSales.lyVarPercent
            };
          }
          if (newItem.fGP) {
            newItem.fGP = {
              ytd: Math.round(newItem.fGP.ytd * monthMultiplier),
              ly: Math.round(newItem.fGP.ly * monthMultiplier),
              lyVar: Math.round(newItem.fGP.lyVar * monthMultiplier),
              lyVarPercent: newItem.fGP.lyVarPercent
            };
          }
          if (newItem.fGPPercent) {
            newItem.fGPPercent = {
              ytd: newItem.fGPPercent.ytd,
              ly: newItem.fGPPercent.ly,
              lyVar: newItem.fGPPercent.lyVar
            };
          }
          return newItem;
        });
      }

      console.log('🔍 Foodservice SKUs filters applied:', JSON.stringify(filterParams, null, 2));
      console.log('🔍 Filtered Foodservice SKUs data:', JSON.stringify(filteredData, null, 2));

      setFoodserviceSKUsData(filteredData);
      setLoadedSections(prev => new Set(prev).add('foodserviceSKUs'));
    } catch (error) {
      console.error('Error fetching Foodservice SKUs data:', error);
      setFoodserviceSKUsData([]);
    } finally {
      setLoadingStates(prev => ({ ...prev, foodserviceSKUs: false }));
    }
  };

  const fetchWSUKNIChannelData = async () => {
    console.log('🔍 fetchWSUKNIChannelData called!');
    setLoadingStates(prev => ({ ...prev, wsukniChannel: true }));
    try {
      const filterParams = getFilterParams();
      console.log('🔍 Filter params:', JSON.stringify(filterParams, null, 2));

      // Mock data based on the screenshots
      let mockData: any[] = [
        // SKU Channel Summary
        { name: 'Retail', isTotal: false, cases: { ytd: 93280, ly: 124185, lyVar: -30905, lyVarPercent: -24.9 }, gSales: { ytd: 1615, ly: 2045, lyVar: -430, lyVarPercent: -21.0 }, fGP: { ytd: 582, ly: 723, lyVar: -141, lyVarPercent: -19.5 }, fGPPercent: { ytd: 36.0, ly: 35.4, lyVar: 0.7 } },
        { name: 'Foodservice', isTotal: false, cases: { ytd: 10806, ly: 11097, lyVar: -291, lyVarPercent: -2.6 }, gSales: { ytd: 398, ly: 396, lyVar: 1, lyVarPercent: 0.3 }, fGP: { ytd: 162, ly: 167, lyVar: -5, lyVarPercent: -2.8 }, fGPPercent: { ytd: 40.8, ly: 42.1, lyVar: -1.3 } },
        { name: 'Total', isTotal: true, cases: { ytd: 104086, ly: 135282, lyVar: -31196, lyVarPercent: -23.1 }, gSales: { ytd: 2013, ly: 2441, lyVar: -428, lyVarPercent: -17.6 }, fGP: { ytd: 744, ly: 890, lyVar: -146, lyVarPercent: -16.4 }, fGPPercent: { ytd: 37.0, ly: 36.5, lyVar: 0.5 } },
        
        // Foodservice SKU brands
        { name: 'McDonnells', isTotal: false, cases: { ytd: 5432, ly: 4800, lyVar: 632, lyVarPercent: 13.2 }, gSales: { ytd: 198, ly: 175, lyVar: 23, lyVarPercent: 13.1 }, fGP: { ytd: 81, ly: 71, lyVar: 10, lyVarPercent: 14.1 }, fGPPercent: { ytd: 40.9, ly: 40.6, lyVar: 0.3 } },
        { name: 'Richmond', isTotal: false, cases: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0.0 }, gSales: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0.0 }, fGP: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0.0 }, fGPPercent: { ytd: 0.0, ly: 0.0, lyVar: 0.0 } },
        { name: 'Bonne Maman', isTotal: false, cases: { ytd: 1234, ly: 1500, lyVar: -266, lyVarPercent: -17.7 }, gSales: { ytd: 45, ly: 55, lyVar: -10, lyVarPercent: -18.2 }, fGP: { ytd: 18, ly: 22, lyVar: -4, lyVarPercent: -18.2 }, fGPPercent: { ytd: 40.0, ly: 40.0, lyVar: 0.0 } },
        { name: 'Chivers', isTotal: false, cases: { ytd: 876, ly: 950, lyVar: -74, lyVarPercent: -7.8 }, gSales: { ytd: 32, ly: 35, lyVar: -3, lyVarPercent: -8.6 }, fGP: { ytd: 13, ly: 14, lyVar: -1, lyVarPercent: -7.1 }, fGPPercent: { ytd: 40.6, ly: 40.0, lyVar: 0.6 } },
        { name: 'BV Honey', isTotal: false, cases: { ytd: 2100, ly: 1800, lyVar: 300, lyVarPercent: 16.7 }, gSales: { ytd: 78, ly: 67, lyVar: 11, lyVarPercent: 16.4 }, fGP: { ytd: 32, ly: 27, lyVar: 5, lyVarPercent: 18.5 }, fGPPercent: { ytd: 41.0, ly: 40.3, lyVar: 0.7 } },
        { name: 'Erin', isTotal: false, cases: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0.0 }, gSales: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0.0 }, fGP: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0.0 }, fGPPercent: { ytd: 0.0, ly: 0.0, lyVar: 0.0 } },
        { name: 'Lakeshore', isTotal: false, cases: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0.0 }, gSales: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0.0 }, fGP: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0.0 }, fGPPercent: { ytd: 0.0, ly: 0.0, lyVar: 0.0 } },
        { name: 'Killeen', isTotal: false, cases: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0.0 }, gSales: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0.0 }, fGP: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0.0 }, fGPPercent: { ytd: 0.0, ly: 0.0, lyVar: 0.0 } },
        { name: 'Brillo', isTotal: false, cases: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0.0 }, gSales: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0.0 }, fGP: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0.0 }, fGPPercent: { ytd: 0.0, ly: 0.0, lyVar: 0.0 } },
        { name: 'Green Aware', isTotal: false, cases: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0.0 }, gSales: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0.0 }, fGP: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0.0 }, fGPPercent: { ytd: 0.0, ly: 0.0, lyVar: 0.0 } },
        { name: 'Panda', isTotal: false, cases: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0.0 }, gSales: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0.0 }, fGP: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0.0 }, fGPPercent: { ytd: 0.0, ly: 0.0, lyVar: 0.0 } },
        { name: 'AGC Minor', isTotal: false, cases: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0.0 }, gSales: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0.0 }, fGP: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0.0 }, fGPPercent: { ytd: 0.0, ly: 0.0, lyVar: 0.0 } },
        { name: 'Cali Cali', isTotal: false, cases: { ytd: 164, ly: 847, lyVar: -683, lyVarPercent: -80.6 }, gSales: { ytd: 45, ly: 60, lyVar: -15, lyVarPercent: -25.0 }, fGP: { ytd: 18, ly: 24, lyVar: -6, lyVarPercent: -25.0 }, fGPPercent: { ytd: 40.0, ly: 40.0, lyVar: 0.0 } },
        
        // Foodservice SKU's sub-total
        { name: 'Foodservice SKU\'s', isTotal: false, isSubTotal: true, cases: { ytd: 10806, ly: 11097, lyVar: -291, lyVarPercent: -2.6 }, gSales: { ytd: 398, ly: 396, lyVar: 1, lyVarPercent: 0.3 }, fGP: { ytd: 162, ly: 167, lyVar: -5, lyVarPercent: -2.8 }, fGPPercent: { ytd: 40.8, ly: 42.1, lyVar: -1.3 } },
        
        // Retail SKU brands
        { name: 'Koka', isTotal: false, cases: { ytd: 12345, ly: 15000, lyVar: -2655, lyVarPercent: -17.7 }, gSales: { ytd: 234, ly: 285, lyVar: -51, lyVarPercent: -17.9 }, fGP: { ytd: 78, ly: 95, lyVar: -17, lyVarPercent: -17.9 }, fGPPercent: { ytd: 33.3, ly: 33.3, lyVar: 0.0 } },
        { name: 'Killeen', isTotal: false, cases: { ytd: 8765, ly: 12000, lyVar: -3235, lyVarPercent: -27.0 }, gSales: { ytd: 156, ly: 214, lyVar: -58, lyVarPercent: -27.1 }, fGP: { ytd: 52, ly: 71, lyVar: -19, lyVarPercent: -26.8 }, fGPPercent: { ytd: 33.3, ly: 33.2, lyVar: 0.1 } },
        { name: 'McDonnells', isTotal: false, cases: { ytd: 5432, ly: 8000, lyVar: -2568, lyVarPercent: -32.1 }, gSales: { ytd: 98, ly: 144, lyVar: -46, lyVarPercent: -31.9 }, fGP: { ytd: 32, ly: 48, lyVar: -16, lyVarPercent: -33.3 }, fGPPercent: { ytd: 32.7, ly: 33.3, lyVar: -0.6 } },
        { name: 'Brillo', isTotal: false, cases: { ytd: 1234, ly: 1500, lyVar: -266, lyVarPercent: -17.7 }, gSales: { ytd: 25, ly: 30, lyVar: -5, lyVarPercent: -16.7 }, fGP: { ytd: 8, ly: 10, lyVar: -2, lyVarPercent: -20.0 }, fGPPercent: { ytd: 32.0, ly: 33.3, lyVar: -1.3 } },
        { name: 'Chivers', isTotal: false, cases: { ytd: 876, ly: 950, lyVar: -74, lyVarPercent: -7.8 }, gSales: { ytd: 18, ly: 19, lyVar: -1, lyVarPercent: -5.3 }, fGP: { ytd: 6, ly: 6, lyVar: 0, lyVarPercent: 0.0 }, fGPPercent: { ytd: 33.3, ly: 31.6, lyVar: 1.7 } },
        { name: 'BV Honey', isTotal: false, cases: { ytd: 2100, ly: 1800, lyVar: 300, lyVarPercent: 16.7 }, gSales: { ytd: 42, ly: 36, lyVar: 6, lyVarPercent: 16.7 }, fGP: { ytd: 14, ly: 12, lyVar: 2, lyVarPercent: 16.7 }, fGPPercent: { ytd: 33.3, ly: 33.3, lyVar: 0.0 } },
        { name: 'Kinetica', isTotal: false, cases: { ytd: 5432, ly: 8000, lyVar: -2568, lyVarPercent: -32.1 }, gSales: { ytd: 98, ly: 144, lyVar: -46, lyVarPercent: -31.9 }, fGP: { ytd: 32, ly: 48, lyVar: -16, lyVarPercent: -33.3 }, fGPPercent: { ytd: 32.7, ly: 33.3, lyVar: -0.6 } },
        { name: 'Erin', isTotal: false, cases: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0.0 }, gSales: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0.0 }, fGP: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0.0 }, fGPPercent: { ytd: 0.0, ly: 0.0, lyVar: 0.0 } },
        { name: 'Panda', isTotal: false, cases: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0.0 }, gSales: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0.0 }, fGP: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0.0 }, fGPPercent: { ytd: 0.0, ly: 0.0, lyVar: 0.0 } },
        { name: 'Goddards', isTotal: false, cases: { ytd: 1234, ly: 1500, lyVar: -266, lyVarPercent: -17.7 }, gSales: { ytd: 25, ly: 30, lyVar: -5, lyVarPercent: -16.7 }, fGP: { ytd: 8, ly: 10, lyVar: -2, lyVarPercent: -20.0 }, fGPPercent: { ytd: 32.0, ly: 33.3, lyVar: -1.3 } },
        { name: 'Green Aware', isTotal: false, cases: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0.0 }, gSales: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0.0 }, fGP: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0.0 }, fGPPercent: { ytd: 0.0, ly: 0.0, lyVar: 0.0 } },
        { name: 'Homecook', isTotal: false, cases: { ytd: 876, ly: 950, lyVar: -74, lyVarPercent: -7.8 }, gSales: { ytd: 18, ly: 19, lyVar: -1, lyVarPercent: -5.3 }, fGP: { ytd: 6, ly: 6, lyVar: 0, lyVarPercent: 0.0 }, fGPPercent: { ytd: 33.3, ly: 31.6, lyVar: 1.7 } },
        { name: 'Cali Cali', isTotal: false, cases: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0.0 }, gSales: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0.0 }, fGP: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0.0 }, fGPPercent: { ytd: 0.0, ly: 0.0, lyVar: 0.0 } },
        { name: 'Don Carlos', isTotal: false, cases: { ytd: 2100, ly: 1800, lyVar: 300, lyVarPercent: 16.7 }, gSales: { ytd: 42, ly: 36, lyVar: 6, lyVarPercent: 16.7 }, fGP: { ytd: 14, ly: 12, lyVar: 2, lyVarPercent: 16.7 }, fGPPercent: { ytd: 33.3, ly: 33.3, lyVar: 0.0 } },
        { name: 'Bonne Maman', isTotal: false, cases: { ytd: 5432, ly: 4800, lyVar: 632, lyVarPercent: 13.2 }, gSales: { ytd: 98, ly: 87, lyVar: 11, lyVarPercent: 12.6 }, fGP: { ytd: 32, ly: 28, lyVar: 4, lyVarPercent: 14.3 }, fGPPercent: { ytd: 32.7, ly: 32.2, lyVar: 0.5 } },
        { name: 'Lifeforce', isTotal: false, cases: { ytd: 2100, ly: 1800, lyVar: 300, lyVarPercent: 16.7 }, gSales: { ytd: 42, ly: 36, lyVar: 6, lyVarPercent: 16.7 }, fGP: { ytd: 14, ly: 12, lyVar: 2, lyVarPercent: 16.7 }, fGPPercent: { ytd: 33.3, ly: 33.3, lyVar: 0.0 } },
        { name: 'Lakeshore', isTotal: false, cases: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0.0 }, gSales: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0.0 }, fGP: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0.0 }, fGPPercent: { ytd: 0.0, ly: 0.0, lyVar: 0.0 } },
        { name: 'GDF', isTotal: false, cases: { ytd: 1234, ly: 1500, lyVar: -266, lyVarPercent: -17.7 }, gSales: { ytd: 25, ly: 30, lyVar: -5, lyVarPercent: -16.7 }, fGP: { ytd: 8, ly: 10, lyVar: -2, lyVarPercent: -20.0 }, fGPPercent: { ytd: 32.0, ly: 33.3, lyVar: -1.3 } },
        { name: 'Bensons', isTotal: false, cases: { ytd: 876, ly: 950, lyVar: -74, lyVarPercent: -7.8 }, gSales: { ytd: 18, ly: 19, lyVar: -1, lyVarPercent: -5.3 }, fGP: { ytd: 6, ly: 6, lyVar: 0, lyVarPercent: 0.0 }, fGPPercent: { ytd: 33.3, ly: 31.6, lyVar: 1.7 } },
        { name: 'Irish Breeze', isTotal: false, cases: { ytd: 1234, ly: 1100, lyVar: 134, lyVarPercent: 12.2 }, gSales: { ytd: 25, ly: 22, lyVar: 3, lyVarPercent: 13.6 }, fGP: { ytd: 8, ly: 7, lyVar: 1, lyVarPercent: 14.3 }, fGPPercent: { ytd: 32.0, ly: 31.8, lyVar: 0.2 } },
        { name: 'PL Minor', isTotal: false, cases: { ytd: 2100, ly: 1800, lyVar: 300, lyVarPercent: 16.7 }, gSales: { ytd: 42, ly: 36, lyVar: 6, lyVarPercent: 16.7 }, fGP: { ytd: 14, ly: 12, lyVar: 2, lyVarPercent: 16.7 }, fGPPercent: { ytd: 33.3, ly: 33.3, lyVar: 0.0 } },
        { name: 'Babykind', isTotal: false, cases: { ytd: 1234, ly: 1100, lyVar: 134, lyVarPercent: 12.2 }, gSales: { ytd: 25, ly: 22, lyVar: 3, lyVarPercent: 13.6 }, fGP: { ytd: 8, ly: 7, lyVar: 1, lyVarPercent: 14.3 }, fGPPercent: { ytd: 32.0, ly: 31.8, lyVar: 0.2 } },
        
        // Retail SKU's sub-total
        { name: 'Retail SKU\'s', isTotal: false, isSubTotal: true, cases: { ytd: 93280, ly: 124185, lyVar: -30905, lyVarPercent: -24.9 }, gSales: { ytd: 1615, ly: 2045, lyVar: -430, lyVarPercent: -21.0 }, fGP: { ytd: 582, ly: 723, lyVar: -141, lyVarPercent: -19.5 }, fGPPercent: { ytd: 36.0, ly: 35.4, lyVar: 0.7 } }
      ];

      // Apply filters to mock data
      let filteredData = [...mockData];

      // Add visual indicators to show filters are working
      let titleSuffix = '';
      if (filterParams.year && filterParams.year !== 2024) {
        titleSuffix += ` (Year: ${filterParams.year})`;
      }
      if (filterParams.month && filterParams.month !== 'All') {
        titleSuffix += ` (Month: ${filterParams.month})`;
      }

      if (titleSuffix) {
        // Update the main title
        filteredData = filteredData.map(item => {
          if (item.name === 'Total') {
            return { ...item, name: `Total${titleSuffix}` };
          }
          return item;
        });
      }

      // Apply year filter (simulate different data for different years)
      if (filterParams.year && filterParams.year !== 2024) {
        const yearMultiplier = filterParams.year === 2023 ? 0.8 : filterParams.year === 2025 ? 1.2 : 1.0;
        filteredData = filteredData.map(item => {
          const newItem = { ...item };
          if (newItem.cases) {
            newItem.cases = {
              ytd: Math.round(newItem.cases.ytd * yearMultiplier),
              ly: Math.round(newItem.cases.ly * yearMultiplier),
              lyVar: Math.round(newItem.cases.lyVar * yearMultiplier),
              lyVarPercent: newItem.cases.lyVarPercent
            };
          }
          if (newItem.gSales) {
            newItem.gSales = {
              ytd: Math.round(newItem.gSales.ytd * yearMultiplier),
              ly: Math.round(newItem.gSales.ly * yearMultiplier),
              lyVar: Math.round(newItem.gSales.lyVar * yearMultiplier),
              lyVarPercent: newItem.gSales.lyVarPercent
            };
          }
          if (newItem.fGP) {
            newItem.fGP = {
              ytd: Math.round(newItem.fGP.ytd * yearMultiplier),
              ly: Math.round(newItem.fGP.ly * yearMultiplier),
              lyVar: Math.round(newItem.fGP.lyVar * yearMultiplier),
              lyVarPercent: newItem.fGP.lyVarPercent
            };
          }
          if (newItem.fGPPercent) {
            newItem.fGPPercent = {
              ytd: newItem.fGPPercent.ytd,
              ly: newItem.fGPPercent.ly,
              lyVar: newItem.fGPPercent.lyVar
            };
          }
          return newItem;
        });
      }

      // Apply month filter (simulate monthly data)
      if (filterParams.month && filterParams.month !== 'All') {
        const monthMultiplier = 0.1; // Simulate monthly data (1/12 of annual)
        filteredData = filteredData.map(item => {
          const newItem = { ...item };
          if (newItem.cases) {
            newItem.cases = {
              ytd: Math.round(newItem.cases.ytd * monthMultiplier),
              ly: Math.round(newItem.cases.ly * monthMultiplier),
              lyVar: Math.round(newItem.cases.lyVar * monthMultiplier),
              lyVarPercent: newItem.cases.lyVarPercent
            };
          }
          if (newItem.gSales) {
            newItem.gSales = {
              ytd: Math.round(newItem.gSales.ytd * monthMultiplier),
              ly: Math.round(newItem.gSales.ly * monthMultiplier),
              lyVar: Math.round(newItem.gSales.lyVar * monthMultiplier),
              lyVarPercent: newItem.gSales.lyVarPercent
            };
          }
          if (newItem.fGP) {
            newItem.fGP = {
              ytd: Math.round(newItem.fGP.ytd * monthMultiplier),
              ly: Math.round(newItem.fGP.ly * monthMultiplier),
              lyVar: Math.round(newItem.fGP.lyVar * monthMultiplier),
              lyVarPercent: newItem.fGP.lyVarPercent
            };
          }
          if (newItem.fGPPercent) {
            newItem.fGPPercent = {
              ytd: newItem.fGPPercent.ytd,
              ly: newItem.fGPPercent.ly,
              lyVar: newItem.fGPPercent.lyVar
            };
          }
          return newItem;
        });
      }

      console.log('🔍 WS UK&NI Channel filters applied:', JSON.stringify(filterParams, null, 2));
      console.log('🔍 Filtered WS UK&NI Channel data:', JSON.stringify(filteredData, null, 2));

      setWsukniChannelData(filteredData);
      setLoadedSections(prev => new Set(prev).add('wsukniChannel'));
    } catch (error) {
      console.error('Error fetching WS UK&NI Channel data:', error);
      setWsukniChannelData([]);
    } finally {
      setLoadingStates(prev => ({ ...prev, wsukniChannel: false }));
    }
  };

  const fetchWSROIChannelData = async () => {
    console.log('🔍 fetchWSROIChannelData called!');
    setLoadingStates(prev => ({ ...prev, wsroiChannel: true }));
    try {
      const filterParams = getFilterParams();
      console.log('🔍 Filter params:', JSON.stringify(filterParams, null, 2));

      // Mock data based on the screenshots
      let mockData: any[] = [
        // Individual brands
        { name: 'Brillo', isTotal: false, cases: { ytd: 12345, ly: 11800, lyVar: 545, lyVarPercent: 4.6 }, gSales: { ytd: 234, ly: 225, lyVar: 9, lyVarPercent: 4.0 }, fGP: { ytd: 78, ly: 75, lyVar: 3, lyVarPercent: 4.0 }, fGPPercent: { ytd: 33.3, ly: 33.3, lyVar: 0.0 } },
        { name: 'Chivers', isTotal: false, cases: { ytd: 8765, ly: 8200, lyVar: 565, lyVarPercent: 6.9 }, gSales: { ytd: 156, ly: 148, lyVar: 8, lyVarPercent: 5.4 }, fGP: { ytd: 52, ly: 49, lyVar: 3, lyVarPercent: 6.1 }, fGPPercent: { ytd: 33.3, ly: 33.1, lyVar: 0.2 } },
        { name: 'BV Honey', isTotal: false, cases: { ytd: 5432, ly: 5100, lyVar: 332, lyVarPercent: 6.5 }, gSales: { ytd: 98, ly: 92, lyVar: 6, lyVarPercent: 6.5 }, fGP: { ytd: 32, ly: 30, lyVar: 2, lyVarPercent: 6.7 }, fGPPercent: { ytd: 32.7, ly: 32.6, lyVar: 0.1 } },
        { name: 'Kinetica', isTotal: false, cases: { ytd: 21057, ly: 24865, lyVar: -3808, lyVarPercent: -15.3 }, gSales: { ytd: 459, ly: 524, lyVar: -64, lyVarPercent: -12.3 }, fGP: { ytd: 111, ly: 133, lyVar: -22, lyVarPercent: -16.8 }, fGPPercent: { ytd: 24.1, ly: 25.4, lyVar: -1.3 } },
        { name: 'Erin', isTotal: false, cases: { ytd: 6531, ly: 16437, lyVar: -9906, lyVarPercent: -60.3 }, gSales: { ytd: 137, ly: 232, lyVar: -95, lyVarPercent: -40.9 }, fGP: { ytd: 49, ly: 83, lyVar: -34, lyVarPercent: -40.9 }, fGPPercent: { ytd: 35.8, ly: 35.8, lyVar: 0.0 } },
        { name: 'Panda', isTotal: false, cases: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0.0 }, gSales: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0.0 }, fGP: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0.0 }, fGPPercent: { ytd: 0.0, ly: 0.0, lyVar: 0.0 } },
        { name: 'Goddards', isTotal: false, cases: { ytd: 1234, ly: 1500, lyVar: -266, lyVarPercent: -17.7 }, gSales: { ytd: 25, ly: 30, lyVar: -5, lyVarPercent: -16.7 }, fGP: { ytd: 8, ly: 10, lyVar: -2, lyVarPercent: -20.0 }, fGPPercent: { ytd: 32.0, ly: 33.3, lyVar: -1.3 } },
        { name: 'Green Aware', isTotal: false, cases: { ytd: 0, ly: 100, lyVar: -100, lyVarPercent: -100.0 }, gSales: { ytd: 0, ly: 2, lyVar: -2, lyVarPercent: -100.0 }, fGP: { ytd: 0, ly: -1, lyVar: 1, lyVarPercent: 100.0 }, fGPPercent: { ytd: 0.0, ly: -50.0, lyVar: 50.0 } },
        { name: 'Homecook', isTotal: false, cases: { ytd: 876, ly: 950, lyVar: -74, lyVarPercent: -7.8 }, gSales: { ytd: 18, ly: 19, lyVar: -1, lyVarPercent: -5.3 }, fGP: { ytd: 6, ly: 6, lyVar: 0, lyVarPercent: 0.0 }, fGPPercent: { ytd: 33.3, ly: 31.6, lyVar: 1.7 } },
        { name: 'Cali Cali', isTotal: false, cases: { ytd: 2187, ly: 6040, lyVar: -3853, lyVarPercent: -63.8 }, gSales: { ytd: 33, ly: 96, lyVar: -64, lyVarPercent: -66.0 }, fGP: { ytd: 13, ly: 34, lyVar: -21, lyVarPercent: -62.7 }, fGPPercent: { ytd: 39.1, ly: 35.6, lyVar: 3.5 } },
        { name: 'Don Carlos', isTotal: false, cases: { ytd: 3980, ly: 3275, lyVar: 705, lyVarPercent: 21.5 }, gSales: { ytd: 191, ly: 153, lyVar: 38, lyVarPercent: 24.8 }, fGP: { ytd: 68, ly: 44, lyVar: 25, lyVarPercent: 56.5 }, fGPPercent: { ytd: 35.8, ly: 28.5, lyVar: 7.3 } },
        { name: 'Bonne Maman', isTotal: false, cases: { ytd: 5432, ly: 4800, lyVar: 632, lyVarPercent: 13.2 }, gSales: { ytd: 98, ly: 87, lyVar: 11, lyVarPercent: 12.6 }, fGP: { ytd: 32, ly: 28, lyVar: 4, lyVarPercent: 14.3 }, fGPPercent: { ytd: 32.7, ly: 32.2, lyVar: 0.5 } },
        { name: 'Lifeforce', isTotal: false, cases: { ytd: 2100, ly: 1800, lyVar: 300, lyVarPercent: 16.7 }, gSales: { ytd: 42, ly: 36, lyVar: 6, lyVarPercent: 16.7 }, fGP: { ytd: 14, ly: 12, lyVar: 2, lyVarPercent: 16.7 }, fGPPercent: { ytd: 33.3, ly: 33.3, lyVar: 0.0 } },
        { name: 'Lakeshore', isTotal: false, cases: { ytd: 1500, ly: 2000, lyVar: -500, lyVarPercent: -25.0 }, gSales: { ytd: 30, ly: 40, lyVar: -10, lyVarPercent: -25.0 }, fGP: { ytd: 10, ly: 13, lyVar: -3, lyVarPercent: -23.1 }, fGPPercent: { ytd: 33.3, ly: 32.5, lyVar: 0.8 } },
        { name: 'GDF', isTotal: false, cases: { ytd: 890, ly: 750, lyVar: 140, lyVarPercent: 18.7 }, gSales: { ytd: 18, ly: 15, lyVar: 3, lyVarPercent: 20.0 }, fGP: { ytd: 6, ly: 5, lyVar: 1, lyVarPercent: 20.0 }, fGPPercent: { ytd: 33.3, ly: 33.3, lyVar: 0.0 } },
        { name: 'Irish Breeze', isTotal: false, cases: { ytd: 1234, ly: 1100, lyVar: 134, lyVarPercent: 12.2 }, gSales: { ytd: 25, ly: 22, lyVar: 3, lyVarPercent: 13.6 }, fGP: { ytd: 8, ly: 7, lyVar: 1, lyVarPercent: 14.3 }, fGPPercent: { ytd: 32.0, ly: 31.8, lyVar: 0.2 } },
        { name: 'PL Minor', isTotal: false, cases: { ytd: 2100, ly: 1800, lyVar: 300, lyVarPercent: 16.7 }, gSales: { ytd: 42, ly: 36, lyVar: 6, lyVarPercent: 16.7 }, fGP: { ytd: 14, ly: 12, lyVar: 2, lyVarPercent: 16.7 }, fGPPercent: { ytd: 33.3, ly: 33.3, lyVar: 0.0 } },
        { name: 'Bensons', isTotal: false, cases: { ytd: 876, ly: 950, lyVar: -74, lyVarPercent: -7.8 }, gSales: { ytd: 18, ly: 19, lyVar: -1, lyVarPercent: -5.3 }, fGP: { ytd: 6, ly: 6, lyVar: 0, lyVarPercent: 0.0 }, fGPPercent: { ytd: 33.3, ly: 31.6, lyVar: 1.7 } },
        { name: 'Babykind', isTotal: false, cases: { ytd: 1234, ly: 1100, lyVar: 134, lyVarPercent: 12.2 }, gSales: { ytd: 25, ly: 22, lyVar: 3, lyVarPercent: 13.6 }, fGP: { ytd: 8, ly: 7, lyVar: 1, lyVarPercent: 14.3 }, fGPPercent: { ytd: 32.0, ly: 31.8, lyVar: 0.2 } },
        
        // Sub-totals
        { name: 'Retail SKU\'s', isTotal: false, isSubTotal: true, cases: { ytd: 354451, ly: 361011, lyVar: -6560, lyVarPercent: -1.8 }, gSales: { ytd: 7506, ly: 7521, lyVar: -15, lyVarPercent: -0.2 }, fGP: { ytd: 2616, ly: 2579, lyVar: 38, lyVarPercent: 1.5 }, fGPPercent: { ytd: 34.9, ly: 34.3, lyVar: 0.6 } },
        
        // Grand total
        { name: 'Total', isTotal: true, cases: { ytd: 472546, ly: 477072, lyVar: -4526, lyVarPercent: -0.9 }, gSales: { ytd: 11799, ly: 11768, lyVar: 31, lyVarPercent: 0.3 }, fGP: { ytd: 4275, ly: 4162, lyVar: 114, lyVarPercent: 2.7 }, fGPPercent: { ytd: 36.2, ly: 35.4, lyVar: 0.9 } }
      ];

      // Apply filters to mock data
      let filteredData = [...mockData];

      // Add visual indicators to show filters are working
      let titleSuffix = '';
      if (filterParams.year && filterParams.year !== 2024) {
        titleSuffix += ` (Year: ${filterParams.year})`;
      }
      if (filterParams.month && filterParams.month !== 'All') {
        titleSuffix += ` (Month: ${filterParams.month})`;
      }

      if (titleSuffix) {
        // Update the main title
        filteredData = filteredData.map(item => {
          if (item.name === 'Total') {
            return { ...item, name: `Total${titleSuffix}` };
          }
          return item;
        });
      }

      // Apply year filter (simulate different data for different years)
      if (filterParams.year && filterParams.year !== 2024) {
        const yearMultiplier = filterParams.year === 2023 ? 0.8 : filterParams.year === 2025 ? 1.2 : 1.0;
        filteredData = filteredData.map(item => {
          const newItem = { ...item };
          if (newItem.cases) {
            newItem.cases = {
              ytd: Math.round(newItem.cases.ytd * yearMultiplier),
              ly: Math.round(newItem.cases.ly * yearMultiplier),
              lyVar: Math.round(newItem.cases.lyVar * yearMultiplier),
              lyVarPercent: newItem.cases.lyVarPercent
            };
          }
          if (newItem.gSales) {
            newItem.gSales = {
              ytd: Math.round(newItem.gSales.ytd * yearMultiplier),
              ly: Math.round(newItem.gSales.ly * yearMultiplier),
              lyVar: Math.round(newItem.gSales.lyVar * yearMultiplier),
              lyVarPercent: newItem.gSales.lyVarPercent
            };
          }
          if (newItem.fGP) {
            newItem.fGP = {
              ytd: Math.round(newItem.fGP.ytd * yearMultiplier),
              ly: Math.round(newItem.fGP.ly * yearMultiplier),
              lyVar: Math.round(newItem.fGP.lyVar * yearMultiplier),
              lyVarPercent: newItem.fGP.lyVarPercent
            };
          }
          if (newItem.fGPPercent) {
            newItem.fGPPercent = {
              ytd: newItem.fGPPercent.ytd,
              ly: newItem.fGPPercent.ly,
              lyVar: newItem.fGPPercent.lyVar
            };
          }
          return newItem;
        });
      }

      // Apply month filter (simulate monthly data)
      if (filterParams.month && filterParams.month !== 'All') {
        const monthMultiplier = 0.1; // Simulate monthly data (1/12 of annual)
        filteredData = filteredData.map(item => {
          const newItem = { ...item };
          if (newItem.cases) {
            newItem.cases = {
              ytd: Math.round(newItem.cases.ytd * monthMultiplier),
              ly: Math.round(newItem.cases.ly * monthMultiplier),
              lyVar: Math.round(newItem.cases.lyVar * monthMultiplier),
              lyVarPercent: newItem.cases.lyVarPercent
            };
          }
          if (newItem.gSales) {
            newItem.gSales = {
              ytd: Math.round(newItem.gSales.ytd * monthMultiplier),
              ly: Math.round(newItem.gSales.ly * monthMultiplier),
              lyVar: Math.round(newItem.gSales.lyVar * monthMultiplier),
              lyVarPercent: newItem.gSales.lyVarPercent
            };
          }
          if (newItem.fGP) {
            newItem.fGP = {
              ytd: Math.round(newItem.fGP.ytd * monthMultiplier),
              ly: Math.round(newItem.fGP.ly * monthMultiplier),
              lyVar: Math.round(newItem.fGP.lyVar * monthMultiplier),
              lyVarPercent: newItem.fGP.lyVarPercent
            };
          }
          if (newItem.fGPPercent) {
            newItem.fGPPercent = {
              ytd: newItem.fGPPercent.ytd,
              ly: newItem.fGPPercent.ly,
              lyVar: newItem.fGPPercent.lyVar
            };
          }
          return newItem;
        });
      }

      console.log('🔍 WS ROI Channel filters applied:', JSON.stringify(filterParams, null, 2));
      console.log('🔍 Filtered WS ROI Channel data:', JSON.stringify(filteredData, null, 2));

      setWsroiChannelData(filteredData);
      setLoadedSections(prev => new Set(prev).add('wsroiChannel'));
    } catch (error) {
      console.error('Error fetching WS ROI Channel data:', error);
      setWsroiChannelData([]);
    } finally {
      setLoadingStates(prev => ({ ...prev, wsroiChannel: false }));
    }
  };

  const fetchNPDData = async () => {
    console.log('🔍 fetchNPDData called!');
    setLoadingStates(prev => ({ ...prev, npd: true }));
    try {
      const filterParams = getFilterParams();
      console.log('🔍 Filter params:', JSON.stringify(filterParams, null, 2));

      // Mock data based on the screenshots
      let mockData: any[] = [
        {
          name: 'Erin',
          isTotal: false,
          children: [
            { name: 'Simmer GF', launchYear: 2021, productType: 'Foodservice', isTotal: false, cases: { ytd: 545, ly: 2672, lyVar: -2127, lyVarPercent: -79.6 }, gSales: { ytd: 11, ly: 50, lyVar: -38, lyVarPercent: -77.3 }, fGP: { ytd: 4, ly: 23, lyVar: -19, lyVarPercent: -80.8 }, fGPPercent: { ytd: 39.1, ly: 46.2, lyVar: -7.1 } },
            { name: 'Hotcup GF', launchYear: 2021, productType: 'Foodservice', isTotal: false, cases: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0.0 }, gSales: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0.0 }, fGP: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0.0 }, fGPPercent: { ytd: 0.0, ly: 0.0, lyVar: 0.0 } },
            { name: 'Simmer', launchYear: 2021, productType: 'Foodservice', isTotal: false, cases: { ytd: 3022, ly: 8055, lyVar: -5033, lyVarPercent: -62.5 }, gSales: { ytd: 95, ly: 182, lyVar: -88, lyVarPercent: -48.1 }, fGP: { ytd: 25, ly: 58, lyVar: -33, lyVarPercent: -56.9 }, fGPPercent: { ytd: 26.3, ly: 31.9, lyVar: -5.6 } }
          ]
        },
        {
          name: 'Total Erin',
          isTotal: true,
          cases: { ytd: 3567, ly: 10727, lyVar: -7160, lyVarPercent: -66.7 },
          gSales: { ytd: 106, ly: 232, lyVar: -126, lyVarPercent: -54.4 },
          fGP: { ytd: 29, ly: 81, lyVar: -52, lyVarPercent: -64.3 },
          fGPPercent: { ytd: 27.5, ly: 35.0, lyVar: -7.6 }
        },
        {
          name: 'BY Honey',
          isTotal: false,
          children: [
            { name: 'Hot honey', launchYear: 2025, productType: 'Hot', isTotal: false, cases: { ytd: 8762, ly: 0, lyVar: 8762, lyVarPercent: 100.0 }, gSales: { ytd: 149, ly: 0, lyVar: 149, lyVarPercent: 100.0 }, fGP: { ytd: 44, ly: 0, lyVar: 44, lyVarPercent: 100.0 }, fGPPercent: { ytd: 29.4, ly: 0.0, lyVar: 29.4 } }
          ]
        },
        {
          name: 'Total BY Honey',
          isTotal: true,
          cases: { ytd: 8762, ly: 0, lyVar: 8762, lyVarPercent: 100.0 },
          gSales: { ytd: 149, ly: 0, lyVar: 149, lyVarPercent: 100.0 },
          fGP: { ytd: 44, ly: 0, lyVar: 44, lyVarPercent: 100.0 },
          fGPPercent: { ytd: 29.4, ly: 0.0, lyVar: 29.4 }
        },
        {
          name: 'Don Carlos',
          isTotal: false,
          children: [
            { name: 'Olive Oil', launchYear: 2025, productType: 'Extra Virgin Spray', isTotal: false, cases: { ytd: 196, ly: 0, lyVar: 196, lyVarPercent: 100.0 }, gSales: { ytd: 7, ly: 0, lyVar: 7, lyVarPercent: 100.0 }, fGP: { ytd: 2, ly: 0, lyVar: 2, lyVarPercent: 100.0 }, fGPPercent: { ytd: 33.3, ly: 0.0, lyVar: 33.3 } }
          ]
        },
        {
          name: 'Total Don Carlos',
          isTotal: true,
          cases: { ytd: 196, ly: 0, lyVar: 196, lyVarPercent: 100.0 },
          gSales: { ytd: 7, ly: 0, lyVar: 7, lyVarPercent: 100.0 },
          fGP: { ytd: 2, ly: 0, lyVar: 2, lyVarPercent: 100.0 },
          fGPPercent: { ytd: 33.3, ly: 0.0, lyVar: 33.3 }
        },
        {
          name: 'GDF',
          isTotal: false,
          children: [
            { name: 'Salt/Pepper', launchYear: 2024, productType: 'Truffle', isTotal: false, cases: { ytd: 313, ly: 0, lyVar: 313, lyVarPercent: 100.0 }, gSales: { ytd: 4, ly: 0, lyVar: 4, lyVarPercent: 100.0 }, fGP: { ytd: 1, ly: 0, lyVar: 1, lyVarPercent: 100.0 }, fGPPercent: { ytd: 26.9, ly: 0.0, lyVar: 26.9 } }
          ]
        },
        {
          name: 'Total GDF',
          isTotal: true,
          cases: { ytd: 313, ly: 0, lyVar: 313, lyVarPercent: 100.0 },
          gSales: { ytd: 4, ly: 0, lyVar: 4, lyVarPercent: 100.0 },
          fGP: { ytd: 1, ly: 0, lyVar: 1, lyVarPercent: 100.0 },
          fGPPercent: { ytd: 26.9, ly: 0.0, lyVar: 26.9 }
        },
        {
          name: 'McDonnells',
          isTotal: false,
          children: [
            { name: 'Gluten Free Gravy', launchYear: 2021, productType: 'Foodservice', isTotal: false, cases: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0.0 }, gSales: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0.0 }, fGP: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0.0 }, fGPPercent: { ytd: 0.0, ly: 0.0, lyVar: 0.0 } },
            { name: 'Gluten Free Gravy', launchYear: 2023, productType: 'Retail', isTotal: false, cases: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0.0 }, gSales: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0.0 }, fGP: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0.0 }, fGPPercent: { ytd: 0.0, ly: 0.0, lyVar: 0.0 } },
            { name: 'Spice Bag', launchYear: 2022, productType: 'Foodservice', isTotal: false, cases: { ytd: 15804, ly: 16022, lyVar: -218, lyVarPercent: -1.4 }, gSales: { ytd: 459, ly: 436, lyVar: 23, lyVarPercent: 5.2 }, fGP: { ytd: 161, ly: 132, lyVar: 29, lyVarPercent: 22.1 }, fGPPercent: { ytd: 35.1, ly: 30.2, lyVar: 4.9 } }
          ]
        },
        {
          name: 'Total McDonnells',
          isTotal: true,
          cases: { ytd: 15804, ly: 16022, lyVar: -218, lyVarPercent: -1.4 },
          gSales: { ytd: 459, ly: 436, lyVar: 23, lyVarPercent: 5.2 },
          fGP: { ytd: 161, ly: 132, lyVar: 29, lyVarPercent: 22.1 },
          fGPPercent: { ytd: 35.1, ly: 30.2, lyVar: 4.9 }
        },
        {
          name: 'Koka',
          isTotal: false,
          children: [
            { name: 'Baked Packet noodles', launchYear: 2023, productType: 'Chicken', isTotal: false, cases: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0.0 }, gSales: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0.0 }, fGP: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0.0 }, fGPPercent: { ytd: 0.0, ly: 0.0, lyVar: 0.0 } },
            { name: 'Baked Packet noodles', launchYear: 2023, productType: 'Curry', isTotal: false, cases: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0.0 }, gSales: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0.0 }, fGP: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0.0 }, fGPPercent: { ytd: 0.0, ly: 0.0, lyVar: 0.0 } },
            { name: 'Packet noodles', launchYear: 2024, productType: 'Mi Goreng', isTotal: false, cases: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0.0 }, gSales: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0.0 }, fGP: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0.0 }, fGPPercent: { ytd: 0.0, ly: 0.0, lyVar: 0.0 } },
            { name: 'Packet noodles', launchYear: 2024, productType: 'Masala', isTotal: false, cases: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0.0 }, gSales: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0.0 }, fGP: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0.0 }, fGPPercent: { ytd: 0.0, ly: 0.0, lyVar: 0.0 } },
            { name: 'Noodle bowls', launchYear: 2024, productType: 'Chicken', isTotal: false, cases: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0.0 }, gSales: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0.0 }, fGP: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0.0 }, fGPPercent: { ytd: 0.0, ly: 0.0, lyVar: 0.0 } },
            { name: 'Noodle bowls', launchYear: 2024, productType: 'Curry', isTotal: false, cases: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0.0 }, gSales: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0.0 }, fGP: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0.0 }, fGPPercent: { ytd: 0.0, ly: 0.0, lyVar: 0.0 } },
            { name: 'Pot noodles', launchYear: 2024, productType: 'Spicy chicken', isTotal: false, cases: { ytd: 39866, ly: 4944, lyVar: 34922, lyVarPercent: 706.4 }, gSales: { ytd: 843, ly: 142, lyVar: 701, lyVarPercent: 492.3 }, fGP: { ytd: 227, ly: 51, lyVar: 177, lyVarPercent: 350.0 }, fGPPercent: { ytd: 27.0, ly: 35.5, lyVar: -8.5 } }
          ]
        },
        {
          name: 'Total Koka',
          isTotal: true,
          cases: { ytd: 39866, ly: 4944, lyVar: 34922, lyVarPercent: 706.4 },
          gSales: { ytd: 843, ly: 142, lyVar: 701, lyVarPercent: 492.3 },
          fGP: { ytd: 227, ly: 51, lyVar: 177, lyVarPercent: 350.0 },
          fGPPercent: { ytd: 27.0, ly: 35.5, lyVar: -8.5 }
        },
        {
          name: 'Total Food',
          isTotal: true,
          cases: { ytd: 78644, ly: 39271, lyVar: 39373, lyVarPercent: 100.3 },
          gSales: { ytd: 1781, ly: 977, lyVar: 803, lyVarPercent: 82.2 },
          fGP: { ytd: 502, ly: 283, lyVar: 219, lyVarPercent: 77.5 },
          fGPPercent: { ytd: 28.2, ly: 28.9, lyVar: -0.8 }
        },
        {
          name: 'Kinetica',
          isTotal: false,
          children: [
            { name: 'Collagen Powder', launchYear: 2023, productType: 'Berry', isTotal: false, cases: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0.0 }, gSales: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0.0 }, fGP: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0.0 }, fGPPercent: { ytd: 0.0, ly: 0.0, lyVar: 0.0 } },
            { name: 'Collagen Shots', launchYear: 2022, productType: 'Orange and Man', isTotal: false, cases: { ytd: 20546, ly: 11736, lyVar: 8810, lyVarPercent: 75.1 }, gSales: { ytd: 595, ly: 204, lyVar: 391, lyVarPercent: 192.7 }, fGP: { ytd: 377, ly: 181, lyVar: 195, lyVarPercent: 107.8 }, fGPPercent: { ytd: 63.4, ly: 88.7, lyVar: -25.3 } }
          ]
        },
        {
          name: 'Total Kinetica',
          isTotal: true,
          cases: { ytd: 20546, ly: 11736, lyVar: 8810, lyVarPercent: 75.1 },
          gSales: { ytd: 595, ly: 204, lyVar: 391, lyVarPercent: 192.7 },
          fGP: { ytd: 377, ly: 181, lyVar: 195, lyVarPercent: 107.8 },
          fGPPercent: { ytd: 63.4, ly: 88.7, lyVar: -25.3 }
        },
        {
          name: 'Total NPD',
          isTotal: true,
          cases: { ytd: 99190, ly: 51007, lyVar: 48183, lyVarPercent: 94.5 },
          gSales: { ytd: 2376, ly: 1181, lyVar: 1195, lyVarPercent: 101.2 },
          fGP: { ytd: 879, ly: 464, lyVar: 415, lyVarPercent: 89.3 },
          fGPPercent: { ytd: 37.0, ly: 39.3, lyVar: -2.3 }
        }
      ];

      // Apply filters to mock data
      let filteredData = [...mockData];

      // Add visual indicators to show filters are working
      let titleSuffix = '';
      if (filterParams.year && filterParams.year !== 2024) {
        titleSuffix += ` (Year: ${filterParams.year})`;
      }
      if (filterParams.month && filterParams.month !== 'All') {
        titleSuffix += ` (Month: ${filterParams.month})`;
      }

      if (titleSuffix) {
        // Update the main title
        filteredData = filteredData.map(item => {
          if (item.name === 'Total NPD') {
            return { ...item, name: `Total NPD${titleSuffix}` };
          }
          return item;
        });
      }

      // Apply year filter (simulate different data for different years)
      if (filterParams.year && filterParams.year !== 2024) {
        const yearMultiplier = filterParams.year === 2023 ? 0.8 : filterParams.year === 2025 ? 1.2 : 1.0;
        filteredData = filteredData.map(item => {
          const newItem = { ...item };
          if (newItem.children) {
            newItem.children = newItem.children.map((child: any) => {
              const newChild = { ...child };
              if (newChild.cases) {
                newChild.cases = {
                  ytd: Math.round(newChild.cases.ytd * yearMultiplier),
                  ly: Math.round(newChild.cases.ly * yearMultiplier),
                  lyVar: Math.round(newChild.cases.lyVar * yearMultiplier),
                  lyVarPercent: newChild.cases.lyVarPercent
                };
              }
              if (newChild.gSales) {
                newChild.gSales = {
                  ytd: Math.round(newChild.gSales.ytd * yearMultiplier),
                  ly: Math.round(newChild.gSales.ly * yearMultiplier),
                  lyVar: Math.round(newChild.gSales.lyVar * yearMultiplier),
                  lyVarPercent: newChild.gSales.lyVarPercent
                };
              }
              if (newChild.fGP) {
                newChild.fGP = {
                  ytd: Math.round(newChild.fGP.ytd * yearMultiplier),
                  ly: Math.round(newChild.fGP.ly * yearMultiplier),
                  lyVar: Math.round(newChild.fGP.lyVar * yearMultiplier),
                  lyVarPercent: newChild.fGP.lyVarPercent
                };
              }
              if (newChild.fGPPercent) {
                newChild.fGPPercent = {
                  ytd: newChild.fGPPercent.ytd,
                  ly: newChild.fGPPercent.ly,
                  lyVar: newChild.fGPPercent.lyVar
                };
              }
              return newChild;
            });
          }
          if (newItem.cases) {
            newItem.cases = {
              ytd: Math.round(newItem.cases.ytd * yearMultiplier),
              ly: Math.round(newItem.cases.ly * yearMultiplier),
              lyVar: Math.round(newItem.cases.lyVar * yearMultiplier),
              lyVarPercent: newItem.cases.lyVarPercent
            };
          }
          if (newItem.gSales) {
            newItem.gSales = {
              ytd: Math.round(newItem.gSales.ytd * yearMultiplier),
              ly: Math.round(newItem.gSales.ly * yearMultiplier),
              lyVar: Math.round(newItem.gSales.lyVar * yearMultiplier),
              lyVarPercent: newItem.gSales.lyVarPercent
            };
          }
          if (newItem.fGP) {
            newItem.fGP = {
              ytd: Math.round(newItem.fGP.ytd * yearMultiplier),
              ly: Math.round(newItem.fGP.ly * yearMultiplier),
              lyVar: Math.round(newItem.fGP.lyVar * yearMultiplier),
              lyVarPercent: newItem.fGP.lyVarPercent
            };
          }
          if (newItem.fGPPercent) {
            newItem.fGPPercent = {
              ytd: newItem.fGPPercent.ytd,
              ly: newItem.fGPPercent.ly,
              lyVar: newItem.fGPPercent.lyVar
            };
          }
          return newItem;
        });
      }

      // Apply month filter (simulate monthly data)
      if (filterParams.month && filterParams.month !== 'All') {
        const monthMultiplier = 0.1; // Simulate monthly data (1/12 of annual)
        filteredData = filteredData.map(item => {
          const newItem = { ...item };
          if (newItem.children) {
            newItem.children = newItem.children.map((child: any) => {
              const newChild = { ...child };
              if (newChild.cases) {
                newChild.cases = {
                  ytd: Math.round(newChild.cases.ytd * monthMultiplier),
                  ly: Math.round(newChild.cases.ly * monthMultiplier),
                  lyVar: Math.round(newChild.cases.lyVar * monthMultiplier),
                  lyVarPercent: newChild.cases.lyVarPercent
                };
              }
              if (newChild.gSales) {
                newChild.gSales = {
                  ytd: Math.round(newChild.gSales.ytd * monthMultiplier),
                  ly: Math.round(newChild.gSales.ly * monthMultiplier),
                  lyVar: Math.round(newChild.gSales.lyVar * monthMultiplier),
                  lyVarPercent: newChild.gSales.lyVarPercent
                };
              }
              if (newChild.fGP) {
                newChild.fGP = {
                  ytd: Math.round(newChild.fGP.ytd * monthMultiplier),
                  ly: Math.round(newChild.fGP.ly * monthMultiplier),
                  lyVar: Math.round(newChild.fGP.lyVar * monthMultiplier),
                  lyVarPercent: newChild.fGP.lyVarPercent
                };
              }
              if (newChild.fGPPercent) {
                newChild.fGPPercent = {
                  ytd: newChild.fGPPercent.ytd,
                  ly: newChild.fGPPercent.ly,
                  lyVar: newChild.fGPPercent.lyVar
                };
              }
              return newChild;
            });
          }
          if (newItem.cases) {
            newItem.cases = {
              ytd: Math.round(newItem.cases.ytd * monthMultiplier),
              ly: Math.round(newItem.cases.ly * monthMultiplier),
              lyVar: Math.round(newItem.cases.lyVar * monthMultiplier),
              lyVarPercent: newItem.cases.lyVarPercent
            };
          }
          if (newItem.gSales) {
            newItem.gSales = {
              ytd: Math.round(newItem.gSales.ytd * monthMultiplier),
              ly: Math.round(newItem.gSales.ly * monthMultiplier),
              lyVar: Math.round(newItem.gSales.lyVar * monthMultiplier),
              lyVarPercent: newItem.gSales.lyVarPercent
            };
          }
          if (newItem.fGP) {
            newItem.fGP = {
              ytd: Math.round(newItem.fGP.ytd * monthMultiplier),
              ly: Math.round(newItem.fGP.ly * monthMultiplier),
              lyVar: Math.round(newItem.fGP.lyVar * monthMultiplier),
              lyVarPercent: newItem.fGP.lyVarPercent
            };
          }
          if (newItem.fGPPercent) {
            newItem.fGPPercent = {
              ytd: newItem.fGPPercent.ytd,
              ly: newItem.fGPPercent.ly,
              lyVar: newItem.fGPPercent.lyVar
            };
          }
          return newItem;
        });
      }

      console.log('🔍 NPD filters applied:', JSON.stringify(filterParams, null, 2));
      console.log('🔍 Filtered NPD data:', JSON.stringify(filteredData, null, 2));

      setNpdData(filteredData);
      setLoadedSections(prev => new Set(prev).add('npd'));
    } catch (error) {
      console.error('Error fetching NPD data:', error);
      setNpdData([]);
    } finally {
      setLoadingStates(prev => ({ ...prev, npd: false }));
    }
  };

  const fetchPrivateLabelData = async () => {
    console.log('🔍 fetchPrivateLabelData called!');
    setLoadingStates(prev => ({ ...prev, privateLabel: true }));
    try {
      const filterParams = getFilterParams();
      console.log('🔍 Filter params:', JSON.stringify(filterParams, null, 2));

      // Mock data based on the screenshot
      let mockData: any[] = [
        {
          name: 'Household',
          isTotal: false,
          children: [
            { name: 'Powerforce', isTotal: false, cases: { ytd: 188228, ly: 125703, lyVar: 62525, lyVarPercent: 49.7 }, gSales: { ytd: 2738, ly: 1986, lyVar: 751, lyVarPercent: 37.8 }, fGP: { ytd: 727, ly: 457, lyVar: 270, lyVarPercent: 59.1 }, fGPPercent: { ytd: 26.5, ly: 23.0, lyVar: 3.6 } },
            { name: 'SuperValu', isTotal: false, cases: { ytd: 63034, ly: 67656, lyVar: -4622, lyVarPercent: -6.8 }, gSales: { ytd: 803, ly: 883, lyVar: -80, lyVarPercent: -9.1 }, fGP: { ytd: 136, ly: 175, lyVar: -39, lyVarPercent: -22.3 }, fGPPercent: { ytd: 16.9, ly: 19.8, lyVar: -2.9 } },
            { name: 'Centra', isTotal: false, cases: { ytd: 15000, ly: 13000, lyVar: 2000, lyVarPercent: 15.4 }, gSales: { ytd: 200, ly: 170, lyVar: 30, lyVarPercent: 17.6 }, fGP: { ytd: 50, ly: 40, lyVar: 10, lyVarPercent: 25.0 }, fGPPercent: { ytd: 25.0, ly: 23.5, lyVar: 1.5 } },
            { name: 'PL Minor', isTotal: false, cases: { ytd: 7216, ly: 9216, lyVar: -2000, lyVarPercent: -21.7 }, gSales: { ytd: 91, ly: 121, lyVar: -30, lyVarPercent: -24.8 }, fGP: { ytd: 9, ly: 14, lyVar: -5, lyVarPercent: -35.7 }, fGPPercent: { ytd: 9.9, ly: 11.4, lyVar: -1.5 } }
          ]
        },
        {
          name: 'Total (Household)',
          isTotal: true,
          cases: { ytd: 273478, ly: 216054, lyVar: 57424, lyVarPercent: 26.6 },
          gSales: { ytd: 3832, ly: 3190, lyVar: 643, lyVarPercent: 20.1 },
          fGP: { ytd: 922, ly: 706, lyVar: 216, lyVarPercent: 30.6 },
          fGPPercent: { ytd: 24.1, ly: 22.1, lyVar: 1.9 }
        },
        {
          name: 'Brillo & KMPL',
          isTotal: false,
          children: [
            { name: 'Clean It', isTotal: false, cases: { ytd: 32704, ly: 39200, lyVar: -6496, lyVarPercent: -16.6 }, gSales: { ytd: 266, ly: 319, lyVar: -53, lyVarPercent: -16.6 }, fGP: { ytd: 53, ly: 67, lyVar: -13, lyVarPercent: -20.2 }, fGPPercent: { ytd: 20.1, ly: 21.0, lyVar: -0.9 } },
            { name: 'Cederroth', isTotal: false, cases: { ytd: 12000, ly: 15000, lyVar: -3000, lyVarPercent: -20.0 }, gSales: { ytd: 96, ly: 120, lyVar: -24, lyVarPercent: -20.0 }, fGP: { ytd: 16, ly: 21, lyVar: -5, lyVarPercent: -23.8 }, fGPPercent: { ytd: 16.7, ly: 17.5, lyVar: -0.8 } },
            { name: 'Powerforce', isTotal: false, cases: { ytd: 10000, ly: 12000, lyVar: -2000, lyVarPercent: -16.7 }, gSales: { ytd: 80, ly: 96, lyVar: -16, lyVarPercent: -16.7 }, fGP: { ytd: 14, ly: 17, lyVar: -3, lyVarPercent: -17.6 }, fGPPercent: { ytd: 17.5, ly: 17.7, lyVar: -0.2 } },
            { name: 'SuperValu', isTotal: false, cases: { ytd: 8000, ly: 9000, lyVar: -1000, lyVarPercent: -11.1 }, gSales: { ytd: 64, ly: 72, lyVar: -8, lyVarPercent: -11.1 }, fGP: { ytd: 11, ly: 13, lyVar: -2, lyVarPercent: -15.4 }, fGPPercent: { ytd: 17.2, ly: 18.0, lyVar: -0.8 } },
            { name: 'Lilleborg', isTotal: false, cases: { ytd: 6000, ly: 6500, lyVar: -500, lyVarPercent: -7.7 }, gSales: { ytd: 48, ly: 52, lyVar: -4, lyVarPercent: -7.7 }, fGP: { ytd: 8, ly: 9, lyVar: -1, lyVarPercent: -11.1 }, fGPPercent: { ytd: 16.7, ly: 17.4, lyVar: -0.7 } },
            { name: 'PL Minor', isTotal: false, cases: { ytd: 1292, ly: 4408, lyVar: -3116, lyVarPercent: -70.7 }, gSales: { ytd: 9, ly: 34, lyVar: -25, lyVarPercent: -72.9 }, fGP: { ytd: 1, ly: 6, lyVar: -4, lyVarPercent: -80.9 }, fGPPercent: { ytd: 11.6, ly: 16.4, lyVar: -4.8 } },
            { name: 'Zeespons', isTotal: false, cases: { ytd: 3000, ly: 4000, lyVar: -1000, lyVarPercent: -25.0 }, gSales: { ytd: 24, ly: 32, lyVar: -8, lyVarPercent: -25.0 }, fGP: { ytd: 4, ly: 6, lyVar: -2, lyVarPercent: -33.3 }, fGPPercent: { ytd: 16.7, ly: 18.4, lyVar: -1.7 } },
            { name: 'Tesco', isTotal: false, cases: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0.0 }, gSales: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0.0 }, fGP: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0.0 }, fGPPercent: { ytd: 0.0, ly: 0.0, lyVar: 0.0 } },
            { name: 'PL minor brands', isTotal: false, cases: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0.0 }, gSales: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0.0 }, fGP: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0.0 }, fGPPercent: { ytd: 0.0, ly: 0.0, lyVar: 0.0 } },
            { name: 'Sainsbury', isTotal: false, cases: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0.0 }, gSales: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0.0 }, fGP: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0.0 }, fGPPercent: { ytd: 0.0, ly: 0.0, lyVar: 0.0 } },
            { name: 'Asda', isTotal: false, cases: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0.0 }, gSales: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0.0 }, fGP: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0.0 }, fGPPercent: { ytd: 0.0, ly: 0.0, lyVar: 0.0 } },
            { name: 'Morrissons', isTotal: false, cases: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0.0 }, gSales: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0.0 }, fGP: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0.0 }, fGPPercent: { ytd: 0.0, ly: 0.0, lyVar: 0.0 } }
          ]
        },
        {
          name: 'Total (Brillo & KMPL)',
          isTotal: true,
          cases: { ytd: 74144, ly: 98981, lyVar: -24837, lyVarPercent: -25.1 },
          gSales: { ytd: 565, ly: 753, lyVar: -189, lyVarPercent: -25.1 },
          fGP: { ytd: 99, ly: 136, lyVar: -36, lyVarPercent: -26.9 },
          fGPPercent: { ytd: 17.6, ly: 18.0, lyVar: -0.4 }
        },
        {
          name: 'Food',
          isTotal: false,
          children: [
            { name: 'Tesco', isTotal: false, cases: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0.0 }, gSales: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0.0 }, fGP: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0.0 }, fGPPercent: { ytd: 0.0, ly: 0.0, lyVar: 0.0 } },
            { name: 'Dunnes', isTotal: false, cases: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0.0 }, gSales: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0.0 }, fGP: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0.0 }, fGPPercent: { ytd: 0.0, ly: 0.0, lyVar: 0.0 } }
          ]
        },
        {
          name: 'Total (Food)',
          isTotal: true,
          cases: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0.0 },
          gSales: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0.0 },
          fGP: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0.0 },
          fGPPercent: { ytd: 0.0, ly: 0.0, lyVar: 0.0 }
        },
        {
          name: 'Total',
          isTotal: true,
          cases: { ytd: 347622, ly: 315035, lyVar: 32587, lyVarPercent: 10.3 },
          gSales: { ytd: 4397, ly: 3943, lyVar: 454, lyVarPercent: 11.5 },
          fGP: { ytd: 1021, ly: 842, lyVar: 179, lyVarPercent: 21.3 },
          fGPPercent: { ytd: 23.2, ly: 21.3, lyVar: 1.9 }
        }
      ];

      // Apply filters to mock data
      let filteredData = [...mockData];

      // Add visual indicators to show filters are working
      let titleSuffix = '';
      if (filterParams.year && filterParams.year !== 2024) {
        titleSuffix += ` (Year: ${filterParams.year})`;
      }
      if (filterParams.month && filterParams.month !== 'All') {
        titleSuffix += ` (Month: ${filterParams.month})`;
      }

      if (titleSuffix) {
        // Update the main title
        filteredData = filteredData.map(item => {
          if (item.name === 'Total') {
            return { ...item, name: `Total${titleSuffix}` };
          }
          return item;
        });
      }

      // Apply year filter (simulate different data for different years)
      if (filterParams.year && filterParams.year !== 2024) {
        const yearMultiplier = filterParams.year === 2023 ? 0.8 : filterParams.year === 2025 ? 1.2 : 1.0;
        filteredData = filteredData.map(item => {
          const newItem = { ...item };
          if (newItem.children) {
            newItem.children = newItem.children.map((child: any) => {
              const newChild = { ...child };
              if (newChild.cases) {
                newChild.cases = {
                  ytd: Math.round(newChild.cases.ytd * yearMultiplier),
                  ly: Math.round(newChild.cases.ly * yearMultiplier),
                  lyVar: Math.round(newChild.cases.lyVar * yearMultiplier),
                  lyVarPercent: newChild.cases.lyVarPercent
                };
              }
              if (newChild.gSales) {
                newChild.gSales = {
                  ytd: Math.round(newChild.gSales.ytd * yearMultiplier),
                  ly: Math.round(newChild.gSales.ly * yearMultiplier),
                  lyVar: Math.round(newChild.gSales.lyVar * yearMultiplier),
                  lyVarPercent: newChild.gSales.lyVarPercent
                };
              }
              if (newChild.fGP) {
                newChild.fGP = {
                  ytd: Math.round(newChild.fGP.ytd * yearMultiplier),
                  ly: Math.round(newChild.fGP.ly * yearMultiplier),
                  lyVar: Math.round(newChild.fGP.lyVar * yearMultiplier),
                  lyVarPercent: newChild.fGP.lyVarPercent
                };
              }
              if (newChild.fGPPercent) {
                newChild.fGPPercent = {
                  ytd: newChild.fGPPercent.ytd,
                  ly: newChild.fGPPercent.ly,
                  lyVar: newChild.fGPPercent.lyVar
                };
              }
              return newChild;
            });
          }
          if (newItem.cases) {
            newItem.cases = {
              ytd: Math.round(newItem.cases.ytd * yearMultiplier),
              lyVar: Math.round(newItem.cases.lyVar * yearMultiplier),
              lyVarPercent: newItem.cases.lyVarPercent
            };
          }
          if (newItem.gSales) {
            newItem.gSales = {
              ytd: Math.round(newItem.gSales.ytd * yearMultiplier),
              lyVar: Math.round(newItem.gSales.lyVar * yearMultiplier),
              lyVarPercent: newItem.gSales.lyVarPercent
            };
          }
          if (newItem.fGP) {
            newItem.fGP = {
              ytd: Math.round(newItem.fGP.ytd * yearMultiplier),
              lyVar: Math.round(newItem.fGP.lyVar * yearMultiplier),
              lyVarPercent: newItem.fGP.lyVarPercent
            };
          }
          if (newItem.fGPPercent) {
            newItem.fGPPercent = {
              ytd: newItem.fGPPercent.ytd,
              lyVar: newItem.fGPPercent.lyVar
            };
          }
          return newItem;
        });
      }

      // Apply month filter (simulate monthly data)
      if (filterParams.month && filterParams.month !== 'All') {
        const monthMultiplier = 0.1; // Simulate monthly data (1/12 of annual)
        filteredData = filteredData.map(item => {
          const newItem = { ...item };
          if (newItem.children) {
            newItem.children = newItem.children.map((child: any) => {
              const newChild = { ...child };
              if (newChild.cases) {
                newChild.cases = {
                  ytd: Math.round(newChild.cases.ytd * monthMultiplier),
                  lyVar: Math.round(newChild.cases.lyVar * monthMultiplier),
                  lyVarPercent: newChild.cases.lyVarPercent
                };
              }
              if (newChild.gSales) {
                newChild.gSales = {
                  ytd: Math.round(newChild.gSales.ytd * monthMultiplier),
                  lyVar: Math.round(newChild.gSales.lyVar * monthMultiplier),
                  lyVarPercent: newChild.gSales.lyVarPercent
                };
              }
              if (newChild.fGP) {
                newChild.fGP = {
                  ytd: Math.round(newChild.fGP.ytd * monthMultiplier),
                  lyVar: Math.round(newChild.fGP.lyVar * monthMultiplier),
                  lyVarPercent: newChild.fGP.lyVarPercent
                };
              }
              if (newChild.fGPPercent) {
                newChild.fGPPercent = {
                  ytd: newChild.fGPPercent.ytd,
                  lyVar: newChild.fGPPercent.lyVar
                };
              }
              return newChild;
            });
          }
          if (newItem.cases) {
            newItem.cases = {
              ytd: Math.round(newItem.cases.ytd * monthMultiplier),
              lyVar: Math.round(newItem.cases.lyVar * monthMultiplier),
              lyVarPercent: newItem.cases.lyVarPercent
            };
          }
          if (newItem.gSales) {
            newItem.gSales = {
              ytd: Math.round(newItem.gSales.ytd * monthMultiplier),
              lyVar: Math.round(newItem.gSales.lyVar * monthMultiplier),
              lyVarPercent: newItem.gSales.lyVarPercent
            };
          }
          if (newItem.fGP) {
            newItem.fGP = {
              ytd: Math.round(newItem.fGP.ytd * monthMultiplier),
              lyVar: Math.round(newItem.fGP.lyVar * monthMultiplier),
              lyVarPercent: newItem.fGP.lyVarPercent
            };
          }
          if (newItem.fGPPercent) {
            newItem.fGPPercent = {
              ytd: newItem.fGPPercent.ytd,
              lyVar: newItem.fGPPercent.lyVar
            };
          }
          return newItem;
        });
      }

      console.log('🔍 Private Label filters applied:', JSON.stringify(filterParams, null, 2));
      console.log('🔍 Filtered Private Label data:', JSON.stringify(filteredData, null, 2));

      setPrivateLabelData(filteredData);
      setLoadedSections(prev => new Set(prev).add('privateLabel'));
    } catch (error) {
      console.error('Error fetching Private Label data:', error);
      setPrivateLabelData([]);
    } finally {
      setLoadingStates(prev => ({ ...prev, privateLabel: false }));
    }
  };

  const fetchCategoriesData = async () => {
    console.log('🔍 fetchCategoriesData called!');
    setLoadingStates(prev => ({ ...prev, categories: true }));
    try {
      const filterParams = getFilterParams();
      console.log('🔍 Filter params:', JSON.stringify(filterParams, null, 2));

      // Mock data based on the screenshot
      let mockData: any[] = [
        {
          name: 'Snacking',
          isTotal: false,
          cases: { ytd: 792443, lyVar: -75557, lyVarPercent: -8.7 },
          gSales: { ytd: 15580, lyVar: -1466, lyVarPercent: -8.6 },
          fGP: { ytd: 4896, lyVar: -533, lyVarPercent: -9.8 },
          fGPPercent: { ytd: 31.4, lyVar: -0.4 }
        },
        {
          name: 'Sauces',
          isTotal: false,
          cases: { ytd: 292597, lyVar: -13953, lyVarPercent: -4.6 },
          gSales: { ytd: 8824, lyVar: -438, lyVarPercent: -4.7 },
          fGP: { ytd: 3576, lyVar: -29, lyVarPercent: -0.8 },
          fGPPercent: { ytd: 40.5, lyVar: 1.6 }
        },
        {
          name: 'Household Bags',
          isTotal: false,
          cases: { ytd: 400888, lyVar: 60760, lyVarPercent: 17.9 },
          gSales: { ytd: 9305, lyVar: 1150, lyVarPercent: 14.1 },
          fGP: { ytd: 2898, lyVar: 306, lyVarPercent: 11.8 },
          fGPPercent: { ytd: 31.1, lyVar: -0.6 }
        },
        {
          name: 'Preserves',
          isTotal: false,
          cases: { ytd: 731200, lyVar: -35097, lyVarPercent: -4.6 },
          gSales: { ytd: 10907, lyVar: -118, lyVarPercent: -1.1 },
          fGP: { ytd: 2739, lyVar: 551, lyVarPercent: 25.2 },
          fGPPercent: { ytd: 25.1, lyVar: 5.3 }
        },
        {
          name: 'Sports Nutrition',
          isTotal: false,
          cases: { ytd: 121099, lyVar: 28485, lyVarPercent: 30.8 },
          gSales: { ytd: 4216, lyVar: 883, lyVarPercent: 26.5 },
          fGP: { ytd: 1797, lyVar: 361, lyVarPercent: 25.1 },
          fGPPercent: { ytd: 42.6, lyVar: -0.5 }
        },
        {
          name: 'Household Cleaning',
          isTotal: false,
          cases: { ytd: 475655, lyVar: -54299, lyVarPercent: -10.2 },
          gSales: { ytd: 5799, lyVar: -567, lyVarPercent: -8.9 },
          fGP: { ytd: 1897, lyVar: -180, lyVarPercent: -8.7 },
          fGPPercent: { ytd: 32.7, lyVar: 0.1 }
        },
        {
          name: 'Oils',
          isTotal: false,
          cases: { ytd: 46203, lyVar: 2777, lyVarPercent: 6.4 },
          gSales: { ytd: 2788, lyVar: 531, lyVarPercent: 23.5 },
          fGP: { ytd: 629, lyVar: 218, lyVarPercent: 53.1 },
          fGPPercent: { ytd: 22.6, lyVar: 4.4 }
        },
        {
          name: 'Condiments',
          isTotal: false,
          cases: { ytd: 93341, lyVar: -15446, lyVarPercent: -14.2 },
          gSales: { ytd: 1617, lyVar: -174, lyVarPercent: -9.7 },
          fGP: { ytd: 538, lyVar: -11, lyVarPercent: -2.0 },
          fGPPercent: { ytd: 33.3, lyVar: 2.6 }
        },
        {
          name: 'Baking',
          isTotal: false,
          cases: { ytd: 87145, lyVar: 3172, lyVarPercent: 3.8 },
          gSales: { ytd: 1667, lyVar: 180, lyVarPercent: 12.1 },
          fGP: { ytd: 433, lyVar: 40, lyVarPercent: 10.2 },
          fGPPercent: { ytd: 26.0, lyVar: -0.4 }
        },
        {
          name: 'Desserts',
          isTotal: false,
          cases: { ytd: 64157, lyVar: -10038, lyVarPercent: -13.5 },
          gSales: { ytd: 1621, lyVar: -56, lyVarPercent: -3.3 },
          fGP: { ytd: 358, lyVar: 67, lyVarPercent: 23.1 },
          fGPPercent: { ytd: 22.1, lyVar: 4.7 }
        },
        {
          name: 'Soups',
          isTotal: false,
          cases: { ytd: 74864, lyVar: -36971, lyVarPercent: -33.1 },
          gSales: { ytd: 1588, lyVar: -530, lyVarPercent: -25.0 },
          fGP: { ytd: 401, lyVar: -306, lyVarPercent: -43.3 },
          fGPPercent: { ytd: 25.3, lyVar: -8.2 }
        },
        {
          name: 'Beauty',
          isTotal: false,
          cases: { ytd: 10414, lyVar: -568, lyVarPercent: -5.2 },
          gSales: { ytd: 268, lyVar: -26, lyVarPercent: -8.9 },
          fGP: { ytd: 95, lyVar: 7, lyVarPercent: 7.5 },
          fGPPercent: { ytd: 35.3, lyVar: 5.4 }
        },
        {
          name: 'Other',
          isTotal: false,
          cases: { ytd: 6716, lyVar: 19, lyVarPercent: 0.3 },
          gSales: { ytd: 222, lyVar: 17, lyVarPercent: 8.3 },
          fGP: { ytd: 53, lyVar: 3, lyVarPercent: 7.0 },
          fGPPercent: { ytd: 23.9, lyVar: -0.3 }
        },
        {
          name: 'Total',
          isTotal: true,
          cases: { ytd: 3196722, lyVar: -146716, lyVarPercent: -4.4 },
          gSales: { ytd: 64402, lyVar: -614, lyVarPercent: -0.9 },
          fGP: { ytd: 20310, lyVar: 494, lyVarPercent: 2.5 },
          fGPPercent: { ytd: 31.5, lyVar: 1.1 }
        }
      ];

      // Apply filters to mock data
      let filteredData = [...mockData];

      // Add visual indicators to show filters are working
      let titleSuffix = '';
      if (filterParams.year && filterParams.year !== 2024) {
        titleSuffix += ` (Year: ${filterParams.year})`;
      }
      if (filterParams.month && filterParams.month !== 'All') {
        titleSuffix += ` (Month: ${filterParams.month})`;
      }

      if (titleSuffix) {
        // Update the main title
        filteredData = filteredData.map(item => {
          if (item.name === 'Total') {
            return { ...item, name: `Total${titleSuffix}` };
          }
          return item;
        });
      }

      // Apply year filter (simulate different data for different years)
      if (filterParams.year && filterParams.year !== 2024) {
        const yearMultiplier = filterParams.year === 2023 ? 0.8 : filterParams.year === 2025 ? 1.2 : 1.0;
        filteredData = filteredData.map(item => {
          const newItem = { ...item };
          if (newItem.cases) {
            newItem.cases = {
              ytd: Math.round(newItem.cases.ytd * yearMultiplier),
              lyVar: Math.round(newItem.cases.lyVar * yearMultiplier),
              lyVarPercent: newItem.cases.lyVarPercent
            };
          }
          if (newItem.gSales) {
            newItem.gSales = {
              ytd: Math.round(newItem.gSales.ytd * yearMultiplier),
              lyVar: Math.round(newItem.gSales.lyVar * yearMultiplier),
              lyVarPercent: newItem.gSales.lyVarPercent
            };
          }
          if (newItem.fGP) {
            newItem.fGP = {
              ytd: Math.round(newItem.fGP.ytd * yearMultiplier),
              lyVar: Math.round(newItem.fGP.lyVar * yearMultiplier),
              lyVarPercent: newItem.fGP.lyVarPercent
            };
          }
          if (newItem.fGPPercent) {
            newItem.fGPPercent = {
              ytd: newItem.fGPPercent.ytd,
              lyVar: newItem.fGPPercent.lyVar
            };
          }
          return newItem;
        });
      }

      // Apply month filter (simulate monthly data)
      if (filterParams.month && filterParams.month !== 'All') {
        const monthMultiplier = 0.1; // Simulate monthly data (1/12 of annual)
        filteredData = filteredData.map(item => {
          const newItem = { ...item };
          if (newItem.cases) {
            newItem.cases = {
              ytd: Math.round(newItem.cases.ytd * monthMultiplier),
              lyVar: Math.round(newItem.cases.lyVar * monthMultiplier),
              lyVarPercent: newItem.cases.lyVarPercent
            };
          }
          if (newItem.gSales) {
            newItem.gSales = {
              ytd: Math.round(newItem.gSales.ytd * monthMultiplier),
              lyVar: Math.round(newItem.gSales.lyVar * monthMultiplier),
              lyVarPercent: newItem.gSales.lyVarPercent
            };
          }
          if (newItem.fGP) {
            newItem.fGP = {
              ytd: Math.round(newItem.fGP.ytd * monthMultiplier),
              lyVar: Math.round(newItem.fGP.lyVar * monthMultiplier),
              lyVarPercent: newItem.fGP.lyVarPercent
            };
          }
          if (newItem.fGPPercent) {
            newItem.fGPPercent = {
              ytd: newItem.fGPPercent.ytd,
              lyVar: newItem.fGPPercent.lyVar
            };
          }
          return newItem;
        });
      }

      console.log('🔍 Categories filters applied:', JSON.stringify(filterParams, null, 2));
      console.log('🔍 Filtered Categories data:', JSON.stringify(filteredData, null, 2));

      setCategoriesData(filteredData);
      setLoadedSections(prev => new Set(prev).add('categories'));
    } catch (error) {
      console.error('Error fetching Categories data:', error);
      setCategoriesData([]);
    } finally {
      setLoadingStates(prev => ({ ...prev, categories: false }));
    }
  };

  const fetchCategoriesSubcategoryData = async () => {
    console.log('🔍 fetchCategoriesSubcategoryData called!');
    setLoadingStates(prev => ({ ...prev, categoriesSubcategory: true }));
    try {
      const filterParams = getFilterParams();
      console.log('🔍 Filter params:', JSON.stringify(filterParams, null, 2));

      // Mock data based on the screenshots with realistic values
      let mockData: any[] = [
        {
          name: 'Total Condiments',
          isTotal: false,
          children: [
            { name: 'Chivers', isTotal: false, cases: { ytd: 1250, ly: 1180, lyVar: 70, lyVarPercent: 5.9 }, gSales: { ytd: 45, ly: 42, lyVar: 3, lyVarPercent: 7.1 }, fGP: { ytd: 18, ly: 17, lyVar: 1, lyVarPercent: 5.9 }, fGPPercent: { ytd: 40.0, ly: 40.5, lyVar: -0.5 } },
            { name: 'Cali Cali', isTotal: false, cases: { ytd: 0, ly: 450, lyVar: -450, lyVarPercent: -100.0 }, gSales: { ytd: 0, ly: 18, lyVar: -18, lyVarPercent: -100.0 }, fGP: { ytd: 0, ly: 7, lyVar: -7, lyVarPercent: -100.0 }, fGPPercent: { ytd: 0, ly: 38.9, lyVar: -38.9 } },
            { name: 'Tesco', isTotal: false, cases: { ytd: 890, ly: 920, lyVar: -30, lyVarPercent: -3.3 }, gSales: { ytd: 32, ly: 33, lyVar: -1, lyVarPercent: -3.0 }, fGP: { ytd: 13, ly: 13, lyVar: 0, lyVarPercent: 0.0 }, fGPPercent: { ytd: 40.6, ly: 39.4, lyVar: 1.2 } },
            { name: 'Dunnes', isTotal: false, cases: { ytd: 650, ly: 680, lyVar: -30, lyVarPercent: -4.4 }, gSales: { ytd: 23, ly: 24, lyVar: -1, lyVarPercent: -4.2 }, fGP: { ytd: 9, ly: 10, lyVar: -1, lyVarPercent: -10.0 }, fGPPercent: { ytd: 39.1, ly: 41.7, lyVar: -2.6 } }
          ]
        },
        {
          name: 'Total Condiments',
          isTotal: true,
          cases: { ytd: 2790, ly: 3230, lyVar: -440, lyVarPercent: -13.6 },
          gSales: { ytd: 100, ly: 117, lyVar: -17, lyVarPercent: -14.5 },
          fGP: { ytd: 40, ly: 47, lyVar: -7, lyVarPercent: -14.9 },
          fGPPercent: { ytd: 40.0, ly: 40.2, lyVar: -0.2 }
        },
        {
          name: 'HOUSEHOLD BAGS',
          isTotal: false,
          children: [
            { name: 'Plastic sacks', isTotal: false, cases: { ytd: 1200, ly: 1100, lyVar: 100, lyVarPercent: 9.1 }, gSales: { ytd: 24, ly: 22, lyVar: 2, lyVarPercent: 9.1 }, fGP: { ytd: 8, ly: 7, lyVar: 1, lyVarPercent: 14.3 }, fGPPercent: { ytd: 33.3, ly: 31.8, lyVar: 1.5 } },
            { name: 'Compost sacks', isTotal: false, cases: { ytd: 800, ly: 750, lyVar: 50, lyVarPercent: 6.7 }, gSales: { ytd: 16, ly: 15, lyVar: 1, lyVarPercent: 6.7 }, fGP: { ytd: 5, ly: 5, lyVar: 0, lyVarPercent: 0.0 }, fGPPercent: { ytd: 31.3, ly: 33.3, lyVar: -2.0 } },
            { name: 'Compost bags', isTotal: false, cases: { ytd: 600, ly: 650, lyVar: -50, lyVarPercent: -7.7 }, gSales: { ytd: 12, ly: 13, lyVar: -1, lyVarPercent: -7.7 }, fGP: { ytd: 4, ly: 4, lyVar: 0, lyVarPercent: 0.0 }, fGPPercent: { ytd: 33.3, ly: 30.8, lyVar: 2.5 } },
            { name: 'Shopping bags', isTotal: false, cases: { ytd: 400, ly: 420, lyVar: -20, lyVarPercent: -4.8 }, gSales: { ytd: 8, ly: 8, lyVar: 0, lyVarPercent: 0.0 }, fGP: { ytd: 3, ly: 3, lyVar: 0, lyVarPercent: 0.0 }, fGPPercent: { ytd: 37.5, ly: 37.5, lyVar: 0.0 } },
            { name: 'Nappy', isTotal: false, cases: { ytd: 300, ly: 280, lyVar: 20, lyVarPercent: 7.1 }, gSales: { ytd: 6, ly: 6, lyVar: 0, lyVarPercent: 0.0 }, fGP: { ytd: 2, ly: 2, lyVar: 0, lyVarPercent: 0.0 }, fGPPercent: { ytd: 33.3, ly: 33.3, lyVar: 0.0 } },
            { name: 'Fruit and Veg Bag', isTotal: false, cases: { ytd: 200, ly: 180, lyVar: 20, lyVarPercent: 11.1 }, gSales: { ytd: 4, ly: 4, lyVar: 0, lyVarPercent: 0.0 }, fGP: { ytd: 1, ly: 1, lyVar: 0, lyVarPercent: 0.0 }, fGPPercent: { ytd: 25.0, ly: 25.0, lyVar: 0.0 } },
            { name: 'Caddy Bin', isTotal: false, cases: { ytd: 0, ly: 150, lyVar: -150, lyVarPercent: -100.0 }, gSales: { ytd: 0, ly: 3, lyVar: -3, lyVarPercent: -100.0 }, fGP: { ytd: 0, ly: 1, lyVar: -1, lyVarPercent: -100.0 }, fGPPercent: { ytd: 0, ly: 33.3, lyVar: -33.3 } }
          ]
        },
        {
          name: 'TOTAL HOUSEHOLD BAGS',
          isTotal: true,
          cases: { ytd: 3500, ly: 3530, lyVar: -30, lyVarPercent: -0.8 },
          gSales: { ytd: 70, ly: 71, lyVar: -1, lyVarPercent: -1.4 },
          fGP: { ytd: 23, ly: 23, lyVar: 0, lyVarPercent: 0.0 },
          fGPPercent: { ytd: 32.9, ly: 32.4, lyVar: 0.5 }
        },
        {
          name: 'HOUSEHOLD CLEANING',
          isTotal: false,
          children: [
            {
              name: 'SOAPPADS',
              isTotal: false,
              children: [
                { name: 'Brillo', isTotal: false, cases: { ytd: 2500, ly: 2400, lyVar: 100, lyVarPercent: 4.2 }, gSales: { ytd: 75, ly: 72, lyVar: 3, lyVarPercent: 4.2 }, fGP: { ytd: 30, ly: 29, lyVar: 1, lyVarPercent: 3.4 }, fGPPercent: { ytd: 40.0, ly: 40.3, lyVar: -0.3 } },
                { name: 'Private Label', isTotal: false, cases: { ytd: 1800, ly: 1900, lyVar: -100, lyVarPercent: -5.3 }, gSales: { ytd: 54, ly: 57, lyVar: -3, lyVarPercent: -5.3 }, fGP: { ytd: 22, ly: 23, lyVar: -1, lyVarPercent: -4.3 }, fGPPercent: { ytd: 40.7, ly: 40.4, lyVar: 0.3 } }
              ]
            },
            {
              name: 'Total Soappads',
              isSubTotal: true,
              cases: { ytd: 4300, ly: 4300, lyVar: 0, lyVarPercent: 0.0 },
              gSales: { ytd: 129, ly: 129, lyVar: 0, lyVarPercent: 0.0 },
              fGP: { ytd: 52, ly: 52, lyVar: 0, lyVarPercent: 0.0 },
              fGPPercent: { ytd: 40.3, ly: 40.3, lyVar: 0.0 }
            },
            {
              name: 'Green Aware Goddards',
              isTotal: false,
              children: [
                { name: 'Household Cleaning', isTotal: false, cases: { ytd: 1200, ly: 1100, lyVar: 100, lyVarPercent: 9.1 }, gSales: { ytd: 36, ly: 33, lyVar: 3, lyVarPercent: 9.1 }, fGP: { ytd: 14, ly: 13, lyVar: 1, lyVarPercent: 7.7 }, fGPPercent: { ytd: 38.9, ly: 39.4, lyVar: -0.5 } }
              ]
            },
            {
              name: 'Cloths',
              isTotal: false,
              children: [
                { name: 'Killeen', isTotal: false, cases: { ytd: 3200, ly: 3000, lyVar: 200, lyVarPercent: 6.7 }, gSales: { ytd: 96, ly: 90, lyVar: 6, lyVarPercent: 6.7 }, fGP: { ytd: 38, ly: 36, lyVar: 2, lyVarPercent: 5.6 }, fGPPercent: { ytd: 39.6, ly: 40.0, lyVar: -0.4 } },
                { name: 'Private Label', isTotal: false, cases: { ytd: 1500, ly: 1600, lyVar: -100, lyVarPercent: -6.3 }, gSales: { ytd: 45, ly: 48, lyVar: -3, lyVarPercent: -6.3 }, fGP: { ytd: 18, ly: 19, lyVar: -1, lyVarPercent: -5.3 }, fGPPercent: { ytd: 40.0, ly: 39.6, lyVar: 0.4 } }
              ]
            },
            {
              name: 'Total Cloths',
              isSubTotal: true,
              cases: { ytd: 4700, ly: 4600, lyVar: 100, lyVarPercent: 2.2 },
              gSales: { ytd: 141, ly: 138, lyVar: 3, lyVarPercent: 2.2 },
              fGP: { ytd: 56, ly: 55, lyVar: 1, lyVarPercent: 1.8 },
              fGPPercent: { ytd: 39.7, ly: 39.9, lyVar: -0.2 }
            },
            {
              name: 'Gloves',
              isTotal: false,
              children: [
                { name: 'Killeen', isTotal: false, cases: { ytd: 800, ly: 750, lyVar: 50, lyVarPercent: 6.7 }, gSales: { ytd: 24, ly: 23, lyVar: 1, lyVarPercent: 4.3 }, fGP: { ytd: 10, ly: 9, lyVar: 1, lyVarPercent: 11.1 }, fGPPercent: { ytd: 41.7, ly: 39.1, lyVar: 2.6 } },
                { name: 'Private Label', isTotal: false, cases: { ytd: 600, ly: 650, lyVar: -50, lyVarPercent: -7.7 }, gSales: { ytd: 18, ly: 20, lyVar: -2, lyVarPercent: -10.0 }, fGP: { ytd: 7, ly: 8, lyVar: -1, lyVarPercent: -12.5 }, fGPPercent: { ytd: 38.9, ly: 40.0, lyVar: -1.1 } }
              ]
            },
            {
              name: 'Total Gloves',
              isSubTotal: true,
              cases: { ytd: 1400, ly: 1400, lyVar: 0, lyVarPercent: 0.0 },
              gSales: { ytd: 42, ly: 43, lyVar: -1, lyVarPercent: -2.3 },
              fGP: { ytd: 17, ly: 17, lyVar: 0, lyVarPercent: 0.0 },
              fGPPercent: { ytd: 40.5, ly: 39.5, lyVar: 1.0 }
            },
            {
              name: 'Other HH',
              isTotal: false,
              children: [
                { name: 'Killeen', isTotal: false, cases: { ytd: 900, ly: 850, lyVar: 50, lyVarPercent: 5.9 }, gSales: { ytd: 27, ly: 26, lyVar: 1, lyVarPercent: 3.8 }, fGP: { ytd: 11, ly: 10, lyVar: 1, lyVarPercent: 10.0 }, fGPPercent: { ytd: 40.7, ly: 38.5, lyVar: 2.2 } },
                { name: 'Private Label', isTotal: false, cases: { ytd: 700, ly: 750, lyVar: -50, lyVarPercent: -6.7 }, gSales: { ytd: 21, ly: 23, lyVar: -2, lyVarPercent: -8.7 }, fGP: { ytd: 8, ly: 9, lyVar: -1, lyVarPercent: -11.1 }, fGPPercent: { ytd: 38.1, ly: 39.1, lyVar: -1.0 } }
              ]
            },
            {
              name: 'Total Other HH',
              isSubTotal: true,
              cases: { ytd: 1600, ly: 1600, lyVar: 0, lyVarPercent: 0.0 },
              gSales: { ytd: 48, ly: 49, lyVar: -1, lyVarPercent: -2.0 },
              fGP: { ytd: 19, ly: 19, lyVar: 0, lyVarPercent: 0.0 },
              fGPPercent: { ytd: 39.6, ly: 38.8, lyVar: 0.8 }
            }
          ]
        },
        {
          name: 'TOTAL HOUSEHOLD CLEANING',
          isTotal: true,
          cases: { ytd: 12000, ly: 11900, lyVar: 100, lyVarPercent: 0.8 },
          gSales: { ytd: 360, ly: 357, lyVar: 3, lyVarPercent: 0.8 },
          fGP: { ytd: 144, ly: 143, lyVar: 1, lyVarPercent: 0.7 },
          fGPPercent: { ytd: 40.0, ly: 40.1, lyVar: -0.1 }
        },
        {
          name: 'Sports Nutrition',
          isTotal: false,
          children: [
            { name: 'Kinetica', isTotal: false, cases: { ytd: 5000, ly: 4200, lyVar: 800, lyVarPercent: 19.0 }, gSales: { ytd: 150, ly: 126, lyVar: 24, lyVarPercent: 19.0 }, fGP: { ytd: 60, ly: 50, lyVar: 10, lyVarPercent: 20.0 }, fGPPercent: { ytd: 40.0, ly: 39.7, lyVar: 0.3 } }
          ]
        },
        {
          name: 'Baking',
          isTotal: false,
          cases: { ytd: 800, ly: 750, lyVar: 50, lyVarPercent: 6.7 },
          gSales: { ytd: 24, ly: 23, lyVar: 1, lyVarPercent: 4.3 },
          fGP: { ytd: 10, ly: 9, lyVar: 1, lyVarPercent: 11.1 },
          fGPPercent: { ytd: 41.7, ly: 39.1, lyVar: 2.6 }
        },
        {
          name: 'Beauty',
          isTotal: false,
          cases: { ytd: 600, ly: 650, lyVar: -50, lyVarPercent: -7.7 },
          gSales: { ytd: 18, ly: 20, lyVar: -2, lyVarPercent: -10.0 },
          fGP: { ytd: 7, ly: 8, lyVar: -1, lyVarPercent: -12.5 },
          fGPPercent: { ytd: 38.9, ly: 40.0, lyVar: -1.1 }
        },
        {
          name: 'Other',
          isTotal: false,
          children: [
            { name: 'Cereals', isTotal: false, cases: { ytd: 400, ly: 380, lyVar: 20, lyVarPercent: 5.3 }, gSales: { ytd: 12, ly: 11, lyVar: 1, lyVarPercent: 9.1 }, fGP: { ytd: 5, ly: 4, lyVar: 1, lyVarPercent: 25.0 }, fGPPercent: { ytd: 41.7, ly: 36.4, lyVar: 5.3 } }
          ]
        },
        {
          name: 'Total',
          isTotal: true,
          cases: { ytd: 23490, ly: 22110, lyVar: 1380, lyVarPercent: 6.2 },
          gSales: { ytd: 704, ly: 663, lyVar: 41, lyVarPercent: 6.2 },
          fGP: { ytd: 282, ly: 265, lyVar: 17, lyVarPercent: 6.4 },
          fGPPercent: { ytd: 40.1, ly: 40.0, lyVar: 0.1 }
        }
      ];

      // Apply filters to mock data
      let filteredData = [...mockData];

      // Add visual indicators to show filters are working
      let titleSuffix = '';
      if (filterParams.year && filterParams.year !== 2024) {
        titleSuffix += ` (Year: ${filterParams.year})`;
      }
      if (filterParams.month && filterParams.month !== 'All') {
        titleSuffix += ` (Month: ${filterParams.month})`;
      }

      if (titleSuffix) {
        // Update the main title
        filteredData = filteredData.map(item => {
          if (item.name === 'Total') {
            return { ...item, name: `Total${titleSuffix}` };
          }
          return item;
        });
      }

      // Apply year filter (simulate different data for different years)
      if (filterParams.year && filterParams.year !== 2024) {
        const yearMultiplier = filterParams.year === 2023 ? 0.8 : filterParams.year === 2025 ? 1.2 : 1.0;
        filteredData = filteredData.map(item => {
          const newItem = { ...item };
          if (newItem.children) {
            newItem.children = newItem.children.map((child: any) => {
              const newChild = { ...child };
              if (newChild.children) {
                newChild.children = newChild.children.map((grandChild: any) => {
                  const newGrandChild = { ...grandChild };
                  if (newGrandChild.cases) {
                    newGrandChild.cases = {
                      ytd: Math.round(newGrandChild.cases.ytd * yearMultiplier),
                      ly: Math.round((newGrandChild.cases.ly || 0) * yearMultiplier),
                      lyVar: Math.round(newGrandChild.cases.lyVar * yearMultiplier),
                      lyVarPercent: newGrandChild.cases.lyVarPercent
                    };
                  }
                  if (newGrandChild.gSales) {
                    newGrandChild.gSales = {
                      ytd: Math.round(newGrandChild.gSales.ytd * yearMultiplier),
                      ly: Math.round((newGrandChild.gSales.ly || 0) * yearMultiplier),
                      lyVar: Math.round(newGrandChild.gSales.lyVar * yearMultiplier),
                      lyVarPercent: newGrandChild.gSales.lyVarPercent
                    };
                  }
                  if (newGrandChild.fGP) {
                    newGrandChild.fGP = {
                      ytd: Math.round(newGrandChild.fGP.ytd * yearMultiplier),
                      ly: Math.round((newGrandChild.fGP.ly || 0) * yearMultiplier),
                      lyVar: Math.round(newGrandChild.fGP.lyVar * yearMultiplier),
                      lyVarPercent: newGrandChild.fGP.lyVarPercent
                    };
                  }
                  if (newGrandChild.fGPPercent) {
                    newGrandChild.fGPPercent = {
                      ytd: newGrandChild.fGPPercent.ytd,
                      ly: newGrandChild.fGPPercent.ly,
                      lyVar: newGrandChild.fGPPercent.lyVar
                    };
                  }
                  return newGrandChild;
                });
              }
              if (newChild.cases) {
                newChild.cases = {
                  ytd: Math.round(newChild.cases.ytd * yearMultiplier),
                  ly: Math.round((newChild.cases.ly || 0) * yearMultiplier),
                  lyVar: Math.round(newChild.cases.lyVar * yearMultiplier),
                  lyVarPercent: newChild.cases.lyVarPercent
                };
              }
              if (newChild.gSales) {
                newChild.gSales = {
                  ytd: Math.round(newChild.gSales.ytd * yearMultiplier),
                  ly: Math.round((newChild.gSales.ly || 0) * yearMultiplier),
                  lyVar: Math.round(newChild.gSales.lyVar * yearMultiplier),
                  lyVarPercent: newChild.gSales.lyVarPercent
                };
              }
              if (newChild.fGP) {
                newChild.fGP = {
                  ytd: Math.round(newChild.fGP.ytd * yearMultiplier),
                  ly: Math.round((newChild.fGP.ly || 0) * yearMultiplier),
                  lyVar: Math.round(newChild.fGP.lyVar * yearMultiplier),
                  lyVarPercent: newChild.fGP.lyVarPercent
                };
              }
              if (newChild.fGPPercent) {
                newChild.fGPPercent = {
                  ytd: newChild.fGPPercent.ytd,
                  ly: newChild.fGPPercent.ly,
                  lyVar: newChild.fGPPercent.lyVar
                };
              }
              return newChild;
            });
          }
          if (newItem.cases) {
            newItem.cases = {
              ytd: Math.round(newItem.cases.ytd * yearMultiplier),
              ly: Math.round((newItem.cases.ly || 0) * yearMultiplier),
              lyVar: Math.round(newItem.cases.lyVar * yearMultiplier),
              lyVarPercent: newItem.cases.lyVarPercent
            };
          }
          if (newItem.gSales) {
            newItem.gSales = {
              ytd: Math.round(newItem.gSales.ytd * yearMultiplier),
              ly: Math.round((newItem.gSales.ly || 0) * yearMultiplier),
              lyVar: Math.round(newItem.gSales.lyVar * yearMultiplier),
              lyVarPercent: newItem.gSales.lyVarPercent
            };
          }
          if (newItem.fGP) {
            newItem.fGP = {
              ytd: Math.round(newItem.fGP.ytd * yearMultiplier),
              ly: Math.round((newItem.fGP.ly || 0) * yearMultiplier),
              lyVar: Math.round(newItem.fGP.lyVar * yearMultiplier),
              lyVarPercent: newItem.fGP.lyVarPercent
            };
          }
          if (newItem.fGPPercent) {
            newItem.fGPPercent = {
              ytd: newItem.fGPPercent.ytd,
              ly: newItem.fGPPercent.ly,
              lyVar: newItem.fGPPercent.lyVar
            };
          }
          return newItem;
        });
      }

      // Apply month filter (simulate monthly data)
      if (filterParams.month && filterParams.month !== 'All') {
        const monthMultiplier = 0.1; // Simulate monthly data (1/12 of annual)
        filteredData = filteredData.map(item => {
          const newItem = { ...item };
          if (newItem.children) {
            newItem.children = newItem.children.map((child: any) => {
              const newChild = { ...child };
              if (newChild.children) {
                newChild.children = newChild.children.map((grandChild: any) => {
                  const newGrandChild = { ...grandChild };
                  if (newGrandChild.cases) {
                    newGrandChild.cases = {
                      ytd: Math.round(newGrandChild.cases.ytd * monthMultiplier),
                      ly: Math.round((newGrandChild.cases.ly || 0) * monthMultiplier),
                      lyVar: Math.round(newGrandChild.cases.lyVar * monthMultiplier),
                      lyVarPercent: newGrandChild.cases.lyVarPercent
                    };
                  }
                  if (newGrandChild.gSales) {
                    newGrandChild.gSales = {
                      ytd: Math.round(newGrandChild.gSales.ytd * monthMultiplier),
                      ly: Math.round((newGrandChild.gSales.ly || 0) * monthMultiplier),
                      lyVar: Math.round(newGrandChild.gSales.lyVar * monthMultiplier),
                      lyVarPercent: newGrandChild.gSales.lyVarPercent
                    };
                  }
                  if (newGrandChild.fGP) {
                    newGrandChild.fGP = {
                      ytd: Math.round(newGrandChild.fGP.ytd * monthMultiplier),
                      ly: Math.round((newGrandChild.fGP.ly || 0) * monthMultiplier),
                      lyVar: Math.round(newGrandChild.fGP.lyVar * monthMultiplier),
                      lyVarPercent: newGrandChild.fGP.lyVarPercent
                    };
                  }
                  if (newGrandChild.fGPPercent) {
                    newGrandChild.fGPPercent = {
                      ytd: newGrandChild.fGPPercent.ytd,
                      ly: newGrandChild.fGPPercent.ly,
                      lyVar: newGrandChild.fGPPercent.lyVar
                    };
                  }
                  return newGrandChild;
                });
              }
              if (newChild.cases) {
                newChild.cases = {
                  ytd: Math.round(newChild.cases.ytd * monthMultiplier),
                  ly: Math.round((newChild.cases.ly || 0) * monthMultiplier),
                  lyVar: Math.round(newChild.cases.lyVar * monthMultiplier),
                  lyVarPercent: newChild.cases.lyVarPercent
                };
              }
              if (newChild.gSales) {
                newChild.gSales = {
                  ytd: Math.round(newChild.gSales.ytd * monthMultiplier),
                  ly: Math.round((newChild.gSales.ly || 0) * monthMultiplier),
                  lyVar: Math.round(newChild.gSales.lyVar * monthMultiplier),
                  lyVarPercent: newChild.gSales.lyVarPercent
                };
              }
              if (newChild.fGP) {
                newChild.fGP = {
                  ytd: Math.round(newChild.fGP.ytd * monthMultiplier),
                  ly: Math.round((newChild.fGP.ly || 0) * monthMultiplier),
                  lyVar: Math.round(newChild.fGP.lyVar * monthMultiplier),
                  lyVarPercent: newChild.fGP.lyVarPercent
                };
              }
              if (newChild.fGPPercent) {
                newChild.fGPPercent = {
                  ytd: newChild.fGPPercent.ytd,
                  ly: newChild.fGPPercent.ly,
                  lyVar: newChild.fGPPercent.lyVar
                };
              }
              return newChild;
            });
          }
          if (newItem.cases) {
            newItem.cases = {
              ytd: Math.round(newItem.cases.ytd * monthMultiplier),
              ly: Math.round((newItem.cases.ly || 0) * monthMultiplier),
              lyVar: Math.round(newItem.cases.lyVar * monthMultiplier),
              lyVarPercent: newItem.cases.lyVarPercent
            };
          }
          if (newItem.gSales) {
            newItem.gSales = {
              ytd: Math.round(newItem.gSales.ytd * monthMultiplier),
              ly: Math.round((newItem.gSales.ly || 0) * monthMultiplier),
              lyVar: Math.round(newItem.gSales.lyVar * monthMultiplier),
              lyVarPercent: newItem.gSales.lyVarPercent
            };
          }
          if (newItem.fGP) {
            newItem.fGP = {
              ytd: Math.round(newItem.fGP.ytd * monthMultiplier),
              ly: Math.round((newItem.fGP.ly || 0) * monthMultiplier),
              lyVar: Math.round(newItem.fGP.lyVar * monthMultiplier),
              lyVarPercent: newItem.fGP.lyVarPercent
            };
          }
          if (newItem.fGPPercent) {
            newItem.fGPPercent = {
              ytd: newItem.fGPPercent.ytd,
              ly: newItem.fGPPercent.ly,
              lyVar: newItem.fGPPercent.lyVar
            };
          }
          return newItem;
        });
      }

      console.log('🔍 Categories Subcategory filters applied:', JSON.stringify(filterParams, null, 2));
      console.log('🔍 Filtered Categories Subcategory data:', JSON.stringify(filteredData, null, 2));

      setCategoriesSubcategoryData(filteredData);
      setLoadedSections(prev => new Set(prev).add('categoriesSubcategory'));
    } catch (error) {
      console.error('Error fetching Categories Subcategory data:', error);
      setCategoriesSubcategoryData([]);
    } finally {
      setLoadingStates(prev => ({ ...prev, categoriesSubcategory: false }));
    }
  };

  const fetchKineticaData = async () => {
    console.log('🔍 fetchKineticaData called!');
    setLoadingStates(prev => ({ ...prev, kinetica: true }));
    try {
      const filterParams = getFilterParams();
      console.log('🔍 Filter params:', JSON.stringify(filterParams, null, 2));

      // Mock data based on the screenshot
      let mockData = [
        {
          name: 'Supplements',
          isTotal: false,
          children: [
            { name: 'Whey Protein', isTotal: false, cases: { ytd: 34674, ly: 30737, lyVar: 3937, lyVarPercent: 12.8 }, gSales: { ytd: 1843, ly: 1549, lyVar: 294, lyVarPercent: 19.0 }, fGP: { ytd: 594, ly: 576, lyVar: 18, lyVarPercent: 3.1 }, fGPPercent: { ytd: 32.2, ly: 37.2, lyVar: -5.0 } },
            { name: 'Creatine', isTotal: false, cases: { ytd: 21781, ly: 15333, lyVar: 6448, lyVarPercent: 42.1 }, gSales: { ytd: 681, ly: 484, lyVar: 197, lyVarPercent: 40.7 }, fGP: { ytd: 374, ly: 259, lyVar: 115, lyVarPercent: 44.3 }, fGPPercent: { ytd: 55.0, ly: 53.6, lyVar: 1.3 } },
            { name: 'Collagen Powder', isTotal: false, cases: { ytd: 12000, lyVar: 2400, lyVarPercent: 25.0 }, gSales: { ytd: 432, lyVar: 86, lyVarPercent: 25.0 }, fGP: { ytd: 187, lyVar: 37, lyVarPercent: 25.0 }, fGPPercent: { ytd: 43.3, lyVar: 0.0 } },
            { name: 'Electro C', isTotal: false, cases: { ytd: 8000, lyVar: 1600, lyVarPercent: 25.0 }, gSales: { ytd: 288, lyVar: 58, lyVarPercent: 25.0 }, fGP: { ytd: 125, lyVar: 25, lyVarPercent: 25.0 }, fGPPercent: { ytd: 43.3, lyVar: 0.0 } },
            { name: 'Gels', isTotal: false, cases: { ytd: 6000, lyVar: 1200, lyVarPercent: 25.0 }, gSales: { ytd: 216, lyVar: 43, lyVarPercent: 25.0 }, fGP: { ytd: 94, lyVar: 19, lyVarPercent: 25.0 }, fGPPercent: { ytd: 43.3, lyVar: 0.0 } },
            { name: 'Recovery', isTotal: false, cases: { ytd: 5000, lyVar: 1000, lyVarPercent: 25.0 }, gSales: { ytd: 180, lyVar: 36, lyVarPercent: 25.0 }, fGP: { ytd: 78, lyVar: 16, lyVarPercent: 25.0 }, fGPPercent: { ytd: 43.3, lyVar: 0.0 } },
            { name: 'Collagen Shots', isTotal: false, cases: { ytd: 3996, ly: 4443, lyVar: -447, lyVarPercent: -10.1 }, gSales: { ytd: 102, ly: 111, lyVar: -9, lyVarPercent: -7.9 }, fGP: { ytd: 50, ly: 53, lyVar: -3, lyVarPercent: -6.3 }, fGPPercent: { ytd: 48.5, ly: 47.7, lyVar: 0.8 } },
            { name: 'Oat Gain', isTotal: false, cases: { ytd: 3500, lyVar: 700, lyVarPercent: 25.0 }, gSales: { ytd: 126, lyVar: 25, lyVarPercent: 25.0 }, fGP: { ytd: 55, lyVar: 11, lyVarPercent: 25.0 }, fGPPercent: { ytd: 43.3, lyVar: 0.0 } },
            { name: 'PreFuel', isTotal: false, cases: { ytd: 3000, lyVar: 600, lyVarPercent: 25.0 }, gSales: { ytd: 108, lyVar: 22, lyVarPercent: 25.0 }, fGP: { ytd: 47, lyVar: 9, lyVarPercent: 25.0 }, fGPPercent: { ytd: 43.3, lyVar: 0.0 } },
            { name: 'Zinc Mag', isTotal: false, cases: { ytd: 2500, lyVar: 500, lyVarPercent: 25.0 }, gSales: { ytd: 90, lyVar: 18, lyVarPercent: 25.0 }, fGP: { ytd: 39, lyVar: 8, lyVarPercent: 25.0 }, fGPPercent: { ytd: 43.3, lyVar: 0.0 } },
            { name: 'Clear Whey', isTotal: false, cases: { ytd: 2000, lyVar: 400, lyVarPercent: 25.0 }, gSales: { ytd: 72, lyVar: 14, lyVarPercent: 25.0 }, fGP: { ytd: 31, lyVar: 6, lyVarPercent: 25.0 }, fGPPercent: { ytd: 43.3, lyVar: 0.0 } },
            { name: 'Energy', isTotal: false, cases: { ytd: 1500, lyVar: 300, lyVarPercent: 25.0 }, gSales: { ytd: 54, lyVar: 11, lyVarPercent: 25.0 }, fGP: { ytd: 23, lyVar: 5, lyVarPercent: 25.0 }, fGPPercent: { ytd: 43.3, lyVar: 0.0 } },
            { name: 'Lean Act Protein', isTotal: false, cases: { ytd: 1000, lyVar: 200, lyVarPercent: 25.0 }, gSales: { ytd: 36, lyVar: 7, lyVarPercent: 25.0 }, fGP: { ytd: 16, lyVar: 3, lyVarPercent: 25.0 }, fGPPercent: { ytd: 43.3, lyVar: 0.0 } },
            { name: 'Plant Protein', isTotal: false, cases: { ytd: 800, lyVar: 160, lyVarPercent: 25.0 }, gSales: { ytd: 29, lyVar: 6, lyVarPercent: 25.0 }, fGP: { ytd: 13, lyVar: 3, lyVarPercent: 25.0 }, fGPPercent: { ytd: 43.3, lyVar: 0.0 } },
            { name: 'Vitamin D', isTotal: false, cases: { ytd: 107, ly: 1373, lyVar: -1266, lyVarPercent: -92.2 }, gSales: { ytd: 2, ly: 18, lyVar: -16, lyVarPercent: -91.1 }, fGP: { ytd: 1, ly: 12, lyVar: -11, lyVarPercent: -90.8 }, fGPPercent: { ytd: 66.5, ly: 64.2, lyVar: 2.2 } },
            { name: 'Omega 3', isTotal: false, cases: { ytd: 400, lyVar: 80, lyVarPercent: 25.0 }, gSales: { ytd: 14, lyVar: 3, lyVarPercent: 25.0 }, fGP: { ytd: 6, lyVar: 1, lyVarPercent: 25.0 }, fGPPercent: { ytd: 43.3, lyVar: 0.0 } }
          ]
        },
        {
          name: 'Supplements total',
          isTotal: true,
          cases: { ytd: 114471, ly: 90887, lyVar: 23584, lyVarPercent: 25.9 },
          gSales: { ytd: 4161, ly: 3327, lyVar: 834, lyVarPercent: 25.1 },
          fGP: { ytd: 1810, ly: 1434, lyVar: 376, lyVarPercent: 26.2 },
          fGPPercent: { ytd: 43.5, ly: 43.1, lyVar: 0.4 }
        },
        {
          name: 'Food & Beverage',
          isTotal: false,
          children: [
            { name: 'RTD\'s', isTotal: false, cases: { ytd: 35791, ly: 39130, lyVar: -3339, lyVarPercent: -8.5 }, gSales: { ytd: 806, ly: 873, lyVar: -67, lyVarPercent: -7.7 }, fGP: { ytd: 209, ly: 207, lyVar: 2, lyVarPercent: 1.1 }, fGPPercent: { ytd: 26.0, ly: 23.7, lyVar: 2.3 } },
            { name: 'Protein Bar', isTotal: false, cases: { ytd: 965, ly: 11205, lyVar: -10240, lyVarPercent: -91.4 }, gSales: { ytd: 18, ly: 246, lyVar: -228, lyVarPercent: -92.7 }, fGP: { ytd: 4, ly: 33, lyVar: -29, lyVarPercent: -87.9 }, fGPPercent: { ytd: 25.9, ly: 13.4, lyVar: 12.5 } }
          ]
        },
        {
          name: 'Food & Beverage total',
          isTotal: true,
          cases: { ytd: 36756, ly: 50335, lyVar: -13579, lyVarPercent: -27.0 },
          gSales: { ytd: 824, ly: 1114, lyVar: -290, lyVarPercent: -26.0 },
          fGP: { ytd: 213, ly: 240, lyVar: -27, lyVarPercent: -11.1 },
          fGPPercent: { ytd: 25.9, ly: 21.5, lyVar: 4.3 }
        },
        {
          name: 'Clothing & Accessories',
          isTotal: false,
          children: [
            { name: 'Shaker', isTotal: false, cases: { ytd: 3522, ly: 1203, lyVar: 2319, lyVarPercent: 192.8 }, gSales: { ytd: 18, ly: 4, lyVar: 14, lyVarPercent: 345.4 }, fGP: { ytd: 5, ly: 2, lyVar: 3, lyVarPercent: 207.0 }, fGPPercent: { ytd: 26.0, ly: 37.7, lyVar: -11.7 } },
            { name: 'Water Bottle', isTotal: false, cases: { ytd: 2599, ly: 522, lyVar: 2077, lyVarPercent: 398.1 }, gSales: { ytd: 17, ly: 11, lyVar: 6, lyVarPercent: 54.5 }, fGP: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0.0 }, fGPPercent: { ytd: 0.0, ly: 0.0, lyVar: 0.0 } },
            { name: 'Clothing', isTotal: false, cases: { ytd: 507, ly: 2, lyVar: 505, lyVarPercent: 25250.0 }, gSales: { ytd: 20, ly: 0, lyVar: 20, lyVarPercent: 49923.3 }, fGP: { ytd: -13, ly: 0, lyVar: -13, lyVarPercent: -162959.9 }, fGPPercent: { ytd: -65.6, ly: -20.1, lyVar: -45.5 } }
          ]
        },
        {
          name: 'Accessories total',
          isTotal: true,
          cases: { ytd: 6628, ly: 1727, lyVar: 4901, lyVarPercent: 283.8 },
          gSales: { ytd: 55, ly: 6, lyVar: 49, lyVarPercent: 791.6 },
          fGP: { ytd: -13, ly: 2, lyVar: -15, lyVarPercent: -639.5 },
          fGPPercent: { ytd: -22.9, ly: 37.8, lyVar: -60.7 }
        },
        {
          name: 'Total Kinetica',
          isTotal: true,
          cases: { ytd: 157855, ly: 142949, lyVar: 14906, lyVarPercent: 10.4 },
          gSales: { ytd: 5040, ly: 4447, lyVar: 593, lyVarPercent: 13.3 },
          fGP: { ytd: 2011, ly: 1676, lyVar: 334, lyVarPercent: 19.9 },
          fGPPercent: { ytd: 39.9, ly: 37.7, lyVar: 2.2 }
        }
      ];

      // Apply filters to mock data
      let filteredData = [...mockData];

      // Add visual indicators to show filters are working
      let titleSuffix = '';
      if (filterParams.year && filterParams.year !== 2024) {
        titleSuffix += ` (Year: ${filterParams.year})`;
      }
      if (filterParams.month && filterParams.month !== 'All') {
        titleSuffix += ` (Month: ${filterParams.month})`;
      }

      if (titleSuffix) {
        // Update the main title
        filteredData = filteredData.map(item => {
          if (item.name === 'Total Kinetica') {
            return { ...item, name: `Total Kinetica${titleSuffix}` };
          }
          return item;
        });
      }

      // Apply year filter (simulate different data for different years)
      if (filterParams.year && filterParams.year !== 2024) {
        const yearMultiplier = filterParams.year === 2023 ? 0.8 : filterParams.year === 2025 ? 1.2 : 1.0;
        filteredData = filteredData.map(item => {
          const newItem = { ...item };
          if (newItem.children) {
            newItem.children = newItem.children.map(child => {
              const newChild = { ...child };
              if (newChild.cases) {
                newChild.cases = {
                  ytd: Math.round(newChild.cases.ytd * yearMultiplier),
                  ly: Math.round((newChild.cases.ly || 0) * yearMultiplier),
                  lyVar: Math.round(newChild.cases.lyVar * yearMultiplier),
                  lyVarPercent: newChild.cases.lyVarPercent
                };
              }
              if (newChild.gSales) {
                newChild.gSales = {
                  ytd: Math.round(newChild.gSales.ytd * yearMultiplier),
                  ly: Math.round((newChild.gSales.ly || 0) * yearMultiplier),
                  lyVar: Math.round(newChild.gSales.lyVar * yearMultiplier),
                  lyVarPercent: newChild.gSales.lyVarPercent
                };
              }
              if (newChild.fGP) {
                newChild.fGP = {
                  ytd: Math.round(newChild.fGP.ytd * yearMultiplier),
                  ly: Math.round((newChild.fGP.ly || 0) * yearMultiplier),
                  lyVar: Math.round(newChild.fGP.lyVar * yearMultiplier),
                  lyVarPercent: newChild.fGP.lyVarPercent
                };
              }
              if (newChild.fGPPercent) {
                newChild.fGPPercent = {
                  ytd: newChild.fGPPercent.ytd,
                  ly: newChild.fGPPercent.ly,
                  lyVar: newChild.fGPPercent.lyVar
                };
              }
              return newChild;
            });
          }
          if (newItem.cases) {
            newItem.cases = {
              ytd: Math.round(newItem.cases.ytd * yearMultiplier),
              ly: Math.round(newItem.cases.ly * yearMultiplier),
              lyVar: Math.round(newItem.cases.lyVar * yearMultiplier),
              lyVarPercent: newItem.cases.lyVarPercent
            };
          }
          if (newItem.gSales) {
            newItem.gSales = {
              ytd: Math.round(newItem.gSales.ytd * yearMultiplier),
              ly: Math.round(newItem.gSales.ly * yearMultiplier),
              lyVar: Math.round(newItem.gSales.lyVar * yearMultiplier),
              lyVarPercent: newItem.gSales.lyVarPercent
            };
          }
          if (newItem.fGP) {
            newItem.fGP = {
              ytd: Math.round(newItem.fGP.ytd * yearMultiplier),
              ly: Math.round(newItem.fGP.ly * yearMultiplier),
              lyVar: Math.round(newItem.fGP.lyVar * yearMultiplier),
              lyVarPercent: newItem.fGP.lyVarPercent
            };
          }
          if (newItem.fGPPercent) {
            newItem.fGPPercent = {
              ytd: newItem.fGPPercent.ytd,
              ly: newItem.fGPPercent.ly,
              lyVar: newItem.fGPPercent.lyVar
            };
          }
          return newItem;
        });
      }

      // Apply month filter (simulate monthly data)
      if (filterParams.month && filterParams.month !== 'All') {
        const monthMultiplier = 0.1; // Simulate monthly data (1/12 of annual)
        filteredData = filteredData.map(item => {
          const newItem = { ...item };
          if (newItem.children) {
            newItem.children = newItem.children.map(child => {
              const newChild = { ...child };
              if (newChild.cases) {
                newChild.cases = {
                  ytd: Math.round(newChild.cases.ytd * monthMultiplier),
                  ly: Math.round((newChild.cases.ly || 0) * monthMultiplier),
                  lyVar: Math.round(newChild.cases.lyVar * monthMultiplier),
                  lyVarPercent: newChild.cases.lyVarPercent
                };
              }
              if (newChild.gSales) {
                newChild.gSales = {
                  ytd: Math.round(newChild.gSales.ytd * monthMultiplier),
                  ly: Math.round((newChild.gSales.ly || 0) * monthMultiplier),
                  lyVar: Math.round(newChild.gSales.lyVar * monthMultiplier),
                  lyVarPercent: newChild.gSales.lyVarPercent
                };
              }
              if (newChild.fGP) {
                newChild.fGP = {
                  ytd: Math.round(newChild.fGP.ytd * monthMultiplier),
                  ly: Math.round((newChild.fGP.ly || 0) * monthMultiplier),
                  lyVar: Math.round(newChild.fGP.lyVar * monthMultiplier),
                  lyVarPercent: newChild.fGP.lyVarPercent
                };
              }
              if (newChild.fGPPercent) {
                newChild.fGPPercent = {
                  ytd: newChild.fGPPercent.ytd,
                  ly: newChild.fGPPercent.ly,
                  lyVar: newChild.fGPPercent.lyVar
                };
              }
              return newChild;
            });
          }
          if (newItem.cases) {
            newItem.cases = {
              ytd: Math.round(newItem.cases.ytd * monthMultiplier),
              ly: Math.round(newItem.cases.ly * monthMultiplier),
              lyVar: Math.round(newItem.cases.lyVar * monthMultiplier),
              lyVarPercent: newItem.cases.lyVarPercent
            };
          }
          if (newItem.gSales) {
            newItem.gSales = {
              ytd: Math.round(newItem.gSales.ytd * monthMultiplier),
              ly: Math.round(newItem.gSales.ly * monthMultiplier),
              lyVar: Math.round(newItem.gSales.lyVar * monthMultiplier),
              lyVarPercent: newItem.gSales.lyVarPercent
            };
          }
          if (newItem.fGP) {
            newItem.fGP = {
              ytd: Math.round(newItem.fGP.ytd * monthMultiplier),
              ly: Math.round(newItem.fGP.ly * monthMultiplier),
              lyVar: Math.round(newItem.fGP.lyVar * monthMultiplier),
              lyVarPercent: newItem.fGP.lyVarPercent
            };
          }
          if (newItem.fGPPercent) {
            newItem.fGPPercent = {
              ytd: newItem.fGPPercent.ytd,
              ly: newItem.fGPPercent.ly,
              lyVar: newItem.fGPPercent.lyVar
            };
          }
          return newItem;
        });
      }

      console.log('🔍 Kinetica filters applied:', JSON.stringify(filterParams, null, 2));
      console.log('🔍 Filtered Kinetica data:', JSON.stringify(filteredData, null, 2));

      setKineticaData(filteredData);
      setLoadedSections(prev => new Set(prev).add('kinetica'));
    } catch (error) {
      console.error('Error fetching Kinetica data:', error);
      setKineticaData([]);
    } finally {
      setLoadingStates(prev => ({ ...prev, kinetica: false }));
    }
  };

  const fetchBrilloKilleenData = async () => {
    console.log('🔍 fetchBrilloKilleenData called!');
    setLoadingStates(prev => ({ ...prev, brilloKilleen: true }));
    try {
      const filterParams = getFilterParams();
      console.log('🔍 Filter params:', JSON.stringify(filterParams, null, 2));
      
      // For now, we'll use mock data based on the screenshot
      // In production, this would call a real API endpoint
      let mockData = [
        {
          name: 'Brillo & KMPL',
          isTotal: false,
          children: [
            {
              name: 'Brillo',
              isTotal: false,
              children: [
                {
                  name: 'Soappads',
                  isTotal: false,
                  cases: { ytd: 155835, ly: 175475, lyVar: -19640, lyVarPercent: -11.2 },
                  gSales: { ytd: 1872, ly: 2118, lyVar: -246, lyVarPercent: -11.6 },
                  fGP: { ytd: 668, ly: 784, lyVar: -116, lyVarPercent: -14.8 },
                  fGPPercent: { ytd: 35.7, ly: 37.0, lyVar: -1.3 }
                },
                {
                  name: 'Powerpads',
                  isTotal: false,
                  cases: { ytd: 11372, ly: 11586, lyVar: -214, lyVarPercent: -1.8 },
                  gSales: { ytd: 136, ly: 140, lyVar: -4, lyVarPercent: -2.9 },
                  fGP: { ytd: 48, ly: 52, lyVar: -4, lyVarPercent: -7.7 },
                  fGPPercent: { ytd: 35.3, ly: 37.1, lyVar: -1.8 }
                }
              ]
            },
            {
              name: 'Brillo Total',
              isTotal: true,
              cases: { ytd: 167207, ly: 187061, lyVar: -19854, lyVarPercent: -10.6 },
              gSales: { ytd: 2008, ly: 2258, lyVar: -250, lyVarPercent: -11.1 },
              fGP: { ytd: 716, ly: 836, lyVar: -120, lyVarPercent: -14.4 },
              fGPPercent: { ytd: 35.7, ly: 37.0, lyVar: -1.3 }
            },
            {
              name: 'Private Label',
              isTotal: false,
              children: [
                {
                  name: 'Clean It',
                  isTotal: false,
                  cases: { ytd: 32704, ly: 39200, lyVar: -6496, lyVarPercent: -16.6 },
                  gSales: { ytd: 393, ly: 470, lyVar: -77, lyVarPercent: -16.4 },
                  fGP: { ytd: 118, ly: 141, lyVar: -23, lyVarPercent: -16.3 },
                  fGPPercent: { ytd: 30.0, ly: 30.0, lyVar: 0.0 }
                },
                {
                  name: 'Cederroth',
                  isTotal: false,
                  cases: { ytd: 1176, ly: 1960, lyVar: -784, lyVarPercent: -40.0 },
                  gSales: { ytd: 141, ly: 237, lyVar: -96, lyVarPercent: -40.4 },
                  fGP: { ytd: 4, ly: 10, lyVar: -6, lyVarPercent: -60.0 },
                  fGPPercent: { ytd: 2.8, ly: 4.2, lyVar: -1.4 }
                },
                {
                  name: 'Powerforce',
                  isTotal: false,
                  cases: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0 },
                  gSales: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0 },
                  fGP: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0 },
                  fGPPercent: { ytd: 0, ly: 0, lyVar: 0 }
                },
                {
                  name: 'SuperValu',
                  isTotal: false,
                  cases: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0 },
                  gSales: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0 },
                  fGP: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0 },
                  fGPPercent: { ytd: 0, ly: 0, lyVar: 0 }
                },
                {
                  name: 'Lilleborg',
                  isTotal: false,
                  cases: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0 },
                  gSales: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0 },
                  fGP: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0 },
                  fGPPercent: { ytd: 6.7, ly: 8.9, lyVar: -2.2 }
                },
                {
                  name: 'PL Minor',
                  isTotal: false,
                  cases: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0 },
                  gSales: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0 },
                  fGP: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0 },
                  fGPPercent: { ytd: 0, ly: 0, lyVar: 0 }
                },
                {
                  name: 'Zeespons',
                  isTotal: false,
                  cases: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0 },
                  gSales: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0 },
                  fGP: { ytd: 4, ly: 10, lyVar: -6, lyVarPercent: -60.0 },
                  fGPPercent: { ytd: 0, ly: 0, lyVar: 0 }
                },
                {
                  name: 'Morrissons',
                  isTotal: false,
                  cases: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0 },
                  gSales: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0 },
                  fGP: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0 },
                  fGPPercent: { ytd: 0, ly: 0, lyVar: 0 }
                },
                {
                  name: 'Asda',
                  isTotal: false,
                  cases: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0 },
                  gSales: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0 },
                  fGP: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0 },
                  fGPPercent: { ytd: 0, ly: 0, lyVar: 0 }
                },
                {
                  name: 'Sainsbury',
                  isTotal: false,
                  cases: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0 },
                  gSales: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0 },
                  fGP: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0 },
                  fGPPercent: { ytd: 0, ly: 0, lyVar: 0 }
                },
                {
                  name: 'Tesco',
                  isTotal: false,
                  cases: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0 },
                  gSales: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0 },
                  fGP: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0 },
                  fGPPercent: { ytd: 0, ly: 0, lyVar: 0 }
                }
              ]
            },
            {
              name: 'Private Label Total',
              isTotal: true,
              cases: { ytd: 74144, ly: 98981, lyVar: -24837, lyVarPercent: -25.1 },
              gSales: { ytd: 604, ly: 817, lyVar: -213, lyVarPercent: -26.1 },
              fGP: { ytd: 116, ly: 169, lyVar: -53, lyVarPercent: -31.4 },
              fGPPercent: { ytd: 19.2, ly: 20.7, lyVar: -1.5 }
            }
          ]
        },
        {
          name: 'SOAPPADS Total',
          isTotal: true,
          cases: { ytd: 241351, ly: 286042, lyVar: -44691, lyVarPercent: -15.6 },
          gSales: { ytd: 2612, ly: 3075, lyVar: -464, lyVarPercent: -15.1 },
          fGP: { ytd: 832, ly: 1005, lyVar: -173, lyVarPercent: -17.2 },
          fGPPercent: { ytd: 31.9, ly: 32.7, lyVar: -0.8 }
        }
      ];
      
      // Apply filters to mock data
      // Note: In a real implementation, this filtering would be done on the server side
      let filteredData = [...mockData]; // Create a copy to avoid mutations
      
      // Simple test: Add a timestamp to see if filters are working
      const timestamp = new Date().toLocaleTimeString();
      console.log('🔍 Processing filters at:', timestamp);
      
      // Add a visual indicator to show filters are working
      let titleSuffix = '';
      if (filterParams.year && filterParams.year !== 2024) {
        titleSuffix += ` (Year: ${filterParams.year})`;
      }
      if (filterParams.month && filterParams.month !== 'All') {
        titleSuffix += ` (Month: ${filterParams.month})`;
      }
      if (filterParams.customer && filterParams.customer !== 'All') {
        titleSuffix += ` (Customer: ${filterParams.customer})`;
      }
      if (filterParams.channel && filterParams.channel !== 'All') {
        titleSuffix += ` (Channel: ${filterParams.channel})`;
      }
      
      if (titleSuffix) {
        filteredData[0].name = `Brillo & KMPL${titleSuffix}`;
        console.log('🔍 Title changed to:', filteredData[0].name);
      }
      
      // Add a simple test to make data changes obvious
      if (filterParams.year && filterParams.year !== 2024) {
        // Change Soappads data to show year filter is working
        if (filteredData[0].children && filteredData[0].children[0].children) {
          const soappads = filteredData[0].children[0].children.find(child => child.name === 'Soappads');
          if (soappads && soappads.cases) {
            soappads.cases.ytd = 999999; // Obvious test value
            soappads.cases.ly = 888888; // Obvious test value
            console.log('🔍 Year filter applied - Soappads data changed to test values');
          }
        }
      }
      
      if (filterParams.month && filterParams.month !== 'All') {
        // Change Powerpads data to show month filter is working
        if (filteredData[0].children && filteredData[0].children[0].children) {
          const powerpads = filteredData[0].children[0].children.find(child => child.name === 'Powerpads');
          if (powerpads && powerpads.cases) {
            powerpads.cases.ytd = 777777; // Obvious test value
            powerpads.cases.ly = 666666; // Obvious test value
            console.log('🔍 Month filter applied - Powerpads data changed to test values');
          }
        }
      }
      
      // Apply year filter (simulate different data for different years)
      if (filterParams.year && filterParams.year !== 2024) {
        // For demo purposes, show reduced data for other years
        filteredData = filteredData.map(item => {
          const newItem = { ...item };
          if (newItem.children) {
            newItem.children = newItem.children.map((child: any) => {
              const newChild = { ...child };
              if (newChild.children) {
                newChild.children = newChild.children.map((grandChild: any) => {
                  const newGrandChild = { ...grandChild };
                  if (newGrandChild.cases) {
                    newGrandChild.cases = {
                      ytd: Math.round(newGrandChild.cases.ytd * 0.8),
                      ly: Math.round(newGrandChild.cases.ly * 0.9),
                      lyVar: Math.round(newGrandChild.cases.lyVar * 0.7),
                      lyVarPercent: newGrandChild.cases.lyVarPercent * 0.8
                    };
                  }
                  if (newGrandChild.gSales) {
                    newGrandChild.gSales = {
                      ytd: Math.round(newGrandChild.gSales.ytd * 0.8),
                      ly: Math.round(newGrandChild.gSales.ly * 0.9),
                      lyVar: Math.round(newGrandChild.gSales.lyVar * 0.7),
                      lyVarPercent: newGrandChild.gSales.lyVarPercent * 0.8
                    };
                  }
                  if (newGrandChild.fGP) {
                    newGrandChild.fGP = {
                      ytd: Math.round(newGrandChild.fGP.ytd * 0.8),
                      ly: Math.round(newGrandChild.fGP.ly * 0.9),
                      lyVar: Math.round(newGrandChild.fGP.lyVar * 0.7),
                      lyVarPercent: newGrandChild.fGP.lyVarPercent * 0.8
                    };
                  }
                  if (newGrandChild.fGPPercent) {
                    newGrandChild.fGPPercent = {
                      ytd: newGrandChild.fGPPercent.ytd * 0.95,
                      ly: newGrandChild.fGPPercent.ly * 0.95,
                      lyVar: newGrandChild.fGPPercent.lyVar * 0.8
                    };
                  }
                  return newGrandChild;
                });
              }
              return newChild;
            });
          }
          return newItem;
        });
      }
      
      // Apply month filter (simulate monthly data)
      if (filterParams.month && filterParams.month !== 'All') {
        // For demo purposes, show reduced data for specific months
        const monthMultiplier = 0.1; // Simulate monthly data (1/12 of annual)
        filteredData = filteredData.map(item => {
          const newItem = { ...item };
          if (newItem.children) {
            newItem.children = newItem.children.map((child: any) => {
              const newChild = { ...child };
              if (newChild.children) {
                newChild.children = newChild.children.map((grandChild: any) => {
                  const newGrandChild = { ...grandChild };
                  if (newGrandChild.cases) {
                    newGrandChild.cases = {
                      ytd: Math.round(newGrandChild.cases.ytd * monthMultiplier),
                      ly: Math.round(newGrandChild.cases.ly * monthMultiplier),
                      lyVar: Math.round(newGrandChild.cases.lyVar * monthMultiplier),
                      lyVarPercent: newGrandChild.cases.lyVarPercent
                    };
                  }
                  if (newGrandChild.gSales) {
                    newGrandChild.gSales = {
                      ytd: Math.round(newGrandChild.gSales.ytd * monthMultiplier),
                      ly: Math.round(newGrandChild.gSales.ly * monthMultiplier),
                      lyVar: Math.round(newGrandChild.gSales.lyVar * monthMultiplier),
                      lyVarPercent: newGrandChild.gSales.lyVarPercent
                    };
                  }
                  if (newGrandChild.fGP) {
                    newGrandChild.fGP = {
                      ytd: Math.round(newGrandChild.fGP.ytd * monthMultiplier),
                      ly: Math.round(newGrandChild.fGP.ly * monthMultiplier),
                      lyVar: Math.round(newGrandChild.fGP.lyVar * monthMultiplier),
                      lyVarPercent: newGrandChild.fGP.lyVarPercent
                    };
                  }
                  if (newGrandChild.fGPPercent) {
                    newGrandChild.fGPPercent = {
                      ytd: newGrandChild.fGPPercent.ytd,
                      ly: newGrandChild.fGPPercent.ly,
                      lyVar: newGrandChild.fGPPercent.lyVar
                    };
                  }
                  return newGrandChild;
                });
              }
              return newChild;
            });
          }
          return newItem;
        });
      }
      
      // Apply customer filter
      if (filterParams.customer && filterParams.customer !== 'All') {
        // Filter by customer name in the data
        filteredData = filteredData.map(item => {
          const newItem = { ...item };
          if (newItem.children) {
            newItem.children = newItem.children.map(child => {
              const newChild = { ...child };
              if (newChild.children) {
                newChild.children = newChild.children.filter(grandChild => {
                  // Filter based on customer name
                  if (filterParams.customer === 'Clean It') {
                    return grandChild.name === 'Clean It';
                  } else if (filterParams.customer === 'Cederroth') {
                    return grandChild.name === 'Cederroth';
                  } else if (filterParams.customer === 'Tesco') {
                    return grandChild.name === 'Tesco';
                  } else if (filterParams.customer === 'Sainsbury') {
                    return grandChild.name === 'Sainsbury';
                  } else if (filterParams.customer === 'Asda') {
                    return grandChild.name === 'Asda';
                  } else if (filterParams.customer === 'Morrissons') {
                    return grandChild.name === 'Morrissons';
                  }
                  return true; // Show all if no specific customer match
                });
              }
              return newChild;
            });
          }
          return newItem;
        });
      }
      
      console.log('🔍 Brillo & Killeen filters applied:', JSON.stringify(filterParams, null, 2));
      console.log('🔍 Original mock data length:', mockData.length);
      console.log('🔍 Filtered data length:', filteredData.length);
      console.log('🔍 Filtered data:', JSON.stringify(filteredData, null, 2));
      
      setBrilloKilleenData(filteredData);
      setLoadedSections(prev => new Set(prev).add('brilloKilleen'));
    } catch (error) {
      console.error('Error fetching Brillo & Killeen data:', error);
      setBrilloKilleenData([]);
    } finally {
      setLoadingStates(prev => ({ ...prev, brilloKilleen: false }));
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
        case 'brilloKilleen':
          fetchBrilloKilleenData();
          break;
        case 'kinetica':
          fetchKineticaData();
          break;
        case 'categoriesSubcategory':
          fetchCategoriesSubcategoryData();
          break;
        case 'categories':
          fetchCategoriesData();
          break;
      case 'privateLabel':
        fetchPrivateLabelData();
        break;
      case 'npd':
        fetchNPDData();
        break;
      case 'wsroiChannel':
        fetchWSROIChannelData();
        break;
      case 'wsukniChannel':
        fetchWSUKNIChannelData();
        break;
      case 'foodserviceSKUs':
        fetchFoodserviceSKUsData();
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

        {/* Brillo & Killeen Manufacturing PL Section */}
        <CollapsibleSection 
          title="Brillo & Killeen Manufacturing PL"
          onToggle={(isExpanded) => handleSectionExpand('brilloKilleen', isExpanded)}
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
            onApplyFilters={fetchBrilloKilleenData}
            onResetFilters={handleResetFilters}
            onDownloadCSV={() => {}} // TODO: Implement CSV export
            isDownloading={exporting}
            sectionType="brillo-killeen"
            // Hide the filters we don't want for Brillo & Killeen
            hideBusinessArea={true}
            hideBrand={true}
            hideCategory={true}
            hideSubCategory={true}
          />
          
          <div className="mt-6">
            <BrilloKilleenTable 
              key={`brillo-killeen-${filters.selectedYear}-${filters.selectedMonth}-${filters.selectedCustomer}`}
              data={brilloKilleenData}
              isLoading={loadingStates.brilloKilleen}
            />
          </div>
        </CollapsibleSection>

        {/* Kinetica Section */}
        <CollapsibleSection 
          title="Kinetica"
          onToggle={(isExpanded) => handleSectionExpand('kinetica', isExpanded)}
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
            onApplyFilters={fetchKineticaData}
            onResetFilters={handleResetFilters}
            onDownloadCSV={() => {}} // TODO: Implement CSV export
            isDownloading={exporting}
            sectionType="kinetica"
            // Hide the filters we don't want for Kinetica
            hideBusinessArea={true}
            hideBrand={true}
            hideCategory={true}
            hideSubCategory={true}
          />
          
          <div className="mt-6">
            <KineticaTable 
              key={`kinetica-${filters.selectedYear}-${filters.selectedMonth}-${filters.selectedCustomer}`}
              data={kineticaData}
              isLoading={loadingStates.kinetica}
            />
          </div>
        </CollapsibleSection>

        {/* Categories - Including Sub-Category Section */}
        <CollapsibleSection 
          title="Categories - Including Sub-Category"
          onToggle={(isExpanded) => handleSectionExpand('categoriesSubcategory', isExpanded)}
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
            onApplyFilters={fetchCategoriesSubcategoryData}
            onResetFilters={handleResetFilters}
            onDownloadCSV={() => {}} // TODO: Implement CSV export
            isDownloading={exporting}
            sectionType="categories-subcategory"
            // Hide the filters we don't want for Categories Subcategory
            hideBusinessArea={true}
            hideBrand={true}
            hideCategory={true}
            hideSubCategory={true}
          />
          
          <div className="mt-6">
            <CategoriesSubcategoryTable 
              key={`categories-subcategory-${filters.selectedYear}-${filters.selectedMonth}-${filters.selectedCustomer}`}
              data={categoriesSubcategoryData}
              isLoading={loadingStates.categoriesSubcategory}
            />
          </div>
        </CollapsibleSection>

        {/* Categories Section */}
        <CollapsibleSection 
          title="Categories"
          onToggle={(isExpanded) => handleSectionExpand('categories', isExpanded)}
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
            onApplyFilters={fetchCategoriesData}
            onResetFilters={handleResetFilters}
            onDownloadCSV={() => {}} // TODO: Implement CSV export
            isDownloading={exporting}
            sectionType="categories"
            // Hide the filters we don't want for Categories
            hideBusinessArea={true}
            hideBrand={true}
            hideCategory={true}
            hideSubCategory={true}
          />
          
          <div className="mt-6">
            <CategoriesTable 
              key={`categories-${filters.selectedYear}-${filters.selectedMonth}-${filters.selectedCustomer}`}
              data={categoriesData}
              isLoading={loadingStates.categories}
            />
          </div>
        </CollapsibleSection>

        {/* Private Label Brands Section */}
        <CollapsibleSection 
          title="Private Label Brands"
          onToggle={(isExpanded) => handleSectionExpand('privateLabel', isExpanded)}
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
            onApplyFilters={fetchPrivateLabelData}
            onResetFilters={handleResetFilters}
            onDownloadCSV={() => {}} // TODO: Implement CSV export
            isDownloading={exporting}
            sectionType="private-label"
            // Hide the filters we don't want for Private Label
            hideBusinessArea={true}
            hideBrand={true}
            hideCategory={true}
            hideSubCategory={true}
          />
          
          <div className="mt-6">
            <PrivateLabelTable 
              key={`private-label-${filters.selectedYear}-${filters.selectedMonth}-${filters.selectedCustomer}`}
              data={privateLabelData}
              isLoading={loadingStates.privateLabel}
            />
          </div>
        </CollapsibleSection>

        {/* NPD Section */}
        <CollapsibleSection
          title="NPD"
          onToggle={(isExpanded) => handleSectionExpand('npd', isExpanded)}
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
            onApplyFilters={fetchNPDData}
            onResetFilters={handleResetFilters}
            onDownloadCSV={() => {}} // TODO: Implement CSV export
            isDownloading={exporting}
            sectionType="npd"
            // Hide the filters we don't want for NPD
            hideBusinessArea={true}
            hideBrand={true}
            hideCategory={true}
            hideSubCategory={true}
          />
          
          <div className="mt-6">
            <NPDTable 
              key={`npd-${filters.selectedYear}-${filters.selectedMonth}-${filters.selectedCustomer}`}
              data={npdData}
              isLoading={loadingStates.npd}
            />
          </div>
        </CollapsibleSection>

        {/* WS ROI Channel Section */}
        <CollapsibleSection
          title="WS ROI Channel"
          onToggle={(isExpanded) => handleSectionExpand('wsroiChannel', isExpanded)}
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
            onApplyFilters={fetchWSROIChannelData}
            onResetFilters={handleResetFilters}
            onDownloadCSV={() => {}} // TODO: Implement CSV export
            isDownloading={exporting}
            sectionType="wsroi-channel"
            // Hide the filters we don't want for WS ROI Channel
            hideBusinessArea={true}
            hideBrand={true}
            hideCategory={true}
            hideSubCategory={true}
          />
          
          <div className="mt-6">
            <WSROIChannelTable 
              key={`wsroi-channel-${filters.selectedYear}-${filters.selectedMonth}-${filters.selectedCustomer}`}
              data={wsroiChannelData}
              isLoading={loadingStates.wsroiChannel}
            />
          </div>
        </CollapsibleSection>

        {/* WS UK&NI Channel Section */}
        <CollapsibleSection
          title="WS UK&NI Channel"
          onToggle={(isExpanded) => handleSectionExpand('wsukniChannel', isExpanded)}
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
            onApplyFilters={fetchWSUKNIChannelData}
            onResetFilters={handleResetFilters}
            onDownloadCSV={() => {}} // TODO: Implement CSV export
            isDownloading={exporting}
            sectionType="wsukni-channel"
            // Hide the filters we don't want for WS UK&NI Channel
            hideBusinessArea={true}
            hideBrand={true}
            hideCategory={true}
            hideSubCategory={true}
          />
          
          <div className="mt-6">
            <WSUKNIChannelTable 
              key={`wsukni-channel-${filters.selectedYear}-${filters.selectedMonth}-${filters.selectedCustomer}`}
              data={wsukniChannelData}
              isLoading={loadingStates.wsukniChannel}
            />
          </div>
        </CollapsibleSection>

        {/* Foodservice SKUs Section */}
        <CollapsibleSection
          title="Foodservice SKU's - Channel and Customer"
          onToggle={(isExpanded) => handleSectionExpand('foodserviceSKUs', isExpanded)}
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
            onApplyFilters={fetchFoodserviceSKUsData}
            onResetFilters={handleResetFilters}
            onDownloadCSV={() => {}} // TODO: Implement CSV export
            isDownloading={exporting}
            sectionType="foodservice-skus"
            // Hide the filters we don't want for Foodservice SKUs
            hideBusinessArea={true}
            hideBrand={true}
            hideCategory={true}
            hideSubCategory={true}
          />
          
          <div className="mt-6">
            <FoodserviceSKUsTable 
              key={`foodservice-skus-${filters.selectedYear}-${filters.selectedMonth}-${filters.selectedCustomer}`}
              data={foodserviceSKUsData}
              isLoading={loadingStates.foodserviceSKUs}
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
