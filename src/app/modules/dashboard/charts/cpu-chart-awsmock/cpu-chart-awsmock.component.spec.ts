import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CpuChartAwsmockComponent} from './cpu-chart-awsmock.component';

describe('HomeComponent', () => {
    let component: CpuChartAwsmockComponent;
    let fixture: ComponentFixture<CpuChartAwsmockComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CpuChartAwsmockComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CpuChartAwsmockComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
