import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environment';
import { IncomeState } from '@graphql';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  private readonly apiUri = `${environment.uri}/api/reports`;

  private readonly http = inject(HttpClient);

  public incomesDownload(start: string, end: string, branchId: string) {
    const searchParams = new URLSearchParams({ start, end, branchId });

    const url = `${this.apiUri}/incomes-download?${searchParams.toString()}`;

    this.http
      .get(url, {
        responseType: 'blob',
        observe: 'response',
      })
      .subscribe({
        next: (response) => {
          if (response.body) {
            const blob = new Blob([response.body], {
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'reporte-ingresos.xlsx';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          }
        },
        error: (error) => {
          console.error('Error al descargar el reporte:', error);
        },
      });
  }

  public incomes(
    start: string,
    end: string,
    branchId: string
  ): Observable<ReportsResponse> {
    return this.http.get<ReportsResponse>(`${this.apiUri}/incomes`, {
      params: { start, end, branchId },
    });
  }

  public incomesBYDisciplineDownload(start: string, end: string, branchId: string) {
    const searchParams = new URLSearchParams({ start, end, branchId });

    const url = `${this.apiUri}/incomes-by-disciplines-download?${searchParams.toString()}`;

    this.http
      .get(url, {
        responseType: 'blob',
        observe: 'response',
      })
      .subscribe({
        next: (response) => {
          if (response.body) {
            const blob = new Blob([response.body], {
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'reporte-ingresos-por-disciplinas.xlsx';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          }
        },
        error: (error) => {
          console.error('Error al descargar el reporte:', error);
        },
      });
  }

  public incomesBYDiscipline(
    start: string,
    end: string,
    branchId: string
  ): Observable<DisciplineReportResponse> {
    return this.http.get<DisciplineReportResponse>(
      `${this.apiUri}/incomes-by-disciplines`,
      {
        params: { start, end, branchId },
      }
    );
  }

  public debits(
    start: string,
    end: string,
    branchId: string
  ): Observable<ReportsResponse> {
    return this.http.get<ReportsResponse>(`${this.apiUri}/debits`, {
      params: { start, end, branchId },
    });
  }
}

export interface ReportsStudent {
  id: string;
  fullname: string;
}

export interface ReportsData {
  paymentId: string;
  paymentFolio: number;
  paymentState: string;
  paymentMethod: string;
  paymentDate: string;
  paymentAmount: string;
  paymentTransaction: string;
  paymentBank: string;
  incomeId: string;
  incomeFolio: number;
  incomeState: string;
  incomeDate: string;
  incomeAmount: string;
  incomeDiscount: string;
  incomeSubtotal: string;
  incomeTaxes: string;
  incomeTotal: string;
  incomePendingPayment: string;
  branchId: string;
  branchName: string;
  students: ReportsStudent[];
}

export interface ReportsGrouped {
  id: string;
  name: string;
  count: string;
}

export interface ReportsResponse {
  groupedByMethod: ReportsGrouped[];
  total: number;
  data: ReportsData[];
}

export interface DisciplineReportResponse {
  total: string;
  receivedPerOtherItems: string;
  receivedPerMonthlyItems: string;
  monthlyDetailsItems: Array<MonthlyByDisciplineData>;
  otherItems: Array<ConceptWithIncomeData>;
  groupedByDiscipline: Array<ReportsGrouped>;
}

export type ConceptWithIncomeData = {
  incomeId: string;
  incomeFolio: number;
  incomeState: IncomeState;
  incomeDate: string;
  branchId: string;
  branchName: string;
  received: number;
  students: Array<ReportsStudent>;
  conceptId: string;
  conceptDescription: string;
  conceptTotal: string;
  conceptPendingPayment: string;
  conceptReceived: string;
  debitId: string;
  enrollmentId: string;
  enrollmentDetails: string;
};

export type MonthlyByDisciplineData = {
  receivedPerHour: string;
  receivedPerDiscipline: string;
  incomeId: string;
  incomeFolio: number;
  incomeState: IncomeState;
  incomeDate: string;
  branchId: string;
  branchName: string;
  received: number;
  students: Array<ReportsStudent>;
  enrollmentId: string;
  enrollmentHours: number;
  studentId: string;
  studentFullname: string;
  disciplineId: string;
  disciplineName: string;
  disciplineTotalHours: number;
  conceptId: string;
  conceptDescription: string;
  conceptTotal: string;
  conceptPendingPayment: string;
  conceptReceived: string;
  debitId: string;
};
