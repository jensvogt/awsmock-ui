import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ThreadsChartComponent} from './threads-chart.component';

describe('HomeComponent', () => {
    let component: ThreadsChartComponent;
    let fixture: ComponentFixture<ThreadsChartComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ThreadsChartComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ThreadsChartComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
