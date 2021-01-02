import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-dealerbutton',
  templateUrl: './dealerbutton.component.html',
  styleUrls: ['./dealerbutton.component.css']
})
export class DealerbuttonComponent implements OnInit {

  @Input()
  dealer = -1;
  constructor() { }

  ngOnInit(): void {
  }

}
