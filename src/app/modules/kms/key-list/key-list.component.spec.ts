import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SnsTopicListComponent} from './key-list.component';

describe('HomeComponent', () => {
    let component: SnsTopicListComponent;
    let fixture: ComponentFixture<SnsTopicListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SnsTopicListComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SnsTopicListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
