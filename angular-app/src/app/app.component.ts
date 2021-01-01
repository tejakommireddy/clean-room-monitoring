import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { CleanRoomMonitoringService } from './clean-room-monitoring.service';


const convertToHalfDoughnut = (doughnutChart: any) => {
  let sum = 0;
  const dataPoints = doughnutChart.options.data[0].dataPoints;

  for (let i = 0; i < dataPoints.length; i++) {
    sum += dataPoints[i].y;
  }

  dataPoints.splice(0, 0, { y: sum, color: "transparent", toolTipContent: null, highlightEnabled: false });
}

const convertToHalfDoughnut1 = (doughnutChart1: any) => {
  let sum = 0;
  const dataPoints = doughnutChart1.options.data[0].dataPoints;

  for (let i = 0; i < dataPoints.length; i++) {
    sum += dataPoints[i].y;
  }

  dataPoints.splice(0, 0, { y: sum, color: "transparent", toolTipContent: null, highlightEnabled: false });
}

const convertToHalfDoughnut2 = (doughnutChart2: any) => {
  let sum = 0;
  const dataPoints = doughnutChart2.options.data[0].dataPoints;

  for (let i = 0; i < dataPoints.length; i++) {
    sum += dataPoints[i].y;
  }

  dataPoints.splice(0, 0, { y: sum, color: "transparent", toolTipContent: null, highlightEnabled: false });
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Clean Room Monitoring';
  dataSource = new MatTableDataSource<any>();
  loading = false;

  constructor(public cleanRoomMonitoringService: CleanRoomMonitoringService) {
  }

  ngOnInit() {
    this.refresh();
  }

  async refresh() {
    this.loading = true;
    const data = await this.cleanRoomMonitoringService.get();
    this.dataSource.data = data.data;
    console.log('data ', this.dataSource);

    const temparatureDataPoints = data.data.map((element: any) => ({
      y: element.temparature,
      label: element.date,
    }));
    const humidityDataPoints = data.data.map((element: any) => ({
      y: element.humidity,
      label: element.date,
    }));
    const pressureDataPoints = data.data.map((element: any) => ({
      y: element.pressure,
      label: element.date,
    }));
    // @ts-ignore
    const columnChart = new CanvasJS.Chart("columnChartContainer",
      {
        axisY: {
          interval: 5,
        },
        data: [
          {
            dataPoints: temparatureDataPoints
          },
          {
            dataPoints: humidityDataPoints
          },
          {
            dataPoints: pressureDataPoints
          }
        ]
      });

    columnChart.render();

    this.loading = false;
    // @ts-ignore
    const chart = new CanvasJS.Chart("splineChartContainer", {
      theme: "light2",
      animationEnabled: true, 
      title: {
        text: ""
      },
      axisY: {
        suffix: "",
        interval: 10
      },
      toolTip: {
        shared: "true"
      },
      legend: {
        cursor: "pointer",
        itemclick: toggleDataSeries
      },
      data: [
        {
          type: "spline",
          showInLegend: true,
          yValueFormatString: "##.00mn",
          name: "Temparature (°C)",
          dataPoints: temparatureDataPoints
        },
        {
          type: "spline",
          showInLegend: true,
          yValueFormatString: "##.00mn",
          name: "Humidity (%)",
          dataPoints: humidityDataPoints
        },
        {
          type: "spline",
          showInLegend: true,
          yValueFormatString: "##.00mn",
          name: "Pressure (atm)",
          dataPoints: pressureDataPoints
        }
      ]
    });
    chart.render();
    // @ts-ignore
    const doughnutChart = new CanvasJS.Chart("doughnutchart1",
      {
        title:{
          text: this.dataSource.data[0].temparature + "°C",
          fontColor:"#FFB6C1",
          verticalAlign: "center",
          dockInsidePlotArea: true
        },
        data: [
          {
            type: "doughnut",
            dataPoints: [
              { y: this.dataSource.data[0].temparature, color: "#FFB6C1" },
              { y: 100 - this.dataSource.data[0].temparature, color: "grey" }
            ]
          }
        ]
      });
    convertToHalfDoughnut(doughnutChart);
    doughnutChart.render();

    // @ts-ignore
    const doughnutChart1 = new CanvasJS.Chart("doughnutchart2",
    {
      title:{
        text: this.dataSource.data[0].humidity + "%",
        fontColor:"#2E8B57",
        verticalAlign: "center",
        dockInsidePlotArea: true
      },
      data: [
        {
          type: "doughnut",
          dataPoints: [
            { y: this.dataSource.data[0].humidity, color: "#2E8B57" },
            { y: 100 - this.dataSource.data[0].humidity, color: "grey" }
          ]
        }
      ]
    });

  convertToHalfDoughnut1(doughnutChart1);
  doughnutChart1.render();

  // @ts-ignore
  const doughnutChart2 = new CanvasJS.Chart("doughnutchart3",
  {
    title:{
      text: this.dataSource.data[0].pressure + "atm",
      fontColor:"purple",
      verticalAlign: "center",
      dockInsidePlotArea: true
    },
    data: [
      {
        type: "doughnut",
        dataPoints: [
          { y: this.dataSource.data[0].pressure, color: "purple" },
          { y: 100 - this.dataSource.data[0].pressure, color: "grey" }
        ]
      }
    ]
  });

convertToHalfDoughnut2(doughnutChart2);
doughnutChart2.render();

    function toggleDataSeries(e: any) {
      if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
        e.dataSeries.visible = false;
      } else {
        e.dataSeries.visible = true;
      }
      chart.render();
    }
  }
}
