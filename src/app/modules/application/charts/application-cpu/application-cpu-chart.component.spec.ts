import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ApplicationCpuChartComponent} from "./application-cpu-chart.component";


describe('HomeComponent', () => {
    let component: ApplicationCpuChartComponent;
    let fixture: ComponentFixture<ApplicationCpuChartComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ApplicationCpuChartComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ApplicationCpuChartComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
