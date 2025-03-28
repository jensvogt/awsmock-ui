import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MemoryChartTotalComponent} from './memory-chart-total.component';

describe('HomeComponent', () => {
    let component: MemoryChartTotalComponent;
    let fixture: ComponentFixture<MemoryChartTotalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MemoryChartTotalComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(MemoryChartTotalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
