import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-potbetinfo',
  templateUrl: './potbetinfo.component.html',
  styleUrls: ['./potbetinfo.component.css']
})
export class PotbetinfoComponent implements OnInit {

  bets: number[] = [1,2,3,4,5,6,7,8];
  pot: number = 0;

  constructor() { }

  ngOnInit(): void {
  }

}
