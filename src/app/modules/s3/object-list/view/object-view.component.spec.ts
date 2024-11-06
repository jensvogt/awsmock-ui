import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ObjectListComponent} from './object-view.component';

describe('HomeComponent', () => {
    let component: ObjectListComponent;
    let fixture: ComponentFixture<ObjectListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ObjectListComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ObjectListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
