import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SnsMessageListComponent} from './sns-message-list.component';

describe('HomeComponent', () => {
    let component: SnsMessageListComponent;
    let fixture: ComponentFixture<SnsMessageListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SnsMessageListComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SnsMessageListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
