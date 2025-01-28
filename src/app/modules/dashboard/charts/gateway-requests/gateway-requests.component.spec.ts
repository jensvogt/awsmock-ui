import {ComponentFixture, TestBed} from '@angular/core/testing';

import {GatewayRequestsComponent} from './gateway-requests.component';

describe('HomeComponent', () => {
    let component: GatewayRequestsComponent;
    let fixture: ComponentFixture<GatewayRequestsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [GatewayRequestsComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(GatewayRequestsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
