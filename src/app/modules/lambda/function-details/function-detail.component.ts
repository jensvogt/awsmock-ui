import {Component, OnDestroy, OnInit} from "@angular/core";
import {Location} from "@angular/common";
import {ActivatedRoute} from "@angular/router";
import {Sort} from "@angular/material/sort";
import {LambdaService} from "../service/lambda-service.component";
import {Environment, LambdaFunctionItem, Tag} from "../model/function-item";
import {Store} from "@ngrx/store";
import {Observable} from "rxjs";
import {selectFunctionItem} from "./state/lambda-function-details.selectors";
import {byteConversion} from "../../../shared/byte-utils.component";
import {MatTableDataSource} from "@angular/material/table";
import {MatDialog} from "@angular/material/dialog";


@Component({
    selector: 'lambda-function-detail-component',
    templateUrl: './function-detail.component.html',
    styleUrls: ['./function-detail.component.scss'],
    standalone: false,
    providers: [LambdaService]
})
export class LambdaFunctionDetailsComponent implements OnInit, OnDestroy {

    // Last update
    lastUpdate: Date = new Date();

    functionItem = {} as LambdaFunctionItem;
    functionName: string = '';
    functionItem$: Observable<LambdaFunctionItem> = this.store.select(selectFunctionItem);

    // Environment
    environmentColumns: string[] = ['name', 'value'];
    environmentDataSource = new MatTableDataSource<Environment>;
    tagsDataSource = new MatTableDataSource<Tag>;

    // Sorting
    protected readonly byteConversion = byteConversion;
    private routerSubscription: any;

    constructor(private location: Location, private route: ActivatedRoute, private dialog: MatDialog, private store: Store, private lambdaService: LambdaService) {
    }

    ngOnInit() {
        this.routerSubscription = this.route.params.subscribe(params => {
            this.functionName = params['functionName'];
            this.loadFunction();
        });
        this.loadFunction();
    }

    ngOnDestroy() {
        this.routerSubscription.unsubscribe();
        //this.updateSubscription.unsubscribe();
    }

    back() {
        this.location.back();
    }

    refresh() {
        this.loadFunction();
    }

    loadFunction() {
        this.lambdaService.getFunction(this.functionName).subscribe((data: any) => {
            this.lastUpdate = new Date();
            this.functionItem = data;
            this.environmentDataSource = this.convertEnvironment(data);
            this.tagsDataSource = this.convertTags(data);
        });
        //this.store.dispatch(lambdaFunctionDetailsActions.loadFunction({name: this.functionName}));
    }

    save() {
        this.location.back();
    }

    environmentSortChanged(sortState: Sort) {
//        console.log("Sort:", sortState);
//        this.environmentDataSource = new MatTableDataSource(this.sortEnvData(sortState));
    }

    tagsSortChanged(sortState: Sort) {
        if (sortState.direction) {
            //this.environmentDataSource = new MatTableDataSource(this.sortEnvData(this.functionItem.environment, 'name', 'asc'));
        } else {
            //this.environmentDataSource = new MatTableDataSource(this.sortEnvData(this.functionItem.environment, 'name', 'desc'));
        }
    }

    private convertEnvironment(data: any): MatTableDataSource<Environment> {
        let i = 0;
        let env: Environment[] = [];
        for (let t in data.environment) {
            env[i++] = {key: t, value: data.environment[t]};
        }
        return new MatTableDataSource(env);
    }

    private convertTags(data: any): MatTableDataSource<Tag> {
        let i = 0;
        let tags: Tag[] = [];
        for (let t in data.tags) {
            tags[i++] = {key: t, value: data.tags[t]};
        }
        return new MatTableDataSource(tags)
    }
}
