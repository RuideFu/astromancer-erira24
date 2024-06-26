import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {ClusterService} from "../../../cluster.service";
import {ClusterDataService} from "../../../cluster-data.service";
import {ProgressBarMode} from "@angular/material/progress-bar";
import {Job, JobStatus} from "../../../../../shared/job/job";
import {ClusterStorageService} from "../../../storage/cluster-storage.service";
import {ErrorComponent} from "../error/error.component";

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss', '../cluster-data-source-pop-ups.scss']
})
export class SummaryComponent {
  clusterName: string = this.service.getClusterName();
  hasFSR: boolean = false;
  job: Job | null = null;
  loadGaia: boolean = false;
  gaia_text: string = GAIA_TEXT.PENDING;
  progress_mode: ProgressBarMode = 'indeterminate';
  progress_value: number = 0;
  fsr_count: number = this.dataService.getSources().length;

  constructor(@Inject(MAT_DIALOG_DATA) public data:
                { source: string, filters: string[], starCounts: number, clusterName: string },
              private service: ClusterService,
              private dataService: ClusterDataService,
              private storageService: ClusterStorageService,
              public dialog: MatDialog) {
    this.dataService.sources$.subscribe(
      () => {
        this.hasFSR = true;
        this.fsr_count = this.dataService.getSources().length;
      });
  }

  next() {
    if (this.hasFSR) {
      this.service.setTabIndex(1);
      this.dialog.closeAll();
    } else {
      this.service.setClusterName(this.clusterName);
      this.loadGaia = true;
      this.job = this.dataService.fetchFieldStarRemoval();
      this.job.update$.subscribe(
        (job) => {
          const storageObject = job.getStorageObject();
          storageObject.payload = this.dataService.getSources();
        });
      this.job.statusUpdate$.subscribe(
        (status) => {
          if (status === JobStatus.PENDING) {
            this.progress_mode = 'indeterminate';
            this.progress_value = 0;
          } else if (status === JobStatus.RUNNING) {
            this.progress_mode = 'determinate';
            this.gaia_text = GAIA_TEXT.RUNNING;
          }
        });
      this.job.progressUpdate$.subscribe(
        (progress) => {
          if (progress !== null) {
            this.progress_value = progress;
          }
        });
      this.job.complete$.subscribe(
        (complete) => {
          if (!complete && this.job?.getError()) {
            this.dialog.closeAll();
            this.dialog.open(ErrorComponent, {
              data: {error: this.job?.getError()}
            });
          }
        });
      this.dataService.sources$.pipe(
      ).subscribe(
        () => {
          this.progress_mode = 'indeterminate';
          this.progress_value = 100;
          this.loadGaia = false;
        }
      )
    }
  }

  cancel() {
    this.job?.cancelJob();
    this.service.reset();
    this.dataService.reset();
    this.loadGaia = false;
  }
}

enum GAIA_TEXT {
  PENDING = 'GAIA Cross Match Job is Pending',
  RUNNING = 'GAIA Cross Match Job is Running',
}
