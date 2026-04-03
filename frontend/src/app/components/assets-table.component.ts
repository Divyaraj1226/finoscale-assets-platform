import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { RowClassParams, ColDef, GridApi, GridReadyEvent, CellValueChangedEvent, AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
import { CommonModule } from '@angular/common';
import { firstValueFrom, Subject } from 'rxjs';
import { AssetsService, AssetsResponse } from '../services/assets.service';
import { ErrorService } from '../services/error.service';

ModuleRegistry.registerModules([AllCommunityModule]);

export interface IAssetRow {
  field: string;
  [year: string]: number | string;
}

@Component({
  selector: 'app-assets-table',
  standalone: true,
  imports: [AgGridAngular, CommonModule],
  styleUrls: ['./assets-table.component.css'],
  templateUrl: './assets-table.component.html',
})
export class AssetsTableComponent implements OnInit, OnDestroy {
  private gridApi!: GridApi<IAssetRow>;
  private destroy$ = new Subject<void>();

  loading = signal(true);
  saving = signal(false);
  error = signal<string | null>(null);
  saveError = signal<string | null>(null);

  private _rowData = signal<IAssetRow[]>([]);
  private _colDefs = signal<ColDef<IAssetRow>[]>([]);

  rowData = computed(() => this._rowData());
  colDefs = computed(() => this._colDefs());

  getRowId = (params: { data: IAssetRow }) => params.data.field;

  defaultColDef: ColDef<IAssetRow> = {
    sortable: true,
    filter: true,
    resizable: true,
    flex: 1,
    cellClass: (params) =>
      params.colDef.field !== 'field' ? 'text-right' : '',
    valueFormatter: (params) => {
      if (params.colDef.field === 'field') return params.value;
      const val = Number(params.value ?? 0);
      return val.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    },
  };

  getRowClass = (params: RowClassParams<IAssetRow>) => {
    return params.data?.field === 'TOTAL' ? 'total-row' : '';
  };

  constructor(private assetsService: AssetsService, private errorService: ErrorService) {}

  ngOnInit() {
    this.fetchAssets();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onGridReady(event: GridReadyEvent<IAssetRow>) {
    this.gridApi = event.api;
  }

  async fetchAssets() {
    this.loading.set(true);
    this.error.set(null);

    try {
  const res: AssetsResponse = await firstValueFrom(this.assetsService.getAssets());
  
      this._colDefs.set([
        {
          field: 'field',
          headerName: 'Asset Field',
          editable: false,
          flex: 2,
          valueFormatter: (p) =>
            String(p.value)
              .replace(/_/g, ' ')
              .replace(/\b\w/g, (c) => c.toUpperCase()),
          cellStyle: (params) => params.data?.field === 'TOTAL' ? { 'font-weight': 'bold' } : null,
        },
        ...res.years.map((y) => ({
          field: y,
          headerName: new Date(y).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          }),
          editable: (params:any) => params.data?.field !== 'TOTAL',
          flex: 1,
          type: 'rightAligned',
          valueFormatter: (p: any) => {
            const val = Number(p.value ?? 0);
            return val.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
          },
          cellStyle: (params:any) => params.data?.field === 'TOTAL' ? { 'font-weight': 'bold' } : null,
        })),
      ]);

      const dataRows: IAssetRow[] = res.fields.map(f => {
        const row: IAssetRow = { field: f };
        res.years.forEach(year => row[year] = res.data[f]?.[year] ?? 0);
        return row;
      });

      const totalsRow: IAssetRow = { field: 'TOTAL' };
      res.years.forEach(year => totalsRow[year] = res.totals[year] ?? 0);

      this._rowData.set([...dataRows, totalsRow]);
    } catch (err: any) {
      this.error.set(`Failed to load: ${err.message}`);
      console.error(err);
      this.errorService.showError(err.message);
    } finally {
      this.loading.set(false);
    }
  }

  async onCellValueChanged(event: CellValueChangedEvent<IAssetRow>) {
    const field = event.data.field;
    const year = event.colDef.field as string;
    const newValue = Number(event.newValue);
    const oldValue = event.oldValue;

    if (!field || field === 'TOTAL' || !year) return;

    // Optimistic update
    const updatedRow: IAssetRow = { ...event.data, [year]: newValue };
    this.gridApi.applyTransaction({ update: [updatedRow] });
    this.updateTotalsRow(year);

    this.saving.set(true);
    this.saveError.set(null);

    try {
      await this.assetsService.updateAsset({ key: field, year, value: newValue }).toPromise();
      this.errorService.showSuccess('Saved successfully');
    } catch (err: any) {
      // rollback
      const rolledBack: IAssetRow = { ...event.data, [year]: oldValue };
      this.gridApi.applyTransaction({ update: [rolledBack] });
      this.updateTotalsRow(year);

      this.saveError.set(`Save failed: ${err.message}`);
      this.errorService.showError(err.message);
    } finally {
      this.saving.set(false);
    }
  }

  private updateTotalsRow(year: string) {
    let total = 0;
    this.gridApi.forEachNode(node => {
      if (node.data?.field !== 'TOTAL') total += Number(node.data?.[year] ?? 0);
    });

    const totalsNode = this.findTotalsNode();
    if (totalsNode?.data) {
      const updated: IAssetRow = { ...totalsNode.data, [year]: total };
      this.gridApi.applyTransaction({ update: [updated] });
    }
  }

  private findTotalsNode() {
    let found: any = null;
    this.gridApi.forEachNode(node => {
      if (node.data?.field === 'TOTAL') found = node;
    });
    return found;
  }
}