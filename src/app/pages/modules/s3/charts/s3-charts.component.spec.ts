import {ComponentFixture, TestBed} from '@angular/core/testing';

import {S3ChartsComponent} from './s3-charts.component';

describe('HomeComponent', () => {
    let component: S3ChartsComponent;
    let fixture: ComponentFixture<S3ChartsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [S3ChartsComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(S3ChartsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
