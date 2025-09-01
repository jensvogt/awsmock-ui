import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CpuChartTotalDockerComponent} from "./cpu-chart-docker-total.component";

describe('HomeComponent', () => {
    let component: CpuChartTotalDockerComponent;
    let fixture: ComponentFixture<CpuChartTotalDockerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CpuChartTotalDockerComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CpuChartTotalDockerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
