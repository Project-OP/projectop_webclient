import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dealerbutton',
  templateUrl: './dealerbutton.component.html',
  styleUrls: ['./dealerbutton.component.css']
})
export class DealerbuttonComponent implements OnInit {

  dealer = -1;
  constructor() { }

  ngOnInit(): void {
  }

}
