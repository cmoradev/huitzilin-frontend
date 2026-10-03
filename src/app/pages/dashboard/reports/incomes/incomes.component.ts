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
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { merge, startWith } from 'rxjs';
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
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-incomes',
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
    FolioPipe,
    MethodPipe,
    DatePipe,
    CurrencyPipe,
    RouterLink
],
  templateUrl: './incomes.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: ``,
})
export class IncomesComponent implements AfterViewInit, OnInit {
  @ViewChild('paginator') public paginator!: MatPaginator;
  @ViewChild('methodsChart')
  public methodsChartElement!: ElementRef<HTMLDivElement>;

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

  public startDateControl = new FormControl<Date>(startOfDay(new Date()));
  public endDateControl = new FormControl<Date>(endOfDay(new Date()));
  public branchControl = new FormControl<string | null>(
    this._globalStateService.branch?.id ?? null
  );

  ngOnInit(): void {
    this.branchTools.fetchAll();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;

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

      this.reportsService.incomesDownload(start, end, branchId);
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

      this.reportsService.incomes(start, end, branchId).subscribe({
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
  }

  private drawCharts() {
    if (this.methodsChartElement.nativeElement) {
      const methodsChart = init(this.methodsChartElement.nativeElement);

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
