import {ComponentFixture, TestBed} from '@angular/core/testing';
import {LambdaServiceTimeChartComponent} from "./lambda-service-time-chart.component";


describe('HomeComponent', () => {
    let component: LambdaServiceTimeChartComponent;
    let fixture: ComponentFixture<LambdaServiceTimeChartComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LambdaServiceTimeChartComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(LambdaServiceTimeChartComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
