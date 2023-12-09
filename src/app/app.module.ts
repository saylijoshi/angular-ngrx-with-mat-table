import { BrowserModule } from "@angular/platform-browser";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { CustomerTableComponent } from "./customer-table/customer-table.component";
import { StorageModule } from "./store/storage.module";
import { CustomerService } from "./services/customer.service";
import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MaterialModule } from "./shared/material.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgxLoadingButtonsModule } from "ngx-loading-buttons";
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from "@angular/material/form-field";
import { NgxSpinnerModule } from "ngx-spinner";
@NgModule({
  declarations: [AppComponent, CustomerTableComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    StorageModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgxLoadingButtonsModule,
    NgxSpinnerModule,
  ],
  providers: [
    CustomerService,
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: "fill" },
    },
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
