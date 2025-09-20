import {ComponentFixture, TestBed} from '@angular/core/testing';
import {SqsDatabaseTimeChartComponent} from "./sqs-database-time-chart.component";


describe('HomeComponent', () => {
    let component: SqsDatabaseTimeChartComponent;
    let fixture: ComponentFixture<SqsDatabaseTimeChartComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SqsDatabaseTimeChartComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SqsDatabaseTimeChartComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
