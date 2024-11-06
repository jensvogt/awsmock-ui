import {ComponentFixture, TestBed} from '@angular/core/testing';

import {S3ObjectListComponent} from './object-list.component';

describe('HomeComponent', () => {
    let component: S3ObjectListComponent;
    let fixture: ComponentFixture<S3ObjectListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [S3ObjectListComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(S3ObjectListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
