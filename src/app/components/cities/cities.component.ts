import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import * as Chart from 'chart.js';

@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  styleUrls: ['./cities.component.css']
})
export class CitiesComponent implements OnInit {

  states = ["Andhra Pradesh","Bihar","Delhi","Gujarat","Karnataka","Maharashtra","Madhya Pradesh","Rajasthan","Tamil Nadu","Uttar Pradesh","Uttarakhand","West Bengal"]; //states we want on our first screen

  constructor( private http:HttpClient ) { }

  ngOnInit(): void {
    this.getStateData();
  }

  //for diplaying active cases in different states across India
  canvas: any;
  ctx: any;
  displayChart(){
    this.canvas = document.getElementById('myChart');
    this.ctx = this.canvas.getContext('2d');
    let myChart = new Chart(this.ctx, {
      type: 'bar',
      data: {
          labels: this.cities.map(x=>x["state_name"]),
          datasets: [{
              label: 'Active cases',
              data: this.cities.map(x=>x["active"]),
              backgroundColor: this.colors,
              borderWidth: 1
          }]
      },
      options: { 
        scales: {
        xAxes: [{
            gridLines: {
                color: "rgba(0, 0, 0, 0)",
            }
        }],
        yAxes: [{
            gridLines: {
                color: "rgba(0, 0, 0, 0)",
            }   
        }]
    },
    legend: {
        display: false
    },
        responsive: false,
        display:true
      }
    });
  }

  statewise = [];
  cities = [];
  colors = [];  
  getStateData(){
    var total = 0;

    //requesting data
    this.http.get("https://api.covid19india.org/data.json").subscribe((res:any[]) => {
      console.log(res);
      this.statewise = res["statewise"];
      this.statewise.forEach(element=>{
        // console.log(element);
        if(this.states.indexOf(element["state"]) != -1){
          this.cities.push({
                state_name: element["state"],
                active: element["active"],
                statecode: element["statecode"]
              })
            
        if(element["active"]<50000) this.colors.push("#01579B");
        // else if(element["active"]>50000 && element["active"]<200000)  this.colors.push("olive");
        else this.colors.push("orangered");
        }
      })

      console.log(this.cities);
      this.displayChart();  //calling function to display chart when data is loaded successfully
  });
  }

}
