import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ImportMessagesComponentDialog} from "./message-import.component";

describe('HomeComponent', () => {
    let component: ImportMessagesComponentDialog;
    let fixture: ComponentFixture<ImportMessagesComponentDialog>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ImportMessagesComponentDialog]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ImportMessagesComponentDialog);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
