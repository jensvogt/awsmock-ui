import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LambdaChartsComponent} from './lambda-charts.component';

describe('HomeComponent', () => {
    let component: LambdaChartsComponent;
    let fixture: ComponentFixture<LambdaChartsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LambdaChartsComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(LambdaChartsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
