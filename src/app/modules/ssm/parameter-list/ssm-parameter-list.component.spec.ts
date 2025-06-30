import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SsmParameterListComponent} from './ssm-parameter-list.component';

describe('HomeComponent', () => {
    let component: SsmParameterListComponent;
    let fixture: ComponentFixture<SsmParameterListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SsmParameterListComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SsmParameterListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
