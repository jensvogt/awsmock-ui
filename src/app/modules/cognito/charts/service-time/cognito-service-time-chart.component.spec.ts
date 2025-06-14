import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CognitoServiceTimeChartComponent} from "./cognito-service-time-chart.component";


describe('HomeComponent', () => {
    let component: CognitoServiceTimeChartComponent;
    let fixture: ComponentFixture<CognitoServiceTimeChartComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CognitoServiceTimeChartComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CognitoServiceTimeChartComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
