export interface PipelineConfig {
  enableValidation: boolean;
  enableCleaning: boolean;
  enableImputation: boolean;
  schemaMode: 'flat' | 'star';
  dimensionColumns: string[];
}

export interface PipelineResult {
  data: any[];
  logs: string[];
  qualityScore: number;
  schemaMode?: 'flat' | 'star';
  factTable?: any[];
  dimensionTables?: Record<string, any[]>;
}

export const runPipeline = async (
  rawData: any[], 
  config: PipelineConfig, 
  onProgress: (step: string, status: 'running' | 'completed' | 'skipped', logs: string[]) => void
): Promise<PipelineResult> => {
  
  const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
  
  let currentData = JSON.parse(JSON.stringify(rawData));
  let allLogs: string[] = [];
  
  // 1. Input
  onProgress('input', 'running', ['Loading raw data...']);
  await delay(500);
  currentData = currentData.map((row: any) => ({
    ...row,
    _source_type: 'raw',
    _is_imputed: false,
    _quality_score: 100
  }));
  onProgress('input', 'completed', ['Loaded raw data', `Row count: ${currentData.length}`]);
  
  // 2. Validation
  if (config.enableValidation) {
    onProgress('validation', 'running', ['Starting validation...']);
    await delay(600);
    let invalidCount = 0;
    currentData.forEach((row: any) => {
      let hasNull = false;
      Object.values(row).forEach(val => {
        if (val === null || val === '' || val === undefined) hasNull = true;
      });
      if (hasNull) {
        row._quality_score -= 10;
        invalidCount++;
      }
    });
    onProgress('validation', 'completed', [`Found ${invalidCount} rows with missing/null values.`]);
  } else {
    onProgress('validation', 'skipped', ['Validation skipped.']);
  }

  // 3. Cleaning
  if (config.enableCleaning) {
    onProgress('cleaning', 'running', ['Starting cleaning...']);
    await delay(600);
    const uniqueData: any[] = [];
    const seen = new Set();
    let duplicates = 0;
    for (const row of currentData) {
      const str = JSON.stringify({ ...row, _source_type: undefined, _is_imputed: undefined, _quality_score: undefined });
      if (seen.has(str)) {
        duplicates++;
      } else {
        seen.add(str);
        row._source_type = 'cleaned';
        uniqueData.push(row);
      }
    }
    currentData = uniqueData;
    onProgress('cleaning', 'completed', [`Removed ${duplicates} duplicate rows.`]);
  } else {
    onProgress('cleaning', 'skipped', ['Cleaning skipped.']);
  }

  // 4. Imputation
  if (config.enableImputation) {
    onProgress('imputation', 'running', ['Starting imputation...']);
    await delay(600);
    let imputedCount = 0;
    
    const numericCols = Object.keys(currentData[0] || {}).filter(k => !k.startsWith('_') && typeof currentData[0][k] === 'number');
    const means: Record<string, number> = {};
    numericCols.forEach(col => {
      const validVals = currentData.map((r: any) => r[col]).filter((v: any) => typeof v === 'number' && !isNaN(v));
      means[col] = validVals.length ? validVals.reduce((a: number, b: number) => a + b, 0) / validVals.length : 0;
    });

    currentData.forEach((row: any) => {
      let rowImputed = false;
      Object.keys(row).forEach(col => {
        if (!col.startsWith('_') && (row[col] === null || row[col] === '' || row[col] === undefined)) {
          if (numericCols.includes(col)) {
            row[col] = means[col];
          } else {
            row[col] = 'Unknown';
          }
          rowImputed = true;
        }
      });
      if (rowImputed) {
        row._is_imputed = true;
        row._source_type = 'imputed';
        row._quality_score = Math.max(0, row._quality_score - 5);
        imputedCount++;
      }
    });
    onProgress('imputation', 'completed', [`Imputed missing values in ${imputedCount} rows.`]);
  } else {
    onProgress('imputation', 'skipped', ['Imputation skipped.']);
  }

  // 5. Output
  onProgress('output', 'running', ['Finalizing output and applying schema...']);
  await delay(500);
  let factTable: any[] | undefined;
  let dimensionTables: Record<string, any[]> | undefined;

  if (config.schemaMode === 'star') {
    factTable = [];
    dimensionTables = {};
    
    config.dimensionColumns.forEach(dimCol => {
      dimensionTables![dimCol] = [];
      const uniqueVals = new Set();
      currentData.forEach((row: any) => {
        if (!uniqueVals.has(row[dimCol])) {
          uniqueVals.add(row[dimCol]);
          dimensionTables![dimCol].push({
            [`${dimCol}_id`]: uniqueVals.size,
            [dimCol]: row[dimCol]
          });
        }
      });
    });

    currentData.forEach((row: any) => {
      const factRow = { ...row };
      config.dimensionColumns.forEach(dimCol => {
        const dimTable = dimensionTables![dimCol];
        const dimEntry = dimTable.find(d => d[dimCol] === row[dimCol]);
        if (dimEntry) {
          factRow[`${dimCol}_id`] = dimEntry[`${dimCol}_id`];
          delete factRow[dimCol];
        }
      });
      factTable!.push(factRow);
    });
    allLogs.push(`Created Fact table with ${factTable.length} rows and ${config.dimensionColumns.length} Dimension tables.`);
  } else {
    allLogs.push('Using Flat Table schema.');
  }

  const avgQuality = currentData.length ? currentData.reduce((acc: number, row: any) => acc + row._quality_score, 0) / currentData.length : 0;
  allLogs.push(`Average Data Quality Score: ${avgQuality.toFixed(1)}/100`);
  
  onProgress('output', 'completed', allLogs);

  return {
    data: currentData,
    logs: allLogs,
    qualityScore: avgQuality,
    factTable,
    dimensionTables
  };
};
