import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule, MatDividerModule, MatIconModule, MatInputModule, MatSelectModule, MatTableModule } from '@angular/material';
import {MatCardModule} from '@angular/material/card';
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    
  ],
  exports:[
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatDividerModule,
    MatTableModule,
    MatCardModule
    ]
})
export class MaterialModule { }
