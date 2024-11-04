import {ComponentFixture, TestBed} from '@angular/core/testing';

import {S3ObjectDownloadComponent} from './s3-object-download.component';

describe('HomeComponent', () => {
    let component: S3ObjectDownloadComponent;
    let fixture: ComponentFixture<S3ObjectDownloadComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [S3ObjectDownloadComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(S3ObjectDownloadComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
