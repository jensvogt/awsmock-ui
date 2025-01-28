import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RealMemoryChartComponent} from './real-memory-chart.component';

describe('HomeComponent', () => {
    let component: RealMemoryChartComponent;
    let fixture: ComponentFixture<RealMemoryChartComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [RealMemoryChartComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(RealMemoryChartComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
