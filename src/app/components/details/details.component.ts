import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import * as Chart from 'chart.js';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

  constructor( private http:HttpClient, private route:ActivatedRoute ) { }

  state_name = '';
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.state_name = params['state'];
    })
    this.getTimeSeries(this.state_name);
    this.getDistrictData(this.state_name);
  }

  
  time_series = [];
  statewise = [];
  state_data = {};
  //requesting data for charts
  getTimeSeries(state:string){
    this.http.get("https://api.covid19india.org/data.json").subscribe((res:any[]) => {
      console.log(res);
      this.time_series = res["cases_time_series"];
      this.statewise = res["statewise"];

      this.statewise.forEach(element=>{
        // console.log(element);
        if(element["state"] == state){
          this.state_data = {
                state_name: element["state"],
                active: element["active"],
                confirmed: element["confirmed"],
                deaths: element["deaths"],
                statecode: element["statecode"]
              }
        }
      })
      this.displayLineChart();
      this.displayDoughnutChart();
  });
  }

  lineChart: any;
  ctx1: any;
  displayLineChart(){
    this.lineChart = document.getElementById('lineChart');
    this.ctx1 = this.lineChart.getContext('2d');
    this.lineChart = new Chart(this.ctx1, {
      type: 'line',
      data: {
        labels: this.time_series.map(item=>item.date),
        datasets: [
          {
            label: 'Daily Confirmed Cases',
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: this.time_series.map(item=>item.dailyconfirmed),
            spanGaps: false,
          },
          {
            label: 'Daily Recovered Cases',
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'rgba(0,128,0,0.4)',
            borderColor: 'rgba(0,128,0,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(0,128,0,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(0,128,0,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: this.time_series.map(item=>item.dailyrecovered),
            spanGaps: false,
          },
          {
            label: 'Daily Deceased Cases',
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'rgba(255,0,0,0.4)',
            borderColor: 'rgba(255,0,0,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(255,0,01)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(255,0,0,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: this.time_series.map(item=>item.dailydeceased),
            spanGaps: false,
          }
        ]
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
    }
      }
    });
  }

  districts_data = [];
  getDistrictData(state:string){
    this.http.get("https://api.covid19india.org/state_district_wise.json").subscribe((res:any[]) => {
      console.log(res[state]);

      var districtdata = res[state]["districtData"];
      for(var x in districtdata){
        // console.log(districtdata[x]);
        this.districts_data.push({
          district: x,
          active: districtdata[x]["active"],
          confirmed: districtdata[x]["confirmed"],
          deceased: districtdata[x]["deceased"]
        });
      }
      console.log("districts_data",this.districts_data);
      this.displayDistrictChart();
      // this.time_series = res["cases_time_series"];
      // this.displayLineChart();
  });
  }

  districtChart: any;
  ctx2: any;
  displayDistrictChart(){
    this.districtChart = document.getElementById('districtChart');
    this.ctx2 = this.districtChart.getContext('2d');
    let myChart = new Chart(this.ctx2, {
      type: 'bar',
      data: {
          labels: this.districts_data.map(x=>x["district"]),
          datasets: [{
              label: 'Active cases',
              data: this.districts_data.map(x=>x["active"]),
              backgroundColor: "olive",
              borderWidth: 1
          },
          {
            label: 'Confirmed cases',
            data: this.districts_data.map(x=>x["confirmed"]),
            backgroundColor: "purple",
            borderWidth: 1
        }]
      },
      options: { scales: {
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

  doughnutChart: any;
  ctx3: any;
  displayDoughnutChart() {
    this.doughnutChart = document.getElementById('doughnutChart');
    this.ctx3 = this.doughnutChart.getContext('2d');
    let myChart = new Chart(this.ctx3, {
      type: 'doughnut',
      data: {
        labels: ['Active', 'Confirmed', 'Deaths'],
        datasets: [{
          label: 'Overall data',
          data: [this.state_data["active"], this.state_data["confirmed"], this.state_data["deaths"]],
          backgroundColor: [
            'rgba(255, 159, 64, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)'
          ],
          hoverBackgroundColor: [
            '#FFCE56',
            '#FF6384',
            '#36A2EB'
          ]
        }]
      }
    });
  }

}
