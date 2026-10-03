import { NgStyle } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
} from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';

@Component({
  selector: 'app-image-picker',
  imports: [NgStyle],
  templateUrl: './image-picker.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: ``,
})
export class ImagePickerComponent implements FormValueControl<File | string> {
  public readonly imageSource = input('images/image-default.png');
  public readonly width = input('6rem');
  public readonly height = input('6rem');

  /**
   * El modelo emite tanto un `File` (cuando el usuario selecciona una
   * nueva imagen) como una cadena con la URL existente al cargar el
   * registro original.
   */
  public readonly value = model<File | string>('');

  public onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    if (file) {
      this.value.set(file);
    }

    input.value = '';
  }

  public get preview(): string {
    const current = this.value();
    if (current instanceof File) {
      return URL.createObjectURL(current);
    }
    return current || 'images/image-default.png';
  }
}