import {ComponentFixture, TestBed} from '@angular/core/testing';

import {S3BucketListComponent} from './bucket-list.component';

describe('HomeComponent', () => {
    let component: S3BucketListComponent;
    let fixture: ComponentFixture<S3BucketListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [S3BucketListComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(S3BucketListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
