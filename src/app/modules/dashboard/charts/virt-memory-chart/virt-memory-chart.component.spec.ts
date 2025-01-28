import {ComponentFixture, TestBed} from '@angular/core/testing';

import {VirtMemoryChartComponent} from './virt-memory-chart.component';

describe('HomeComponent', () => {
    let component: VirtMemoryChartComponent;
    let fixture: ComponentFixture<VirtMemoryChartComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [VirtMemoryChartComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(VirtMemoryChartComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
