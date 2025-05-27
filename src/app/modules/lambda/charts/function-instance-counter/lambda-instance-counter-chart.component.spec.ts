import {ComponentFixture, TestBed} from '@angular/core/testing';
import {LambdaInstanceCounterChartComponent} from "./lambda-instance-counter-chart.component";


describe('HomeComponent', () => {
    let component: LambdaInstanceCounterChartComponent;
    let fixture: ComponentFixture<LambdaInstanceCounterChartComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LambdaInstanceCounterChartComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(LambdaInstanceCounterChartComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
