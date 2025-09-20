import {ComponentFixture, TestBed} from '@angular/core/testing';
import {SnsDatabaseTimeChartComponent} from "./sns-database-time-chart.component";


describe('HomeComponent', () => {
    let component: SnsDatabaseTimeChartComponent;
    let fixture: ComponentFixture<SnsDatabaseTimeChartComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SnsDatabaseTimeChartComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SnsDatabaseTimeChartComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
