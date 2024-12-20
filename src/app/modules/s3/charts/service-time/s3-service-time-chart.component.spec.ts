import {ComponentFixture, TestBed} from '@angular/core/testing';
import {S3ServiceTimeChartComponent} from "./s3-service-time-chart.component";


describe('HomeComponent', () => {
    let component: S3ServiceTimeChartComponent;
    let fixture: ComponentFixture<S3ServiceTimeChartComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [S3ServiceTimeChartComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(S3ServiceTimeChartComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
