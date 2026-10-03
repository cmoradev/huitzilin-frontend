import { NgStyle } from '@angular/common';
import { Component, forwardRef, Input, Optional, Self, ChangeDetectionStrategy } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NgControl,
} from '@angular/forms';

@Component({
  selector: 'app-image-picker',
  imports: [NgStyle],
  templateUrl: './image-picker.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ImagePickerComponent),
      multi: true,
    },
  ],
})
export class ImagePickerComponent implements ControlValueAccessor {
  @Input({ required: false }) imageSource = 'images/image-default.png';
  @Input({ required: false }) width = '6rem';
  @Input({ required: false }) height = '6rem';

  private onChange: (value: File | null) => void = () => {};
  private onTouched: () => void = () => {};

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0] || null;
    if (file) {
      this.imageSource = URL.createObjectURL(file);

      this.onTouched();
      this.onChange(file);
    }
  }

  writeValue(value: string | null): void {
    this.imageSource = value || 'images/image-default.png';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
