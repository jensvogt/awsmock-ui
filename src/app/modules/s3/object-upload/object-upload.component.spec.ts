import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ObjectUploadComponent} from './object-upload.component';

describe('HomeComponent', () => {
    let component: ObjectUploadComponent;
    let fixture: ComponentFixture<ObjectUploadComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ObjectUploadComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ObjectUploadComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
