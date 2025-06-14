import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CognitoChartsComponent} from './cognito-charts.component';

describe('HomeComponent', () => {
    let component: CognitoChartsComponent;
    let fixture: ComponentFixture<CognitoChartsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CognitoChartsComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CognitoChartsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
