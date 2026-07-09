import { Component, inject, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { SolarPanelService } from '../../services/solar-panel.service';
import { SolarPanel } from '../../interfaces/solar-panel.interface';

@Component({
  selector: 'app-production-component',
  standalone:true,
  imports: [MatButtonModule,MatTableModule,MatIconModule,MatChipsModule,MatCardModule],
  templateUrl: './production-component.html',
  styleUrl: './production-component.scss',
})
export class ProductionComponent {
  solarPanelService = inject(SolarPanelService);
  viewMode = signal<'table' | 'chart'>('table');

  showTable(){
    this.viewMode.set('table');
    
    console.log('table click');

  }

  showChart(){
    this.viewMode.set('chart');
    
    console.log('chart click');

  }

  deletePanel(panel: SolarPanel){
    const confirmed = confirm('Are you sure you want to delete this panel?');

    if (confirmed) {
      const panelId = panel.id;
      this.solarPanelService.deletePanel(panelId);
    }
  }

  addPanel(){
    console.log("added panel")
  }

  updatePanel(panel:SolarPanel){
    console.log('updated')
  }
  
  columnsToDisplay = [
    'id',
    'location',
    'capacity',
    'todayProduction',
    'status',
    'actions'
  ];
    

}
