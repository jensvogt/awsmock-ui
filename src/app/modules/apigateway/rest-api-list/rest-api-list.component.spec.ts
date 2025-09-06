import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RestApiListComponent} from './rest-api-list.component';

describe('HomeComponent', () => {
    let component: RestApiListComponent;
    let fixture: ComponentFixture<RestApiListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [RestApiListComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(RestApiListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
