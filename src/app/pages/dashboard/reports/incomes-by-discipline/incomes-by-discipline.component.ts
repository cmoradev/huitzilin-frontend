import { CurrencyPipe } from '@angular/common';
import {
  AfterViewInit,
  Component,
  effect,
  ElementRef,
  inject,
  OnInit,
  signal,
  viewChild,
  ChangeDetectionStrategy,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { FolioPipe } from '@pipes';
import {
  BranchToolsService,
  ConceptWithIncomeData,
  GlobalStateService,
  MonthlyByDisciplineData,
  ReportsGrouped,
  ReportsService,
} from '@services';
import { getRandomColor } from '@utils/helpers';
import { endOfDay, startOfDay } from 'date-fns';
import { init } from 'echarts';

@Component({
  selector: 'app-incomes-by-discipline',
  imports: [
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatPaginatorModule,
    MatIconModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatTooltipModule,
    MatSelectModule,
    MatTabsModule,
    CurrencyPipe,
    FolioPipe,
    RouterLink,
  ],
  templateUrl: './incomes-by-discipline.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: ``,
})
export class IncomesByDisciplineComponent implements AfterViewInit, OnInit {
  public readonly monthlyPaginator =
    viewChild.required<MatPaginator>('monthlyPaginator');
  public readonly otherPaginator =
    viewChild.required<MatPaginator>('otherPaginator');
  public readonly methodsChartElement =
    viewChild.required<ElementRef<HTMLDivElement>>('methodsChart');

  public loading = signal<boolean>(false);
  public total = signal<number>(0);
  public summaryData = signal<ReportsGrouped[]>([]);
  public displayedColumns: string[] = [
    'student',
    'folio',
    'details1',
    'details2',
    'total',
  ];
  public summaryDisplayedColumns: string[] = ['name', 'value'];
  public otherDataSource = new MatTableDataSource<ConceptWithIncomeData>([]);
  public monthlyDataSource = new MatTableDataSource<MonthlyByDisciplineData>(
    []
  );

  private readonly reportsService = inject(ReportsService);
  private readonly _globalStateService = inject(GlobalStateService);

  public branchTools = inject(BranchToolsService);

  public readonly startDate = signal<Date>(startOfDay(new Date()));
  public readonly endDate = signal<Date>(endOfDay(new Date()));
  public readonly branchId = signal<string | null>(
    this._globalStateService.branch?.id ?? null
  );

  constructor() {
    effect(() => {
      const start = this.startDate();
      const end = this.endDate();
      const branchId = this.branchId();
      this.refreshWith(start, end, branchId);
    });
  }

  ngOnInit(): void {
    this.branchTools.fetchAll();
  }

  ngAfterViewInit(): void {
    this.otherDataSource.paginator = this.otherPaginator();
    this.monthlyDataSource.paginator = this.monthlyPaginator();
  }

  public onStartDateChange(value: Date | null): void {
    if (value) {
      this.startDate.set(value);
    }
  }

  public onEndDateChange(value: Date | null): void {
    if (value) {
      this.endDate.set(value);
    }
  }

  public onBranchChange(value: string | null): void {
    this.branchId.set(value);
  }

  public download(): void {
    const start = this.startDate();
    const end = this.endDate();
    const branchId = this.branchId();

    if (start && end && branchId) {
      this.reportsService.incomesBYDisciplineDownload(
        startOfDay(start).toISOString(),
        endOfDay(end).toISOString(),
        branchId
      );
    }
  }

  public refresh(): void {
    this.loading.set(true);
    this.refreshWith(this.startDate(), this.endDate(), this.branchId());
  }

  private refreshWith(
    start: Date | null,
    end: Date | null,
    branchId: string | null
  ): void {
    if (!start || !end || !branchId) {
      return;
    }

    this.loading.set(true);
    this.reportsService
      .incomesBYDiscipline(
        startOfDay(start).toISOString(),
        endOfDay(end).toISOString(),
        branchId
      )
      .subscribe({
        next: (response) => {
          this.summaryData.set(response.groupedByDiscipline);
          this.otherDataSource.data = response.otherItems;
          this.monthlyDataSource.data = response.monthlyDetailsItems;
          this.total.set(parseFloat(response.total));
          this.loading.set(false);

          this.drawCharts();
        },
        error: (error) => {
          console.error('Error fetching incomes:', error);
          this.loading.set(false);
        },
      });
  }

  private drawCharts(): void {
    const chartElement = this.methodsChartElement();
    if (chartElement) {
      const methodsChart = init(chartElement.nativeElement);

      const sortedData = this.summaryData()
        .sort((a, b) => parseFloat(b.count) - parseFloat(a.count))
        .map((item) => [item.name, parseFloat(item.count)]);

      methodsChart.setOption({
        dataset: {
          source: [['name', 'value'], ...sortedData],
        },
        xAxis: { name: 'amount' },
        yAxis: { type: 'category', inverse: true },
        grid: { containLabel: true },
        series: [
          {
            type: 'bar',
            encode: {
              x: 'value',
              y: 'name',
            },
            itemStyle: {
              color: function (params: any) {
                return getRandomColor();
              },
            },
            label: {
              show: true,
              position: 'right',
              formatter: (params: any) => {
                return new Intl.NumberFormat('es-MX', {
                  style: 'currency',
                  currency: 'MXN',
                  minimumFractionDigits: 2,
                }).format(params.value[1]);
              },
            },
          },
        ],
      });
    }
  }
}