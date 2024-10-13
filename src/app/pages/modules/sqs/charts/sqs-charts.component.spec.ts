import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SqsChartsComponent} from './sqs-charts.component';

describe('HomeComponent', () => {
    let component: SqsChartsComponent;
    let fixture: ComponentFixture<SqsChartsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SqsChartsComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SqsChartsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
