import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BinaryFileUploadComponent} from './binary-file-upload.component';

describe('HomeComponent', () => {
    let component: BinaryFileUploadComponent;
    let fixture: ComponentFixture<BinaryFileUploadComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [BinaryFileUploadComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(BinaryFileUploadComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
