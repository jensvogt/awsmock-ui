import {ComponentFixture, TestBed} from '@angular/core/testing';

import {GatewayTimeComponent} from './gateway-time.component';

describe('HomeComponent', () => {
    let component: GatewayTimeComponent;
    let fixture: ComponentFixture<GatewayTimeComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [GatewayTimeComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(GatewayTimeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
