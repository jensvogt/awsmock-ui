import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ExportInfrastructureComponentDialog} from "./export-infrastructure.component";

describe('HomeComponent', () => {
    let component: ExportInfrastructureComponentDialog;
    let fixture: ComponentFixture<ExportInfrastructureComponentDialog>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ExportInfrastructureComponentDialog]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ExportInfrastructureComponentDialog);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
