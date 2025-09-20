import {ComponentFixture, TestBed} from '@angular/core/testing';
import {S3DatabaseTimeChartComponent} from "./s3-database-time-chart.component";


describe('HomeComponent', () => {
    let component: S3DatabaseTimeChartComponent;
    let fixture: ComponentFixture<S3DatabaseTimeChartComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [S3DatabaseTimeChartComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(S3DatabaseTimeChartComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
