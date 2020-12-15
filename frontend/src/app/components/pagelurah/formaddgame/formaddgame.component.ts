import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, FormBuilder } from "@angular/forms";
import "jquery";
import { HeadchiefService } from "src/app/services/headchief.service";
import { ActivatedRoute } from "@angular/router";
import { chief } from "src/app/models/headchief";

@Component({
  selector: "app-formaddgame",
  templateUrl: "./formaddgame.component.html",
  styleUrls: ["./formaddgame.component.css"],
})
export class FormaddgameComponent implements OnInit {
  comitted: any;
  assign = new FormGroup({
    subDistrict: new FormControl(""),
    _id: new FormControl(""),
  });
  constructor(
    private chiefService: HeadchiefService,
    private route: ActivatedRoute,
    public fb: FormBuilder
  ) {}
  ngOnInit(): void {}
  AssignCom(): void {
    const chief: chief = {
      _id: this.assign.get("_id").value,
      subDistrict: this.assign.get("subDistrict").value,
    };
  }
}
