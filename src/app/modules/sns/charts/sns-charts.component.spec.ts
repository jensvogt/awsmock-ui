import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SnsChartsComponent} from './sns-charts.component';

describe('HomeComponent', () => {
    let component: SnsChartsComponent;
    let fixture: ComponentFixture<SnsChartsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SnsChartsComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SnsChartsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
