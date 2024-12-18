import {ComponentFixture, TestBed} from '@angular/core/testing';
import {LambdaFunctionCounterChartComponent} from "./lambda-function-counter-chart.component";


describe('HomeComponent', () => {
    let component: LambdaFunctionCounterChartComponent;
    let fixture: ComponentFixture<LambdaFunctionCounterChartComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LambdaFunctionCounterChartComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(LambdaFunctionCounterChartComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
