import { CurrencyPipe, DatePipe } from '@angular/common';
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
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { endOfDay, startOfDay } from 'date-fns';
import {
  BranchToolsService,
  GlobalStateService,
  ReportsData,
  ReportsGrouped,
  ReportsService,
} from '@services';
import { FolioPipe, MethodPipe } from '@pipes';
import { init } from 'echarts';
import { PaymentMethod } from '@graphql';
import { paymentNames } from '@utils/contains';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-incomes',
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
    FolioPipe,
    MethodPipe,
    DatePipe,
    CurrencyPipe,
    RouterLink,
  ],
  templateUrl: './incomes.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: ``,
})
export class IncomesComponent implements AfterViewInit, OnInit {
  public readonly paginator = viewChild.required<MatPaginator>('paginator');
  public readonly methodsChartElement =
    viewChild.required<ElementRef<HTMLDivElement>>('methodsChart');

  public loading = signal<boolean>(false);
  public total = signal<number>(0);
  public incomeMethods = signal<ReportsGrouped[]>([]);
  public displayedColumns: string[] = [
    'branchName',
    'studentNames',
    'incomeFolio',
    'paymentFolio',
    'paymentMethod',
    'paymentDate',
    'paymentAmount',
  ];
  public summaryDisplayedColumns: string[] = ['name', 'value'];

  public dataSource = new MatTableDataSource<ReportsData>([]);
  public summaryDataSource = new MatTableDataSource<ReportsGrouped>([]);

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
    this.dataSource.paginator = this.paginator();
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
      this.reportsService.incomesDownload(
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
      .incomes(
        startOfDay(start).toISOString(),
        endOfDay(end).toISOString(),
        branchId
      )
      .subscribe({
        next: (response) => {
          this.dataSource.data = response.data;
          this.incomeMethods.set(response.groupedByMethod);
          this.summaryDataSource.data = response.groupedByMethod.map(
            (data) => ({
              ...data,
              name: paymentNames[data.id.toUpperCase() as PaymentMethod],
            })
          );
          this.total.set(response.total);
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

      const methodsData = this.incomeMethods().map((grouped) => ({
        value: grouped.count,
        name: paymentNames[grouped.id.toUpperCase() as PaymentMethod],
      }));

      methodsChart.setOption({
        tooltip: {
          trigger: 'item',
        },
        legend: {
          top: '5%',
          left: 'center',
        },
        series: [
          {
            name: 'Ingresos por método',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            padAngle: 3,
            itemStyle: {
              borderRadius: 8,
            },
            label: {
              show: false,
              position: 'center',
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 24,
                fontWeight: 'bold',
              },
            },
            labelLine: {
              show: false,
            },
            data: methodsData,
          },
        ],
      });
    }
  }
}