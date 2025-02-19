import {ComponentFixture, TestBed} from '@angular/core/testing';
import {LambdaFunctionInvocationTimeChartComponent} from "./lambda-function-invocation-time-chart.component";


describe('HomeComponent', () => {
    let component: LambdaFunctionInvocationTimeChartComponent;
    let fixture: ComponentFixture<LambdaFunctionInvocationTimeChartComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LambdaFunctionInvocationTimeChartComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(LambdaFunctionInvocationTimeChartComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
