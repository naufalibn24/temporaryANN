import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth/auth.service";
import { User } from "../../models/user";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"],
})
export class SignupComponent implements OnInit {
  datauser = {
    username: "",
    email: "",
    password: "",
  };
  regis;

  constructor(private authService: AuthService, private router: Router) {}

  signupUser() {
    this.authService.signupUser(this.datauser).subscribe((res) => {
      console.log(res);
      (res) => this.router.navigate([""]);
    });
  }

  ngOnInit(): void {}
}
