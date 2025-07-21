import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ApplicationChartsComponent} from './application-charts.component';

describe('HomeComponent', () => {
    let component: ApplicationChartsComponent;
    let fixture: ComponentFixture<ApplicationChartsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ApplicationChartsComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ApplicationChartsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
