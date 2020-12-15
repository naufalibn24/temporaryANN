import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, FormBuilder } from "@angular/forms";
import "jquery";
import { HeadchiefService } from "src/app/services/headchief.service";
import { ActivatedRoute } from "@angular/router";
import { chief } from "src/app/models/headchief";
declare var $: JQuery;

declare global {
  interface JQuery {
    (any): JQuery;
    bracket(options: any): JQuery;
  }
}

@Component({})
export class PagelurahComponent implements OnInit {
  ngOnInit(): void {
    $(document).ready(function () {
      $("#example").DataTable({
        columnDefs: [
          {
            targets: [0],
            orderData: [0, 1],
          },
          {
            targets: [1],
            orderData: [1, 0],
          },
          {
            targets: [4],
            orderData: [4, 0],
          },
        ],
      });
    });
  }
}
