import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Customer } from "../core/models/customer";
import { CustomerParams } from "../core/models/customer-params";
import { Observable, of } from "rxjs";
import { delay } from "rxjs/operators";
import { CustomerResponse } from "../core/models/customer-response";

@Injectable()
export class CustomerService {
  constructor(private httpClient: HttpClient) {
    this.getData().subscribe(
      (response: any) => {
        localStorage.setItem("data", JSON.stringify(response));
      },
      (error) => {
        console.log("Err : ", error);
      }
    );
  }

  public getCustomers(params: CustomerParams): Observable<CustomerResponse> {
    console.log(params);
    // return this.httpClient.post<Customer[]>("localhost:4200/customers", params);
    return of(this.getFakeCustomers(params)).pipe(delay(3000));
  }
  getData() {
    return this.httpClient.get(`https://dummyjson.com/users`);
  }

  private getFakeCustomers(params: CustomerParams): CustomerResponse {
    let abc = JSON.parse(localStorage.getItem("data") || "{}");
    let data = <Customer[]>[];
    console.log(
      abc.users.filter(
        (c: any) => ~c.firstName.toLocaleLowerCase().indexOf(params.filter)
      )
    );
    data = abc.users.filter(
      (c: any) =>
        ~c.firstName.toLocaleLowerCase().indexOf(params.filter) ||
        ~c.lastName.toLocaleLowerCase().indexOf(params.filter)
    );
    console.log(data);
    data.sort(
      (a: any, b: any) =>
        ((a as any)[params.sortField] > (b as any)[params.sortField] ? 1 : -1) *
        (params.sortDirection === "asc" ? 1 : -1)
    );
    return {
      total: data.length,
      customers: data.slice(
        params.pageIndex * params.pageSize,
        (params.pageIndex + 1) * params.pageSize
      ),
    };
  }
}

// const customers = <Customer[]>[
//   <Customer>{
//     id: "1",
//     amount: 100,
//     firstName: "Nikolai",
//     lastName: "Uvarov",
//     role: "Admin",
//     show: false,
//   },
//   <Customer>{
//     id: "2",
//     amount: 140,
//     firstName: "John",
//     lastName: "Conor",
//     role: "Admin",
//     show: false,
//   },
//   <Customer>{
//     id: "3",
//     amount: 80,
//     firstName: "Olya",
//     lastName: "Bytsenko",
//     role: "User",
//     show: false,
//   },
//   <Customer>{
//     id: "4",
//     amount: 100,
//     firstName: "Vasya",
//     lastName: "Pupkin",
//     role: "Partner",
//     show: false,
//   },
//   <Customer>{
//     id: "5",
//     amount: 140,
//     firstName: "Ivan",
//     lastName: "Grozniy",
//     role: "Admin",
//     show: false,
//   },
//   <Customer>{
//     id: "6",
//     amount: 80,
//     firstName: "Svet",
//     lastName: "Svetoslav",
//     role: "User",
//     show: false,
//   },
//   ,
//   <Customer>{
//     id: "7",
//     amount: 200,
//     firstName: "Alex",
//     lastName: "Great",
//     role: "Partner",
//     show: false,
//   },
//   <Customer>{
//     id: "8",
//     amount: 40,
//     firstName: "Kolya",
//     lastName: "Smith",
//     role: "User",
//     show: false,
//   },
//   <Customer>{
//     id: "9",
//     amount: 160,
//     firstName: "Tolya",
//     lastName: "Alikov",
//     role: "User",
//     show: false,
//   },
// ];
