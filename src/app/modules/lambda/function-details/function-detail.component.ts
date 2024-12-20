import {Component, inject, OnDestroy, OnInit} from "@angular/core";
import {Location} from "@angular/common";
import {ActivatedRoute} from "@angular/router";
import {Sort} from "@angular/material/sort";
import {LiveAnnouncer} from "@angular/cdk/a11y";
import {LambdaService} from "../service/lambda-service.component";
import {Environment, LambdaFunctionItem, Tag} from "../model/function-item";
import {State, Store} from "@ngrx/store";
import {LambdaFunctionDetailsState} from "./state/lambda-function-details.reducer";
import {lambdaFunctionDetailsActions} from "./state/lambda-function-details.actions";
import {Observable} from "rxjs";
import {selectFunctionItem} from "./state/lambda-function-details.selectors";
import {byteConversion} from "../../../shared/byte-utils.component";
import {MatTableDataSource} from "@angular/material/table";


@Component({
    selector: 'lambda-function-detail-component',
    templateUrl: './function-detail.component.html',
    styleUrls: ['./function-detail.component.scss'],
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
    sortedEnvData: Environment[] = [];
    protected readonly byteConversion = byteConversion;
    private routerSubscription: any;
    private _liveAnnouncer = inject(LiveAnnouncer);

    constructor(private location: Location, private route: ActivatedRoute, private state: State<LambdaFunctionDetailsState>, private store: Store) {
    }

    ngOnInit() {
        this.routerSubscription = this.route.params.subscribe(params => {
            this.functionName = params['functionName'];
        });
        this.functionItem$?.subscribe((data: LambdaFunctionItem) => {
            this.lastUpdate = new Date();
            this.functionItem = data;
            this.environmentDataSource = this.convertEnvironment(data);
            this.tagsDataSource = this.convertTags(data);
            console.log(data);
        });
        this.loadFunction();
    }

    ngOnDestroy() {
        this.routerSubscription.unsubscribe();
    }

    back() {
        this.location.back();
    }

    refresh() {
        this.loadFunction();
    }

    loadFunction() {
        this.store.dispatch(lambdaFunctionDetailsActions.loadFunction({
            name: this.functionName
        }));
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
