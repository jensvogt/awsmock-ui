import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MemoryChartAwsmockComponent} from './memory-chart-awsmock.component';

describe('HomeComponent', () => {
    let component: MemoryChartAwsmockComponent;
    let fixture: ComponentFixture<MemoryChartAwsmockComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MemoryChartAwsmockComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(MemoryChartAwsmockComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
