import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AutoReloadComponent} from './auto-reload.component';

describe('HomeComponent', () => {
    let component: AutoReloadComponent;
    let fixture: ComponentFixture<AutoReloadComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AutoReloadComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AutoReloadComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
