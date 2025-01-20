import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FunctionUploadDialog} from './function-upload-dialog.component';

describe('HomeComponent', () => {
    let component: FunctionUploadDialog;
    let fixture: ComponentFixture<FunctionUploadDialog>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [FunctionUploadDialog]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(FunctionUploadDialog);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
