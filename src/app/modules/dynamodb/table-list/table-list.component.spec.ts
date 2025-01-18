import {ComponentFixture, TestBed} from '@angular/core/testing';

import {UserPoolListComponent} from './table-list.component';

describe('HomeComponent', () => {
    let component: UserPoolListComponent;
    let fixture: ComponentFixture<UserPoolListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [UserPoolListComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(UserPoolListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
