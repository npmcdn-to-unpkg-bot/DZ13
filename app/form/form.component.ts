import { Directive } from 'angular2/core';
import { FormBuilder, Validators, ControlGroup, Control, FORM_DIRECTIVES, FORM_BINDINGS} from 'angular2/common';
import {Http, HTTP_PROVIDERS, Headers} from 'angular2/http';
import 'rxjs/Rx';
import {Router, ROUTER_PROVIDERS} from 'angular2/router'
import{Component} from "angular2/core";

@Component({
  selector: 'FormPage',
  templateUrl: 'app/form/form.html',
  directives: [FORM_DIRECTIVES],
  viewBindings: [FORM_BINDINGS]
})

export class FormComponent {

  registerForm: ControlGroup;
 http: Http;
 router: Router;
 postResponse: String;

 constructor(builder: FormBuilder, http: Http, router: Router) {
this.http = http;
this.router = router;
 this.registerForm = builder.group({
 korisnik: ["", Validators.none],
 sifra: ["", Validators.none],
 ime: ["", Validators.none],
 prezime: ["", Validators.none],
 });

 if(localStorage.getItem('token') != null){
this.router.parent.navigate(['MainPage']);
 }

 }
 
 onRegister(): void {
var data =
"korisnik="+this.registerForm.value.korisnik+"&sifra="+this.registerForm.value.sifra+"&ime="+this.registerForm.value.ime+"&prezime="+this.registerForm.value.prezime;
var headers = new Headers();
headers.append('Content-Type', 'application/x-www-form-urlencoded');
this.http.post('http://localhost/php/registerservice.php',data, {headers:headers})
 .map(res => res)
 .subscribe( data => this.postResponse = data,
err => alert(JSON.stringify(err)),
() => {
if(this.postResponse._body.indexOf("error") === -1){
var obj = JSON.parse(this.postResponse._body);
localStorage.setItem('token', obj.token);
 this.router.parent.navigate(['./MainPage']);
}else{

var obj = JSON.parse(this.postResponse._body);
document.getElementsByClassName("alert")[0].style.display = "block";
document.getElementsByClassName("alert")[0].innerHTML =
obj.error.split("\\r\\n").join("<br/>").split("\"").join("");
}
}
);
 }
}
