import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import {
  DocumentPartsFragment,
  GetDocumentPageGQL,
  GetDocumentPageQueryVariables,
  StudentPartsFragment,
} from '@graphql';
import { studentDocuments } from '@utils/contains';
import { map } from 'rxjs';
import { StudentUploadDocumentComponent } from '../student-upload-document/student-upload-document.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { StudentItemDocumentComponent } from "../student-item-document/student-item-document.component";

@Component({
  selector: 'app-student-documents-dialog',
  imports: [
    MatDialogModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    StudentUploadDocumentComponent,
    StudentItemDocumentComponent
],
  templateUrl: './student-documents-dialog.component.html',
  styles: ``,
})
export class StudentDocumentsDialogComponent implements OnInit {
  private readonly _getDocumentsPage = inject(GetDocumentPageGQL);

  public data: StudentPartsFragment = inject(MAT_DIALOG_DATA);
  public documents = signal<DocumentPartsFragment[]>([]);
  public studentDocuments = computed(() =>
    studentDocuments.map((doc) => ({
      ...doc,
      document: this.documents().find((value) => value.key === doc.value),
    }))
  );

  ngOnInit(): void {
    this.fetchAllDocuments();
  }

  public fetchAllDocuments(accumulared: DocumentPartsFragment[] = []): void {
    if (!!this.data!.id) {
      const limit = 50;
      const offset = accumulared.length;

      const params: GetDocumentPageQueryVariables = {
        studentId: this.data.id,
        limit,
        offset,
      };

      const getDocuments$ = this._getDocumentsPage
        .watch({
          variables: params,
          fetchPolicy: 'cache-and-network', // Usa cache primero, solo pide a la API si no hay datos en cache
          nextFetchPolicy: 'cache-and-network', // Mantiene la política de cache en siguientes peticiones
          notifyOnNetworkStatusChange: false, // No notifica cambios de red para evitar refetch innecesario
        })
        .valueChanges;

      getDocuments$.pipe(map((resp) => resp.data?.documents)).subscribe({
        next: (documents) => {
          if (!documents) return;

          const nodes = (documents.nodes ?? []) as DocumentPartsFragment[];
          const totalCount = documents.totalCount ?? 0;

          const allItems = accumulared.concat(nodes);

          if (allItems.length >= totalCount) {
            this.documents.set(allItems);
            return; // No more fees to fetch
          }

          this.fetchAllDocuments(allItems);
        },
        error: (error) => {
          console.error('Error fetching fees', error);
        },
      });
    }
  }
}
