import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ServiceTimeChartComponent} from './application-service-count-chart.component';

describe('HomeComponent', () => {
    let component: ServiceTimeChartComponent;
    let fixture: ComponentFixture<ServiceTimeChartComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ServiceTimeChartComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ServiceTimeChartComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
