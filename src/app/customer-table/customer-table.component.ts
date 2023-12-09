import {
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
  AfterViewInit,
} from "@angular/core";
import { Customer } from "../core/models/customer";
import { MatSort, Sort } from "@angular/material/sort";
import { MatLegacyTableDataSource as MatTableDataSource } from "@angular/material/legacy-table";
import { GlobalState } from "../store/states/global.state";
import { Store, select } from "@ngrx/store";
import {
  selectAllCustomer,
  selectCustomerTotal,
  selectCustomerError,
  selectCustomerLoading,
} from "../store/selectors/customer.selectors";
import { loadingCustomers } from "../store/actions/customer.actions";
import { NgxSpinnerService } from "ngx-spinner";
import { MatLegacyPaginator as MatPaginator } from "@angular/material/legacy-paginator";
import { Observable, merge, Subject, Subscription } from "rxjs";
import { tap, debounceTime, distinctUntilChanged } from "rxjs/operators";
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";

import { FormGroup, FormControl } from "@angular/forms";

export interface PeriodicElement {
  action: string;
  id: number;
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
  phone: string;
}
@Component({
  selector: "app-customer-table",
  templateUrl: "./customer-table.component.html",
  styleUrls: ["./customer-table.component.scss"],
  animations: [
    trigger("detailExpand", [
      state("collapsed", style({ height: "0px", minHeight: "0" })),
      state("expanded", style({ height: "*" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
      ),
    ]),
  ],
})
export class CustomerTableComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  form: FormGroup;
  public displayedColumns: string[] = [
    "action",
    "id",
    "firstName",
    "lastName",
    "gender",
    "email",
    "phone",
  ];
  personProps: any[] = [];

  public dataSource: MatTableDataSource<Customer>;
  expandedElement: PeriodicElement | null;
  public customerTotal: number;
  public noData: Customer[] = [<Customer>{}];
  public loading: boolean = false;
  public error$: Observable<boolean>;
  public filterSubject = new Subject<string>();
  public defaultSort: Sort = { active: "id", direction: "asc" };
  public btnloading: boolean = false;
  private filter: string = "";
  private subscription: Subscription = new Subscription();
  isExpansionDetailRow = (i: number, row: Object) => {
    console.log(row);
    return row.hasOwnProperty("detailRow");
  };
  constructor(
    public store: Store<GlobalState>,
    private spinner: NgxSpinnerService
  ) {}

  public ngOnInit(): void {
    this.store
      .pipe(select(selectAllCustomer))
      .subscribe((customers) => this.initializeData(customers));
    this.store
      .pipe(select(selectCustomerTotal))
      .subscribe((total) => (this.customerTotal = total));
    this.subscription.add(
      this.store.pipe(select(selectCustomerLoading)).subscribe((loading) => {
        if (loading) {
          this.dataSource = new MatTableDataSource(this.noData);
        }
        this.loading = loading;
      })
    );
    this.error$ = this.store.pipe(select(selectCustomerError));
  }

  public ngAfterViewInit(): void {
    this.loadCustomers();
    let filter$ = this.filterSubject.pipe(
      debounceTime(150),
      distinctUntilChanged(),
      tap((value: string) => {
        this.paginator.pageIndex = 0;
        this.filter = value;
      })
    );

    let sort$ = this.sort.sortChange.pipe(
      tap(() => (this.paginator.pageIndex = 0))
    );

    this.subscription.add(
      merge(filter$, sort$, this.paginator.page)
        .pipe(tap(() => this.loadCustomers()))
        .subscribe()
    );
  }

  private loadCustomers(): void {
    this.store.dispatch(
      loadingCustomers({
        params: {
          filter: this.filter.toLocaleLowerCase(),
          pageIndex: this.paginator.pageIndex,
          pageSize: this.paginator.pageSize,
          sortDirection: this.sort.direction,
          sortField: this.sort.active,
        },
      })
    );
  }

  private initializeData(customers: Customer[]): void {
    this.dataSource = new MatTableDataSource(
      customers.length ? customers : this.noData
    );
  }

  expandedSymbol: string = "";

  toggleExpandableSymbol(data: any, symbol: string): void {
    this.expandedSymbol = this.expandedSymbol === symbol ? "" : symbol;
    const formDataObj: any = {};

    for (const prop of Object.keys(data)) {
      formDataObj[prop] = new FormControl(data[prop]);
      this.personProps.push(prop);
    }

    this.form = new FormGroup(formDataObj);
    console.log(this.form);
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public retry(): void {
    this.loadCustomers();
  }
  save(): void {
    this.btnloading = true;
    this.spinner.show();
    console.log(this.form.value);
    let currentdata = JSON.parse(localStorage.getItem("data") || "{}");

    var foundIndex = currentdata.users.findIndex(
      (x: any) => x.id == this.form.value.id
    );
    currentdata[foundIndex] = this.form.value;
    localStorage.setItem("data", JSON.stringify(currentdata));
    this.btnloading = false;
    //this.spinner.hide();
  }
}
