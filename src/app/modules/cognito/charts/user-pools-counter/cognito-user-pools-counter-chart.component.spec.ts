import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CognitoUserPoolsCounterChartComponent} from "./cognito-user-pools-counter-chart.component";


describe('HomeComponent', () => {
    let component: CognitoUserPoolsCounterChartComponent;
    let fixture: ComponentFixture<CognitoUserPoolsCounterChartComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CognitoUserPoolsCounterChartComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CognitoUserPoolsCounterChartComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
