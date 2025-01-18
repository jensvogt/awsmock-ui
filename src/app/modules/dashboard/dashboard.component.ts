import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {ModuleService} from "../../services/module.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CpuChartComponent} from "./charts/cpu-chart/cpu-chart.component";
import {ThreadsChartComponent} from "./charts/thread-chart/threads-chart.component";
import {GatewayTimeComponent} from "./charts/gateway-time/gateway-time.component";
import {MemoryChartComponent} from "./charts/memory-chart/memory-chart.component";
import {interval, Subscription} from "rxjs";
import {ModuleSelectionComponentDialog} from "../infrastructure/selection/module-selection.component";
import {ExportInfrastructureComponentDialog} from "../infrastructure/export/export-infrastructure.component";
import {ImportInfrastructureComponentDialog} from "../infrastructure/import/import-infrastructure.component";

@Component({
    selector: 'dashboard-component',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    standalone: false
})
export class DashboardComponent implements OnInit, OnDestroy {

    // Last update
    lastUpdate: Date = new Date();

    // Auto-update
    updateSubscription: Subscription | undefined;
    @ViewChild(CpuChartComponent) cpuChart: CpuChartComponent | undefined;
    @ViewChild(MemoryChartComponent) memoryChart: MemoryChartComponent | undefined;
    @ViewChild(GatewayTimeComponent) gatewayTimeChart: GatewayTimeComponent | undefined;
    @ViewChild(ThreadsChartComponent) threadsChart: ThreadsChartComponent | undefined;

    constructor(private snackBar: MatSnackBar, private moduleService: ModuleService, private dialog: MatDialog) {
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
        this.cpuChart?.loadCpuChart();
        this.memoryChart?.loadMemoryChart();
        this.gatewayTimeChart?.loadHttpTimeChart();
        this.threadsChart?.loadThreadChart();
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

                    this.dialog.open(ExportInfrastructureComponentDialog, exportDialogConfig);
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
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.width = "40%"
        dialogConfig.data = {title: 'Erase Infrastructure', mode: 'erase'}

        this.dialog.open(ModuleSelectionComponentDialog, dialogConfig).afterClosed().subscribe(result => {
            if (result) {
                const moduleList = result.modules.filter((ele: any) => {
                    return ele.selected;
                }).map((ele: any) => ele.name);
                this.moduleService.eraseInfrastructure({modules: moduleList, onlyObjects: result.onlyObjects}).subscribe(() => {
                    this.snackBar.open('Infrastructure erased', 'Done', {duration: 5000})
                });
            }
        });
    }
}
