import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { AddStudentsToDocumentGQL, CreateOneDocumentGQL } from '@graphql';
import { StorageService } from '@services';
import { map, switchMap } from 'rxjs';

@Component({
  selector: 'app-student-upload-document',
  imports: [],
  templateUrl: './student-upload-document.component.html',
  styles: ``,
})
export class StudentUploadDocumentComponent {
  @Input({ required: true }) public studentId!: string;
  @Input({ required: true }) public documentKey!: string;
  @Input({ required: true }) public documentName!: string;

  @Output() refresh = new EventEmitter<void>();

  public loading = signal(false);

  private readonly _storageService = inject(StorageService);
  private readonly _createOneDocument = inject(CreateOneDocumentGQL);
  private readonly _addStudentsToDocument = inject(AddStudentsToDocumentGQL);

  public onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    this.loading.set(true);

    if (file) {
      this._storageService
        .upload(file)
        .pipe(
          switchMap((url) =>
            this._createOneDocument
              .mutate({
                variables: {
                  document: {
                    key: this.documentKey,
                    name: this.documentName,
                    url,
                  },
                },
              })
              .pipe(map((response) => response.data?.createOneDocument))
          ),
          switchMap((document) =>
            this._addStudentsToDocument
              .mutate({
                variables: {
                  id: document!.id,
                  relationIds: [this.studentId],
                },
              })
              .pipe(map(() => document))
          )
        )
        .subscribe({
          next: () => {
            this.loading.set(false);
            this.refresh.emit();
          },
        });
    }
  }
}
