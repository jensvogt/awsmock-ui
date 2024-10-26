import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SqsMessageListComponent} from './sqs-message-list.component';

describe('HomeComponent', () => {
    let component: SqsMessageListComponent;
    let fixture: ComponentFixture<SqsMessageListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SqsMessageListComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SqsMessageListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
