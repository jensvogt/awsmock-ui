import {ComponentFixture, TestBed} from '@angular/core/testing';
import {LambdaFunctionInvocationsChartComponent} from "./lambda-function-invocation-count-chart.component";


describe('HomeComponent', () => {
    let component: LambdaFunctionInvocationsChartComponent;
    let fixture: ComponentFixture<LambdaFunctionInvocationsChartComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LambdaFunctionInvocationsChartComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(LambdaFunctionInvocationsChartComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
