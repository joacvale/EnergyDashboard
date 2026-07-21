import { Component, signal } from '@angular/core';
import { ViewMode } from '../../enums';


@Component({
  selector: 'app-scenario-analysis-component',
  imports: [],
  templateUrl: './scenario-analysis-component.html',
  styleUrl: './scenario-analysis-component.scss',
})
export class ScenarioAnalysisComponent {
 viewMode = signal<ViewMode>(ViewMode.TABLE);

  //showTable()
    showTable() {
      this.viewMode.set(ViewMode.TABLE);
    }
  
    showChart() {
      this.viewMode.set(ViewMode.CHART);
    }
  //showChart()
  //table
  //save()
  //update() 
  //chart
}
