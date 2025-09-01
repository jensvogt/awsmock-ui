import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MemoryChartDockerTotalComponent} from './memory-chart-docker-total.component';

describe('HomeComponent', () => {
    let component: MemoryChartDockerTotalComponent;
    let fixture: ComponentFixture<MemoryChartDockerTotalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MemoryChartDockerTotalComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(MemoryChartDockerTotalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
