import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  signal,
  ChangeDetectionStrategy
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DocumentPartsFragment, RemoveStudentsFromDocumentGQL } from '@graphql';
import { DeleteOneDocumentGQL } from '../../../../graphql/generated';
import { StorageService } from '@services';
import { map, switchMap } from 'rxjs';

@Component({
  selector: 'app-student-item-document',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './student-item-document.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: ``,
})
export class StudentItemDocumentComponent {
  @Input({ required: true }) document!: DocumentPartsFragment;
  @Input({ required: true }) studentId!: string;

  @Output() refresh = new EventEmitter<void>();

  private readonly _storageService = inject(StorageService);
  private readonly _removeStudentsFromDocument = inject(
    RemoveStudentsFromDocumentGQL
  );
  private readonly _deleteOneDocument = inject(DeleteOneDocumentGQL);

  public loading = signal(false);

  public deleteDocument() {
    this.loading.set(true);

    if (!!this.document?.id) {
      this._storageService
        .delete(this.document.url)
        .pipe(
          switchMap(() =>
            this._removeStudentsFromDocument
              .mutate({
                variables: {
                  id: this.document.id,
                  relationIds: [this.studentId],
                },
              })
              .pipe(map((resp) => resp.data?.removeStudentsFromDocument))
          ),
          switchMap(() =>
            this._deleteOneDocument
              .mutate({
                variables: { id: this.document.id },
              })
              .pipe(map((resp) => resp.data?.deleteOneDocument))
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
