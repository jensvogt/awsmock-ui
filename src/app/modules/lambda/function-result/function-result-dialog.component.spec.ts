import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LambdaFunctionCreateDialog} from './function-result-dialog.component';

describe('HomeComponent', () => {
    let component: LambdaFunctionCreateDialog;
    let fixture: ComponentFixture<LambdaFunctionCreateDialog>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LambdaFunctionCreateDialog]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(LambdaFunctionCreateDialog);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
