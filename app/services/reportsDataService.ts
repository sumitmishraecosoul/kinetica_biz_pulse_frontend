// Service to transform raw data into the format expected by the reports tables

export interface BusinessAreaReportData {
  businessArea: string;
  cases: {
    ytd: number;
    lyVar: number;
    lyVarPercent: number;
  };
  gSales: {
    ytd: number;
    lyVar: number;
    lyVarPercent: number;
  };
  fGP: {
    ytd: number;
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

export interface ChannelReportData {
  channel: string;
  cases: {
    ytd: number;
    lyVar: number;
    lyVarPercent: number;
  };
  gSales: {
    ytd: number;
    lyVar: number;
    lyVarPercent: number;
  };
  fGP: {
    ytd: number;
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

export class ReportsDataService {
  /**
   * Transform raw business area data into report format
   */
  static transformBusinessAreaData(rawData: any[]): BusinessAreaReportData[] {
    if (!rawData || rawData.length === 0) {
      return [];
    }

    // Group data by business area
    const groupedData = rawData.reduce((acc, item) => {
      const businessArea = item.businessArea || 'Unknown';
      if (!acc[businessArea]) {
        acc[businessArea] = {
          cases: { ytd: 0, ly: 0 },
          gSales: { ytd: 0, ly: 0 },
          fGP: { ytd: 0, ly: 0 },
          fGPFY24: { ytd: 0, ly: 0 }
        };
      }
      
      acc[businessArea].cases.ytd += item.cases || 0;
      acc[businessArea].gSales.ytd += item.gSales || 0;
      acc[businessArea].fGP.ytd += item.fGP || 0;
      acc[businessArea].fGPFY24.ytd += item.fGPFY24 || 0;
      
      // For LY data, you would need to fetch previous year data
      // This is a simplified version - in reality, you'd need to compare with LY data
      acc[businessArea].cases.ly += (item.cases || 0) * 0.95; // Simulated LY data
      acc[businessArea].gSales.ly += (item.gSales || 0) * 0.98;
      acc[businessArea].fGP.ly += (item.fGP || 0) * 0.97;
      acc[businessArea].fGPFY24.ly += (item.fGPFY24 || 0) * 0.98;
      
      return acc;
    }, {} as any);

    // Transform to report format
    return Object.entries(groupedData).map(([businessArea, data]: [string, any]) => {
      const casesVar = data.cases.ytd - data.cases.ly;
      const gSalesVar = data.gSales.ytd - data.gSales.ly;
      const fGPVar = data.fGP.ytd - data.fGP.ly;
      const fGPFY24Var = data.fGPFY24.ytd - data.fGPFY24.ly;

      const casesVarPercent = data.cases.ly !== 0 ? (casesVar / data.cases.ly) * 100 : 0;
      const gSalesVarPercent = data.gSales.ly !== 0 ? (gSalesVar / data.gSales.ly) * 100 : 0;
      const fGPVarPercent = data.fGP.ly !== 0 ? (fGPVar / data.fGP.ly) * 100 : 0;
      const fGPFY24VarPercent = data.fGPFY24.ly !== 0 ? (fGPFY24Var / data.fGPFY24.ly) * 100 : 0;

      const fGPPercentYTD = data.gSales.ytd !== 0 ? (data.fGP.ytd / data.gSales.ytd) * 100 : 0;
      const fGPPercentLY = data.gSales.ly !== 0 ? (data.fGP.ly / data.gSales.ly) * 100 : 0;
      const fGPPercentVar = fGPPercentYTD - fGPPercentLY;

      return {
        businessArea,
        cases: {
          ytd: Math.round(data.cases.ytd),
          lyVar: Math.round(casesVar),
          lyVarPercent: Math.round(casesVarPercent * 10) / 10
        },
        gSales: {
          ytd: Math.round(data.gSales.ytd),
          lyVar: Math.round(gSalesVar),
          lyVarPercent: Math.round(gSalesVarPercent * 10) / 10
        },
        fGP: {
          ytd: Math.round(data.fGP.ytd),
          lyVar: Math.round(fGPVar),
          lyVarPercent: Math.round(fGPVarPercent * 10) / 10
        },
        fGPPercent: {
          ytd: Math.round(fGPPercentYTD * 10) / 10,
          lyVar: Math.round(fGPPercentVar * 10) / 10
        },
        fGPFY24: {
          ytd: Math.round(data.fGPFY24.ytd),
          cyVLy: Math.round(fGPFY24VarPercent * 10) / 10
        }
      };
    });
  }

  /**
   * Transform raw channel data into report format
   */
  static transformChannelData(rawData: any[]): ChannelReportData[] {
    if (!rawData || rawData.length === 0) {
      return [];
    }

    // Group data by channel
    const groupedData = rawData.reduce((acc, item) => {
      const channel = item.channel || 'Unknown';
      if (!acc[channel]) {
        acc[channel] = {
          cases: { ytd: 0, ly: 0 },
          gSales: { ytd: 0, ly: 0 },
          fGP: { ytd: 0, ly: 0 },
          fGPFY24: { ytd: 0, ly: 0 }
        };
      }
      
      acc[channel].cases.ytd += item.cases || 0;
      acc[channel].gSales.ytd += item.gSales || 0;
      acc[channel].fGP.ytd += item.fGP || 0;
      acc[channel].fGPFY24.ytd += item.fGPFY24 || 0;
      
      // For LY data, you would need to fetch previous year data
      // This is a simplified version - in reality, you'd need to compare with LY data
      acc[channel].cases.ly += (item.cases || 0) * 0.96; // Simulated LY data
      acc[channel].gSales.ly += (item.gSales || 0) * 0.99;
      acc[channel].fGP.ly += (item.fGP || 0) * 0.98;
      acc[channel].fGPFY24.ly += (item.fGPFY24 || 0) * 0.98;
      
      return acc;
    }, {} as any);

    // Transform to report format
    return Object.entries(groupedData).map(([channel, data]: [string, any]) => {
      const casesVar = data.cases.ytd - data.cases.ly;
      const gSalesVar = data.gSales.ytd - data.gSales.ly;
      const fGPVar = data.fGP.ytd - data.fGP.ly;
      const fGPFY24Var = data.fGPFY24.ytd - data.fGPFY24.ly;

      const casesVarPercent = data.cases.ly !== 0 ? (casesVar / data.cases.ly) * 100 : 0;
      const gSalesVarPercent = data.gSales.ly !== 0 ? (gSalesVar / data.gSales.ly) * 100 : 0;
      const fGPVarPercent = data.fGP.ly !== 0 ? (fGPVar / data.fGP.ly) * 100 : 0;
      const fGPFY24VarPercent = data.fGPFY24.ly !== 0 ? (fGPFY24Var / data.fGPFY24.ly) * 100 : 0;

      const fGPPercentYTD = data.gSales.ytd !== 0 ? (data.fGP.ytd / data.gSales.ytd) * 100 : 0;
      const fGPPercentLY = data.gSales.ly !== 0 ? (data.fGP.ly / data.gSales.ly) * 100 : 0;
      const fGPPercentVar = fGPPercentYTD - fGPPercentLY;

      return {
        channel,
        cases: {
          ytd: Math.round(data.cases.ytd),
          lyVar: Math.round(casesVar),
          lyVarPercent: Math.round(casesVarPercent * 10) / 10
        },
        gSales: {
          ytd: Math.round(data.gSales.ytd),
          lyVar: Math.round(gSalesVar),
          lyVarPercent: Math.round(gSalesVarPercent * 10) / 10
        },
        fGP: {
          ytd: Math.round(data.fGP.ytd),
          lyVar: Math.round(fGPVar),
          lyVarPercent: Math.round(fGPVarPercent * 10) / 10
        },
        fGPPercent: {
          ytd: Math.round(fGPPercentYTD * 10) / 10,
          lyVar: Math.round(fGPPercentVar * 10) / 10
        },
        fGPFY24: {
          ytd: Math.round(data.fGPFY24.ytd),
          cyVLy: Math.round(fGPFY24VarPercent * 10) / 10
        }
      };
    });
  }

  /**
   * Generate sample data for testing (matches screenshot format)
   */
  static generateSampleBusinessAreaData(): BusinessAreaReportData[] {
    return [
      {
        businessArea: 'Food',
        cases: { ytd: 2151910, lyVar: -167515, lyVarPercent: -7.2 },
        gSales: { ytd: 43990, lyVar: -1763, lyVarPercent: -3.9 },
        fGP: { ytd: 13409, lyVar: 27, lyVarPercent: 0.2 },
        fGPPercent: { ytd: 30.5, lyVar: 1.2 },
        fGPFY24: { ytd: 13382, cyVLy: 100.2 }
      },
      {
        businessArea: 'Household',
        cases: { ytd: 645606, lyVar: 50584, lyVarPercent: 8.5 },
        gSales: { ytd: 12760, lyVar: 1020, lyVarPercent: 8.7 },
        fGP: { ytd: 4058, lyVar: 305, lyVarPercent: 8.1 },
        fGPPercent: { ytd: 31.8, lyVar: -0.2 },
        fGPFY24: { ytd: 3752, cyVLy: 108.1 }
      },
      {
        businessArea: 'Brillo & KMPL',
        cases: { ytd: 241351, lyVar: -44691, lyVarPercent: -15.6 },
        gSales: { ytd: 2612, lyVar: -464, lyVarPercent: -15.1 },
        fGP: { ytd: 832, lyVar: -173, lyVarPercent: -17.2 },
        fGPPercent: { ytd: 31.9, lyVar: -0.8 },
        fGPFY24: { ytd: 1005, cyVLy: 82.8 }
      },
      {
        businessArea: 'Kinetica',
        cases: { ytd: 157855, lyVar: 14906, lyVarPercent: 10.4 },
        gSales: { ytd: 5040, lyVar: 593, lyVarPercent: 13.3 },
        fGP: { ytd: 2011, lyVar: 334, lyVarPercent: 19.9 },
        fGPPercent: { ytd: 39.9, lyVar: 2.2 },
        fGPFY24: { ytd: 1676, cyVLy: 119.9 }
      }
    ];
  }

  /**
   * Generate sample channel data for testing (matches screenshot format)
   */
  static generateSampleChannelData(): ChannelReportData[] {
    return [
      {
        channel: 'Grocery ROI',
        cases: { ytd: 1643698, lyVar: -128384, lyVarPercent: -7.2 },
        gSales: { ytd: 38478, lyVar: -1368, lyVarPercent: -3.4 },
        fGP: { ytd: 11046, lyVar: -363, lyVarPercent: -3.2 },
        fGPPercent: { ytd: 28.7, lyVar: 0.1 },
        fGPFY24: { ytd: 11409, cyVLy: 96.8 }
      },
      {
        channel: 'Grocery UK & NI',
        cases: { ytd: 354658, lyVar: 47394, lyVarPercent: 15.4 },
        gSales: { ytd: 4742, lyVar: 685, lyVarPercent: 16.9 },
        fGP: { ytd: 1491, lyVar: 192, lyVarPercent: 14.7 },
        fGPPercent: { ytd: 31.4, lyVar: -0.6 },
        fGPFY24: { ytd: 1299, cyVLy: 114.7 }
      },
      {
        channel: 'Wholesale ROI',
        cases: { ytd: 472546, lyVar: -4526, lyVarPercent: -0.9 },
        gSales: { ytd: 11799, lyVar: 31, lyVarPercent: 0.3 },
        fGP: { ytd: 4275, lyVar: 114, lyVarPercent: 2.7 },
        fGPPercent: { ytd: 36.2, lyVar: 0.9 },
        fGPFY24: { ytd: 4162, cyVLy: 102.7 }
      },
      {
        channel: 'Wholesale UK & NI',
        cases: { ytd: 104086, lyVar: -31196, lyVarPercent: -23.1 },
        gSales: { ytd: 2013, lyVar: -428, lyVarPercent: -17.6 },
        fGP: { ytd: 744, lyVar: -146, lyVarPercent: -16.4 },
        fGPPercent: { ytd: 37.0, lyVar: 0.5 },
        fGPFY24: { ytd: 890, cyVLy: 83.6 }
      },
      {
        channel: 'International',
        cases: { ytd: 519720, lyVar: -53180, lyVarPercent: -9.3 },
        gSales: { ytd: 3991, lyVar: -230, lyVarPercent: -5.4 },
        fGP: { ytd: 1109, lyVar: 330, lyVarPercent: 42.4 },
        fGPPercent: { ytd: 27.8, lyVar: 9.3 },
        fGPFY24: { ytd: 779, cyVLy: 142.4 }
      },
      {
        channel: 'Online',
        cases: { ytd: 86155, lyVar: 21474, lyVarPercent: 33.2 },
        gSales: { ytd: 2925, lyVar: 621, lyVarPercent: 27.0 },
        fGP: { ytd: 1473, lyVar: 343, lyVarPercent: 30.4 },
        fGPPercent: { ytd: 50.4, lyVar: 1.3 },
        fGPFY24: { ytd: 1130, cyVLy: 130.4 }
      },
      {
        channel: 'Sports & Others',
        cases: { ytd: 15859, lyVar: 1702, lyVarPercent: 12.0 },
        gSales: { ytd: 455, lyVar: 75, lyVarPercent: 19.6 },
        fGP: { ytd: 170, lyVar: 23, lyVarPercent: 15.8 },
        fGPPercent: { ytd: 37.4, lyVar: -1.2 },
        fGPFY24: { ytd: 147, cyVLy: 115.8 }
      }
    ];
  }
}
