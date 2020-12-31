import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { CleanRoomMonitoringService } from './clean-room-monitoring.service';

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

    function toggleDataSeries(e:any) {
      if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
        e.dataSeries.visible = false;
      } else {
        e.dataSeries.visible = true;
      }
      chart.render();
    }
  }
}
