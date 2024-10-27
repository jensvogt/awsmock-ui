import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CpuChartComponent} from './cpu-chart.component';

describe('HomeComponent', () => {
    let component: CpuChartComponent;
    let fixture: ComponentFixture<CpuChartComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CpuChartComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CpuChartComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
