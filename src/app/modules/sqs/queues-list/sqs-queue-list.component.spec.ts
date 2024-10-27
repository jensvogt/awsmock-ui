import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SqsQueueListComponent} from './sqs-queue-list.component';

describe('HomeComponent', () => {
    let component: SqsQueueListComponent;
    let fixture: ComponentFixture<SqsQueueListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SqsQueueListComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SqsQueueListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
