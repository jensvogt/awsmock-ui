import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CognitoUsersCounterChartComponent} from "./cognito-users-counter-chart.component";


describe('HomeComponent', () => {
    let component: CognitoUsersCounterChartComponent;
    let fixture: ComponentFixture<CognitoUsersCounterChartComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CognitoUsersCounterChartComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CognitoUsersCounterChartComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
