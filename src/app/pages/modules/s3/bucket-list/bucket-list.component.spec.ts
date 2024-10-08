import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BucketListComponent} from './bucket-list.component';

describe('HomeComponent', () => {
    let component: BucketListComponent;
    let fixture: ComponentFixture<BucketListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [BucketListComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(BucketListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
