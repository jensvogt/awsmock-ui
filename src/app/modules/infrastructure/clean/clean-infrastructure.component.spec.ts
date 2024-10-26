import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CleanInfrastructureComponentDialog} from "./clean-infrastructure.component";

describe('HomeComponent', () => {
    let component: CleanInfrastructureComponentDialog;
    let fixture: ComponentFixture<CleanInfrastructureComponentDialog>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CleanInfrastructureComponentDialog]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CleanInfrastructureComponentDialog);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
