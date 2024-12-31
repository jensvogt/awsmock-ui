import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TransferServerListComponent} from './transfer-server-list.component';

describe('HomeComponent', () => {
    let component: TransferServerListComponent;
    let fixture: ComponentFixture<TransferServerListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TransferServerListComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TransferServerListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
