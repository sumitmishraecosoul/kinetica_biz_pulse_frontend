// Service to implement Excel formulas for Summary calculations
// Based on the provided Excel formulas for Business Area and Channel Summary

export interface SummaryRowData {
  name: string;
  cases: {
    ytd: number;
    ly: number;
    lyVar: number;
    lyVarPercent: number;
  };
  gSales: {
    ytd: number;
    ly: number;
    lyVar: number;
    lyVarPercent: number;
  };
  fGP: {
    ytd: number;
    ly: number;
    lyVar: number;
    lyVarPercent: number;
  };
  fGPPercent: {
    ytd: number;
    lyVar: number;
  };
  fGPFY24: {
    ytd: number;
    cyVLy: number;
  };
}

export interface FilterCriteria {
  year?: number;
  month?: string;
  businessArea?: string;
  channel?: string;
  customer?: string;
  brand?: string;
  category?: string;
  subCategory?: string;
}

export class SummaryCalculationService {
  /**
   * Main function to calculate summary data for Business Areas
   */
  static calculateBusinessAreaSummary(
    rawData: any[], 
    filters: FilterCriteria,
    isYTD: boolean = true
  ): SummaryRowData[] {
    console.log('\n=== Business Area Summary Calculation ===');
    console.log('Raw Data Length:', rawData.length);
    console.log('Filters:', filters);
    console.log('Is YTD:', isYTD);
    
    const businessAreas = ['Food', 'Household', 'Brillo & KMPL', 'Kinetica'];
    const results: SummaryRowData[] = [];

    for (const businessArea of businessAreas) {
      const rowData = this.calculateRowData(rawData, filters, businessArea, 'businessArea', isYTD);
      results.push({
        name: businessArea,
        ...rowData
      });
    }

    // Calculate Total row
    const totalRow = this.calculateTotalRow(results);
    results.push({
      name: 'Total',
      ...totalRow
    });

    // Calculate Total Household row (Household + Brillo & KMPL)
    const householdRow = this.calculateHouseholdTotal(results);
    results.push({
      name: 'Total Household',
      ...householdRow
    });

    return results;
  }

  /**
   * Main function to calculate summary data for Channels
   */
  static calculateChannelSummary(
    rawData: any[], 
    filters: FilterCriteria,
    isYTD: boolean = true
  ): SummaryRowData[] {
    console.log('\n=== Channel Summary Calculation ===');
    console.log('Raw Data Length:', rawData.length);
    console.log('Filters:', filters);
    console.log('Is YTD:', isYTD);
    
    const channels = [
      'Grocery ROI', 
      'Grocery UK & NI', 
      'Wholesale ROI', 
      'Wholesale UK & NI', 
      'International', 
      'Online', 
      'Sports & Others'
    ];
    const results: SummaryRowData[] = [];

    for (const channel of channels) {
      const rowData = this.calculateRowData(rawData, filters, channel, 'channel', isYTD);
      results.push({
        name: channel,
        ...rowData
      });
    }

    // Calculate Total row
    const totalRow = this.calculateTotalRow(results);
    results.push({
      name: 'Total',
      ...totalRow
    });

    // Calculate Grocery & Wholesale ROI (Grocery ROI + Wholesale ROI)
    const groceryWholesaleROI = this.calculateCombinedRow(
      results, 
      ['Grocery ROI', 'Wholesale ROI'], 
      'Grocery & Wholesale ROI'
    );
    results.push(groceryWholesaleROI);

    // Calculate Grocery & Wholesale UK & NI (Grocery UK & NI + Wholesale UK & NI)
    const groceryWholesaleUKNI = this.calculateCombinedRow(
      results, 
      ['Grocery UK & NI', 'Wholesale UK & NI'], 
      'Grocery & Wholesale UK & NI'
    );
    results.push(groceryWholesaleUKNI);

    return results;
  }

  /**
   * Calculate data for a single row (Business Area or Channel)
   * Implements the exact Excel formulas provided
   */
  private static calculateRowData(
    rawData: any[], 
    filters: FilterCriteria, 
    rowName: string, 
    dimension: 'businessArea' | 'channel',
    isYTD: boolean
  ) {
    console.log(`\n=== Calculating Row Data ===`);
    console.log(`Row Name: ${rowName}`);
    console.log(`Dimension: ${dimension}`);
    console.log(`Filters:`, filters);
    console.log(`Is YTD: ${isYTD}`);
    console.log(`Raw Data Length: ${rawData.length}`);
    
    const currentYear = filters.year || new Date().getFullYear();
    const lastYear = currentYear - 1;
    
    console.log(`Current Year: ${currentYear}, Last Year: ${lastYear}`);

    // Formula 1: Cases YTD = SUMIFS(YTD!$J:$J, YTD!$A:$A, List!$C$1, YTD!$B:$B, Summary!$B$4, YTD!$Q:$Q, Summary!$B10, YTD!$S:$S, Summary!$B$7, YTD!$R:$R, Summary!$C$4)
    const casesYTD = this.sumifs(rawData, 'Cases', {
      year: currentYear,
      month: isYTD ? undefined : filters.month,
      businessArea: dimension === 'businessArea' ? rowName : filters.businessArea,
      channel: dimension === 'channel' ? rowName : filters.channel,
      customer: filters.customer,
      brand: filters.brand,
      category: filters.category,
      subCategory: filters.subCategory
    });

    // Formula 2: Cases LY = SUMIFS(YTD!$J:$J, YTD!$A:$A, List!$C$2, YTD!$B:$B, Summary!$B$4, YTD!$Q:$Q, Summary!$B10, YTD!$S:$S, Summary!$B$7, YTD!$R:$R, Summary!$C$4)
    const casesLY = this.sumifs(rawData, 'Cases', {
      year: lastYear,
      month: isYTD ? undefined : filters.month,
      businessArea: dimension === 'businessArea' ? rowName : filters.businessArea,
      channel: dimension === 'channel' ? rowName : filters.channel,
      customer: filters.customer,
      brand: filters.brand,
      category: filters.category,
      subCategory: filters.subCategory
    });

    // Formula 3: Cases LY Var = C10-D10
    const casesLYVar = casesYTD - casesLY;

    // Formula 4: Cases LY Var % = IFERROR(E10/ABS(D10),0)
    const casesLYVarPercent = this.iferror(casesLYVar / Math.abs(casesLY), 0) * 100;

    // Formula 5: gSales YTD = SUMIFS(YTD!$K:$K, YTD!$A:$A, List!$C$1, YTD!$B:$B, Summary!$B$4, YTD!$Q:$Q, Summary!$B10, YTD!$S:$S, Summary!$B$7, YTD!$R:$R, Summary!$C$4)/1000
    const gSalesYTD = this.sumifs(rawData, 'gSales', {
      year: currentYear,
      month: isYTD ? undefined : filters.month,
      businessArea: dimension === 'businessArea' ? rowName : filters.businessArea,
      channel: dimension === 'channel' ? rowName : filters.channel,
      customer: filters.customer,
      brand: filters.brand,
      category: filters.category,
      subCategory: filters.subCategory
    }) / 1000;

    // Formula 6: gSales LY = SUMIFS(YTD!$K:$K, YTD!$A:$A, List!$C$2, YTD!$B:$B, Summary!$B$4, YTD!$Q:$Q, Summary!$B10, YTD!$S:$S, Summary!$B$7, YTD!$R:$R, Summary!$C$4)/1000
    const gSalesLY = this.sumifs(rawData, 'gSales', {
      year: lastYear,
      month: isYTD ? undefined : filters.month,
      businessArea: dimension === 'businessArea' ? rowName : filters.businessArea,
      channel: dimension === 'channel' ? rowName : filters.channel,
      customer: filters.customer,
      brand: filters.brand,
      category: filters.category,
      subCategory: filters.subCategory
    }) / 1000;

    // Formula 7: gSales LY Var = H10-I10
    const gSalesLYVar = gSalesYTD - gSalesLY;

    // Formula 8: gSales LY Var % = IFERROR(J10/ABS(I10),0)
    const gSalesLYVarPercent = this.iferror(gSalesLYVar / Math.abs(gSalesLY), 0) * 100;

    // Formula 9: fGP YTD = SUMIFS(YTD!$P:$P, YTD!$A:$A, List!$C$1, YTD!$B:$B, Summary!$B$4, YTD!$Q:$Q, Summary!$B10, YTD!$S:$S, Summary!$B$7, YTD!$R:$R, Summary!$C$4)/1000
    const fGPYTD = this.sumifs(rawData, 'fGP', {
      year: currentYear,
      month: isYTD ? undefined : filters.month,
      businessArea: dimension === 'businessArea' ? rowName : filters.businessArea,
      channel: dimension === 'channel' ? rowName : filters.channel,
      customer: filters.customer,
      brand: filters.brand,
      category: filters.category,
      subCategory: filters.subCategory
    }) / 1000;

    // Formula 10: fGP LY Var = M10-N10 (Note: N10 is fGP LY, but we need to calculate it)
    const fGPLY = this.sumifs(rawData, 'fGP', {
      year: lastYear,
      month: isYTD ? undefined : filters.month,
      businessArea: dimension === 'businessArea' ? rowName : filters.businessArea,
      channel: dimension === 'channel' ? rowName : filters.channel,
      customer: filters.customer,
      brand: filters.brand,
      category: filters.category,
      subCategory: filters.subCategory
    }) / 1000;

    const fGPLYVar = fGPYTD - fGPLY;

    // Formula 11: fGP LY Var % = IFERROR(O10/ABS(N10),0)
    const fGPLYVarPercent = this.iferror(fGPLYVar / Math.abs(fGPLY), 0) * 100;

    // Formula 12: fGP % YTD = IFERROR(M10/H10,0)
    const fGPPercentYTD = this.iferror(fGPYTD / gSalesYTD, 0) * 100;

    // Formula 13: fGP % LY Var = R10-S10 (Note: S10 is fGP % LY)
    const fGPPercentLY = this.iferror(fGPLY / gSalesLY, 0) * 100;
    const fGPPercentLYVar = fGPPercentYTD - fGPPercentLY;

    // Formula 14: fGP FY24 YTD = IF(V$7="YTD",N10,(SUMIFS('FY24'!$P:$P, 'FY24'!$A:$A, List!$C$2, 'FY24'!$B:$B, Summary!$B$4, 'FY24'!$Q:$Q, Summary!$B10, 'FY24'!$T:$T, Summary!$B$7, 'FY24'!$R:$R, Summary!$C$4)/1000))
    let fGPFY24YTD;
    if (isYTD) {
      fGPFY24YTD = fGPLY; // N10 = fGP LY
    } else {
      // For specific month, use current year fGP for that month
      fGPFY24YTD = this.sumifs(rawData, 'fGP', {
        year: currentYear,
        month: filters.month,
        businessArea: dimension === 'businessArea' ? rowName : filters.businessArea,
        channel: dimension === 'channel' ? rowName : filters.channel,
        customer: filters.customer,
        brand: filters.brand,
        category: filters.category,
        subCategory: filters.subCategory
      }) / 1000;
    }

    // Formula 15: fGP FY24 CY v LY % = IFERROR(M10/ABS(V10),0)
    const fGPFY24CYVLy = this.iferror(fGPYTD / Math.abs(fGPFY24YTD), 0) * 100;

    return {
      cases: {
        ytd: Math.round(casesYTD),
        ly: Math.round(casesLY),
        lyVar: Math.round(casesLYVar),
        lyVarPercent: Math.round(casesLYVarPercent * 10) / 10
      },
      gSales: {
        ytd: Math.round(gSalesYTD),
        ly: Math.round(gSalesLY),
        lyVar: Math.round(gSalesLYVar),
        lyVarPercent: Math.round(gSalesLYVarPercent * 10) / 10
      },
      fGP: {
        ytd: Math.round(fGPYTD),
        lyVar: Math.round(fGPLYVar),
        lyVarPercent: Math.round(fGPLYVarPercent * 10) / 10
      },
      fGPPercent: {
        ytd: Math.round(fGPPercentYTD * 10) / 10,
        lyVar: Math.round(fGPPercentLYVar * 10) / 10
      },
      fGPFY24: {
        ytd: Math.round(fGPFY24YTD),
        cyVLy: Math.round(fGPFY24CYVLy * 10) / 10
      }
    };
  }

  /**
   * Implement SUMIFS function - sum values where multiple criteria match
   */
  private static sumifs(
    data: any[], 
    sumColumn: string, 
    criteria: {
      year?: number;
      month?: string;
      businessArea?: string;
      channel?: string;
      customer?: string;
      brand?: string;
      category?: string;
      subCategory?: string;
    }
  ): number {
    console.log(`SUMIFS Debug - Column: ${sumColumn}, Criteria:`, criteria);
    console.log(`SUMIFS Debug - Data length: ${data.length}`);
    
    const result = data.reduce((sum, row) => {
      // Check all criteria - handle year comparison with proper type conversion
      if (criteria.year !== undefined) {
        const rowYear = typeof row.Year === 'string' ? parseInt(row.Year) : row.Year;
        if (rowYear !== criteria.year) return sum;
      }
      if (criteria.month !== undefined && row['Month Name'] !== criteria.month) return sum;
      if (criteria.businessArea !== undefined && criteria.businessArea !== 'All') {
        const mappedBusinessAreas = this.mapBusinessArea(criteria.businessArea);
        if (!mappedBusinessAreas.includes(row.Business)) return sum;
      }
      if (criteria.channel !== undefined && criteria.channel !== 'All' && row.Channel !== criteria.channel) return sum;
      if (criteria.customer !== undefined && criteria.customer !== 'All' && row.Customer !== criteria.customer) return sum;
      if (criteria.brand !== undefined && criteria.brand !== 'All' && row.Brand !== criteria.brand) return sum;
      if (criteria.category !== undefined && criteria.category !== 'All' && row.Category !== criteria.category) return sum;
      if (criteria.subCategory !== undefined && criteria.subCategory !== 'All' && row['Sub-Cat'] !== criteria.subCategory) return sum;

      // If all criteria match, add the value
      const value = row[sumColumn];
      const numericValue = typeof value === 'number' ? value : 0;
      console.log(`SUMIFS Debug - Row matches, adding ${numericValue} from ${sumColumn}`);
      return sum + numericValue;
    }, 0);
    
    console.log(`SUMIFS Debug - Final result: ${result}`);
    return result;
  }

  /**
   * Map report business areas to CSV business areas
   */
  private static mapBusinessArea(reportBusinessArea: string): string[] {
    const businessAreaMapping: { [key: string]: string[] } = {
      'Food': ['Food'], // Map Food to only Food
      'Household': ['Household & Beauty'], // Map Household to Household & Beauty
      'Brillo & KMPL': ['Brillo & KMPL', 'Brillo', 'KMPL'],
      'Kinetica': ['Kinetica']
    };
    
    return businessAreaMapping[reportBusinessArea] || [reportBusinessArea];
  }

  /**
   * Implement IFERROR function - return default value if calculation results in error
   */
  private static iferror(value: number, defaultValue: number): number {
    if (isNaN(value) || !isFinite(value)) {
      return defaultValue;
    }
    return value;
  }

  /**
   * Generate comprehensive sample data for testing
   */
  static generateSampleData(): any[] {
    console.log('Generating sample data...');
    
    const businessAreas = ['Food', 'Household', 'Brillo & KMPL', 'Kinetica'];
    const channels = ['Grocery ROI', 'Grocery UK & NI', 'Wholesale ROI', 'Wholesale UK & NI', 'International', 'Online', 'Sports & Others'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const customers = ['Dunnes ROI', 'Dunnes NI', 'BWG', 'Barry Group', 'Musgrave ROI', 'Others ROI'];
    const brands = ['Babykind', 'Bensons', 'Bonne Mamar Honey', 'Bonne Mamar Jam', 'Bonne Mamar Marmalade'];
    const categories = ['Beauty', 'Curry', 'Honey', 'Jam', 'Marmalade', 'Spreads'];
    const subCategories = ['Babycare', 'Curry Sauce', 'Honey minis', 'Honey sticks', 'Jam', 'Marmalade'];

    const sampleData: any[] = [];
    const currentYear = new Date().getFullYear();
    const lastYear = currentYear - 1;

    // Generate data for current year with more realistic values
    businessAreas.forEach((businessArea, baIndex) => {
      channels.forEach((channel, chIndex) => {
        months.forEach((month, monthIndex) => {
          customers.forEach((customer, custIndex) => {
            brands.forEach((brand, brandIndex) => {
              categories.forEach((category, catIndex) => {
                subCategories.forEach((subCategory, subIndex) => {
                  // Generate more realistic data with business logic
                  const baseMultiplier = (baIndex + 1) * (chIndex + 1) * (monthIndex + 1);
                  const baseCases = Math.floor((Math.random() * 1000 + 100) * baseMultiplier);
                  const pricePerCase = Math.random() * 20 + 10; // 10-30 per case
                  const baseGSales = baseCases * pricePerCase;
                  const costRatio = Math.random() * 0.3 + 0.6; // 60-90% cost ratio
                  const groupCost = baseGSales * costRatio;
                  const fGP = baseGSales - groupCost;

                  sampleData.push({
                    Year: currentYear,
                    'Month Name': month,
                    Business: businessArea,
                    Channel: channel,
                    Customer: customer,
                    Brand: brand,
                    Category: category,
                    'Sub-Cat': subCategory,
                    Cases: baseCases,
                    gSales: baseGSales,
                    'Group Cost': groupCost,
                    fGP: fGP
                  });
                });
              });
            });
          });
        });
      });
    });

    // Generate data for last year with slightly different values for variance
    businessAreas.forEach((businessArea, baIndex) => {
      channels.forEach((channel, chIndex) => {
        months.forEach((month, monthIndex) => {
          customers.forEach((customer, custIndex) => {
            brands.forEach((brand, brandIndex) => {
              categories.forEach((category, catIndex) => {
                subCategories.forEach((subCategory, subIndex) => {
                  // Generate last year data with some variance
                  const baseMultiplier = (baIndex + 1) * (chIndex + 1) * (monthIndex + 1);
                  const varianceFactor = 0.8 + Math.random() * 0.4; // 80-120% of current year
                  const baseCases = Math.floor((Math.random() * 1000 + 100) * baseMultiplier * varianceFactor);
                  const pricePerCase = Math.random() * 20 + 10;
                  const baseGSales = baseCases * pricePerCase;
                  const costRatio = Math.random() * 0.3 + 0.6;
                  const groupCost = baseGSales * costRatio;
                  const fGP = baseGSales - groupCost;

                  sampleData.push({
                    Year: lastYear,
                    'Month Name': month,
                    Business: businessArea,
                    Channel: channel,
                    Customer: customer,
                    Brand: brand,
                    Category: category,
                    'Sub-Cat': subCategory,
                    Cases: baseCases,
                    gSales: baseGSales,
                    'Group Cost': groupCost,
                    fGP: fGP
                  });
                });
              });
            });
          });
        });
      });
    });

    console.log(`Generated ${sampleData.length} sample data records`);
    console.log('Sample data preview:', sampleData.slice(0, 3));
    return sampleData;
  }

  /**
   * Calculate Total row by summing all individual rows
   */
  private static calculateTotalRow(rows: SummaryRowData[]): any {
    const total = rows.reduce((acc, row) => {
      if (row.name === 'Total' || row.name === 'Total Household' || 
          row.name === 'Grocery & Wholesale ROI' || row.name === 'Grocery & Wholesale UK & NI') {
        return acc; // Skip already calculated totals
      }

      return {
        cases: {
          ytd: acc.cases.ytd + row.cases.ytd,
          ly: acc.cases.ly + row.cases.ly,
          lyVar: acc.cases.lyVar + row.cases.lyVar,
          lyVarPercent: 0 // Will be calculated
        },
        gSales: {
          ytd: acc.gSales.ytd + row.gSales.ytd,
          ly: acc.gSales.ly + row.gSales.ly,
          lyVar: acc.gSales.lyVar + row.gSales.lyVar,
          lyVarPercent: 0 // Will be calculated
        },
        fGP: {
          ytd: acc.fGP.ytd + row.fGP.ytd,
          lyVar: acc.fGP.lyVar + row.fGP.lyVar,
          lyVarPercent: 0 // Will be calculated
        },
        fGPPercent: {
          ytd: 0, // Will be calculated
          lyVar: 0 // Will be calculated
        },
        fGPFY24: {
          ytd: acc.fGPFY24.ytd + row.fGPFY24.ytd,
          cyVLy: 0 // Will be calculated
        }
      };
    }, {
      cases: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0 },
      gSales: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0 },
      fGP: { ytd: 0, lyVar: 0, lyVarPercent: 0 },
      fGPPercent: { ytd: 0, lyVar: 0 },
      fGPFY24: { ytd: 0, cyVLy: 0 }
    });

    // Calculate percentages for total
    total.cases.lyVarPercent = this.iferror(total.cases.lyVar / Math.abs(total.cases.ly), 0) * 100;
    total.gSales.lyVarPercent = this.iferror(total.gSales.lyVar / Math.abs(total.gSales.ly), 0) * 100;
    total.fGP.lyVarPercent = this.iferror(total.fGP.lyVar / Math.abs(total.fGP.ly), 0) * 100;
    total.fGPPercent.ytd = this.iferror(total.fGP.ytd / total.gSales.ytd, 0) * 100;
    total.fGPFY24.cyVLy = this.iferror(total.fGP.ytd / Math.abs(total.fGPFY24.ytd), 0) * 100;

    return total;
  }

  /**
   * Calculate Total Household (Household + Brillo & KMPL)
   */
  private static calculateHouseholdTotal(rows: SummaryRowData[]): any {
    const householdRow = rows.find(r => r.name === 'Household');
    const brilloRow = rows.find(r => r.name === 'Brillo & KMPL');

    if (!householdRow || !brilloRow) {
      return {
        cases: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0 },
        gSales: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0 },
        fGP: { ytd: 0, lyVar: 0, lyVarPercent: 0 },
        fGPPercent: { ytd: 0, lyVar: 0 },
        fGPFY24: { ytd: 0, cyVLy: 0 }
      };
    }

    const total = {
      cases: {
        ytd: householdRow.cases.ytd + brilloRow.cases.ytd,
        ly: householdRow.cases.ly + brilloRow.cases.ly,
        lyVar: householdRow.cases.lyVar + brilloRow.cases.lyVar,
        lyVarPercent: 0
      },
      gSales: {
        ytd: householdRow.gSales.ytd + brilloRow.gSales.ytd,
        ly: householdRow.gSales.ly + brilloRow.gSales.ly,
        lyVar: householdRow.gSales.lyVar + brilloRow.gSales.lyVar,
        lyVarPercent: 0
      },
      fGP: {
        ytd: householdRow.fGP.ytd + brilloRow.fGP.ytd,
        lyVar: householdRow.fGP.lyVar + brilloRow.fGP.lyVar,
        lyVarPercent: 0
      },
      fGPPercent: {
        ytd: 0,
        lyVar: 0
      },
      fGPFY24: {
        ytd: householdRow.fGPFY24.ytd + brilloRow.fGPFY24.ytd,
        cyVLy: 0
      }
    };

    // Calculate percentages
    total.cases.lyVarPercent = this.iferror(total.cases.lyVar / Math.abs(total.cases.ly), 0) * 100;
    total.gSales.lyVarPercent = this.iferror(total.gSales.lyVar / Math.abs(total.gSales.ly), 0) * 100;
    total.fGP.lyVarPercent = this.iferror(total.fGP.lyVar / Math.abs(total.fGP.ly), 0) * 100;
    total.fGPPercent.ytd = this.iferror(total.fGP.ytd / total.gSales.ytd, 0) * 100;
    total.fGPFY24.cyVLy = this.iferror(total.fGP.ytd / Math.abs(total.fGPFY24.ytd), 0) * 100;

    return total;
  }

  /**
   * Calculate combined rows (e.g., Grocery & Wholesale ROI)
   */
  private static calculateCombinedRow(
    rows: SummaryRowData[], 
    rowNames: string[], 
    combinedName: string
  ): SummaryRowData {
    const selectedRows = rows.filter(r => rowNames.includes(r.name));
    
    if (selectedRows.length === 0) {
      return {
        name: combinedName,
        cases: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0 },
        gSales: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0 },
        fGP: { ytd: 0, lyVar: 0, lyVarPercent: 0 },
        fGPPercent: { ytd: 0, lyVar: 0 },
        fGPFY24: { ytd: 0, cyVLy: 0 }
      };
    }

    const total = selectedRows.reduce((acc, row) => ({
      cases: {
        ytd: acc.cases.ytd + row.cases.ytd,
        ly: acc.cases.ly + row.cases.ly,
        lyVar: acc.cases.lyVar + row.cases.lyVar,
        lyVarPercent: 0
      },
      gSales: {
        ytd: acc.gSales.ytd + row.gSales.ytd,
        ly: acc.gSales.ly + row.gSales.ly,
        lyVar: acc.gSales.lyVar + row.gSales.lyVar,
        lyVarPercent: 0
      },
      fGP: {
        ytd: acc.fGP.ytd + row.fGP.ytd,
        lyVar: acc.fGP.lyVar + row.fGP.lyVar,
        lyVarPercent: 0
      },
      fGPPercent: {
        ytd: 0,
        lyVar: 0
      },
      fGPFY24: {
        ytd: acc.fGPFY24.ytd + row.fGPFY24.ytd,
        cyVLy: 0
      }
    }), {
      cases: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0 },
      gSales: { ytd: 0, ly: 0, lyVar: 0, lyVarPercent: 0 },
      fGP: { ytd: 0, lyVar: 0, lyVarPercent: 0 },
      fGPPercent: { ytd: 0, lyVar: 0 },
      fGPFY24: { ytd: 0, cyVLy: 0 }
    });

    // Calculate percentages
    total.cases.lyVarPercent = this.iferror(total.cases.lyVar / Math.abs(total.cases.ly), 0) * 100;
    total.gSales.lyVarPercent = this.iferror(total.gSales.lyVar / Math.abs(total.gSales.ly), 0) * 100;
    total.fGP.lyVarPercent = this.iferror(total.fGP.lyVar / Math.abs(total.fGP.ly), 0) * 100;
    total.fGPPercent.ytd = this.iferror(total.fGP.ytd / total.gSales.ytd, 0) * 100;
    total.fGPFY24.cyVLy = this.iferror(total.fGP.ytd / Math.abs(total.fGPFY24.ytd), 0) * 100;

    return {
      name: combinedName,
      ...total
    };
  }
}