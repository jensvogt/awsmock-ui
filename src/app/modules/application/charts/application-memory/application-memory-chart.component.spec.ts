import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ApplicationMemoryChartComponent} from "./application-memory-chart.component";


describe('HomeComponent', () => {
    let component: ApplicationMemoryChartComponent;
    let fixture: ComponentFixture<ApplicationMemoryChartComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ApplicationMemoryChartComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ApplicationMemoryChartComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
