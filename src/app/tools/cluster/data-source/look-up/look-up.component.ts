import {Component} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {ClusterDataSourceService} from "../cluster-data-source.service";
import {ClusterLookUpData} from "../cluster-data-source.service.util";
import {MatDialog} from "@angular/material/dialog";
import {FetchComponent} from "../pop-ups/fetch/fetch.component";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-look-up',
  templateUrl: './look-up.component.html',
  styleUrls: ['./look-up.component.scss']
})
export class LookUpComponent {
  value = '';
  lookUpFrom = new FormGroup({
    name: new FormControl(''),
  })
  recentLookUps: ClusterLookUpData[];

  constructor(private dataSourceService: ClusterDataSourceService,
              private dialog: MatDialog,
              private snackBar: MatSnackBar) {
    this.recentLookUps = this.dataSourceService.lookUpDataStack.list().slice().reverse();
    this.dataSourceService.lookUpDataArray$.subscribe(
      data => {
        this.recentLookUps = this.dataSourceService.lookUpDataStack.list().slice().reverse();
      });
    this.dataSourceService.lookUpData$.subscribe(
      data => {
        if (data !== null)
          this.dialog.open(FetchComponent,
            {
              width: 'fit-content',
              disableClose: true,
              data: data
            });
        else
          this.snackBar.open(`No Cluster Named "${this.lookUpFrom.controls['name'].value}" Found`,
            "OK");
      });
  }

  submit() {
    this.dataSourceService.lookUpCluster(this.lookUpFrom.controls['name'].value!);
  }

  typeCoordinates() {
    this.dialog.open(FetchComponent,
      {
        width: 'fit-content',
        disableClose: true,
        data: {
          name: null,
          ra: null,
          dec: null,
          radius: null,
        }
      });
  }

  searchRecent(lookup: ClusterLookUpData) {
    this.dataSourceService.pushRecentSearch(lookup);
    this.dialog.open(FetchComponent, {
      width: 'fit-content',
      disableClose: true,
      data: lookup
    });
  }
}
