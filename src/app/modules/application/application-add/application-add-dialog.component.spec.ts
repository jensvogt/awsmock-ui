import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ApplicationAddDialog} from './application-add-dialog.component';

describe('HomeComponent', () => {
    let component: ApplicationAddDialog;
    let fixture: ComponentFixture<ApplicationAddDialog>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ApplicationAddDialog]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ApplicationAddDialog);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
