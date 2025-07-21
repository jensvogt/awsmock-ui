import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ApplicationCounterChartComponent} from "./application-counter-chart.component";


describe('HomeComponent', () => {
    let component: ApplicationCounterChartComponent;
    let fixture: ComponentFixture<ApplicationCounterChartComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ApplicationCounterChartComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ApplicationCounterChartComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
