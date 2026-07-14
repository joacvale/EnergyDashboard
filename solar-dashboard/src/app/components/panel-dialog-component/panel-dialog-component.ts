import { Component, inject, input } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { SolarPanelService } from '../../services/solar-panel.service';
import { SolarPanel } from '../../interfaces/solar-panel.interface';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-panel-dialog-component',
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, FormsModule, MatButtonModule, MatIconModule],
  templateUrl: './panel-dialog-component.html',
  styleUrl: './panel-dialog-component.scss',
})
export class PanelDialogComponent {
  title: string = '';
  isEdit: boolean = false;
  isDelete: boolean = false;

  formData = {
  location: '',
  capacity: 0,
  todayProduction: 0,
  status: 'Active' as 'Active' | 'Maintenance' as "Maintenance" | 'Inactive' as "Inactive"
  }; 

  solarPanelService = inject(SolarPanelService);
  dialogRef = inject(MatDialogRef<PanelDialogComponent>);
  data = inject(MAT_DIALOG_DATA, {
    optional: true
  });

  isValid(): boolean{
    const locationValid = this.formData.location.trim().length >=3; //trim tira os espaços em branco do inicio e fim
    const capacityValid = this.formData.capacity>0;
    const statusValid =!! this.formData.status;
    const todayProductionValid = true;
    if(this.formData.todayProduction){
      const todayProductionValid = this.formData.todayProduction>=0
    }

    return (locationValid && capacityValid && todayProductionValid && statusValid);
  }

  formsAction(){
    if(this.isDelete){
      const panelId = this.data.panel.id;
      this.solarPanelService.deletePanel(panelId);
      this.dialogRef.close(this.formData);

    } else if (!this.isDelete && this.isEdit) {
      const updatedPanel: SolarPanel = {
        id: this.data.panel.id,
        location: this.formData.location,
        capacity: this.formData.capacity,
        todayProduction: this.formData.todayProduction,
        status: this.formData.status,
      };
      this.solarPanelService.updatePanel(updatedPanel);
      this.dialogRef.close(updatedPanel);

    } else if (!this.isDelete && !this.isEdit){
      this.solarPanelService.addPanel({
        location: this.formData.location,
        capacity: this.formData.capacity,
        todayProduction: this.formData.todayProduction,
        status: this.formData.status,
      });
      this.dialogRef.close(this.formData);
    }
  }

  constructor(){
    if (this.data?.mode ==='delete'){
      this.isDelete=true;
      this.formData ={
        ...this.data.panel
      };
      this.title = "Delete";
      this.isEdit = false;
    }else if ((this.data?.mode ==='update')){
        this.formData ={
          ...this.data.panel
        };
        this.title = "Edit Solar Panel";
        this.isEdit = true;
    }else{
        this.title = "Add Solar Panel";
        this.isEdit = false;
    }
    
    
  }

}
