import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CpuChartTotalComponent} from './cpu-chart-total.component';

describe('HomeComponent', () => {
    let component: CpuChartTotalComponent;
    let fixture: ComponentFixture<CpuChartTotalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CpuChartTotalComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CpuChartTotalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
