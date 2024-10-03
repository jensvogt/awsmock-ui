import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ExportInfrastructureComponent} from "./export-infrastructure.component";

describe('HomeComponent', () => {
    let component: ExportInfrastructureComponent;
    let fixture: ComponentFixture<ExportInfrastructureComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ExportInfrastructureComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ExportInfrastructureComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
