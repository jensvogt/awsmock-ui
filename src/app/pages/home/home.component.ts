import {Component, LOCALE_ID, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardImage, MatCardTitle} from "@angular/material/card";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatToolbar} from "@angular/material/toolbar";
import {NgForOf, NgIf} from "@angular/common";
import {MatList, MatListItem, MatListOption, MatNavList, MatSelectionList} from "@angular/material/list";
import {MatIcon} from "@angular/material/icon";
import {RouterLink} from "@angular/router";
import {MatOption, MatSelect} from "@angular/material/select";
import {FormsModule} from "@angular/forms";
import {interval, Subscription} from "rxjs";
import {AwsMockMonitoringService} from "../../services/monitoring.service";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {ExportInfrastructureComponentDialog} from "../infrastructure/export/export-infrastructure.component";
import {ModuleService} from "../../services/module.service";
import {CpuChartComponent} from "../charts/cpu-chart/cpu-chart.component";
import {MemoryChartComponent} from "../charts/memory-chart/memory-chart.component";
import {GatewayTimeComponent} from "../charts/gatewas-time/gateway-time.component";
import {MatTooltip} from "@angular/material/tooltip";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ThreadsChartComponent} from "../charts/thread-chart/threads-chart.component";
import {ImportInfrastructureComponentDialog} from "../infrastructure/import/import-infrastructure.component";
import {ModuleSelectionComponentDialog} from "../infrastructure/selection/module-selection.component";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    standalone: true,
    imports: [
        MatCard,
        MatCardHeader,
        MatCardContent,
        MatCardActions,
        MatCardImage,
        MatCardTitle,
        MatButton,
        MatToolbar,
        NgIf,
        NgForOf,
        MatList,
        MatIcon,
        MatListItem,
        RouterLink,
        MatSelect,
        FormsModule,
        MatOption,
        MatIconButton,
        MatListOption,
        MatSelectionList,
        MatNavList,
        CpuChartComponent,
        MemoryChartComponent,
        GatewayTimeComponent,
        MatTooltip,
        ThreadsChartComponent
    ],
    providers: [AwsMockMonitoringService, ModuleService, {provide: LOCALE_ID, useValue: 'de-CH'}],
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
    lastUpdate: string = '';

    // Auto-update
    updateSubscription: Subscription | undefined;
    @ViewChild(CpuChartComponent) cpuChart: CpuChartComponent | undefined;
    @ViewChild(MemoryChartComponent) memoryChart: MemoryChartComponent | undefined;
    @ViewChild(GatewayTimeComponent) gatewayTimeChart: GatewayTimeComponent | undefined;
    @ViewChild(ThreadsChartComponent) threadsChart: ThreadsChartComponent | undefined;

    constructor(private snackBar: MatSnackBar, private moduleService: ModuleService, private dialog: MatDialog) {
        this.updateSubscription = interval(60000).subscribe(() => {
            this.lastUpdate = new Date().toLocaleTimeString('DE-de');
            this.cpuChart?.loadCpuChart();
            this.memoryChart?.loadMemoryChart();
            this.gatewayTimeChart?.loadHttpTimeChart();
            this.threadsChart?.loadThreadChart();
        });
    }

    ngOnInit(): void {
        this.lastUpdate = new Date().toLocaleTimeString('DE-de');
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
