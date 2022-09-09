import { OnChanges, SimpleChanges } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import Chart, { ChartDataset } from 'chart.js/auto';
import { Dataset, Graph } from './models/dataset.model';

@Component({
  selector: 'app-root',
  styles: [
    `
      canvas {
        white-space: pre-line;
      }
      .chart-container {
        position: relative;
        width: 100%;
      }
    `
  ],
  template: `
    <div class="chart-container" [ngStyle]="{ height: this.height + 'px' }">
      <canvas #canvas>{{ chartInstance }}</canvas>
    </div>
  `
})
export class AppComponent implements OnInit, OnChanges, OnDestroy {
  ngOnChanges(): void {
  }
  @Input() height: number = 200;

  @Input() dataset: Dataset = {
    axe: ["Draft", "Validated", "Canceled", "Ordered"],
    graphs: [{
      title: "test Chart",
      color: ["#e8edb6", "#A3EB25", "#A9A9A9", "#39AF50"],
      unit: "meter",
      datas: [866, 466, 366, 258]
    }]
  };



  @ViewChild('canvas', { static: true }) private canvasRef!: ElementRef;

  public chartInstance: Chart;

  ngOnInit(): void {
    this.refreshGraph();
  }

  refreshGraph(): void {
    console.log("tu fontionnes?");

    if (this.chartInstance && this.dataset) {
      this.chartInstance.data.labels = this.dataset.axe && this.dataset.axe.length > 0 ? this.dataset.axe : [];
      this.dataset.graphs.forEach((graph, index) => {
        this.chartInstance.data.datasets[index] = this.createDatasetFromGraph(graph);
      });

      (this.chartInstance.options.scales = this.createScalesFromGraphs(
        this.dataset && this.dataset.graphs ? this.dataset.graphs : []
      )),
        this.chartInstance.update();
      return;
    }

    this.chartInstance = new Chart(this.canvasRef.nativeElement, {
      type: 'pie',
      data: {
        labels: this.dataset && this.dataset.axe && this.dataset.axe.length > 0 ? this.dataset.axe : [],
        datasets:
          this.dataset && this.dataset.graphs ? this.dataset.graphs.map(x => this.createDatasetFromGraph(x)) : []
      },
      options: {
        maintainAspectRatio: false,
        scales: this.createScalesFromGraphs(this.dataset && this.dataset.graphs ? this.dataset.graphs : []),
        responsive: true,
        animation: {
          duration: 0
        },
        interaction: {
          mode: 'nearest',
          intersect: false
        },
        plugins: {
          legend: {
            position: 'right'
          },
          tooltip: {
            callbacks: {
              label: context => {
                let label = context.dataset.label || '';

                if (label) {
                  label += ': ';
                }

                if (context.parsed.y !== null) {
                  label += `${context.parsed.y} ${context.dataset.yAxisID.split('_')[1]}`;
                }
                return label;
              }
            }
          }
        }
      }
    });
  }

  createScalesFromGraphs(graphs: Array<Graph>): any {
    const yAxes = graphs.reduce((acc, graph) => {
      acc[`yAxe_${graph.unit}`] = {
        ticks: {
          mirror: true,
          display: true,
          align: 'end'
        }
      };
      return acc;
    }, {});
    return {
      ...yAxes,
      xAxe: {
        ticks: {
          minRotation: 90
        }
      }
    };
  }

  createDatasetFromGraph(graph: Graph): ChartDataset {
    return {
      label: graph.title,
      data: graph.datas,
      borderColor: graph.color,
      backgroundColor: graph.color,
      pointRadius: 7,
      pointHoverRadius: 20,
      yAxisID: `yAxe_${graph.unit}`,
      xAxisID: 'xAxe'
    };
  }

  ngOnDestroy(): void {
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
  }
}
