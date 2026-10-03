import { CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnInit,
  signal,
  ViewChild,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
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
import { merge, startWith } from 'rxjs';

@Component({
  selector: 'app-incomes-by-discipline',
  imports: [
    NgClass,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatPaginatorModule,
    MatIconModule,
    MatFormFieldModule,
    ReactiveFormsModule,
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
  @ViewChild('monthlyPaginator') public monthlyPaginator!: MatPaginator;
  @ViewChild('otherPaginator') public otherPaginator!: MatPaginator;
  @ViewChild('methodsChart')
  public methodsChartElement!: ElementRef<HTMLDivElement>;

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

  public startDateControl = new FormControl<Date>(startOfDay(new Date()));
  public endDateControl = new FormControl<Date>(endOfDay(new Date()));
  public branchControl = new FormControl<string | null>(
    this._globalStateService.branch?.id ?? null
  );

  ngOnInit(): void {
    this.branchTools.fetchAll();
  }

  ngAfterViewInit(): void {
    this.otherDataSource.paginator = this.otherPaginator;
    this.monthlyDataSource.paginator = this.monthlyPaginator;

    merge(
      this.startDateControl.valueChanges,
      this.endDateControl.valueChanges,
      this.branchControl.valueChanges
    )
      .pipe(startWith(null))
      .subscribe({
        next: () => this.refresh(),
      });
  }

  public download() {
    if (
      !!this.startDateControl?.value &&
      this.endDateControl.value &&
      this.branchControl.value
    ) {
      const start = startOfDay(this.startDateControl.value).toISOString();
      const end = endOfDay(this.endDateControl.value).toISOString();
      const branchId = this.branchControl.value;

      this.reportsService.incomesBYDisciplineDownload(start, end, branchId);
    }
  }

  public refresh() {
    this.loading.set(true);

    if (
      !!this.startDateControl?.value &&
      this.endDateControl.value &&
      this.branchControl.value
    ) {
      const start = startOfDay(this.startDateControl.value).toISOString();
      const end = endOfDay(this.endDateControl.value).toISOString();
      const branchId = this.branchControl.value;

      this.reportsService.incomesBYDiscipline(start, end, branchId).subscribe({
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
  }

  private drawCharts() {
    if (this.methodsChartElement.nativeElement) {
      const methodsChart = init(this.methodsChartElement.nativeElement);

      // Ordena los datos de forma descendente por el valor
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
