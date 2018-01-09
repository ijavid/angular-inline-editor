import { Component, Input, ElementRef, ViewChild, Renderer, forwardRef, OnInit, Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const TYPEAHEAD_EDIT_CONTROL_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => TypeAheadEditorComponent),
  multi: true
};

@Component({
  selector: 'typeahed-editor',
  template: `<div *ngIf="editing">
  <label class="col-form-label">{{label}}</label>
  <div class="input-group">
      <input #typeaheadEditorControl class="form-control" id="ngtypeaheadsearch" type="text" [placeholder]="placeholder" (keyup)="search($event)">
      <span class="input-group-btn">
          <button class="btn btn-sm btn-success" type="button" (click)="onSaveComplete()">
              <i class="fa fa-check" aria-hidden="true"></i>
          </button>
          <button class="btn btn-sm btn-danger" type="button" (click)="onCancelComplete()">
              <i class="fa fa-times" aria-hidden="true"></i>
          </button>
      </span>
  </div>
  <div class="typeahead-menu" *ngIf="open">
      <a class="typeahead-item" *ngFor="let item of options | typeaheadfilter:filterArg:displayValue" (click)="selectItem(item)">{{item[displayValue]}}</a>
  </div>
</div>
<div *ngIf="!editing">
  <div class="form-group">
      <label class="col-form-label">{{label}}</label>
      <div *ngIf="IsTypeAheadTextEmpty()" (click)="edit(value)" (focus)="edit(value);" tabindex="0" class="inline-edit-empty">
          {{placeholder}}&nbsp;
      </div>
      <div *ngIf="!IsTypeAheadTextEmpty()" (click)="edit(value)" (focus)="edit(value);" tabindex="0" [ngClass]="disabled == 'true' ? 'inline-no-edit' : 'inline-edit'">{{GetDisplayText(value)}}&nbsp;</div>
  </div>
</div>`,
  styles: [
    '.col-form-label { padding-bottom: 0px !important; }',
    '.inline-edit { text-decoration: none; border-bottom: #007bff dashed 1px; cursor: pointer; width: auto;}',
    '.inline-no-edit { text-decoration: none; border-bottom: #959596 dashed 1px; cursor: not-allowed; width: auto;}',
    '.inline-edit-empty{ text-decoration: none; border-bottom: red dashed 1px; cursor: pointer; width: auto; color: #b9b8b8;}',
    '.typeahead-menu { top: 100%; left: 0; z-index: 1000; float: left; min-width: 10rem; padding: .5rem 0; margin: .125rem 0 0; font-size: 1rem; color: #212529; text-align: left; list-style: none; background-color: #fff; background-clip: padding-box; border: 1px solid rgba(0,0,0,.15); border-radius: .25rem; }',
    '.typeahead-item { cursor: pointer; display: block; width: 100%; padding: .25rem 1.5rem; clear: both; font-weight: 400; color: #212529; text-align: inherit; white-space: nowrap; background-color: transparent; border: 0;}'
  ],
  providers: [TYPEAHEAD_EDIT_CONTROL_VALUE_ACCESSOR]
})
export class TypeAheadEditorComponent implements ControlValueAccessor, OnInit {

  @ViewChild('typeaheadEditorControl') typeaheadEditorControl: ElementRef; // input DOM element
  @Input() label: string = '';  // Label value for input element
  @Input() placeholder: string = ''; // Placeholder value ofr input element
  @Input() required: boolean = false; // Is input requried?
  @Input() disabled: string = 'false'; // Is input disabled?
  @Input() id: string = '';
  @Input() options: any[];
  @Input() dataValue: string = '';
  @Input() displayValue: string = '';
  @Output() onSave: EventEmitter<string> = new EventEmitter();
  @Output() onCancel: EventEmitter<string> = new EventEmitter();

  public open: boolean = false;
  private _originalValue: any;
  public filterArg: any;
  private _value: string = ''; // Private variable for input value
  private preValue: string = ''; // The value before clicking to edit
  private editing: boolean = false; // Is Component in edit mode?
  public onChange: any = Function.prototype; // Trascend the onChange event
  public onTouched: any = Function.prototype; // Trascend the onTouch event

  constructor(element: ElementRef, private _renderer: Renderer) { }

  onSaveComplete() {
    this.onSave.emit('clicked save');
    this.editing = false;
  }

  onCancelComplete() {
    this.editing = false;
    this._value = this._originalValue;
    this.onCancel.emit('clicked cancel');
  }
  
  // Control Value Accessors for ngModel
  get value(): any {
    return this._value;
  }

  set value(v: any) {
    if (v !== this._value) {
      this._value = v;
      this.onChange(v);
    }
  }

  // Required for ControlValueAccessor interface
  writeValue(value: any) {
    this._value = value;
  }

  // Required forControlValueAccessor interface
  public registerOnChange(fn: (_: any) => {}): void {
    this.onChange = fn;
  }

  // Required forControlValueAccessor interface
  public registerOnTouched(fn: () => {}): void {
    this.onTouched = fn;
  }

  // Do stuff when the input element loses focus
  onBlur($event: Event) {
    this.editing = false;
  }

  // Start the editting process for the input element
  edit(value: any) {
    if (this.disabled === "true") {
      return;
    }

    this.preValue = value;
    this.editing = true;
    this._originalValue = value;
  }

  IsTypeAheadTextEmpty(): Boolean {
    return (this._value === undefined || this._value == '');
  }

  search(event: any) {
    if (event.target.value === undefined || event.target.value === null || event.target.value === "") {
      this.open = false;
      return;
    } else {
      this.filterArg = event.target.value;
      this.open = true;
    }
  }

  selectItem(item: any) {
    debugger;
    var dd = <HTMLInputElement>document.getElementById("ngtypeaheadsearch");
    dd.value = item[this.displayValue];
    this.value = item;
    this.open = false;
  }

  GetDisplayText(c: any): string {
    return c[this.displayValue];
  }

  ngOnInit() {

  }
}