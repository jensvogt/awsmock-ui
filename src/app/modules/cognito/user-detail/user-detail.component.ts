import {Component, OnDestroy, OnInit} from "@angular/core";
import {Location} from "@angular/common";
import {ActivatedRoute} from "@angular/router";
import {byteConversion} from "../../../shared/byte-utils.component";
import {UserItem} from "../model/user-item";
import {CognitoService} from "../service/cognito.service";

@Component({
    selector: 'user-detail-component',
    templateUrl: './user-detail.component.html',
    styleUrls: ['./user-detail.component.scss'],
    standalone: false,
    providers: [CognitoService]
})
export class CognitoUserDetailsComponent implements OnInit, OnDestroy {

    // Last update
    lastUpdate: Date = new Date();

    userItem = {} as UserItem;
    userName: string = '';
    userPoolId: string = '';

    // byte conversion
    protected readonly byteConversion = byteConversion;

    // Subscriptions
    private sub: any;

    constructor(private readonly location: Location, private readonly route: ActivatedRoute, private readonly cognitoService: CognitoService) {
    }

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            this.userPoolId = params['userPoolId'];
            this.userName = params['userName'];
            this.loadUser();
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    back() {
        this.location.back();
    }

    refresh() {
        this.loadUser();
    }

    // ===================================================================================================================
    // Load user details
    // ===================================================================================================================
    loadUser() {
        this.cognitoService.getUser(this.userPoolId, this.userName)
            .subscribe((data: any) => {
                this.lastUpdate = new Date();
                if (data) {
                    this.userItem = data;
                }
            });
    }

    save() {
        this.location.back();
    }
}
