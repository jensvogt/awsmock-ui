import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {interval, Observable, Subscription} from "rxjs";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {ExportInfrastructureComponentDialog} from "../infrastructure/export/export-infrastructure.component";
import {ModuleService} from "../../services/module.service";
import {CpuChartComponent} from "../charts/cpu-chart/cpu-chart.component";
import {MemoryChartComponent} from "../charts/memory-chart/memory-chart.component";
import {GatewayTimeComponent} from "../charts/gateway-time/gateway-time.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ThreadsChartComponent} from "../charts/thread-chart/threads-chart.component";
import {ImportInfrastructureComponentDialog} from "../infrastructure/import/import-infrastructure.component";
import {ModuleSelectionComponentDialog} from "../infrastructure/selection/module-selection.component";
import {dashboardActions} from "./state/dashboard.actions";
import {Store} from "@ngrx/store";

@Component({
    selector: 'dashboard-component',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
    lastUpdate: Date = new Date();

    loadCpuChart$: Observable<any> | undefined;

    // Auto-update
    updateSubscription: Subscription | undefined;
    @ViewChild(CpuChartComponent) cpuChart: CpuChartComponent | undefined;
    @ViewChild(MemoryChartComponent) memoryChart: MemoryChartComponent | undefined;
    @ViewChild(GatewayTimeComponent) gatewayTimeChart: GatewayTimeComponent | undefined;
    @ViewChild(ThreadsChartComponent) threadsChart: ThreadsChartComponent | undefined;
    private data: any;

    constructor(private snackBar: MatSnackBar, private moduleService: ModuleService, private dialog: MatDialog, private readonly store: Store) {
        this.updateSubscription = interval(60000).subscribe(() => {
            this.lastUpdate = new Date();
            this.cpuChart?.loadCpuChart();
            this.memoryChart?.loadMemoryChart();
            this.gatewayTimeChart?.loadHttpTimeChart();
            this.threadsChart?.loadThreadChart();
        });
    }

    ngOnInit(): void {
        this.lastUpdate = new Date();
        this.store.dispatch(dashboardActions.loadCpuChart({
            name: 'total_cpu',
            start: new Date(),
            end: new Date(),
            step: 5
        }));
        this.loadCpuChart$?.subscribe((data: any) => this.data = data);
    }

    ngOnDestroy(): void {
        this.updateSubscription?.unsubscribe();
    }

    exportInfrastructure() {

        const moduleSelectedDialogConfig = new MatDialogConfig();
        moduleSelectedDialogConfig.disableClose = true;
        moduleSelectedDialogConfig.autoFocus = true;
        moduleSelectedDialogConfig.maxWidth = '100vw';
        moduleSelectedDialogConfig.maxHeight = '100vh';
        moduleSelectedDialogConfig.panelClass = 'full-screen-modal';
        moduleSelectedDialogConfig.width = "20%"
        moduleSelectedDialogConfig.minWidth = '280px'
        moduleSelectedDialogConfig.data = {title: 'Export modules', mode: 'export'};

        this.dialog.open(ModuleSelectionComponentDialog, moduleSelectedDialogConfig).afterClosed().subscribe(result => {
            if (result) {

                // Process parameters
                const moduleList = result.modules.filter((ele: any) => {
                    return ele.selected;
                }).map((ele: any) => ele.name);
                const includeObjects = result.includeObjects;
                const prettyPrint = result.prettyPrint;

                this.moduleService.exportInfrastructure(moduleList, includeObjects, prettyPrint).subscribe((data: any) => {

                    const exportDialogConfig = new MatDialogConfig();
                    exportDialogConfig.disableClose = true;
                    exportDialogConfig.autoFocus = true;
                    exportDialogConfig.maxWidth = '100vw';
                    exportDialogConfig.maxHeight = '100vh';
                    exportDialogConfig.panelClass = 'full-screen-modal';
                    exportDialogConfig.width = "90%"
                    exportDialogConfig.data = data;

                    this.dialog.open(ExportInfrastructureComponentDialog, exportDialogConfig).afterClosed().subscribe(result => {
                        if (result) {
                            console.log(result);
                        }
                    });
                });
            }
        });

    }

    importInfrastructure() {

        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.maxWidth = '100vw';
        dialogConfig.maxHeight = '100vh';
        dialogConfig.panelClass = 'full-screen-modal';
        dialogConfig.width = "90%"

        this.dialog.open(ImportInfrastructureComponentDialog, dialogConfig).afterClosed().subscribe(result => {
            if (result) {
                console.log(result);
                // this.moduleService.setInfrastructure().subscribe((data: any) => {
                //
                // });
            }
        });
    }

    cleanInfrastructure() {

        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.width = "40%"
        dialogConfig.data = {title: 'Clean Infrastructure', mode: 'clean'}

        this.dialog.open(ModuleSelectionComponentDialog, dialogConfig).afterClosed().subscribe(result => {
            if (result) {
                const moduleList = result.modules.filter((ele: any) => {
                    return ele.selected;
                }).map((ele: any) => ele.name);
                this.moduleService.cleanInfrastructure({modules: moduleList, onlyObjects: result.onlyObjects}).subscribe(() => {
                    this.snackBar.open('Infrastructure cleaned', 'Done', {duration: 5000})
                });
            }
        });
    }

    eraseInfrastructure() {

    }
}
