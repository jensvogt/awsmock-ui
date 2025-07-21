import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ApplicationServiceTimeChartComponent} from "./application-service-time-chart.component";


describe('HomeComponent', () => {
    let component: ApplicationServiceTimeChartComponent;
    let fixture: ComponentFixture<ApplicationServiceTimeChartComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ApplicationServiceTimeChartComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ApplicationServiceTimeChartComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
